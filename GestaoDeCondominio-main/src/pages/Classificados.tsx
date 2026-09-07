import { motion } from 'motion/react';
import { Card, Button } from '../components/ui';
import { Modal } from '../components/Modal';
import { useToast } from '../components/Toast';
import { ShoppingBag, MessageSquare, Tag, ShieldCheck, Plus, Copy, ExternalLink, Ban } from 'lucide-react';
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
  status: 'Disponível' | 'Encerrado';
  date: string;
  isAuthor?: boolean;
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
    contact: '11988776655',
    status: 'Disponível',
    date: 'Ontem',
    isAuthor: true
  },
  {
    id: '2',
    title: 'Aulas de Reforço de Inglês e Espanhol',
    category: 'Serviços',
    price: 'A combinar',
    description: 'Professora certificada com 8 anos de experiência. Atendimento presencial no condomínio ou online.',
    unit: 'Apto 114 - Bloco A',
    sellerName: 'Rodrigo Mendonça',
    contact: '11977665544',
    status: 'Disponível',
    date: '3 dias atrás',
    isAuthor: false
  },
  {
    id: '3',
    title: 'Mesa de Escritório em Madeira e Aço',
    category: 'Doação',
    price: 'Gratuito',
    description: 'Dimensões: 120x60cm. Retirada por conta do interessado hoje ou amanhã.',
    unit: 'Apto 801 - Bloco A',
    sellerName: 'Lucas Ferreira',
    contact: '11966554433',
    status: 'Encerrado',
    date: '5 dias atrás',
    isAuthor: false
  }
];

export function ClassificadosView() {
  const [items, setItems] = useState<Classified[]>(MOCK_CLASSIFIEDS);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [contactModalItem, setContactModalItem] = useState<Classified | null>(null);
  const { showToast } = useToast();

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Venda' as Classified['category'],
    priceType: 'valor' as 'valor' | 'Gratuito' | 'A combinar',
    priceValue: '',
    description: '',
    contact: '(11) 98765-4321',
  });

  const categories = ['Todas', 'Venda', 'Serviços', 'Doação', 'Aluguel', 'Perdidos'];

  const filtered = selectedCategory === 'Todas' 
    ? items 
    : items.filter(item => item.category === selectedCategory);

  const handleCreateAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      showToast('Preencha os campos obrigatórios', 'error');
      return;
    }

    const price = formData.priceType === 'valor' ? Number(formData.priceValue) || 0 : formData.priceType;

    const newItem: Classified = {
      id: Date.now().toString(),
      title: formData.title,
      category: formData.category,
      price,
      description: formData.description,
      unit: 'Apto 102 - Bloco A',
      sellerName: 'Você (Carlos)',
      contact: formData.contact.replace(/\D/g, ''),
      status: 'Disponível',
      date: 'Agora',
      isAuthor: true
    };

    setItems([newItem, ...items]);
    setIsCreateModalOpen(false);
    setFormData({
      title: '',
      category: 'Venda',
      priceType: 'valor',
      priceValue: '',
      description: '',
      contact: '(11) 98765-4321'
    });
    showToast('Anúncio publicado nos classificados!', 'success');
  };

  const handleEndAd = (id: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, status: 'Encerrado' } : item));
    showToast('Anúncio encerrado com sucesso.', 'info');
  };

  const copyPhoneNumber = (phone: string) => {
    navigator.clipboard.writeText(phone);
    showToast('Número de telefone copiado!', 'success');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-content">
            <ShoppingBag className="text-primary" size={24} /> Classificados Internos
          </h2>
          <p className="text-content-muted mt-1">Anúncios, vendas e serviços entre vizinhos</p>
        </div>
        <Button size="sm" onClick={() => setIsCreateModalOpen(true)} className="gap-1.5 self-start sm:self-auto">
          <Plus size={16} /> Criar anúncio
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
                  item.status === 'Disponível' ? 'bg-success-bg text-success' : 'bg-surface-subtle text-content-muted'
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

            <div className="p-4 bg-surface-subtle border-t border-border-subtle flex items-center justify-between gap-2">
              <span className="text-xs text-content-muted flex items-center gap-1">
                <ShieldCheck size={14} className="text-success shrink-0" /> Negociação direta
              </span>

              <div className="flex items-center gap-2">
                {/* Apenas o botão de encerrar anúncio para o autor/admin, conforme instrução */}
                {item.isAuthor && item.status === 'Disponível' && (
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => handleEndAd(item.id)}
                    className="text-xs text-danger hover:bg-danger-bg gap-1"
                  >
                    <Ban size={14} /> Encerrar anúncio
                  </Button>
                )}

                {item.status === 'Disponível' && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setContactModalItem(item)}
                    className="gap-1.5 text-xs"
                  >
                    <MessageSquare size={14} /> Contatar
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal de Contato */}
      <Modal
        isOpen={Boolean(contactModalItem)}
        onClose={() => setContactModalItem(null)}
        title="Entrar em contato"
        description="Fale diretamente com o anunciante sobre este item."
      >
        {contactModalItem && (
          <div className="space-y-4">
            <div className="p-3 bg-surface-subtle rounded-lg border border-border-subtle">
              <h4 className="font-bold text-content text-sm">{contactModalItem.title}</h4>
              <p className="text-xs text-content-muted mt-1">{contactModalItem.sellerName} • {contactModalItem.unit}</p>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-content-muted">Forma de contato cadastrada:</p>
              <div className="flex items-center justify-between p-3 bg-surface border border-border-subtle rounded-lg">
                <span className="font-mono text-sm font-semibold text-content">{contactModalItem.contact}</span>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => copyPhoneNumber(contactModalItem.contact)}
                  className="gap-1 text-xs"
                >
                  <Copy size={14} /> Copiar
                </Button>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <a
                href={`https://wa.me/55${contactModalItem.contact}?text=Olá! Vi seu anúncio "${encodeURIComponent(contactModalItem.title)}" no Condo SaaS.`}
                target="_blank"
                rel="noreferrer"
                className="w-full"
              >
                <Button fullWidth className="gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white">
                  Conversar no WhatsApp <ExternalLink size={16} />
                </Button>
              </a>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal de Publicação de Anúncio */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Publicar Anúncio nos Classificados"
        description="Negocie diretamente com outros moradores do condomínio."
      >
        <form onSubmit={handleCreateAd} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-content block mb-1">Título do anúncio *</label>
            <input
              type="text"
              required
              placeholder="Ex: Sofá 3 lugares retrátil"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-surface border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-content"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-content block mb-1">Categoria *</label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value as Classified['category'] })}
                className="w-full px-3 py-2 text-sm bg-surface border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-content"
              >
                <option value="Venda">Venda</option>
                <option value="Serviços">Serviços</option>
                <option value="Doação">Doação</option>
                <option value="Aluguel">Aluguel</option>
                <option value="Perdidos">Perdidos e achados</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-content block mb-1">Tipo de Preço</label>
              <select
                value={formData.priceType}
                onChange={e => setFormData({ ...formData, priceType: e.target.value as any })}
                className="w-full px-3 py-2 text-sm bg-surface border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-content"
              >
                <option value="valor">Valor fixo (R$)</option>
                <option value="Gratuito">Gratuito / Doação</option>
                <option value="A combinar">A combinar</option>
              </select>
            </div>
          </div>

          {formData.priceType === 'valor' && (
            <div>
              <label className="text-xs font-medium text-content block mb-1">Valor (R$) *</label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="0,00"
                value={formData.priceValue}
                onChange={e => setFormData({ ...formData, priceValue: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-surface border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-content"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-content block mb-1">Telefone / WhatsApp de Contato *</label>
            <input
              type="text"
              required
              value={formData.contact}
              onChange={e => setFormData({ ...formData, contact: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-surface border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-content"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-content block mb-1">Descrição e detalhes do item *</label>
            <textarea
              required
              rows={3}
              placeholder="Descreva o estado de conservação, dimensões ou forma de retirada..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-surface border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-content resize-none"
            />
          </div>

          <div className="pt-3 border-t border-border-subtle flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" size="sm">
              Publicar anúncio
            </Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}
