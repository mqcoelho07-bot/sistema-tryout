const STORAGE_KEY = 'tryout_data';

const SAMPLE_DATA = [
  {
    id: '1',
    codigo: 'VULC-001',
    setor: 'Vulcanização',
    descricao: 'Matriz de vulcanização - Pneu 205/55 R16',
    status: 'Em Execução',
    responsavel: 'Carlos Silva',
    dataAbertura: '2026-07-20',
    dataProgramada: '2026-07-24',
    dataConclusao: '',
    tentativas: [
      { numero: 1, data: '2026-07-20', resultado: 'Reprovado', responsavel: 'Carlos Silva', observacoes: 'Temperatura abaixo do esperado, tempo de cura insuficiente' },
      { numero: 2, data: '2026-07-24', resultado: 'Em Execução', responsavel: 'Carlos Silva', observacoes: 'Temperatura ajustada para 170°C, revalidar tempo de cura' }
    ],
    observacoes: 'Ajuste realizado na temperatura de vulcanização. Necessário revalidar tempo de cura.'
  },
  {
    id: '2',
    codigo: 'EST-014',
    setor: 'Estamparia',
    descricao: 'Matriz de corte - Chapa 2mm',
    status: 'Aprovado',
    responsavel: 'Ana Santos',
    dataAbertura: '2026-07-15',
    dataProgramada: '2026-07-20',
    dataConclusao: '2026-07-22',
    tentativas: [
      { numero: 1, data: '2026-07-20', resultado: 'Aprovado', responsavel: 'Ana Santos', observacoes: 'Todas as dimensoes dentro da tolerancia' }
    ],
    observacoes: 'Ferramental liberado para producao.'
  },
  {
    id: '3',
    codigo: 'FUND-007',
    setor: 'Fundição',
    descricao: 'Molde de fundição - Bloco de alumínio',
    status: 'Reprovado',
    responsavel: 'João Souza',
    dataAbertura: '2026-07-10',
    dataProgramada: '2026-07-18',
    dataConclusao: '2026-07-19',
    tentativas: [
      { numero: 1, data: '2026-07-18', resultado: 'Reprovado', responsavel: 'João Souza', observacoes: 'Porosidade excessiva na peça fundida' },
      { numero: 2, data: '2026-07-19', resultado: 'Reprovado', responsavel: 'João Souza', observacoes: 'Mesmo problema apos ajuste de temperatura' },
      { numero: 3, data: '2026-07-19', resultado: 'Reprovado', responsavel: 'João Souza', observacoes: 'Necessario retrabalho no molde' }
    ],
    observacoes: 'Necessario retrabalho estrutural no molde de fundição.'
  },
  {
    id: '4',
    codigo: 'MONT-022',
    setor: 'Montagem',
    descricao: 'Dispositivo de montagem - Conjunto de eixo',
    status: 'Aprovado Condicionalmente',
    responsavel: 'Pedro Lima',
    dataAbertura: '2026-07-12',
    dataProgramada: '2026-07-22',
    dataConclusao: '2026-07-24',
    tentativas: [
      { numero: 1, data: '2026-07-22', resultado: 'Aprovado Condicionalmente', responsavel: 'Pedro Lima', observacoes: 'Montagem funcional, porem necessario ajuste no guia' },
      { numero: 2, data: '2026-07-24', resultado: 'Aprovado Condicionalmente', responsavel: 'Pedro Lima', observacoes: 'Guia ajustado, aguardando nova validacao' }
    ],
    observacoes: 'Ajustar guia de posicionamento e revalidar.'
  }
];

export function getTryouts() {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_DATA));
    return SAMPLE_DATA;
  }
  return JSON.parse(data);
}

export function getTryoutById(id) {
  const tryouts = getTryouts();
  return tryouts.find(t => t.id === id);
}

export function createTryout(tryout) {
  const tryouts = getTryouts();
  const newTryout = {
    ...tryout,
    id: Date.now().toString(),
    tentativas: tryout.tentativas || []
  };
  tryouts.push(newTryout);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tryouts));
  return newTryout;
}

export function updateTryout(id, updates) {
  const tryouts = getTryouts();
  const index = tryouts.findIndex(t => t.id === id);
  if (index !== -1) {
    tryouts[index] = { ...tryouts[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tryouts));
    return tryouts[index];
  }
  return null;
}

export function deleteTryout(id) {
  const tryouts = getTryouts();
  const filtered = tryouts.filter(t => t.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}
