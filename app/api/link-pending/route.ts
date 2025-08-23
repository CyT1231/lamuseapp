import { NextResponse } from 'next/server';
import { getServerClient } from '@/lib/supabaseServer';

export async function POST() {
  const supabase = getServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ ok: false });

  const phone = session.user.phone;
  if (!phone) return NextResponse.json({ ok: false });

  const { data: pend } = await supabase.from('members_pending').select('*').eq('phone', phone).maybeSingle();
  if (!pend) return NextResponse.json({ ok: true }); // nothing to link

  // ensure profile row exists (your trigger should create it)
  await supabase.from('profiles').upsert({ id: session.user.id, phone, full_name: pend.full_name, birthday: pend.birthday, tier: pend.tier });

  // create wallet row if missing
  await supabase.from('wallets').upsert({ user_id: session.user.id, balance: 0 });

  // remove pending
  await supabase.from('members_pending').delete().eq('id', pend.id);

  return NextResponse.json({ ok: true, linked: true });
}
