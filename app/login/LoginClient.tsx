'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function LoginClient({ nextPath }: { nextPath: string }) {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [phase, setPhase] = useState<'send' | 'verify'>('send');
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // already signed-in? go to next
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace(nextPath);
    });
  }, [router, nextPath]);

  // redirect when signed in
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') router.replace(nextPath);
    });
    return () => sub.subscription.unsubscribe();
  }, [router, nextPath]);

  const sendCode = async () => {
    setMsg(null); setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      phone, // E.164: +60...
      options: { shouldCreateUser: true },
    });
    setLoading(false);
    if (error) return setMsg(error.message);
    setPhase('verify'); setMsg('Code sent. Check your SMS.');
  };

  const verifyCode = async () => {
    setMsg(null); setLoading(true);
    const { error } = await supabase.auth.verifyOtp({ phone, token: code, type: 'sms' });
    setLoading(false);
    if (error) return setMsg(error.message);
    await fetch('/api/link-pending', { method: 'POST' });
    // onAuthStateChange will handle redirect
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Login</h1>

      {phase === 'send' && (
        <div className="space-y-3">
          <label className="block text-sm">
            Phone (E.164, e.g. +60xxxxxxxxx)
            <input
              className="w-full border p-2 rounded mt-1"
              placeholder="+60..."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              inputMode="tel"
            />
          </label>
          <button
            onClick={sendCode}
            disabled={loading || !phone}
            className="w-full px-3 py-2 rounded bg-brand text-white disabled:opacity-60"
          >
            {loading ? 'Sending…' : 'Send code'}
          </button>
        </div>
      )}

      {phase === 'verify' && (
        <div className="space-y-3">
          <label className="block text-sm">
            SMS Code
            <input
              className="w-full border p-2 rounded mt-1"
              placeholder="6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              inputMode="numeric"
            />
          </label>
          <button
            onClick={verifyCode}
            disabled={loading || code.length < 4}
            className="w-full px-3 py-2 rounded bg-black text-white disabled:opacity-60"
          >
            {loading ? 'Verifying…' : 'Verify & login'}
          </button>
          <button onClick={() => setPhase('send')} className="w-full px-3 py-2 rounded bg-neutral-200">
            Change phone
          </button>
        </div>
      )}

      {msg && <p className="text-sm text-neutral-700">{msg}</p>}
    </div>
  );
}
