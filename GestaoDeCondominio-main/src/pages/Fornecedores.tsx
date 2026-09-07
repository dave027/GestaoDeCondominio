import { motion } from 'motion/react';
import { Card, Button } from '../components/ui';
import { Modal } from '../components/Modal';
import { useToast } from '../components/Toast';
import { Truck, Phone, Mail, FileCheck, AlertCircle, Plus, Calendar, Shield } from 'lucide-react';
import { useState } from 'react';

interface Supplier {
  id: string;
  name: string;
  cnpj: string;
  category: 'Elevadores' | 'Segurança e Portaria' | 'Limpeza e Conservação' | 'Manutenção de Bombas' | 'Seguros';
  contactPerson: string;
  phone: string;
  email: string;
  contractStatus: 'Vigente' | 'A vencer em breve' | 'Encerrado';
  contractExpires: string;
  contractDetails?: string;
}

const MOCK_SUPPLIERS: Supplier[] = [
  {
    id: '1',
    name: 'Atlas Schindler Elevadores S/A',
    cnpj: '00.028.986/0001-08',
    category: 'Elevadores',
    contactPerson: 'Roberto Prado (Plantão)',
    phone: '(11) 0800-055-1918',
    email: 'atendimento@atlas.com.br',
    contractStatus: 'Vigente',
    contractExpires: '15/05/2025',
    contractDetails: 'Cobertura integral de peças e plantão 24 horas para os 4 elevadores sociais e de serviço.'
  },
  {
    id: '2',
    name: 'Proseg Monitoramento & Segurança Patrimonial',
    cnpj: '12.345.678/0001-90',
    category: 'Segurança e Portaria',
    contactPerson: 'Marcos Vinicius',
    phone: '(11) 3456-7890',
    email: 'contato@prosegpatrimonial.com.br',
    contractStatus: 'A vencer em breve',
    contractExpires: '30/11/2023',
    contractDetails: 'Monitoramento por CFTV e suporte técnico aos controles de acesso perimetrais.'
  },
  {
    id: '3',
    name: 'AquaBombas Motores e Manutenção Hidráulica',
    cnpj: '23.456.789/0001-12',
    category: 'Manutenção de Bombas',
    contactPerson: 'Sérgio Santos',
    phone: '(11) 9988-1122',
    email: 'suporte@aquabombas.com.br',
    contractStatus: 'Vigente',
    contractExpires: '10/08/2024',
    contractDetails: 'Vistoria mensal preventiva e substituição emergencial de bombas de recalque.'
  }
];

export function FornecedoresView() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(MOCK_SUPPLIERS);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [detailModalSupplier, setDetailModalSupplier] = useState<Supplier | null>(null);
  const { showToast } = useToast();

  // Restrição estrita de módulo: Apenas Síndico e Administradora podem gerenciar fornecedores
  const userRole: 'sindico' | 'administradora' | 'morador' = 'sindico';

  const [formData, setFormData] = useState({
    name: '',
    cnpj: '',
    category: 'Elevadores' as Supplier['category'],
    contactPerson: '',
    phone: '',
    email: '',
    contractExpires: '',
    contractDetails: ''
  });

  const handleCreateSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.cnpj.trim()) {
      showToast('Preencha os campos obrigatórios do fornecedor', 'error');
      return;
    }

    const newSup: Supplier = {
      id: Date.now().toString(),
      name: formData.name,
      cnpj: formData.cnpj,
      category: formData.category,
      contactPerson: formData.contactPerson || 'Responsável Comercial',
      phone: formData.phone || '(11) 9999-9999',
      email: formData.email || 'contato@empresa.com.br',
      contractStatus: 'Vigente',
      contractExpires: formData.contractExpires || '31/12/2024',
      contractDetails: formData.contractDetails || 'Contrato de prestação de serviços com renovação periódica.'
    };

    setSuppliers([newSup, ...suppliers]);
    setIsRegisterModalOpen(false);
    setFormData({
      name: '',
      cnpj: '',
      category: 'Elevadores',
      contactPerson: '',
      phone: '',
      email: '',
      contractExpires: '',
      contractDetails: ''
    });
    showToast('Fornecedor homologado e registrado no condomínio!', 'success');
  };

  if (userRole === 'morador') {
    return (
      <div className="p-8 text-center bg-surface border border-border-subtle rounded-lg space-y-3">
        <Shield size={32} className="mx-auto text-content-muted" />
        <h3 className="text-base font-bold text-content">Acesso Restrito</h3>
        <p className="text-xs text-content-muted max-w-sm mx-auto">
          A gestão de contratos e fornecedores é restrita à administração e ao corpo diretivo do condomínio.
        </p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-content">
            <Truck className="text-primary" size={24} /> Gestão de Fornecedores
          </h2>
          <p className="text-content-muted mt-1">Contratos, prestadores de serviços e contatos de emergência (Gestão)</p>
        </div>
        <Button size="sm" onClick={() => setIsRegisterModalOpen(true)} className="gap-1.5 self-start sm:self-auto">
          <Plus size={16} /> Cadastrar fornecedor
        </Button>
      </header>

      {/* Alerta de contrato próximo do vencimento conforme especificação */}
      <div className="flex items-center gap-2.5 p-3.5 rounded-lg bg-warning-bg border border-warning/30 text-xs text-warning">
        <AlertCircle size={18} className="shrink-0" />
        <div>
          <span className="font-bold">Atenção à vigência contratual: </span>
          O contrato com <strong>Proseg Monitoramento</strong> vence em 30/11/2023. Providencie a renovação ou cotações.
        </div>
      </div>

      <div className="space-y-4">
        {suppliers.map(sup => (
          <Card key={sup.id}>
            <div className="p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-surface-subtle text-content-muted mr-2">
                    {sup.category}
                  </span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                    sup.contractStatus === 'Vigente'
                      ? 'bg-success-bg text-success'
                      : 'bg-warning-bg text-warning'
                  }`}>
                    {sup.contractStatus}
                  </span>
                  <h3 className="text-lg font-bold text-content mt-1.5">{sup.name}</h3>
                  <p className="text-xs text-content-muted font-mono">CNPJ: {sup.cnpj}</p>
                </div>

                <div className="text-right sm:text-right text-xs text-content-muted">
                  <p>Vigência do Contrato:</p>
                  <p className="font-bold text-content text-sm">{sup.contractExpires}</p>
                </div>
              </div>

              {/* Informações de contato */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-surface-subtle rounded-lg border border-border-subtle text-xs">
                <div>
                  <span className="text-content-muted block">Responsável / Plantão:</span>
                  <span className="font-semibold text-content">{sup.contactPerson}</span>
                </div>
                <div className="flex items-center gap-1.5 text-content">
                  <Phone size={14} className="text-primary shrink-0" />
                  <span className="font-medium">{sup.phone}</span>
                </div>
                <div className="flex items-center gap-1.5 text-content truncate">
                  <Mail size={14} className="text-primary shrink-0" />
                  <span className="font-medium truncate">{sup.email}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-border-subtle text-xs text-content-muted">
                <span className="flex items-center gap-1">
                  <FileCheck size={14} className="text-success" /> Contrato e certidões anexadas
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setDetailModalSupplier(sup)} className="text-xs">
                    Ver contrato e certidões
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal de Detalhes do Contrato */}
      <Modal
        isOpen={Boolean(detailModalSupplier)}
        onClose={() => setDetailModalSupplier(null)}
        title={detailModalSupplier?.name || 'Detalhes do Fornecedor'}
        description={`CNPJ: ${detailModalSupplier?.cnpj} • Categoria: ${detailModalSupplier?.category}`}
      >
        {detailModalSupplier && (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-surface-subtle border border-border-subtle rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-content-muted">Vigência Atual:</span>
                <span className="font-bold text-content">{detailModalSupplier.contractExpires}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-content-muted">Status Operacional:</span>
                <span className="font-semibold text-success">{detailModalSupplier.contractStatus}</span>
              </div>
            </div>

            <div>
              <h5 className="font-bold text-content mb-1">Escopo do Serviço Contratado:</h5>
              <p className="text-content-muted leading-relaxed p-3 bg-surface border border-border-subtle rounded-lg">
                {detailModalSupplier.contractDetails || 'Sem observações adicionais.'}
              </p>
            </div>

            <div className="pt-2 border-t border-border-subtle flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setDetailModalSupplier(null)}>Fechar</Button>
              <Button size="sm" onClick={() => {
                showToast(`Download da íntegra do contrato de ${detailModalSupplier.name} iniciado!`, 'info');
                setDetailModalSupplier(null);
              }}>
                Baixar Contrato Assinado (PDF)
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal de Cadastro de Novo Fornecedor */}
      <Modal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        title="Cadastrar Novo Fornecedor Homologado"
        description="Registre empresas prestadoras de serviço e seus contratos."
      >
        <form onSubmit={handleCreateSupplier} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-content block mb-1">Razão Social / Nome Fantasia *</label>
            <input
              type="text"
              required
              placeholder="Ex: Elevadores Brasil Ltda"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-surface border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-content"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-content block mb-1">CNPJ *</label>
              <input
                type="text"
                required
                placeholder="00.000.000/0001-00"
                value={formData.cnpj}
                onChange={e => setFormData({ ...formData, cnpj: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-surface border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-content"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-content block mb-1">Categoria *</label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value as Supplier['category'] })}
                className="w-full px-3 py-2 text-sm bg-surface border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-content"
              >
                <option value="Elevadores">Elevadores</option>
                <option value="Segurança e Portaria">Segurança e Portaria</option>
                <option value="Limpeza e Conservação">Limpeza e Conservação</option>
                <option value="Manutenção de Bombas">Manutenção de Bombas</option>
                <option value="Seguros">Seguros</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-content block mb-1">Responsável / Contato</label>
              <input
                type="text"
                placeholder="Nome do contato"
                value={formData.contactPerson}
                onChange={e => setFormData({ ...formData, contactPerson: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-surface border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-content"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-content block mb-1">Telefone de Plantão</label>
              <input
                type="text"
                placeholder="(11) 99999-9999"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-surface border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-content"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-content block mb-1">Data de Vigência do Contrato</label>
            <input
              type="text"
              placeholder="Ex: 15/12/2025"
              value={formData.contractExpires}
              onChange={e => setFormData({ ...formData, contractExpires: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-surface border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-content"
            />
          </div>

          <div className="pt-3 border-t border-border-subtle flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsRegisterModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" size="sm">
              Cadastrar fornecedor
            </Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}
