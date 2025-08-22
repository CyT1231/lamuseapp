import './globals.css';
import NavBar from '@/components/NavBar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'La Muse',
  description: 'Promotions, Events & My Profile',
  manifest: '/manifest.json',
  themeColor: '#D8B4A0'
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return (
    <html lang="en">
      <body className="min-h-screen pb-16 bg-neutral-50">
        <div className="max-w-md mx-auto p-4 space-y-4">
          {children}
        </div>
        <NavBar />
      </body>
    </html>
  );
}
