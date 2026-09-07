import { motion } from 'motion/react';
import { Card, Badge, Button } from '../components/ui';
import { Modal } from '../components/Modal';
import { useToast } from '../components/Toast';
import { Vote, CheckCircle, Clock, AlertCircle, Plus, Trash2 } from 'lucide-react';
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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { showToast } = useToast();

  // Permissão: Síndico e Administradora podem criar
  const userRole: 'sindico' | 'administradora' | 'morador' = 'sindico';

  // Form State para nova pesquisa
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [endDate, setEndDate] = useState('');
  const [optionsList, setOptionsList] = useState<string[]>(['Sim, concordo', 'Não concordo']);

  const handleAddOption = () => {
    if (optionsList.length < 5) {
      setOptionsList([...optionsList, '']);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (optionsList.length > 2) {
      setOptionsList(optionsList.filter((_, i) => i !== index));
    }
  };

  const handleCreatePoll = (e: React.FormEvent) => {
    e.preventDefault();
    const validOptions = optionsList.filter(o => o.trim() !== '');
    if (validOptions.length < 2) {
      showToast('Adicione pelo menos duas opções válidas para votação', 'error');
      return;
    }

    const newPoll: Poll = {
      id: Date.now().toString(),
      title,
      description,
      endDate: endDate || '30/11/2023',
      status: 'aberta',
      totalVotes: 0,
      options: validOptions.map((text, idx) => ({ id: `opt_${Date.now()}_${idx}`, text, votes: 0 }))
    };

    setPolls([newPoll, ...polls]);
    setIsCreateModalOpen(false);
    setTitle('');
    setDescription('');
    setEndDate('');
    setOptionsList(['Sim, concordo', 'Não concordo']);
    showToast('Pesquisa de opinião aberta aos moradores!', 'success');
  };

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
    showToast('Seu voto foi registrado com sucesso!', 'success');
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

        {/* Botão apenas para Síndico e Administradora conforme exigido */}
        {(userRole === 'sindico' || userRole === 'administradora') && (
          <Button size="sm" onClick={() => setIsCreateModalOpen(true)} className="gap-1.5 self-start sm:self-auto">
            <Plus size={16} /> Nova pesquisa
          </Button>
        )}
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

      {/* Modal de Criação de Pesquisa (Apenas Síndico/Admin) */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Criar Pesquisa de Opinião"
        description="Consulte os moradores sobre melhorias, regras ou novos serviços."
      >
        <form onSubmit={handleCreatePoll} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-content block mb-1">Título da pesquisa *</label>
            <input
              type="text"
              required
              placeholder="Ex: Reforma da área de churrasqueira"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-surface border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-content"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-content block mb-1">Contexto ou explicação *</label>
            <textarea
              required
              rows={3}
              placeholder="Explique o motivo da pesquisa e o impacto para o condomínio..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-surface border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-content resize-none"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-content block mb-1">Data limite para respostas</label>
            <input
              type="text"
              placeholder="Ex: 30/11/2023"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-surface border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-content"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-content block mb-1">Opções de voto (mínimo 2, máximo 5)</label>
            <div className="space-y-2">
              {optionsList.map((opt, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    type="text"
                    required
                    placeholder={`Opção ${idx + 1}`}
                    value={opt}
                    onChange={e => {
                      const updated = [...optionsList];
                      updated[idx] = e.target.value;
                      setOptionsList(updated);
                    }}
                    className="flex-1 px-3 py-1.5 text-sm bg-surface border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-content"
                  />
                  {optionsList.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(idx)}
                      className="p-1.5 text-content-muted hover:text-danger rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {optionsList.length < 5 && (
              <button
                type="button"
                onClick={handleAddOption}
                className="mt-2 text-xs text-primary font-medium hover:underline flex items-center gap-1"
              >
                + Adicionar outra opção
              </button>
            )}
          </div>

          <div className="pt-3 border-t border-border-subtle flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" size="sm">
              Publicar pesquisa
            </Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}
