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

  const { phone, full_name, birthday, tier } = await req.json();
  const { data, error } = await supabase
    .from('members_pending')
    .upsert({ phone, full_name, birthday, tier })
    .select().single();

  return NextResponse.json({ ok: !error, error: error?.message, data });
}
