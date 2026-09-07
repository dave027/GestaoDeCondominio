import { motion } from 'motion/react';
import { Card, Button } from '../components/ui';
import { Shield, Lock, Check, ShieldCheck, KeyRound } from 'lucide-react';

interface RoleProfile {
  id: string;
  name: string;
  description: string;
  usersCount: number;
  permissions: string[];
}

const MOCK_PROFILES: RoleProfile[] = [
  {
    id: '1',
    name: 'Morador / Inquilino',
    description: 'Acesso às informações da própria unidade, mural de avisos, enquetes, assembleia e classificados.',
    usersCount: 142,
    permissions: [
      'Visualizar avisos e confirmar leitura',
      'Votar em pesquisas de opinião',
      'Publicar e responder em classificados',
      'Visualizar boletos e extratos da sua unidade',
      'Participar e votar em assembleias virtuais',
      'Consultar documentos públicos (convenção, atas)'
    ]
  },
  {
    id: '2',
    name: 'Síndico / Subsíndico',
    description: 'Gestão completa operacional, comunicação oficial e condução de assembleias no condomínio.',
    usersCount: 2,
    permissions: [
      'Todas as permissões de Morador',
      'Publicar, editar e fixar comunicados oficiais no mural',
      'Criar pesquisas de opinião e exportar resultados',
      'Convocar assembleias e cadastrar pautas',
      'Cadastrar e gerenciar contratos de fornecedores',
      'Acessar e editar cadastro de moradores e unidades'
    ]
  },
  {
    id: '3',
    name: 'Administradora de Condomínios',
    description: 'Acesso gerencial amplo, controle financeiro, geração de cobranças e relatórios fiscais.',
    usersCount: 4,
    permissions: [
      'Acesso a múltiplos condomínios da carteira',
      'Emissão e baixa de boletos condominiais',
      'Upload de relatórios contábeis e prestação de contas',
      'Importação em lote de cadastros de unidades',
      'Gerenciamento de papéis e permissões de acesso'
    ]
  },
  {
    id: '4',
    name: 'Conselho Fiscal',
    description: 'Acompanhamento e auditoria de prestação de contas, orçamentos e contratos.',
    usersCount: 3,
    permissions: [
      'Visualizar relatórios contábeis e fiscais completos',
      'Auditar contratos e pagamentos a fornecedores',
      'Emitir parecer consultivo nas contas da assembleia'
    ]
  }
];

export function AcessosView() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-content">
            <Shield className="text-primary" size={24} /> Hierarquia de Acessos
          </h2>
          <p className="text-content-muted mt-1">Perfis de usuários, níveis de permissão e segurança</p>
        </div>
        <Button size="sm">
          + Criar novo perfil
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_PROFILES.map(profile => (
          <Card key={profile.id} className="flex flex-col justify-between">
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <KeyRound size={16} />
                  </div>
                  <h3 className="font-bold text-content text-base">{profile.name}</h3>
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-surface-subtle text-content-muted font-medium">
                  {profile.usersCount} usuários
                </span>
              </div>

              <p className="text-xs text-content-muted leading-relaxed">
                {profile.description}
              </p>

              <div className="pt-3 border-t border-border-subtle space-y-1.5">
                <p className="text-[11px] font-bold text-content uppercase tracking-wider">Permissões inclusas:</p>
                <div className="space-y-1">
                  {profile.permissions.map((perm, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-content">
                      <Check size={13} className="text-success shrink-0" />
                      <span>{perm}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-surface-subtle border-t border-border-subtle flex justify-between items-center">
              <span className="text-xs text-content-muted flex items-center gap-1">
                <ShieldCheck size={14} className="text-primary" /> Perfil ativo
              </span>
              <Button variant="outline" size="sm" className="text-xs">
                Editar permissões
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
