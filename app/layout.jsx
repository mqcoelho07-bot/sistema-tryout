import './globals.css';
import Sidebar from '../components/Sidebar';

export const metadata = {
  title: 'Sistema de Gerenciamento de Tryout',
  description: 'Sistema de gerenciamento de tryout industrial',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <Sidebar />
        <main className="main-content">
          {children}
        </main>
      </body>
    </html>
  );
}
