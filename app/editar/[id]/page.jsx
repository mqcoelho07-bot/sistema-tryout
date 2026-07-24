'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getTryoutById, updateTryout } from '../../../lib/storage';
import TryoutForm from '../../../components/TryoutForm';

export default function EditarTryout({ params }) {
  const router = useRouter();
  const [tryout, setTryout] = useState(null);

  useEffect(() => {
    const data = getTryoutById(params.id);
    setTryout(data);
  }, [params.id]);

  const handleSubmit = (updates) => {
    updateTryout(params.id, updates);
    router.push('/');
  };

  const handleCancel = () => {
    router.push('/');
  };

  if (!tryout) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>Carregando...</div>;
  }

  return (
    <div>
      <div className="breadcrumb">
        <Link href="/">Tryouts</Link> &gt; Editar Tryout
      </div>
      <h1 className="page-title" style={{ marginBottom: '24px' }}>
        Editar Tryout - {tryout.codigo}
      </h1>
      <TryoutForm initialData={tryout} onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
}
