'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getTryouts, deleteTryout } from '../lib/storage';

export default function Home() {
  const [tryouts, setTryouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    codigo: '', setor: '', status: '', responsavel: '',
    dataProgramada: '', dataConclusao: '', tentativas: '', observacoes: ''
  });

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await getTryouts();
      setTryouts(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleDelete = async (id) => {
    if (confirm('Deseja realmente excluir este tryout?')) {
      await deleteTryout(id);
      const data = await getTryouts();
      setTryouts(data);
    }
  };

  const handleFilterChange = (column, value) => {
    setFilters({ ...filters, [column]: value });
  };

  const filteredTryouts = tryouts.filter(t => {
    return (
      (t.codigo || '').toLowerCase().includes(filters.codigo.toLowerCase()) &&
      (t.setor || '').toLowerCase().includes(filters.setor.toLowerCase()) &&
      (t.status || '').toLowerCase().includes(filters.status.toLowerCase()) &&
      (t.responsavel || '').toLowerCase().includes(filters.responsavel.toLowerCase()) &&
      formatDate(t.dataProgramada).includes(filters.dataProgramada.toLowerCase()) &&
      formatDate(t.dataConclusao).includes(filters.dataConclusao.toLowerCase()) &&
      String(t.tentativas?.length || 0).includes(filters.tentativas) &&
      (t.observacoes || '').toLowerCase().includes(filters.observacoes.toLowerCase())
    );
  });

  const countByStatus = (type) => {
    return tryouts.filter(t => {
      const status = t.status || 'Não Iniciado';
      if (type === 'aberto') return status === 'Não Iniciado' || status === 'Em Execução';
      if (type === 'aprovado') return status === 'Aprovado';
      if (type === 'reprovado') return status === 'Reprovado';
      if (type === 'condicional') return status === 'Aprovado Condicionalmente';
      return false;
    }).length;
  };

  const getStatusBadgeClass = (status) => {
    const map = {
      'Não Iniciado': 'badge-aberto',
      'Em Execução': 'badge-execucao',
      'Aprovado': 'badge-aprovado',
      'Reprovado': 'badge-reprovado',
      'Aprovado Condicionalmente': 'badge-condicional'
    };
    return map[status] || '';
  };

  function formatDate(dateStr) {
    if (!dateStr) return '—';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  }

  const columns = [
    { key: 'codigo', label: 'Código da Ferramenta' },
    { key: 'setor', label: 'Setor' },
    { key: 'status', label: 'Status' },
    { key: 'responsavel', label: 'Responsável' },
    { key: 'dataProgramada', label: 'Data Programada' },
    { key: 'dataConclusao', label: 'Data de Conclusão' },
    { key: 'tentativas', label: 'Tentativas' },
    { key: 'observacoes', label: 'Observações' }
  ];

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>Carregando...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard de Tryouts</h1>
        <Link href="/novo">
          <button className="btn btn-add">+ Adicionar Tryout</button>
        </Link>
      </div>

      <div className="counter-cards">
        <div className="counter-card aberto">
          <div className="counter-number">{countByStatus('aberto')}</div>
          <div className="counter-label">Tryouts Não Iniciados / Em Execução</div>
        </div>
        <div className="counter-card aprovado">
          <div className="counter-number">{countByStatus('aprovado')}</div>
          <div className="counter-label">Tryouts Aprovados</div>
        </div>
        <div className="counter-card reprovado">
          <div className="counter-number">{countByStatus('reprovado')}</div>
          <div className="counter-label">Tryouts Reprovados</div>
        </div>
        <div className="counter-card condicional">
          <div className="counter-number">{countByStatus('condicional')}</div>
          <div className="counter-label">Aprovados Condicionalmente</div>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col.key}>
                  {col.label}
                  <input
                    className="filter-input"
                    placeholder="Filtrar..."
                    value={filters[col.key]}
                    onChange={e => handleFilterChange(col.key, e.target.value)}
                  />
                </th>
              ))}
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredTryouts.length === 0 ? (
              <tr>
                <td colSpan="9" className="empty-state">
                  Nenhum tryout encontrado. Clique em "Adicionar Tryout" para começar.
                </td>
              </tr>
            ) : (
              filteredTryouts.map(t => (
                <tr key={t.id}>
                  <td>{t.codigo}</td>
                  <td>{t.setor}</td>
                  <td><span className={`badge ${getStatusBadgeClass(t.status)}`}>{t.status || 'Não Iniciado'}</span></td>
                  <td>{t.responsavel}</td>
                  <td>{formatDate(t.dataProgramada)}</td>
                  <td>{formatDate(t.dataConclusao)}</td>
                  <td>{t.tentativas?.length || 0}</td>
                  <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.observacoes}</td>
                  <td>
                    <div className="action-icons">
                      <Link href={`/editar/${t.id}`} className="action-icon" title="Editar">✏️</Link>
                      <span className="action-icon" onClick={() => handleDelete(t.id)} title="Excluir" style={{ cursor: 'pointer' }}>🗑️</span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
