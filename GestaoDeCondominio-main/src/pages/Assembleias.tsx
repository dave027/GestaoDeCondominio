import { motion } from 'motion/react';
import { Card, Badge, Button } from '../components/ui';
import { Users, FileText, CheckCircle2, Clock, ChevronRight } from 'lucide-react';

interface AgendaItem {
  id: string;
  order: number;
  title: string;
  status: 'Pendente' | 'Votada' | 'Em discussão';
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
      { id: 'p1', order: 1, title: 'Prestação de contas do exercício 2022/2023', status: 'Pendente' },
      { id: 'p2', order: 2, title: 'Previsão orçamentária para 2024', status: 'Pendente' },
      { id: 'p3', order: 3, title: 'Eleição de Síndico e Conselho Fiscal', status: 'Pendente' },
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
      { id: 'p4', order: 1, title: 'Aprovação de taxa extra para restauração e impermeabilização', status: 'Votada' },
      { id: 'p5', order: 2, title: 'Escolha de empresa prestadora', status: 'Votada' },
    ],
    hasAta: true
  }
];

export function AssembleiasView() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-content">
            <Users className="text-primary" size={24} /> Assembleia Virtual
          </h2>
          <p className="text-content-muted mt-1">Convocação, pautas, quórum e votações deliberativas</p>
        </div>
        <Button size="sm" variant="outline">
          Minhas procurações
        </Button>
      </header>

      <div className="space-y-4">
        {MOCK_ASSEMBLIES.map(assembly => (
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
                      <span className="text-content-muted font-medium">{agenda.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-border-subtle">
                <div className="flex items-center gap-3 text-xs text-primary font-medium cursor-pointer hover:underline">
                  <FileText size={14} /> Edital de Convocação (PDF)
                </div>

                <div className="flex gap-2">
                  {assembly.hasAta && (
                    <Button size="sm" variant="outline" className="gap-1 text-xs">
                      <FileText size={14} /> Baixar Ata
                    </Button>
                  )}
                  {assembly.status === 'Convocada' && (
                    <Button size="sm" className="gap-1 text-xs">
                      Acessar sala de votação <ChevronRight size={14} />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
