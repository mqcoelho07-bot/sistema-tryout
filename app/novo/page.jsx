'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createTryout } from '../../lib/storage';
import TryoutForm from '../../components/TryoutForm';

export default function NovoTryout() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (tryout) => {
    setSaving(true);
    await createTryout(tryout);
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
      {saving ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>Salvando...</div>
      ) : (
        <TryoutForm onSubmit={handleSubmit} onCancel={handleCancel} />
      )}
    </div>
  );
}
