import { motion } from 'motion/react';
import { Card, Button } from '../components/ui';
import { Modal } from '../components/Modal';
import { useToast } from '../components/Toast';
import { UserCheck, Search, Phone, Mail, Home, Plus, Car, Shield } from 'lucide-react';
import { useState } from 'react';

interface Resident {
  id: string;
  name: string;
  unit: string;
  block: string;
  type: 'Proprietário Morador' | 'Inquilino' | 'Proprietário Não-Residente';
  phone: string;
  email: string;
  isFinancialResponsible: boolean;
  status: 'Ativo' | 'Incompleto';
  vagas?: string;
}

const MOCK_RESIDENTS: Resident[] = [
  {
    id: '1',
    name: 'Carlos Silva e Oliveira',
    unit: '102',
    block: 'Bloco A',
    type: 'Proprietário Morador',
    phone: '(11) 98765-4321',
    email: 'carlos.silva@email.com',
    isFinancialResponsible: true,
    status: 'Ativo',
    vagas: 'Vagas 14 e 15 (Subsolo 1)'
  },
  {
    id: '2',
    name: 'Mariana Duarte',
    unit: '402',
    block: 'Bloco B',
    type: 'Inquilino',
    phone: '(11) 98877-6655',
    email: 'mariana.duarte@email.com',
    isFinancialResponsible: false,
    status: 'Ativo',
    vagas: 'Vaga 38 (Subsolo 2)'
  },
  {
    id: '3',
    name: 'Rodrigo Mendonça',
    unit: '114',
    block: 'Bloco A',
    type: 'Proprietário Morador',
    phone: '(11) 97766-5544',
    email: 'rodrigo.m@email.com',
    isFinancialResponsible: true,
    status: 'Ativo',
    vagas: 'Vaga 05 (Térreo)'
  },
  {
    id: '4',
    name: 'Beatriz Alcantara',
    unit: '201',
    block: 'Bloco B',
    type: 'Proprietário Não-Residente',
    phone: '(11) 95544-3322',
    email: 'beatriz.a@email.com',
    isFinancialResponsible: true,
    status: 'Incompleto',
    vagas: 'Sem vaga cadastrada'
  }
];

export function MoradoresView() {
  const [residents, setResidents] = useState<Resident[]>(MOCK_RESIDENTS);
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [detailResident, setDetailResident] = useState<Resident | null>(null);
  const { showToast } = useToast();

  // Restrição: Apenas Síndico e Administradora podem adicionar moradores
  const userRole: 'sindico' | 'administradora' | 'morador' = 'sindico';

  const [formData, setFormData] = useState({
    name: '',
    block: 'Bloco A',
    unit: '',
    type: 'Proprietário Morador' as Resident['type'],
    phone: '',
    email: '',
    isFinancialResponsible: false,
    vagas: ''
  });

  const handleAddResident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.unit.trim()) {
      showToast('Preencha o nome e o número da unidade', 'error');
      return;
    }

    const newRes: Resident = {
      id: Date.now().toString(),
      name: formData.name,
      block: formData.block,
      unit: formData.unit,
      type: formData.type,
      phone: formData.phone || '(11) 90000-0000',
      email: formData.email || 'morador@email.com',
      isFinancialResponsible: formData.isFinancialResponsible,
      status: 'Ativo',
      vagas: formData.vagas || 'Vaga a definir'
    };

    setResidents([newRes, ...residents]);
    setIsAddModalOpen(false);
    setFormData({
      name: '',
      block: 'Bloco A',
      unit: '',
      type: 'Proprietário Morador',
      phone: '',
      email: '',
      isFinancialResponsible: false,
      vagas: ''
    });
    showToast('Morador adicionado ao cadastro unificado com sucesso!', 'success');
  };

  const filtered = residents.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) || 
    r.unit.includes(search) ||
    r.block.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-content">
            <UserCheck className="text-primary" size={24} /> Cadastro Unificado
          </h2>
          <p className="text-content-muted mt-1">Unidades, moradores, proprietários e vínculos</p>
        </div>

        {/* Botão para Síndico e Admin (Sem importar planilha, conforme solicitado) */}
        {(userRole === 'sindico' || userRole === 'administradora') && (
          <Button size="sm" onClick={() => setIsAddModalOpen(true)} className="gap-1.5 self-start sm:self-auto">
            <Plus size={16} /> Adicionar pessoa
          </Button>
        )}
      </header>

      {/* Busca */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-content-muted" />
        <input
          type="text"
          placeholder="Buscar por nome, unidade ou bloco..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm bg-surface border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-content"
        />
      </div>

      <div className="space-y-3">
        {filtered.map(resident => (
          <Card key={resident.id}>
            <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0">
                  {resident.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-bold text-content">{resident.name}</h4>
                    <span className="text-xs px-2 py-0.2 rounded bg-surface-subtle border border-border-subtle font-medium text-content-muted">
                      {resident.type}
                    </span>
                    {resident.isFinancialResponsible && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-info-bg text-info font-medium">
                        Resp. Financeiro
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-content-muted mt-1.5 flex-wrap">
                    <span className="flex items-center gap-1 font-semibold text-content">
                      <Home size={13} /> {resident.block} - Apto {resident.unit}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone size={13} /> {resident.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail size={13} /> {resident.email}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                {resident.status === 'Incompleto' && (
                  <span className="text-xs text-warning bg-warning-bg px-2 py-1 rounded font-medium">
                    Cadastro pendente
                  </span>
                )}
                <Button variant="outline" size="sm" onClick={() => setDetailResident(resident)} className="text-xs">
                  Ver detalhes
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal de Detalhes da Pessoa / Unidade */}
      <Modal
        isOpen={Boolean(detailResident)}
        onClose={() => setDetailResident(null)}
        title={detailResident?.name || 'Ficha Cadastral'}
        description={`Vínculo com ${detailResident?.block} - Apto ${detailResident?.unit}`}
      >
        {detailResident && (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-surface-subtle border border-border-subtle rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-content-muted">Tipo de Titularidade:</span>
                <span className="font-semibold text-content">{detailResident.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-content-muted">Responsável Financeiro:</span>
                <span className="font-semibold text-content">{detailResident.isFinancialResponsible ? 'Sim (emite cobranças)' : 'Não'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-content-muted">Status do Cadastro:</span>
                <span className="font-semibold text-success">{detailResident.status}</span>
              </div>
            </div>

            <div className="p-3 bg-surface border border-border-subtle rounded-lg space-y-1">
              <span className="font-bold text-content flex items-center gap-1">
                <Car size={14} className="text-primary" /> Vagas de Garagem:
              </span>
              <p className="text-content-muted">{detailResident.vagas || 'Nenhuma vaga vinculada.'}</p>
            </div>

            <div className="pt-2 border-t border-border-subtle flex justify-end">
              <Button size="sm" onClick={() => setDetailResident(null)}>Fechar ficha</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Adicionar Morador */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Cadastrar Morador ou Titular"
        description="Vincule uma pessoa a uma unidade do condomínio."
      >
        <form onSubmit={handleAddResident} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-content block mb-1">Nome completo *</label>
            <input
              type="text"
              required
              placeholder="Ex: Ana Paula Ribeiro"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-surface border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-content"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-content block mb-1">Bloco / Torre *</label>
              <select
                value={formData.block}
                onChange={e => setFormData({ ...formData, block: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-surface border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-content"
              >
                <option value="Bloco A">Bloco A</option>
                <option value="Bloco B">Bloco B</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-content block mb-1">Apartamento *</label>
              <input
                type="text"
                required
                placeholder="Ex: 304"
                value={formData.unit}
                onChange={e => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-surface border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-content"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-content block mb-1">Tipo de Vínculo</label>
              <select
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value as Resident['type'] })}
                className="w-full px-3 py-2 text-sm bg-surface border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-content"
              >
                <option value="Proprietário Morador">Proprietário Morador</option>
                <option value="Inquilino">Inquilino</option>
                <option value="Proprietário Não-Residente">Proprietário Não-Residente</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-content block mb-1">Vaga de Garagem</label>
              <input
                type="text"
                placeholder="Ex: Vaga 22"
                value={formData.vagas}
                onChange={e => setFormData({ ...formData, vagas: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-surface border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-content"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-content block mb-1">Telefone / WhatsApp</label>
              <input
                type="text"
                placeholder="(11) 90000-0000"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-surface border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-content"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-content block mb-1">E-mail</label>
              <input
                type="email"
                placeholder="email@dominio.com"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-surface border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-content"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-border-subtle">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-content">
              <input
                type="checkbox"
                checked={formData.isFinancialResponsible}
                onChange={e => setFormData({ ...formData, isFinancialResponsible: e.target.checked })}
                className="w-4 h-4 rounded text-primary focus:ring-primary/20 border-border-subtle"
              />
              Esta pessoa é o responsável financeiro pela unidade
            </label>
          </div>

          <div className="pt-3 border-t border-border-subtle flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" size="sm">
              Cadastrar pessoa
            </Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}
