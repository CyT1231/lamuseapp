import { Suspense } from 'react';
import LoginClient from './LoginClient';

export const dynamic = 'force-dynamic'; // avoid static prerendering for OTP flows

export default function LoginPage({
  searchParams,
}: {
  searchParams?: { next?: string };
}) {
  const nextPath = typeof searchParams?.next === 'string' ? searchParams!.next : '/';
  return (
    <Suspense fallback={<div className="max-w-md mx-auto p-6">Loading…</div>}>
      <LoginClient nextPath={nextPath} />
    </Suspense>
  );
}
