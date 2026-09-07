import { motion } from 'motion/react';
import { Card, Button } from '../components/ui';
import { UserCheck, Search, Building2, Phone, Mail, Home } from 'lucide-react';
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
    status: 'Ativo'
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
    status: 'Ativo'
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
    status: 'Ativo'
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
    status: 'Incompleto'
  }
];

export function MoradoresView() {
  const [search, setSearch] = useState('');

  const filtered = MOCK_RESIDENTS.filter(r => 
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
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Importar planilha
          </Button>
          <Button size="sm">
            + Adicionar pessoa
          </Button>
        </div>
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
                <Button variant="outline" size="sm" className="text-xs">
                  Ver detalhes
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
