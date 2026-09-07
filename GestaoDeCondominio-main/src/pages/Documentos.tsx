import { motion } from 'motion/react';
import { Card, Button } from '../components/ui';
import { Folder, FileText, Download, Search, Tag, Eye } from 'lucide-react';
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
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('Todas');

  const categories = ['Todas', 'Convenção e Regimento', 'Atas de Assembleia', 'Prestação de Contas', 'Contratos', 'Laudos'];

  const filteredDocs = MOCK_DOCS.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'Todas' || doc.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-content">
            <Folder className="text-primary" size={24} /> Repositório Documental
          </h2>
          <p className="text-content-muted mt-1">Documentos oficiais, atas, regimento e relatórios</p>
        </div>
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
                <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                  <Eye size={14} /> Pré-visualizar
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                  <Download size={14} /> Baixar
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {filteredDocs.length === 0 && (
          <div className="p-8 text-center text-content-muted text-sm bg-surface rounded-lg border border-dashed border-border-subtle">
            Nenhum documento encontrado para os filtros selecionados.
          </div>
        )}
      </div>
    </motion.div>
  );
}
