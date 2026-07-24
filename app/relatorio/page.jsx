'use client';

import { useState, useEffect } from 'react';
import { getTryouts } from '../../lib/storage';

export default function Relatorio() {
  const [tryouts, setTryouts] = useState([]);

  useEffect(() => {
    setTryouts(getTryouts());
  }, []);

  function formatDate(dateStr) {
    if (!dateStr) return '—';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  }

  const handleExportCSV = () => {
    const headers = ['Código', 'Setor', 'Status', 'Responsável', 'Data Programada', 'Data de Conclusão', 'Tentativas', 'Observações'];
    const rows = tryouts.map(t => [
      t.codigo,
      t.setor,
      t.status,
      t.responsavel,
      formatDate(t.dataProgramada),
      formatDate(t.dataConclusao),
      t.tentativas?.length || 0,
      (t.observacoes || '').replace(/;/g, ',')
    ]);

    const csvContent = [
      headers.join(';'),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(';'))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'relatorio_tryouts.csv';
    link.click();
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Relatório de Tryouts</h1>
        <button className="btn btn-export" onClick={handleExportCSV} disabled={tryouts.length === 0}>
          📊 Exportar para Excel
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Código da Ferramenta</th>
              <th>Setor</th>
              <th>Status</th>
              <th>Responsável</th>
              <th>Data Programada</th>
              <th>Data de Conclusão</th>
              <th>Tentativas</th>
              <th>Observações</th>
            </tr>
          </thead>
          <tbody>
            {tryouts.length === 0 ? (
              <tr>
                <td colSpan="8" className="empty-state">Nenhum tryout registrado.</td>
              </tr>
            ) : (
              tryouts.map(t => (
                <tr key={t.id}>
                  <td>{t.codigo}</td>
                  <td>{t.setor}</td>
                  <td>{t.status}</td>
                  <td>{t.responsavel}</td>
                  <td>{formatDate(t.dataProgramada)}</td>
                  <td>{formatDate(t.dataConclusao)}</td>
                  <td>{t.tentativas?.length || 0}</td>
                  <td>{t.observacoes}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
