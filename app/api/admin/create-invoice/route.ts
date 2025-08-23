import { NextResponse } from 'next/server';
import { getServerClient } from '@/lib/supabaseServer';

export async function POST(req: Request) {
  const supabase = getServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: roleRow } = await supabase
    .from('user_roles').select('role').eq('user_id', session.user.id).single();
  if (!roleRow || !['admin','staff'].includes(roleRow.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { phone, items, points_awarded = 0, use_wallet = 0 } = await req.json();
  if (!Array.is(items) || items.length === 0) {
    return NextResponse.json({ error: 'No items' }, { status: 400 });
  }
  const subtotal = items.reduce((s: number, it: any) => s + Number(it.qty)*Number(it.unit_price), 0);

  // try link to user_id by phone (if already registered)
  let userId: string | null = null;
  const { data: prof } = await supabase.from('profiles').select('id').eq('phone', phone).maybeSingle();
  if (prof?.id) userId = prof.id;

  // create invoice
  const { data: invoice, error: invErr } = await supabase
    .from('invoices')
    .insert({ user_id: userId, phone, subtotal, points_awarded, created_by: session.user.id })
    .select().single();
  if (invErr) return NextResponse.json({ error: invErr.message }, { status: 400 });

  // items
  const itemsPayload = items.map((it: any) => ({
    invoice_id: invoice.id, description: it.description, qty: it.qty, unit_price: it.unit_price
  }));
  const { error: itemsErr } = await supabase.from('invoice_items').insert(itemsPayload);
  if (itemsErr) return NextResponse.json({ error: itemsErr.message }, { status: 400 });

  // points
  if (userId && points_awarded > 0) {
    const { error: pErr } = await supabase.from('user_points').insert({
      user_id: userId, points: points_awarded, reason: `Invoice #${invoice.id}`
    });
    if (pErr) return NextResponse.json({ error: pErr.message }, { status: 400 });
  }

  // wallet deduction
  if (userId && use_wallet > 0) {
    // ensure wallet row exists
    await supabase.from('wallets').upsert({ user_id: userId, balance: 0 });
    const { data: w } = await supabase.from('wallets').select('balance').eq('user_id', userId).single();
    const newBal = Number(w?.balance ?? 0) - Number(use_wallet);
    const { error: wErr } = await supabase.from('wallets').update({ balance: newBal }).eq('user_id', userId);
    if (wErr) return NextResponse.json({ error: wErr.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, invoiceId: invoice.id });
}
