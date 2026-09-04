'use client';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function NewTenantPage() {
  const [created, setCreated] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [plan, setPlan] = useState('Starter');
  function createTenant(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const tenants = JSON.parse(localStorage.getItem('vendaflow-tenants') || '[]');
    tenants.push({ name, email, plan, agentCount: 0, status: 'Ativo' });
    localStorage.setItem('vendaflow-tenants', JSON.stringify(tenants));
    setCreated(true);
  }
  return <main className="min-h-screen bg-slate-50 p-6 md:p-10"><div className="max-w-2xl mx-auto"><Link href="/master" className="inline-flex gap-2 items-center text-sm text-slate-500"><ArrowLeft size={16}/> Painel Master</Link><div className="card p-6 mt-8"><h1 className="text-2xl font-bold">Cadastrar empresa</h1><p className="text-slate-500 mt-2">Crie o tenant e depois configure o agente WhatsApp.</p><form onSubmit={createTenant} className="space-y-5 mt-7"><label className="block text-sm font-semibold">Nome da empresa<input required value={name} onChange={event=>setName(event.target.value)} className="block w-full border rounded-lg p-3 mt-2" placeholder="Ex.: Gera Digital" /></label><label className="block text-sm font-semibold">E-mail do responsável<input required type="email" value={email} onChange={event=>setEmail(event.target.value)} className="block w-full border rounded-lg p-3 mt-2" placeholder="cliente@empresa.com" /></label><label className="block text-sm font-semibold">Plano<select value={plan} onChange={event=>setPlan(event.target.value)} className="block w-full border rounded-lg p-3 mt-2 bg-white"><option>Starter</option><option>Professional</option><option>Business</option></select></label><button type="submit" className="bg-ink text-white rounded-lg px-5 py-3">Criar empresa</button>{created&&<div className="rounded-lg bg-emerald-50 text-emerald-800 p-4 text-sm flex gap-2"><CheckCircle2 size={18}/><span>Empresa criada com sucesso. <Link className="font-semibold underline" href="/master/tenants">Ver clientes</Link> ou <Link className="font-semibold underline" href="/master/agents/new">configurar agente</Link>.</span></div>}</form></div></div></main>
}
