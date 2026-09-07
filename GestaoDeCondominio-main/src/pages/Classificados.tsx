import { motion } from 'motion/react';
import { Card, Badge, Button } from '../components/ui';
import { ShoppingBag, MessageSquare, Tag, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

interface Classified {
  id: string;
  title: string;
  category: 'Venda' | 'Serviços' | 'Doação' | 'Aluguel' | 'Perdidos';
  price: number | 'Gratuito' | 'A combinar';
  description: string;
  unit: string;
  sellerName: string;
  contact: string;
  status: 'Disponível' | 'Reservado' | 'Vendido';
  date: string;
}

const MOCK_CLASSIFIEDS: Classified[] = [
  {
    id: '1',
    title: 'Bicicleta Infantil Aro 16 (Ótimo estado)',
    category: 'Venda',
    price: 250.00,
    description: 'Pouco usada, acompanha rodinhas laterais de apoio e capacete infantil de brinde.',
    unit: 'Apto 402 - Bloco B',
    sellerName: 'Mariana Duarte',
    contact: '(11) 98877-6655',
    status: 'Disponível',
    date: 'Ontem'
  },
  {
    id: '2',
    title: 'Aulas de Reforço de Inglês e Espanhol',
    category: 'Serviços',
    price: 'A combinar',
    description: 'Professora certificada com 8 anos de experiência. Atendimento presencial no condomínio ou online.',
    unit: 'Apto 114 - Bloco A',
    sellerName: 'Rodrigo Mendonça',
    contact: '(11) 97766-5544',
    status: 'Disponível',
    date: '3 dias atrás'
  },
  {
    id: '3',
    title: 'Mesa de Escritório em Madeira e Aço',
    category: 'Doação',
    price: 'Gratuito',
    description: 'Dimensões: 120x60cm. Retirada por conta do interessado hoje ou amanhã.',
    unit: 'Apto 801 - Bloco A',
    sellerName: 'Lucas Ferreira',
    contact: '(11) 96655-4433',
    status: 'Reservado',
    date: '5 dias atrás'
  }
];

export function ClassificadosView() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');

  const categories = ['Todas', 'Venda', 'Serviços', 'Doação', 'Aluguel', 'Perdidos'];

  const filtered = selectedCategory === 'Todas' 
    ? MOCK_CLASSIFIEDS 
    : MOCK_CLASSIFIEDS.filter(item => item.category === selectedCategory);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-content">
            <ShoppingBag className="text-primary" size={24} /> Classificados Internos
          </h2>
          <p className="text-content-muted mt-1">Anúncios, vendas e serviços entre vizinhos</p>
        </div>
        <Button size="sm" className="self-start sm:self-auto">
          + Criar anúncio
        </Button>
      </header>

      {/* Categorias em pills */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full shrink-0 transition-colors ${
              selectedCategory === cat 
                ? 'bg-primary text-white' 
                : 'bg-surface-subtle text-content-muted hover:text-content'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid de classificados */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(item => (
          <Card key={item.id} className="flex flex-col justify-between">
            <div className="p-5 space-y-3">
              <div className="flex justify-between items-start">
                <span className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded bg-surface-subtle text-content-muted">
                  <Tag size={12} className="mr-1" /> {item.category}
                </span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                  item.status === 'Disponível' ? 'bg-success-bg text-success' : 'bg-warning-bg text-warning'
                }`}>
                  {item.status}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-content text-base">{item.title}</h3>
                <p className="text-sm text-content-muted mt-1 leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              </div>

              <div className="text-lg font-bold text-primary">
                {typeof item.price === 'number' ? `R$ ${item.price.toFixed(2).replace('.', ',')}` : item.price}
              </div>

              <div className="pt-3 border-t border-border-subtle flex items-center justify-between text-xs text-content-muted">
                <div>
                  <p className="font-medium text-content">{item.sellerName}</p>
                  <p>{item.unit}</p>
                </div>
                <span>{item.date}</span>
              </div>
            </div>

            <div className="p-4 bg-surface-subtle border-t border-border-subtle flex items-center justify-between">
              <span className="text-xs text-content-muted flex items-center gap-1">
                <ShieldCheck size={14} className="text-success" /> Negociação direta
              </span>
              <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                <MessageSquare size={14} /> Contatar
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
