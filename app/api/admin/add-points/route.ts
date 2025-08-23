import { NextResponse } from 'next/server';
import { getServerClient } from '@/lib/supabaseServer';
export async function POST(req: Request) {
  const supabase = getServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: roleRow } = await supabase.from('user_roles').select('role').eq('user_id', session.user.id).single();
  if (!roleRow || !['admin','staff'].includes(roleRow.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { phone, points, reason } = await req.json();
  const { data: prof } = await supabase.from('profiles').select('id').eq('phone', phone).single();
  if (!prof) return NextResponse.json({ error: 'Member not found' }, { status: 404 });

  const { error } = await supabase.from('user_points').insert({
    user_id: prof.id, points, reason: reason ?? 'Manual adjustment'
  });
  return NextResponse.json({ ok: !error, error: error?.message });
}
