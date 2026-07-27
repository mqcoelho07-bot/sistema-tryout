'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getTryoutById, updateTryout } from '../../../lib/storage';
import TryoutForm from '../../../components/TryoutForm';

export default function EditarTryout({ params }) {
  const router = useRouter();
  const [tryout, setTryout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await getTryoutById(params.id);
      setTryout(data);
      setLoading(false);
    }
    loadData();
  }, [params.id]);

  const handleSubmit = async (updates) => {
    setSaving(true);
    await updateTryout(params.id, updates);
    router.push('/');
  };

  const handleCancel = () => {
    router.push('/');
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>Carregando...</div>;
  }

  if (!tryout) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>Tryout não encontrado.</div>;
  }

  if (saving) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>Salvando...</div>;
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
