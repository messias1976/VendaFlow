import './globals.css';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'VendaFlow AI', description: 'Painel de agentes de vendas' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="pt-BR"><body>{children}</body></html>; }
