'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createTryout } from '../../lib/storage';
import TryoutForm from '../../components/TryoutForm';

export default function NovoTryout() {
  const router = useRouter();

  const handleSubmit = (tryout) => {
    createTryout(tryout);
    router.push('/');
  };

  const handleCancel = () => {
    router.push('/');
  };

  return (
    <div>
      <div className="breadcrumb">
        <Link href="/">Tryouts</Link> &gt; Novo Tryout
      </div>
      <h1 className="page-title" style={{ marginBottom: '24px' }}>Novo Tryout</h1>
      <TryoutForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
}
