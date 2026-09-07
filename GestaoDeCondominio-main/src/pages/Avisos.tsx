import { motion } from 'motion/react';
import { Card, Badge, Button } from '../components/ui';
import { Megaphone, Pin, AlertTriangle, CheckCircle2, Eye, Calendar, User } from 'lucide-react';
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

  const handleConfirmRead = (id: string) => {
    setNotices(prev => prev.map(n => n.id === id ? { ...n, hasConfirmedRead: true, readCount: n.readCount + 1 } : n));
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
        <Button variant="outline" size="sm" className="self-start sm:self-auto">
          + Novo aviso
        </Button>
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
              <p className="text-sm text-content-muted leading-relaxed">{notice.content}</p>

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
    </motion.div>
  );
}
