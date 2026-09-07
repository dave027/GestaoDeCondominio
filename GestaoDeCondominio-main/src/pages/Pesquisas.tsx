import { motion } from 'motion/react';
import { Card, Badge, Button } from '../components/ui';
import { Vote, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface Poll {
  id: string;
  title: string;
  description: string;
  endDate: string;
  status: 'aberta' | 'encerrada';
  totalVotes: number;
  options: PollOption[];
  userVotedOptionId?: string;
}

const MOCK_POLLS: Poll[] = [
  {
    id: '1',
    title: 'Instalação de Carregador para Carros Elétricos',
    description: 'Consulta prévia aos moradores sobre o interesse na instalação de 2 estações de recarga compartilhada na garagem do subsolo.',
    endDate: '20/11/2023',
    status: 'aberta',
    totalVotes: 34,
    options: [
      { id: 'opt1', text: 'Sim, concordo e utilizaria o serviço', votes: 19 },
      { id: 'opt2', text: 'Concordo, mas não utilizarei no momento', votes: 10 },
      { id: 'opt3', text: 'Não concordo com a implantação', votes: 5 },
    ],
    userVotedOptionId: undefined
  },
  {
    id: '2',
    title: 'Horário de Silêncio nos Fins de Semana',
    description: 'Proposta para início do silêncio às 23h aos sábados em vez de 22h.',
    endDate: '01/11/2023',
    status: 'encerrada',
    totalVotes: 48,
    options: [
      { id: 'optA', text: 'Manter às 22h', votes: 31 },
      { id: 'optB', text: 'Alterar para 23h', votes: 17 },
    ],
    userVotedOptionId: 'optA'
  }
];

export function PesquisasView() {
  const [polls, setPolls] = useState<Poll[]>(MOCK_POLLS);
  const [selectedOption, setSelectedOption] = useState<{ [pollId: string]: string }>({});

  const handleVote = (pollId: string) => {
    const optionId = selectedOption[pollId];
    if (!optionId) return;

    setPolls(prev => prev.map(p => {
      if (p.id !== pollId) return p;
      return {
        ...p,
        totalVotes: p.totalVotes + 1,
        userVotedOptionId: optionId,
        options: p.options.map(opt => opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt)
      };
    }));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-content">
            <Vote className="text-primary" size={24} /> Pesquisas de Opinião
          </h2>
          <p className="text-content-muted mt-1">Participe das decisões e consultas da comunidade</p>
        </div>
      </header>

      {/* Alerta de transparência conforme diretriz */}
      <div className="flex items-center gap-2.5 p-3 rounded-lg bg-surface-subtle border border-border-subtle text-xs text-content-muted">
        <AlertCircle size={16} className="text-primary shrink-0" />
        <span>Pesquisas de opinião têm caráter consultivo e não substituem deliberações formais em assembleia.</span>
      </div>

      <div className="space-y-4">
        {polls.map(poll => {
          const hasVoted = Boolean(poll.userVotedOptionId);

          return (
            <Card key={poll.id}>
              <div className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded mr-2 bg-surface-subtle text-content-muted">
                      {poll.status === 'aberta' ? (
                        <span className="flex items-center text-success gap-1"><Clock size={12} /> Aberta até {poll.endDate}</span>
                      ) : (
                        <span className="text-content-muted">Encerrada</span>
                      )}
                    </span>
                    <h3 className="text-lg font-bold text-content mt-2">{poll.title}</h3>
                    <p className="text-sm text-content-muted mt-1 leading-relaxed">{poll.description}</p>
                  </div>
                  <Badge status="default">{poll.totalVotes} votos</Badge>
                </div>

                {/* Opções de Voto ou Resultados */}
                <div className="space-y-2.5 pt-2">
                  {poll.options.map(opt => {
                    const percentage = poll.totalVotes > 0 ? Math.round((opt.votes / poll.totalVotes) * 100) : 0;
                    const isSelected = selectedOption[poll.id] === opt.id || poll.userVotedOptionId === opt.id;

                    return (
                      <div 
                        key={opt.id}
                        onClick={() => !hasVoted && poll.status === 'aberta' && setSelectedOption({ ...selectedOption, [poll.id]: opt.id })}
                        className={`p-3 rounded-lg border transition-all relative overflow-hidden ${
                          !hasVoted && poll.status === 'aberta' ? 'cursor-pointer hover:border-primary/50' : ''
                        } ${isSelected ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'border-border-subtle bg-surface'}`}
                      >
                        {/* Barra de progresso para quem votou ou enquete encerrada */}
                        {(hasVoted || poll.status === 'encerrada') && (
                          <div 
                            className="absolute left-0 top-0 bottom-0 bg-primary/10 transition-all duration-500" 
                            style={{ width: `${percentage}%` }}
                          />
                        )}

                        <div className="relative flex items-center justify-between z-10">
                          <div className="flex items-center gap-2.5">
                            <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected ? 'border-primary bg-primary text-white' : 'border-border-subtle'
                            }`}>
                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </span>
                            <span className="text-sm font-medium text-content">{opt.text}</span>
                          </div>

                          {(hasVoted || poll.status === 'encerrada') && (
                            <span className="text-xs font-semibold text-content-muted">{percentage}% ({opt.votes})</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Ações */}
                <div className="pt-2 flex justify-between items-center border-t border-border-subtle text-xs text-content-muted">
                  <span>{poll.totalVotes} participações registradas</span>
                  {poll.status === 'aberta' && !hasVoted && (
                    <Button 
                      size="sm" 
                      disabled={!selectedOption[poll.id]} 
                      onClick={() => handleVote(poll.id)}
                    >
                      Confirmar voto
                    </Button>
                  )}
                  {hasVoted && (
                    <span className="inline-flex items-center gap-1 text-success font-medium">
                      <CheckCircle size={14} /> Seu voto foi registrado
                    </span>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </motion.div>
  );
}
