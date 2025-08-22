import Card from '@/components/Card';

const mock = [
  { id: 1, title: 'New Customer Facial - RM99', valid: 'Till 30 Sep 2025' },
  { id: 2, title: 'Buy 3 Free 1 Body Massage', valid: 'Till 31 Oct 2025' }
];

export default function PromotionsPage() {
  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">Promotions</h1>
      {mock.map(p => (
        <Card key={p.id}>
          <h3 className="font-medium">{p.title}</h3>
          <p className="text-xs text-neutral-500">Valid: {p.valid}</p>
          <div className="mt-2">
            <a className="inline-block px-3 py-1 rounded-full bg-brand text-white" href={`https://wa.me/60177109955?text=Promo%20${p.id}`}>Redeem / Book</a>
          </div>
        </Card>
      ))}
    </div>
  );
}
