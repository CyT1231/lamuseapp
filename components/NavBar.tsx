'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import type { Route } from 'next';

const tabs: { href: Route; label: string }[] = [
  { href: '/', label: 'Home' },
  { href: '/promotions', label: 'Promotions' },
  { href: '/events', label: 'Events' },
  { href: '/profile', label: 'My' },
];

export default function NavBar() {
  const pathname = usePathname();
  if (pathname === '/login') return null; // hide on login page
  return (
    <nav className="fixed bottom-0 inset-x-0 border-t bg-white/90 backdrop-blur z-50">
      <ul className="flex items-center justify-around py-2">
        {tabs.map(t => (
          <li key={t.href}>
            <Link
              href={t.href}
              className={clsx('px-3 py-1 rounded-full', pathname === t.href && 'bg-brand text-white')}
            >
              {t.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
