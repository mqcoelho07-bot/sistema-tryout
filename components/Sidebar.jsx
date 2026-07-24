'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const isTryoutPage = pathname === '/' || pathname.startsWith('/editar') || pathname.startsWith('/novo');
  const isRelatorioPage = pathname === '/relatorio';

  return (
    <aside className="sidebar">
      <div className="sidebar-title">Gerenciamento de Layout</div>
      <ul className="sidebar-menu">
        <li>
          <Link href="/" className={`sidebar-menu-item ${isTryoutPage ? 'active' : ''}`}>
            📋 Tryout
          </Link>
        </li>
        <li>
          <Link href="/relatorio" className={`sidebar-menu-item ${isRelatorioPage ? 'active' : ''}`}>
            📊 Relatório
          </Link>
        </li>
      </ul>
    </aside>
  );
}
