import Card from '@/components/Card';

const mock = [
  { id: 1, title: 'Skin Analysis Day', date: '2025-09-05', location: 'La Muse Setapak', quota: 20 },
  { id: 2, title: 'Gua Sha Mini Class', date: '2025-09-20', location: 'La Muse Setapak', quota: 15 }
];

export default function EventsPage() {
  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">Events</h1>
      {mock.map(e => (
        <Card key={e.id}>
          <h3 className="font-medium">{e.title}</h3>
          <p className="text-xs text-neutral-500">{e.date} • {e.location} • {e.quota} pax</p>
          <div className="mt-2">
            <a className="inline-block px-3 py-1 rounded-full bg-brand text-white" href={`https://wa.me/60177109955?text=Event%20${e.id}`}>Register</a>
          </div>
        </Card>
      ))}
    </div>
  );
}
