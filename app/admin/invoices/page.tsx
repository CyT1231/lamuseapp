'use client';
import { useState } from 'react';
import Card from '@/components/Card';

type Item = { description: string; qty: number; unit_price: number };
export default function AdminInvoices() {
  const [phone, setPhone] = useState('');
  const [items, setItems] = useState<Item[]>([{ description: '', qty: 1, unit_price: 0 }]);
  const [points, setPoints] = useState(0);
  const [useWallet, setUseWallet] = useState(0);
  const [msg, setMsg] = useState<string|null>(null);

  const addRow = () => setItems(i => [...i, { description: '', qty: 1, unit_price: 0 }]);
  const update = (i:number, k:keyof Item, v:any) => {
    const copy = [...items]; (copy[i] as any)[k] = k==='description'? v : Number(v); setItems(copy);
  };
  const subtotal = items.reduce((s, r) => s + (r.qty * r.unit_price), 0);

  const create = async () => {
    const r = await fetch('/api/admin/create-invoice', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, items, points_awarded: points, use_wallet: useWallet })
    }).then(r=>r.json());
    setMsg(r.error || `Created invoice #${r.invoiceId}`);
  };

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">Create Invoice</h1>
      <Card>
        <div className="grid gap-2">
          <input className="border p-2 rounded" placeholder="Member phone (+60...)" value={phone} onChange={e=>setPhone(e.target.value)} />
          <table className="w-full text-sm">
            <thead><tr><th className="text-left">Item</th><th>Qty</th><th>Price</th></tr></thead>
            <tbody>
              {items.map((it,i)=>(
                <tr key={i}>
                  <td><input className="border p-1 rounded w-full" value={it.description} onChange={e=>update(i,'description',e.target.value)} /></td>
                  <td className="w-20"><input className="border p-1 rounded w-20" type="number" value={it.qty} onChange={e=>update(i,'qty',e.target.value)} /></td>
                  <td className="w-28"><input className="border p-1 rounded w-28" type="number" step="0.01" value={it.unit_price} onChange={e=>update(i,'unit_price',e.target.value)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="px-3 py-1 rounded bg-neutral-200" onClick={addRow}>+ Add Item</button>
          <div className="grid grid-cols-3 gap-2">
            <div>Subtotal: RM {subtotal.toFixed(2)}</div>
            <input className="border p-2 rounded" type="number" placeholder="Points award" value={points} onChange={e=>setPoints(Number(e.target.value))} />
            <input className="border p-2 rounded" type="number" step="0.01" placeholder="Use wallet (RM)" value={useWallet} onChange={e=>setUseWallet(Number(e.target.value))} />
          </div>
          <button className="px-3 py-1 rounded bg-brand text-white" onClick={create}>Create Invoice</button>
          {msg && <p className="text-sm text-green-700">{msg}</p>}
        </div>
      </Card>
    </div>
  );
}
