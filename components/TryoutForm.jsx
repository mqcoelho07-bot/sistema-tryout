'use client';
import { useState, Fragment } from 'react';
const SETORES = ['Vulcanização', 'Estamparia', 'Fundição', 'Montagem'];
const STATUS = ['Não Iniciado', 'Em Execução', 'Aprovado', 'Reprovado', 'Aprovado Condicionalmente'];
export default function TryoutForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    codigo: initialData?.codigo || '',
    setor: initialData?.setor || '',
    descricao: initialData?.descricao || '',
    status: initialData?.status || 'Não Iniciado',
    responsavel: initialData?.responsavel || '',
    dataAbertura: initialData?.dataAbertura || new Date().toISOString().split('T')[0],
    dataProgramada: initialData?.dataProgramada || '',
    dataConclusao: initialData?.dataConclusao || '',
    tentativas: initialData?.tentativas ? initialData.tentativas.map((t, i) => ({ ...t, numero: i + 1 })) : [],
    observacoes: initialData?.observacoes || ''
  });
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  const handleAddTentativa = () => {
    const newTentativa = {
      numero: formData.tentativas.length + 1,
      data: new Date().toISOString().split('T')[0],
      status: 'Em Execução',
      responsavel: formData.responsavel || '',
      observacoes: ''
    };
    setFormData(prev => ({ ...prev, tentativas: [...prev.tentativas, newTentativa] }));
  };
  const handleRemoveTentativa = (index) => {
    const tentativas = formData.tentativas.filter((_, i) => i !== index);
    tentativas.forEach((t, i) => { t.numero = i + 1; });
    setFormData(prev => ({ ...prev, tentativas }));
  };
  const handleTentativaChange = (index, field, value) => {
    const tentativas = [...formData.tentativas];
    tentativas[index] = { ...tentativas[index], [field]: value };
    setFormData(prev => ({ ...prev, tentativas }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanData = {
      ...formData,
      tentativas: formData.tentativas.filter(t => t.data || t.status || t.responsavel || t.observacoes)
    };
    cleanData.tentativas.forEach((t, i) => { t.numero = i + 1; });
    onSubmit(cleanData);
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
  return (
    <form onSubmit={handleSubmit} className="form-card">
      {/* Seção 1: Informações da Ferramenta */}
      <div className="form-section">
        <h2 className="form-section-title">Informações da Ferramenta</h2>
        <div className="form-group">
          <label className="form-label">Código da Ferramenta *</label>
          <input className="form-input" type="text" value={formData.codigo}
            onChange={e => handleChange('codigo', e.target.value)}
            placeholder="Ex: VULC-001" required />
        </div>
        <div className="form-group">
          <label className="form-label">Setor *</label>
          <select className="form-select" value={formData.setor}
            onChange={e => handleChange('setor', e.target.value)} required>
            <option value="">Selecione...</option>
            {SETORES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Descrição da Ferramenta</label>
          <input className="form-input" type="text" value={formData.descricao}
            onChange={e => handleChange('descricao', e.target.value)}
            placeholder="Ex: Matriz de vulcanização - Pneu 205/55 R16" />
        </div>
      </div>
      {/* Seção 2: Status e Responsabilidade */}
      <div className="form-section">
        <h2 className="form-section-title">Status e Responsabilidade</h2>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Status do Tryout</label>
            <select className="form-select" value={formData.status}
              onChange={e => handleChange('status', e.target.value)}>
              {STATUS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <div style={{ marginTop: '6px' }}>
              <span className={`badge ${getStatusBadgeClass(formData.status)}`}>{formData.status}</span>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Responsável pelo Tryout</label>
            <input className="form-input" type="text" value={formData.responsavel}
              onChange={e => handleChange('responsavel', e.target.value)}
              placeholder="Ex: Carlos Silva" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Data de Abertura</label>
            <input className="form-input" type="date" value={formData.dataAbertura}
              onChange={e => handleChange('dataAbertura', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Data Programada</label>
            <input className="form-input" type="date" value={formData.dataProgramada}
              onChange={e => handleChange('dataProgramada', e.target.value)} />
            <div className="form-hint">Data em que o tryout está programado para entrar na máquina</div>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Data de Conclusão</label>
          <input className="form-input" type="date" value={formData.dataConclusao}
            onChange={e => handleChange('dataConclusao', e.target.value)} />
          <div className="form-hint">Preenchida ao concluir o tryout</div>
        </div>
      </div>
      {/* Seção 3: Tentativas de Tryout */}
      <div className="form-section">
        <h2 className="form-section-title">Tentativas de Tryout</h2>
        <table className="tentativas-table">
          <thead>
            <tr>
              <th>Tentativa</th>
              <th>Data</th>
              <th>Status</th>
              <th>Responsável</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {formData.tentativas.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', color: '#9ca3af', padding: '16px' }}>
                  Nenhuma tentativa registrada. Clique em "Adicionar Nova Tentativa".
                </td>
              </tr>
            ) : (
              formData.tentativas.map((tentativa, index) => (
                <Fragment key={index}>
                  <tr>
                    <td style={{ fontWeight: 'bold' }}>{tentativa.numero}ª</td>
                    <td>
                      <input className="form-input" type="date" value={tentativa.data || ''}
                        onChange={e => handleTentativaChange(index, 'data', e.target.value)} />
                    </td>
                    <td>
                      <select className="form-select" value={tentativa.status || ''}
                        onChange={e => handleTentativaChange(index, 'status', e.target.value)}>
                        {STATUS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <div style={{ marginTop: '4px' }}>
                        <span className={`badge ${getStatusBadgeClass(tentativa.status)}`}>{tentativa.status}</span>
                      </div>
                    </td>
                    <td>
                      <input className="form-input" type="text" value={tentativa.responsavel || ''}
                        onChange={e => handleTentativaChange(index, 'responsavel', e.target.value)}
                        placeholder="Responsável" />
                    </td>
                    <td>
                      <button type="button" className="btn-remove-tentativa"
                        onClick={() => handleRemoveTentativa(index)} title="Excluir tentativa">
                        🗑️
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="5" style={{ paddingTop: '4px', paddingBottom: '8px' }}>
                      <textarea className="form-input" value={tentativa.observacoes || ''}
                        onChange={e => handleTentativaChange(index, 'observacoes', e.target.value)}
                        placeholder="Observações da tentativa"
                        style={{ width: '100%', minHeight: '60px', resize: 'vertical' }} />
                    </td>
                  </tr>
                </Fragment>
              ))
            )}
          </tbody>
        </table>
        <button type="button" className="btn btn-add" onClick={handleAddTentativa}>
          + Adicionar Nova Tentativa
        </button>
      </div>
      {/* Seção 4: Observações */}
      <div className="form-section">
        <h2 className="form-section-title">Observações Gerais</h2>
        <div className="form-group">
          <textarea className="form-textarea" value={formData.observacoes}
            onChange={e => handleChange('observacoes', e.target.value)}
            placeholder="Observações gerais sobre o tryout..." />
        </div>
      </div>
      {/* Ações */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
        <button type="submit" className="btn btn-save">Salvar Alterações</button>
        <button type="button" className="btn btn-cancel" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
}
