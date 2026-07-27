'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const STATUS_OPTIONS = [
  { value: 'Não Iniciado', label: 'Não Iniciado', color: '#6b7280' },
  { value: 'Em Aberto', label: 'Em Aberto', color: '#3b82f6' },
  { value: 'Em Execução', label: 'Em Execução', color: '#3b82f6' },
  { value: 'Aprovado', label: 'Aprovado', color: '#16a34a' },
  { value: 'Reprovado', label: 'Reprovado', color: '#dc2626' },
  { value: 'Aprovado Condicionalmente', label: 'Aprovado Condicionalmente', color: '#d97706' },
];

const SETORES = ['Vulcanização', 'Estamparia', 'Fundição', 'Montagem', 'Usinagem'];

export default function TryoutForm({ tryout, onSave, onCancel }) {
  const isEdit = !!tryout;
  
  const [formData, setFormData] = useState({
    codigo: tryout?.codigo || '',
    setor: tryout?.setor || '',
    descricao: tryout?.descricao || '',
    status: tryout?.status || 'Não Iniciado',
    responsavel: tryout?.responsavel || '',
    dataAbertura: tryout?.dataAbertura || new Date().toLocaleDateString('pt-BR'),
    dataProgramada: tryout?.dataProgramada || '',
    dataConclusao: tryout?.dataConclusao || '',
    tentativas: tryout?.tentativas || [],
    observacoes: tryout?.observacoes || '',
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatDateToISO = (dateStr) => {
    if (!dateStr || dateStr === 'DD/MM/AAAA') return '';
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
  };

  const handleAddTentativa = () => {
    const novaTentativa = {
      numero: formData.tentativas.length + 1,
      data: new Date().toLocaleDateString('pt-BR'),
      status: 'Em Execução',
      responsavel: formData.responsavel || '',
      observacoes: '',
    };
    handleChange('tentativas', [...formData.tentativas, novaTentativa]);
  };

  const handleRemoveTentativa = (index) => {
    const novasTentativas = formData.tentativas.filter((_, i) => i !== index);
    novasTentativas.forEach((t, i) => { t.numero = i + 1; });
    handleChange('tentativas', novasTentativas);
  };

  const handleTentativaChange = (index, field, value) => {
    const novasTentativas = [...formData.tentativas];
    novasTentativas[index] = { ...novasTentativas[index], [field]: value };
    handleChange('tentativas', novasTentativas);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const dadosParaSalvar = {
        id: tryout?.id || Date.now().toString(),
        codigo: formData.codigo,
        setor: formData.setor,
        descricao: formData.descricao,
        status: formData.status,
        responsavel: formData.responsavel,
        dataAbertura: formData.dataAbertura,
        dataProgramada: formData.dataProgramada,
        dataConclusao: formData.dataConclusao,
        tentativas: formData.tentativas,
        observacoes: formData.observacoes,
      };

      if (isEdit) {
        const { error: updateError } = await supabase
          .from('tryouts')
          .update(dadosParaSalvar)
          .eq('id', tryout.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('tryouts')
          .insert([dadosParaSalvar]);
        if (insertError) throw insertError;
      }

      onSave?.(dadosParaSalvar);
    } catch (err) {
      console.error('Erro ao salvar tryout:', err);
      setError('Erro ao salvar. Verifique os dados e tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status) => {
    const option = STATUS_OPTIONS.find(o => o.value === status);
    return option?.color || '#6b7280';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Seção 1: Informações da Ferramenta */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">1</span>
          Informações da Ferramenta
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Código da Ferramenta</label>
            <input
              type="text"
              value={formData.codigo}
              onChange={(e) => handleChange('codigo', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: VULC-001"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Setor</label>
            <select
              value={formData.setor}
              onChange={(e) => handleChange('setor', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              required
            >
              <option value="">Selecione...</option>
              {SETORES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Descrição da Ferramenta</label>
            <input
              type="text"
              value={formData.descricao}
              onChange={(e) => handleChange('descricao', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descrição da ferramenta"
              required
            />
          </div>
        </div>
      </div>

      {/* Seção 2: Status e Responsabilidade */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">2</span>
          Status e Responsabilidade
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {STATUS_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <div className="mt-1">
              <span
                className="inline-block px-2 py-0.5 text-xs rounded-full text-white"
                style={{ backgroundColor: getStatusColor(formData.status) }}
              >
                {formData.status}
              </span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Responsável pelo Tryout</label>
            <input
              type="text"
              value={formData.responsavel}
              onChange={(e) => handleChange('responsavel', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nome do responsável"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Data de Abertura</label>
            <input
              type="text"
              value={formData.dataAbertura}
              onChange={(e) => handleChange('dataAbertura', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="DD/MM/AAAA"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Data de Conclusão</label>
            <input
              type="text"
              value={formData.dataConclusao}
              onChange={(e) => handleChange('dataConclusao', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="DD/MM/AAAA"
            />
            <p className="text-xs text-gray-400 italic mt-1">Preenchida ao concluir o tryout</p>
          </div>
        </div>
      </div>

      {/* Seção 3: Tentativas de Tryout */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">3</span>
          Tentativas de Tryout
        </h3>

        {formData.tentativas.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-4">Nenhuma tentativa registrada ainda.</p>
        ) : (
          <div className="space-y-4">
            {/* Cabeçalho da tabela */}
            <div className="grid grid-cols-12 gap-2 px-2 py-2 bg-gray-50 rounded-md">
              <div className="col-span-2 text-xs font-semibold text-gray-500 uppercase">Tentativa</div>
              <div className="col-span-2 text-xs font-semibold text-gray-500 uppercase">Data</div>
              <div className="col-span-3 text-xs font-semibold text-gray-500 uppercase">Status</div>
              <div className="col-span-3 text-xs font-semibold text-gray-500 uppercase">Responsável</div>
              <div className="col-span-2 text-xs font-semibold text-gray-500 uppercase text-center">Ações</div>
            </div>

            {formData.tentativas.map((tentativa, index) => (
              <div key={index} className="border border-gray-200 rounded-md overflow-hidden">
                {/* Linha 1: Campos principais */}
                <div className="grid grid-cols-12 gap-2 p-2 items-center bg-white">
                  <div className="col-span-2">
                    <input
                      type="text"
                      value={`${tentativa.numero}ª`}
                      readOnly
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md bg-gray-50 text-center font-medium"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="text"
                      value={tentativa.data}
                      onChange={(e) => handleTentativaChange(index, 'data', e.target.value)}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="DD/MM/AAAA"
                    />
                  </div>
                  <div className="col-span-3">
                    <select
                      value={tentativa.status}
                      onChange={(e) => handleTentativaChange(index, 'status', e.target.value)}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                    >
                      {STATUS_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-3">
                    <input
                      type="text"
                      value={tentativa.responsavel}
                      onChange={(e) => handleTentativaChange(index, 'responsavel', e.target.value)}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Responsável"
                    />
                  </div>
                  <div className="col-span-2 flex justify-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveTentativa(index)}
                      className="text-red-500 hover:text-red-700 transition-colors p-1"
                      title="Remover tentativa"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Linha 2: Campo de Observações (largura total) */}
                <div className="border-t border-gray-100 bg-gray-50/50 p-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Observações</label>
                  <textarea
                    value={tentativa.observacoes}
                    onChange={(e) => handleTentativaChange(index, 'observacoes', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                    placeholder="Digite as observações da tentativa..."
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={handleAddTentativa}
          className="mt-4 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Adicionar Nova Tentativa
        </button>
      </div>

      {/* Seção 4: Observações Gerais */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">4</span>
          Observações Gerais
        </h3>
        <textarea
          value={formData.observacoes}
          onChange={(e) => handleChange('observacoes', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          placeholder="Observações gerais sobre o tryout..."
        />
      </div>

      {/* Mensagem de erro */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* Botões de Ação */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {saving ? (
            <>
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Salvando...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
              </svg>
              Salvar Alterações
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
          Cancelar
        </button>
      </div>
    </form>
  );
}
