'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Card from '@/components/Card';

type Invoice = { id:number; subtotal:number; created_at:string };
export default function ProfilePage() {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [points, setPoints] = useState<number>(0);
  const [wallet, setWallet] = useState<number>(0);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => { listener.subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    (async () => {
      if (!session) return;
      // link pending by phone
      await fetch('/api/link-pending', { method: 'POST' });

      const uid = session.user.id;
      const [{ data: prof }, { data: pts }, { data: w }, { data: invs }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', uid).single(),
        supabase.from('user_points').select('points').eq('user_id', uid),
        supabase.from('wallets').select('balance').eq('user_id', uid).maybeSingle(),
        supabase.from('invoices').select('id, subtotal, created_at').eq('user_id', uid).order('created_at', { ascending:false }).limit(10),
      ]);
      setProfile(prof);
      setPoints((pts||[]).reduce((s: number, r:any) => s + Number(r.points), 0));
      setWallet(Number(w?.balance ?? 0));
      setInvoices(invs || []);
    })();
  }, [session]);

  const signInPhone = async () => {
    const phone = prompt('Enter phone (e.g. +60xxxxxxxxx):');  // 必须是 E.164 格式
    if (!phone) return;
    const { error } = await supabase.auth.signInWithOtp({
      phone, options: { shouldCreateUser: true }
    });
    if (error) return alert(error.message);
    const code = prompt('SMS code:');
    if (!code) return;
    const { error: vErr } = await supabase.auth.verifyOtp({ phone, token: code, type: 'sms' });
    if (vErr) alert(vErr.message);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">My Profile</h1>

      {!session && (
        <Card>
          <p className="mb-2 text-sm">Login with your phone to view member details.</p>
          <button className="px-3 py-1 rounded-full bg-brand text-white" onClick={signInPhone}>Login via SMS</button>
        </Card>
      )}

      {session && profile && (
        <>
          <Card>
            <div className="flex justify-between">
              <div>
                <div className="text-sm text-neutral-600">{profile.phone}</div>
                <div className="font-medium">{profile.full_name}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-neutral-500">Tier</div>
                <div className="font-semibold">{profile.tier}</div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <Card>
              <div className="text-xs text-neutral-500">Points</div>
              <div className="text-2xl font-semibold">{points}</div>
            </Card>
            <Card>
              <div className="text-xs text-neutral-500">Balance</div>
              <div className="text-2xl font-semibold">RM {wallet.toFixed(2)}</div>
            </Card>
          </div>

          <Card>
            <h3 className="font-medium mb-2">Recent Purchases</h3>
            <ul className="text-sm space-y-1">
              {invoices.map(inv => (
                <li key={inv.id} className="flex justify-between">
                  <span>Invoice #{inv.id}</span>
                  <span>RM {Number(inv.subtotal).toFixed(2)}</span>
                </li>
              ))}
              {invoices.length === 0 && <li className="text-neutral-500">No invoices yet.</li>}
            </ul>
          </Card>

          <button className="px-3 py-1 rounded-full bg-black text-white" onClick={signOut}>Logout</button>
        </>
      )}
    </div>
  );
}
