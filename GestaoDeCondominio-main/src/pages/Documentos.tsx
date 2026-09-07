import { motion } from 'motion/react';
import { Card, Button } from '../components/ui';
import { Modal } from '../components/Modal';
import { useToast } from '../components/Toast';
import { Folder, FileText, Download, Search, Tag, Eye, Plus, UploadCloud } from 'lucide-react';
import { useState } from 'react';

interface DocItem {
  id: string;
  title: string;
  category: 'Convenção e Regimento' | 'Atas de Assembleia' | 'Prestação de Contas' | 'Contratos' | 'Laudos';
  fileSize: string;
  updatedAt: string;
  version: string;
}

const MOCK_DOCS: DocItem[] = [
  {
    id: '1',
    title: 'Regimento Interno Consolidado 2023',
    category: 'Convenção e Regimento',
    fileSize: '1.4 MB',
    updatedAt: '12/03/2023',
    version: 'v2.1'
  },
  {
    id: '2',
    title: 'Convenção Condominial Registrada',
    category: 'Convenção e Regimento',
    fileSize: '4.8 MB',
    updatedAt: '15/01/2020',
    version: 'v1.0'
  },
  {
    id: '3',
    title: 'Ata da Assembleia Geral Extraordinária - Reforma Fachada',
    category: 'Atas de Assembleia',
    fileSize: '820 KB',
    updatedAt: '20/09/2023',
    version: 'v1.0'
  },
  {
    id: '4',
    title: 'Balancete Contábil e DRE - Outubro 2023',
    category: 'Prestação de Contas',
    fileSize: '2.1 MB',
    updatedAt: '05/11/2023',
    version: 'v1.0'
  },
  {
    id: '5',
    title: 'Contrato de Manutenção de Elevadores (Atlas Schindler)',
    category: 'Contratos',
    fileSize: '3.3 MB',
    updatedAt: '01/02/2023',
    version: 'v2.0'
  },
  {
    id: '6',
    title: 'Auto de Vistoria do Corpo de Bombeiros (AVCB Vigente)',
    category: 'Laudos',
    fileSize: '950 KB',
    updatedAt: '14/06/2023',
    version: 'v1.0'
  }
];

export function DocumentosView() {
  const [docs, setDocs] = useState<DocItem[]>(MOCK_DOCS);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('Todas');
  const [previewDoc, setPreviewDoc] = useState<DocItem | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const { showToast } = useToast();

  // Restrição: Apenas Síndico e Administradora podem fazer upload de novos documentos
  const userRole: 'sindico' | 'administradora' | 'morador' = 'sindico';

  const [newDoc, setNewDoc] = useState({
    title: '',
    category: 'Convenção e Regimento' as DocItem['category'],
    version: 'v1.0'
  });

  const categories = ['Todas', 'Convenção e Regimento', 'Atas de Assembleia', 'Prestação de Contas', 'Contratos', 'Laudos'];

  const filteredDocs = docs.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'Todas' || doc.category === category;
    return matchesSearch && matchesCategory;
  });

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoc.title.trim()) {
      showToast('Informe o título do documento', 'error');
      return;
    }

    const item: DocItem = {
      id: Date.now().toString(),
      title: newDoc.title,
      category: newDoc.category,
      fileSize: '1.2 MB',
      updatedAt: new Date().toLocaleDateString('pt-BR'),
      version: newDoc.version || 'v1.0'
    };

    setDocs([item, ...docs]);
    setIsUploadModalOpen(false);
    setNewDoc({ title: '', category: 'Convenção e Regimento', version: 'v1.0' });
    showToast('Documento oficial arquivado e publicado com sucesso!', 'success');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-content">
            <Folder className="text-primary" size={24} /> Repositório Documental
          </h2>
          <p className="text-content-muted mt-1">Documentos oficiais, atas, regimento e relatórios</p>
        </div>

        {/* Botão visível exclusivamente para Síndico e Administradora conforme exigido */}
        {(userRole === 'sindico' || userRole === 'administradora') && (
          <Button size="sm" onClick={() => setIsUploadModalOpen(true)} className="gap-1.5 self-start sm:self-auto">
            <Plus size={16} /> Adicionar documento
          </Button>
        )}
      </header>

      {/* Busca e Filtros */}
      <div className="space-y-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-content-muted" />
          <input
            type="text"
            placeholder="Buscar por título ou palavra-chave..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-surface border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-content"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full shrink-0 transition-colors ${
                category === cat
                  ? 'bg-primary text-white'
                  : 'bg-surface-subtle text-content-muted hover:text-content'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Documentos */}
      <div className="space-y-3">
        {filteredDocs.map(doc => (
          <Card key={doc.id} className="hover:border-primary/40 transition-colors">
            <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5 sm:mt-0">
                  <FileText size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-content">{doc.title}</h4>
                  <div className="flex items-center gap-3 text-xs text-content-muted mt-1 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Tag size={12} /> {doc.category}
                    </span>
                    <span>Tamanho: {doc.fileSize}</span>
                    <span>Atualizado em: {doc.updatedAt}</span>
                    <span className="px-1.5 py-0.2 rounded bg-surface-subtle border border-border-subtle font-mono text-[10px]">
                      {doc.version}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <Button variant="ghost" size="sm" onClick={() => setPreviewDoc(doc)} className="gap-1.5 text-xs">
                  <Eye size={14} /> Pré-visualizar
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => showToast(`Download do arquivo "${doc.title}.pdf" iniciado!`, 'info')}
                  className="gap-1.5 text-xs"
                >
                  <Download size={14} /> Baixar
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal de Pré-visualização de Documento */}
      <Modal
        isOpen={Boolean(previewDoc)}
        onClose={() => setPreviewDoc(null)}
        title={previewDoc?.title || 'Visualização do Documento'}
        description={`Categoria: ${previewDoc?.category} • Versão ${previewDoc?.version}`}
        maxWidth="lg"
      >
        {previewDoc && (
          <div className="space-y-4">
            <div className="p-6 bg-surface-subtle border border-border-subtle rounded-lg text-xs leading-relaxed space-y-3 font-mono">
              <div className="flex justify-between items-center border-b pb-2 text-content">
                <span className="font-bold">ARQUIVO OFICIAL CERTIFICADO</span>
                <span>{previewDoc.updatedAt}</span>
              </div>
              <p className="font-semibold text-sm text-content">{previewDoc.title}</p>
              <p>Este documento faz parte do repositório oficial do condomínio e possui validade jurídica para todos os moradores e gestores.</p>
              <p className="text-content-muted">Tamanho do arquivo original: {previewDoc.fileSize}. Todas as revisões anteriores encontram-se no histórico de versionamento.</p>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setPreviewDoc(null)}>Fechar</Button>
              <Button size="sm" onClick={() => {
                showToast(`Download de "${previewDoc.title}" iniciado!`, 'success');
                setPreviewDoc(null);
              }}>
                <Download size={14} className="mr-1" /> Baixar arquivo original
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal de Upload de Documento (Apenas Síndico / Admin) */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Adicionar Novo Documento Oficial"
        description="Publique convenções, atas, contratos ou laudos para consulta dos condôminos."
      >
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-content block mb-1">Título do documento *</label>
            <input
              type="text"
              required
              placeholder="Ex: Laudo Técnico de Estanqueidade do Gás"
              value={newDoc.title}
              onChange={e => setNewDoc({ ...newDoc, title: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-surface border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-content"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-content block mb-1">Categoria *</label>
              <select
                value={newDoc.category}
                onChange={e => setNewDoc({ ...newDoc, category: e.target.value as DocItem['category'] })}
                className="w-full px-3 py-2 text-sm bg-surface border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-content"
              >
                <option value="Convenção e Regimento">Convenção e Regimento</option>
                <option value="Atas de Assembleia">Atas de Assembleia</option>
                <option value="Prestação de Contas">Prestação de Contas</option>
                <option value="Contratos">Contratos</option>
                <option value="Laudos">Laudos</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-content block mb-1">Versão</label>
              <input
                type="text"
                placeholder="v1.0"
                value={newDoc.version}
                onChange={e => setNewDoc({ ...newDoc, version: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-surface border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-content"
              />
            </div>
          </div>

          <div className="p-6 border-2 border-dashed border-border-subtle rounded-lg text-center bg-surface-subtle space-y-2 cursor-pointer hover:border-primary/50 transition-colors">
            <UploadCloud size={32} className="mx-auto text-content-muted" />
            <p className="text-xs font-semibold text-content">Arraste o arquivo PDF aqui ou clique para selecionar</p>
            <p className="text-[11px] text-content-muted">Formatos permitidos: PDF, DOCX (até 25 MB)</p>
          </div>

          <div className="pt-3 border-t border-border-subtle flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsUploadModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" size="sm">
              Concluir publicação
            </Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}
