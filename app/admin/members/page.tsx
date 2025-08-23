'use client';
import { useState } from 'react';
import Card from '@/components/Card';

export default function AdminMembers() {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [tier, setTier] = useState('Member');
  const [msg, setMsg] = useState<string|null>(null);

  const addPending = async () => {
    const r = await fetch('/api/admin/add-member', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, full_name: name, birthday, tier })
    }).then(r=>r.json());
    setMsg(r.error || 'Saved.');
  };

  const updateTier = async () => {
    const r = await fetch('/api/admin/update-tier', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, tier })
    }).then(r=>r.json());
    setMsg(r.error || 'Tier updated.');
  };

  const addPoints = async () => {
    const pts = Number(prompt('Points to add:') || '0');
    if (!pts) return;
    const r = await fetch('/api/admin/add-points', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, points: pts, reason: 'Manual' })
    }).then(r=>r.json());
    setMsg(r.error || 'Points added.');
  };

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">Members</h1>
      <Card>
        <div className="grid gap-2">
          <input className="border p-2 rounded" placeholder="Phone (+60...)" value={phone} onChange={e=>setPhone(e.target.value)} />
          <input className="border p-2 rounded" placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} />
          <input className="border p-2 rounded" type="date" value={birthday} onChange={e=>setBirthday(e.target.value)} />
          <select className="border p-2 rounded" value={tier} onChange={e=>setTier(e.target.value)}>
            <option>Member</option><option>Silver</option><option>Gold</option><option>VIP</option>
          </select>
          <div className="flex gap-2">
            <button onClick={addPending} className="px-3 py-1 rounded bg-brand text-white">Save / Invite</button>
            <button onClick={updateTier} className="px-3 py-1 rounded bg-black text-white">Update Tier</button>
            <button onClick={addPoints} className="px-3 py-1 rounded bg-black text-white">Add Points</button>
          </div>
          {msg && <p className="text-sm text-green-700">{msg}</p>}
        </div>
      </Card>
    </div>
  );
}
