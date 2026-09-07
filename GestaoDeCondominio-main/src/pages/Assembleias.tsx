import { motion } from 'motion/react';
import { Card, Badge, Button } from '../components/ui';
import { Modal } from '../components/Modal';
import { useToast } from '../components/Toast';
import { Users, FileText, CheckCircle2, Clock, ChevronRight, Check, X, MinusCircle } from 'lucide-react';
import { useState } from 'react';

interface AgendaItem {
  id: string;
  order: number;
  title: string;
  description?: string;
  status: 'Pendente' | 'Votada' | 'Em discussão';
  userVote?: 'A favor' | 'Contra' | 'Abstenção';
}

interface Assembly {
  id: string;
  title: string;
  type: 'Ordinária' | 'Extraordinária';
  date: string;
  time: string;
  status: 'Convocada' | 'Em andamento' | 'Encerrada';
  quorum: string;
  agendas: AgendaItem[];
  hasAta?: boolean;
}

const MOCK_ASSEMBLIES: Assembly[] = [
  {
    id: '1',
    title: 'Assembleia Geral Ordinária (AGO 2023)',
    type: 'Ordinária',
    date: '25/11/2023',
    time: '19:30 (1ª convocação) / 20:00 (2ª convocação)',
    status: 'Convocada',
    quorum: 'Quórum inicial: 50% + 1',
    agendas: [
      { id: 'p1', order: 1, title: 'Prestação de contas do exercício 2022/2023', description: 'Apresentação detalhada das receitas, despesas e auditoria contábil do conselho fiscal.', status: 'Pendente' },
      { id: 'p2', order: 2, title: 'Previsão orçamentária para 2024', description: 'Reajuste sugerido de 4,5% sobre a taxa condominial para cobertura de custos contratuais.', status: 'Pendente' },
      { id: 'p3', order: 3, title: 'Eleição de Síndico e Conselho Fiscal', description: 'Votação dos membros voluntários inscritos para a gestão do biênio 2024-2025.', status: 'Pendente' },
    ],
    hasAta: false
  },
  {
    id: '2',
    title: 'Assembleia Geral Extraordinária - Reforma da Fachada',
    type: 'Extraordinária',
    date: '15/09/2023',
    time: '19:30',
    status: 'Encerrada',
    quorum: 'Quórum atingido: 68% dos condôminos',
    agendas: [
      { id: 'p4', order: 1, title: 'Aprovação de taxa extra para restauração e impermeabilização', status: 'Votada', userVote: 'A favor' },
      { id: 'p5', order: 2, title: 'Escolha de empresa prestadora', status: 'Votada', userVote: 'A favor' },
    ],
    hasAta: true
  }
];

export function AssembleiasView() {
  const [assemblies, setAssemblies] = useState<Assembly[]>(MOCK_ASSEMBLIES);
  const [votingAssembly, setVotingAssembly] = useState<Assembly | null>(null);
  const [docModalTitle, setDocModalTitle] = useState<string | null>(null);
  const [isProcuracoesOpen, setIsProcuracoesOpen] = useState(false);
  const { showToast } = useToast();

  const handleVoteAgenda = (assemblyId: string, agendaId: string, vote: 'A favor' | 'Contra' | 'Abstenção') => {
    setAssemblies(prev => prev.map(a => {
      if (a.id !== assemblyId) return a;
      return {
        ...a,
        agendas: a.agendas.map(ag => ag.id === agendaId ? { ...ag, status: 'Votada', userVote: vote } : ag)
      };
    }));

    if (votingAssembly) {
      setVotingAssembly(prev => prev ? {
        ...prev,
        agendas: prev.agendas.map(ag => ag.id === agendaId ? { ...ag, status: 'Votada', userVote: vote } : ag)
      } : null);
    }

    showToast(`Voto registrado para o Apartamento 102: "${vote}"`, 'success');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-content">
            <Users className="text-primary" size={24} /> Assembleia Virtual
          </h2>
          <p className="text-content-muted mt-1">Convocação, pautas, quórum e votações deliberativas</p>
        </div>
        <Button size="sm" variant="outline" onClick={() => setIsProcuracoesOpen(true)}>
          Minhas procurações
        </Button>
      </header>

      <div className="space-y-4">
        {assemblies.map(assembly => (
          <Card key={assembly.id} className={assembly.status === 'Convocada' ? 'border-primary/40 ring-1 ring-primary/10' : ''}>
            <div className="p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge status="default">{assembly.type}</Badge>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                    assembly.status === 'Convocada' 
                      ? 'bg-info-bg text-info' 
                      : assembly.status === 'Em andamento'
                      ? 'bg-success-bg text-success'
                      : 'bg-surface-subtle text-content-muted'
                  }`}>
                    {assembly.status}
                  </span>
                </div>
                <div className="text-xs text-content-muted flex items-center gap-1">
                  <Clock size={13} /> {assembly.date} às {assembly.time}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-content">{assembly.title}</h3>
                <p className="text-xs text-content-muted mt-1">{assembly.quorum}</p>
              </div>

              {/* Pautas */}
              <div className="bg-surface-subtle p-3 rounded-lg border border-border-subtle space-y-2">
                <p className="text-xs font-semibold text-content uppercase tracking-wider">Pautas em pauta:</p>
                <div className="space-y-1.5">
                  {assembly.agendas.map(agenda => (
                    <div key={agenda.id} className="flex items-center justify-between text-xs text-content">
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-border-subtle text-[10px] font-bold flex items-center justify-center">
                          {agenda.order}
                        </span>
                        {agenda.title}
                      </span>
                      <span className="text-content-muted font-medium">
                        {agenda.userVote ? `Votou: ${agenda.userVote}` : agenda.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-border-subtle">
                <button 
                  onClick={() => setDocModalTitle(`Edital de Convocação - ${assembly.title}`)}
                  className="flex items-center gap-2 text-xs text-primary font-medium hover:underline text-left"
                >
                  <FileText size={14} /> Edital de Convocação (PDF)
                </button>

                <div className="flex gap-2">
                  {assembly.hasAta && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setDocModalTitle(`Ata Notarial da ${assembly.title}`)}
                      className="gap-1 text-xs"
                    >
                      <FileText size={14} /> Baixar Ata
                    </Button>
                  )}
                  {assembly.status === 'Convocada' && (
                    <Button size="sm" onClick={() => setVotingAssembly(assembly)} className="gap-1 text-xs">
                      Acessar sala de votação <ChevronRight size={14} />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal de Sala de Votação */}
      <Modal
        isOpen={Boolean(votingAssembly)}
        onClose={() => setVotingAssembly(null)}
        title={votingAssembly?.title || 'Sala de Votação'}
        description="Seu voto é registrado com fé pública para o Apartamento 102."
        maxWidth="lg"
      >
        {votingAssembly && (
          <div className="space-y-4">
            <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg text-xs text-primary font-medium">
              Votação eletrônica aberta. Selecione seu posicionamento em cada uma das pautas abaixo.
            </div>

            <div className="space-y-4">
              {votingAssembly.agendas.map(agenda => (
                <div key={agenda.id} className="p-4 bg-surface-subtle border border-border-subtle rounded-lg space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm text-content">Pauta #{agenda.order}: {agenda.title}</h4>
                      {agenda.description && (
                        <p className="text-xs text-content-muted mt-1 leading-relaxed">{agenda.description}</p>
                      )}
                    </div>
                    {agenda.userVote && (
                      <span className="text-xs px-2 py-0.5 rounded bg-success-bg text-success font-semibold shrink-0">
                        Votado: {agenda.userVote}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-border-subtle">
                    <button
                      onClick={() => handleVoteAgenda(votingAssembly.id, agenda.id, 'A favor')}
                      className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg border flex items-center justify-center gap-1.5 transition-colors ${
                        agenda.userVote === 'A favor'
                          ? 'bg-success text-white border-success'
                          : 'bg-surface hover:bg-success-bg text-content border-border-subtle'
                      }`}
                    >
                      <Check size={14} /> A Favor
                    </button>
                    <button
                      onClick={() => handleVoteAgenda(votingAssembly.id, agenda.id, 'Contra')}
                      className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg border flex items-center justify-center gap-1.5 transition-colors ${
                        agenda.userVote === 'Contra'
                          ? 'bg-danger text-white border-danger'
                          : 'bg-surface hover:bg-danger-bg text-content border-border-subtle'
                      }`}
                    >
                      <X size={14} /> Contra
                    </button>
                    <button
                      onClick={() => handleVoteAgenda(votingAssembly.id, agenda.id, 'Abstenção')}
                      className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg border flex items-center justify-center gap-1.5 transition-colors ${
                        agenda.userVote === 'Abstenção'
                          ? 'bg-content-muted text-white border-content-muted'
                          : 'bg-surface hover:bg-surface-subtle text-content border-border-subtle'
                      }`}
                    >
                      <MinusCircle size={14} /> Abstenção
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-border-subtle flex justify-end">
              <Button onClick={() => setVotingAssembly(null)}>Concluir participação</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Leitor de Documento / Ata */}
      <Modal
        isOpen={Boolean(docModalTitle)}
        onClose={() => setDocModalTitle(null)}
        title={docModalTitle || 'Visualização de Documento'}
        description="Documento oficial assinado digitalmente pela administração."
      >
        <div className="space-y-4">
          <div className="p-6 bg-surface-subtle border border-border-subtle rounded-lg text-xs leading-relaxed space-y-3 font-mono">
            <p className="font-bold text-center border-b pb-2 text-content">CONDOMÍNIO RESIDENCIAL PARQUE DAS FLORES</p>
            <p>CNPJ: 04.281.993/0001-44 — Termo registrado sob certidão eletrônica.</p>
            <p>Aos vinte e cinco dias do mês, reuniram-se em ambiente digital e deliberativo os senhores condôminos para apreciação das matérias da ordem do dia com quórum qualificado.</p>
            <p className="text-content-muted">[...] Todo o registro foi auditado com chave criptográfica e confirmações de login dos condôminos titulares ou seus procuradores habilitados.</p>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setDocModalTitle(null)}>Fechar</Button>
            <Button size="sm" onClick={() => {
              showToast('Download do documento PDF iniciado!', 'success');
              setDocModalTitle(null);
            }}>
              Baixar via em PDF
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal Minhas Procurações */}
      <Modal
        isOpen={isProcuracoesOpen}
        onClose={() => setIsProcuracoesOpen(false)}
        title="Minhas Procurações e Representações"
        description="Termos outorgados ou recebidos para votação em assembleias."
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-surface-subtle border border-border-subtle rounded-lg space-y-1">
            <p className="font-bold text-content">Procuração Unidade 104 - Bloco A</p>
            <p className="text-content-muted">Outorgante: Helena Vasconcelos</p>
            <span className="text-[10px] px-2 py-0.5 rounded bg-success-bg text-success font-semibold">
              Vigente e Validada
            </span>
          </div>

          <p className="text-content-muted">Para cadastrar uma nova procuração, envie a via com firma reconhecida para a administradora.</p>

          <div className="flex justify-end">
            <Button size="sm" onClick={() => setIsProcuracoesOpen(false)}>Fechar</Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
