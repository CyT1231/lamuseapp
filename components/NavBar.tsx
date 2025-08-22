'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const tabs = [
  { href: '/', label: 'Home' },
  { href: '/promotions', label: 'Promotions' },
  { href: '/events', label: 'Events' },
  { href: '/profile', label: 'My' },
];

export default function NavBar() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 inset-x-0 border-t bg-white/90 backdrop-blur z-50">
      <ul className="flex items-center justify-around py-2">
        {tabs.map(t => (
          <li key={t.href}>
            <Link href={t.href} className={clsx('px-3 py-1 rounded-full', pathname===t.href && 'bg-brand text-white')}>
              {t.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
