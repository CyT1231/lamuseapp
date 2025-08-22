export default function AdminPage() {
  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">Admin</h1>
      <p className="text-sm text-neutral-600">This is a placeholder. Protect this route using middleware once roles are set.</p>
      <ul className="list-disc pl-6 text-sm">
        <li>Create / Edit Promotions</li>
        <li>Create / Edit Events & quota</li>
        <li>Issue coupons / points</li>
      </ul>
    </div>
  );
}
