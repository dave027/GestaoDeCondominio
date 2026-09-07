import { motion } from 'motion/react';
import { Card, Button } from '../components/ui';
import { Modal } from '../components/Modal';
import { useToast } from '../components/Toast';
import { Shield, Check, KeyRound, Lock } from 'lucide-react';
import { useState } from 'react';

interface RoleProfile {
  id: string;
  name: string;
  description: string;
  usersCount: number;
  permissions: string[];
}

const ALL_AVAILABLE_PERMISSIONS = [
  'Visualizar avisos e confirmar leitura',
  'Publicar, editar e fixar comunicados oficiais no mural',
  'Votar em pesquisas de opinião',
  'Criar pesquisas de opinião e exportar resultados',
  'Publicar e responder em classificados',
  'Visualizar boletos e extratos da sua unidade',
  'Emissão e baixa de boletos condominiais',
  'Publicar balancetes e demonstrativos fiscais',
  'Participar e votar em assembleias virtuais',
  'Convocar assembleias e cadastrar pautas',
  'Consultar documentos públicos (convenção, atas)',
  'Upload e arquivamento de documentos oficiais',
  'Cadastrar e gerenciar contratos de fornecedores',
  'Acessar e editar cadastro de moradores e unidades'
];

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
      'Visualizar avisos e confirmar leitura',
      'Publicar, editar e fixar comunicados oficiais no mural',
      'Votar em pesquisas de opinião',
      'Criar pesquisas de opinião e exportar resultados',
      'Publicar e responder em classificados',
      'Visualizar boletos e extratos da sua unidade',
      'Publicar balancetes e demonstrativos fiscais',
      'Participar e votar em assembleias virtuais',
      'Convocar assembleias e cadastrar pautas',
      'Consultar documentos públicos (convenção, atas)',
      'Upload e arquivamento de documentos oficiais',
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
      'Visualizar avisos e confirmar leitura',
      'Publicar, editar e fixar comunicados oficiais no mural',
      'Criar pesquisas de opinião e exportar resultados',
      'Emissão e baixa de boletos condominiais',
      'Publicar balancetes e demonstrativos fiscais',
      'Upload e arquivamento de documentos oficiais',
      'Cadastrar e gerenciar contratos de fornecedores',
      'Acessar e editar cadastro de moradores e unidades'
    ]
  },
  {
    id: '4',
    name: 'Conselho Fiscal',
    description: 'Acompanhamento e auditoria de prestação de contas, orçamentos e contratos.',
    usersCount: 3,
    permissions: [
      'Visualizar avisos e confirmar leitura',
      'Visualizar boletos e extratos da sua unidade',
      'Consultar documentos públicos (convenção, atas)',
      'Publicar balancetes e demonstrativos fiscais'
    ]
  }
];

export function AcessosView() {
  const [profiles, setProfiles] = useState<RoleProfile[]>(MOCK_PROFILES);
  const [editingProfile, setEditingProfile] = useState<RoleProfile | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const { showToast } = useToast();

  const handleOpenEdit = (profile: RoleProfile) => {
    setEditingProfile(profile);
    setSelectedPermissions([...profile.permissions]);
  };

  const handleTogglePermission = (perm: string) => {
    if (selectedPermissions.includes(perm)) {
      setSelectedPermissions(selectedPermissions.filter(p => p !== perm));
    } else {
      setSelectedPermissions([...selectedPermissions, perm]);
    }
  };

  const handleSavePermissions = () => {
    if (!editingProfile) return;

    setProfiles(prev => prev.map(p => {
      if (p.id !== editingProfile.id) return p;
      return {
        ...p,
        permissions: selectedPermissions
      };
    }));

    setEditingProfile(null);
    showToast(`Permissões do perfil "${editingProfile.name}" atualizadas!`, 'success');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-content">
            <Shield className="text-primary" size={24} /> Hierarquia de Acessos
          </h2>
          <p className="text-content-muted mt-1">Perfis de usuários oficiais, matriz de papéis e segurança do sistema</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {profiles.map(profile => (
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
                <p className="text-[11px] font-bold text-content uppercase tracking-wider">Permissões ativas:</p>
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
                <Lock size={14} className="text-primary" /> Perfil nativo
              </span>
              <Button variant="outline" size="sm" onClick={() => handleOpenEdit(profile)} className="text-xs">
                Editar permissões
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal de Edição de Permissões */}
      <Modal
        isOpen={Boolean(editingProfile)}
        onClose={() => setEditingProfile(null)}
        title={`Permissões: ${editingProfile?.name}`}
        description="Ative ou desative os privilégios operacionais deste perfil."
      >
        <div className="space-y-4">
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {ALL_AVAILABLE_PERMISSIONS.map(perm => {
              const isChecked = selectedPermissions.includes(perm);
              return (
                <label
                  key={perm}
                  onClick={() => handleTogglePermission(perm)}
                  className={`flex items-center gap-3 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                    isChecked
                      ? 'bg-primary/5 border-primary/40 text-content font-medium'
                      : 'bg-surface border-border-subtle text-content-muted hover:bg-surface-subtle'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}} // tratado no onClick do label
                    className="w-4 h-4 rounded text-primary focus:ring-primary/20 border-border-subtle"
                  />
                  <span>{perm}</span>
                </label>
              );
            })}
          </div>

          <div className="pt-3 border-t border-border-subtle flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setEditingProfile(null)}>
              Cancelar
            </Button>
            <Button size="sm" onClick={handleSavePermissions}>
              Salvar alterações
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
