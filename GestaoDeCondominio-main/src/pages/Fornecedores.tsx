import { motion } from 'motion/react';
import { Card, Button } from '../components/ui';
import { Truck, Phone, Mail, FileCheck, AlertCircle, ShieldAlert } from 'lucide-react';

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
    contractExpires: '15/05/2025'
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
    contractExpires: '30/11/2023'
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
    contractExpires: '10/08/2024'
  }
];

export function FornecedoresView() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-content">
            <Truck className="text-primary" size={24} /> Gestão de Fornecedores
          </h2>
          <p className="text-content-muted mt-1">Contratos, prestadores de serviços e contatos de emergência</p>
        </div>
        <Button size="sm">
          + Cadastrar fornecedor
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
        {MOCK_SUPPLIERS.map(sup => (
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
                  <Button variant="ghost" size="sm" className="text-xs">Ver histórico</Button>
                  <Button variant="outline" size="sm" className="text-xs">Ver contrato</Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
