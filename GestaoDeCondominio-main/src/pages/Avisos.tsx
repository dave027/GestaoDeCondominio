import { motion } from 'motion/react';
import { Card, Badge, Button } from '../components/ui';
import { Modal } from '../components/Modal';
import { useToast } from '../components/Toast';
import { Megaphone, Pin, AlertTriangle, CheckCircle2, Eye, Calendar, User, Plus } from 'lucide-react';
import { useState } from 'react';

interface NoticeItem {
  id: string;
  title: string;
  category: 'Urgente' | 'Manutenção' | 'Administrativo' | 'Social';
  content: string;
  author: string;
  role: string;
  date: string;
  isPinned?: boolean;
  isUrgent?: boolean;
  readCount: number;
  totalUnits: number;
  hasConfirmedRead?: boolean;
}

const MOCK_NOTICES: NoticeItem[] = [
  {
    id: '1',
    title: 'Manutenção preventiva dos elevadores (Torre A e B)',
    category: 'Manutenção',
    content: 'Informamos que na próxima quinta-feira, das 09h às 12h, a empresa Atlas Schindler realizará a manutenção periódica obrigatória dos elevadores sociais. Os de serviço operarão normalmente.',
    author: 'Carlos Silva',
    role: 'Síndico',
    date: '10/11/2023 - 14:30',
    isPinned: true,
    isUrgent: true,
    readCount: 42,
    totalUnits: 56,
    hasConfirmedRead: false
  },
  {
    id: '2',
    title: 'Campanha de Reciclagem e Coleta Seletiva',
    category: 'Administrativo',
    content: 'Pedimos a colaboração de todos para higienizar e separar adequadamente materiais recicláveis nas lixeiras identificadas no subsolo. Vidros devem ser embalados de forma segura.',
    author: 'Administradora Alfa',
    role: 'Administradora',
    date: '08/11/2023 - 10:15',
    isPinned: false,
    isUrgent: false,
    readCount: 50,
    totalUnits: 56,
    hasConfirmedRead: true
  },
  {
    id: '3',
    title: 'Limpeza semestral das caixas d’água',
    category: 'Manutenção',
    content: 'Na sexta-feira, dia 17/11, haverá interrupção programada no abastecimento de água entre 08h e 16h para higienização e controle de qualidade.',
    author: 'Carlos Silva',
    role: 'Síndico',
    date: '05/11/2023 - 17:00',
    isPinned: false,
    isUrgent: false,
    readCount: 56,
    totalUnits: 56,
    hasConfirmedRead: true
  }
];

export function AvisosView() {
  const [notices, setNotices] = useState(MOCK_NOTICES);
  const [activeFilter, setActiveFilter] = useState<'todos' | 'fixados' | 'urgentes'>('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showToast } = useToast();

  // Simulação de permissão: Síndico / Administradora logado
  const userRole: 'sindico' | 'administradora' | 'morador' = 'sindico';

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Administrativo' as NoticeItem['category'],
    content: '',
    isPinned: false,
    isUrgent: false,
  });

  const handleConfirmRead = (id: string) => {
    setNotices(prev => prev.map(n => n.id === id ? { ...n, hasConfirmedRead: true, readCount: n.readCount + 1 } : n));
    showToast('Leitura confirmada com sucesso!', 'success');
  };

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      showToast('Preencha o título e o conteúdo do aviso', 'error');
      return;
    }

    const newNotice: NoticeItem = {
      id: Date.now().toString(),
      title: formData.title,
      category: formData.category,
      content: formData.content,
      author: 'Carlos Silva',
      role: 'Síndico',
      date: new Date().toLocaleDateString('pt-BR') + ' - ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      isPinned: formData.isPinned,
      isUrgent: formData.isUrgent,
      readCount: 1,
      totalUnits: 56,
      hasConfirmedRead: true
    };

    setNotices([newNotice, ...notices]);
    setIsModalOpen(false);
    setFormData({ title: '', category: 'Administrativo', content: '', isPinned: false, isUrgent: false });
    showToast('Aviso oficial publicado com sucesso!', 'success');
  };

  const filteredNotices = notices.filter(n => {
    if (activeFilter === 'fixados') return n.isPinned;
    if (activeFilter === 'urgentes') return n.isUrgent;
    return true;
  });

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-content">
            <Megaphone className="text-primary" size={24} /> Mural de Avisos
          </h2>
          <p className="text-content-muted mt-1">Comunicações oficiais e avisos da administração</p>
        </div>
        
        {/* Botão visível exclusivamente para Síndico e Administradora conforme exigido */}
        {(userRole === 'sindico' || userRole === 'administradora') && (
          <Button size="sm" onClick={() => setIsModalOpen(true)} className="gap-1.5 self-start sm:self-auto">
            <Plus size={16} /> Novo aviso
          </Button>
        )}
      </header>

      {/* Filtros rápidos */}
      <div className="flex gap-2 border-b border-border-subtle pb-3 overflow-x-auto">
        {(['todos', 'fixados', 'urgentes'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full capitalize transition-colors ${
              activeFilter === tab 
                ? 'bg-primary text-white' 
                : 'bg-surface-subtle text-content-muted hover:text-content'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Lista de cards de aviso */}
      <div className="space-y-4">
        {filteredNotices.map(notice => (
          <Card key={notice.id} className={notice.isUrgent ? 'border-danger/30 ring-1 ring-danger/10' : ''}>
            <div className="p-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  {notice.isPinned && (
                    <span className="inline-flex items-center text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
                      <Pin size={12} className="mr-1" /> Fixado
                    </span>
                  )}
                  {notice.isUrgent && (
                    <span className="inline-flex items-center text-xs font-semibold text-danger bg-danger-bg px-2 py-0.5 rounded">
                      <AlertTriangle size={12} className="mr-1" /> Importante
                    </span>
                  )}
                  <Badge status="default">{notice.category}</Badge>
                </div>
                <div className="text-xs text-content-muted flex items-center gap-1 shrink-0">
                  <Calendar size={13} /> {notice.date}
                </div>
              </div>

              <h3 className="text-lg font-bold text-content">{notice.title}</h3>
              <p className="text-sm text-content-muted leading-relaxed whitespace-pre-line">{notice.content}</p>

              <div className="pt-3 border-t border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-content-muted">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 font-medium text-content">
                    <User size={13} /> {notice.author} ({notice.role})
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye size={13} /> {notice.readCount}/{notice.totalUnits} confirmaram leitura
                  </span>
                </div>

                <div>
                  {notice.hasConfirmedRead ? (
                    <span className="inline-flex items-center gap-1 text-success font-medium">
                      <CheckCircle2 size={14} /> Leitura confirmada
                    </span>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => handleConfirmRead(notice.id)}>
                      Confirmar leitura
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal de Publicação de Aviso (Síndico/Admin) */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Publicar Comunicação Oficial"
        description="Este comunicado será enviado para o mural de todos os condôminos."
      >
        <form onSubmit={handleCreateNotice} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-content block mb-1">Título do aviso *</label>
            <input
              type="text"
              required
              placeholder="Ex: Manutenção dos portões de acesso"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-surface border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-content"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-content block mb-1">Categoria *</label>
            <select
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value as NoticeItem['category'] })}
              className="w-full px-3 py-2 text-sm bg-surface border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-content"
            >
              <option value="Administrativo">Administrativo</option>
              <option value="Manutenção">Manutenção</option>
              <option value="Urgente">Urgente</option>
              <option value="Social">Social</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-content block mb-1">Conteúdo do comunicado *</label>
            <textarea
              required
              rows={4}
              placeholder="Escreva as informações detalhadas para os moradores..."
              value={formData.content}
              onChange={e => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-surface border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-content resize-none"
            />
          </div>

          <div className="flex flex-col gap-2 pt-2 border-t border-border-subtle">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-content">
              <input
                type="checkbox"
                checked={formData.isPinned}
                onChange={e => setFormData({ ...formData, isPinned: e.target.checked })}
                className="w-4 h-4 rounded text-primary focus:ring-primary/20 border-border-subtle"
              />
              Fixar este aviso no topo do mural
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-content">
              <input
                type="checkbox"
                checked={formData.isUrgent}
                onChange={e => setFormData({ ...formData, isUrgent: e.target.checked })}
                className="w-4 h-4 rounded text-danger focus:ring-danger/20 border-border-subtle"
              />
              Marcar como Urgente (destaque vermelho)
            </label>
          </div>

          <div className="pt-3 border-t border-border-subtle flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" size="sm">
              Publicar aviso
            </Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}
