'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Card from '@/components/Card';

export default function ProfilePage() {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => { listener.subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    const load = async () => {
      if (!session) return;
      const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      setProfile(data);
    };
    load();
  }, [session]);

  const signIn = async () => {
    const email = prompt('Enter your email to receive a magic link:');
    if (!email) return;
    await supabase.auth.signInWithOtp({ email });
    alert('Magic link sent. Please check your email.');
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
          <p className="mb-2 text-sm">Login to view your profile and rewards.</p>
          <button className="px-3 py-1 rounded-full bg-brand text-white" onClick={signIn}>Login via Email</button>
        </Card>
      )}

      {session && (
        <>
          <Card>
            <p className="text-sm">Signed in as</p>
            <p className="font-medium">{session.user.email}</p>
          </Card>
          <Card>
            <h3 className="font-medium mb-1">Profile</h3>
            <pre className="text-xs bg-neutral-50 p-2 rounded">{JSON.stringify(profile, null, 2)}</pre>
          </Card>
          <button className="px-3 py-1 rounded-full bg-black text-white" onClick={signOut}>Logout</button>
        </>
      )}
    </div>
  );
}
