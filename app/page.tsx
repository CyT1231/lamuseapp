import Link from 'next/link';
import Card from '@/components/Card';
import HeroCarousel from '@/components/HeroCarousel';

export default function HomePage() {
  return (
    <div className="space-y-4">
      {/* 轮播：每 5s 自动切换，也可左右滑 */}
      <HeroCarousel
        images={[
          { src: '/hero/1.jpg', alt: 'Merdeka Promo' },
          { src: '/hero/2.jpg', alt: 'Weekend Workshop' },
          { src: '/hero/3.jpg', alt: 'New Facial Package' },
        ]}
        intervalMs={5000}
        className="mt-1"
      />

      <Card>
        <h2 className="font-medium mb-2">Quick Links</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/promotions" className="card text-center hover:shadow-md">Promotions</Link>
          <Link href="/events" className="card text-center hover:shadow-md">Events</Link>
          <Link href="/profile" className="card text-center hover:shadow-md">My Profile</Link>
          <a href="https://wa.me/60177109955" className="card text-center hover:shadow-md">WhatsApp</a>
        </div>
      </Card>

      <Card>
        <h2 className="font-medium mb-2">Latest Highlights</h2>
        <ul className="space-y-2 text-sm">
          <li>🎉 Merdeka Promo is live</li>
          <li>🗓️ Facial workshop this weekend</li>
        </ul>
      </Card>
    </div>
  );
}
