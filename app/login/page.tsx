'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function LoginPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get('next') || '/';

  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [phase, setPhase] = useState<'send' | 'verify'>('send');
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // if already signed in, bounce to next
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace(next);
    });
  }, [router, next]);

  // listen for auth state changes -> redirect when signed in
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        router.replace(next);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [router, next]);

  const sendCode = async () => {
    setMsg(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      phone, // must be E.164 (+60...)
      options: { shouldCreateUser: true },
    });
    setLoading(false);
    if (error) return setMsg(error.message);
    setPhase('verify');
    setMsg('Code sent. Check your SMS.');
  };

  const verifyCode = async () => {
    setMsg(null);
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      phone,
      token: code,
      type: 'sms',
    });
    setLoading(false);
    if (error) return setMsg(error.message);
    // optional: link pending profile
    await fetch('/api/link-pending', { method: 'POST' });
    // router.replace(next); // not strictly needed; onAuthStateChange will fire
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
            {loading ? 'Sending...' : 'Send code'}
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
            {loading ? 'Verifying...' : 'Verify & login'}
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
