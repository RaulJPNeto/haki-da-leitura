import React, { useState, useEffect } from 'react';
import { KeywordRule } from '../types';
import { X, BookOpen, Search, Filter } from 'lucide-react';
import { formatCategory } from '../utils/formatters';

interface GlossaryModalProps {
  keywords: KeywordRule[];
  onSelectKeyword: (keyword: KeywordRule) => void;
  onClose: () => void;
}

export const GlossaryModal: React.FC<GlossaryModalProps> = ({
  keywords,
  onSelectKeyword,
  onClose
}) => {
  const [filter, setFilter] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const filteredKeywords = keywords.filter((k) => {
    const q = filter.toLowerCase().trim();
    const matchesQuery =
      !q ||
      k.namePt.toLowerCase().includes(q) ||
      k.rawTag.toLowerCase().includes(q) ||
      k.summaryPt.toLowerCase().includes(q);

    const matchesCategory =
      selectedCategory === 'ALL' || k.category === selectedCategory;

    return matchesQuery && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-lg h-[85vh] bg-[#0b0e14] border border-white/10 rounded-2xl p-5 sm:p-6 flex flex-col gap-4 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/15 border border-sky-500/30">
              <BookOpen className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide font-heading">
                Dicionário de Regras & Keywords
              </h2>
              <p className="text-[11px] text-slate-400 font-medium">Guia Não Oficial da Comunidade em Português</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white active:scale-95 transition-all flex items-center justify-center"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Filter */}
        <div className="w-full py-2.5 px-4 bg-[#101420] border border-white/10 rounded-xl flex items-center gap-2.5 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-500/20 shadow-inner">
          <Search className="w-4 h-4 text-sky-400 shrink-0 select-none" />
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filtrar palavra-chave (ex: Bloqueador, Investida, Gatilho...)"
            className="flex-1 min-w-0 bg-transparent border-none outline-none text-xs font-semibold text-white placeholder-slate-500 focus:outline-none focus:ring-0 p-0"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" /> Categoria:
          </span>
          {[
            { id: 'ALL', label: 'Todas' },
            { id: 'TIMING', label: 'Janelas de Tempo' },
            { id: 'KEYWORD_EFFECT', label: 'Habilidades' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`pill-tab ${
                selectedCategory === cat.id ? 'pill-tab-active' : 'pill-tab-inactive'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Lista de Keywords */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 no-scrollbar">
          {filteredKeywords.map((kw) => (
            <button
              key={kw.id}
              onClick={() => onSelectKeyword(kw)}
              className="w-full p-4 rounded-xl bg-white/[0.02] hover:bg-sky-950/20 border border-white/5 hover:border-sky-500/40 flex flex-col gap-2 text-left transition-all group shadow-sm active:scale-98"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded bg-sky-950/80 border border-sky-700/50 text-sky-300 text-[10px] font-mono font-bold uppercase tracking-wider">
                  {kw.rawTagPt || kw.rawTag}
                </span>
                <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider bg-sky-950/60 border border-sky-800/40 px-2 py-0.5 rounded">
                  {formatCategory(kw.category)}
                </span>
              </div>
              <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors font-heading mt-0.5">
                {kw.namePt}
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                {kw.summaryPt}
              </p>
            </button>
          ))}
        </div>

        {/* Aviso de Não Oficialidade */}
        <p className="text-[10px] text-slate-500 text-center pt-2 border-t border-white/5">
          Projeto não oficial desenvolvido por fãs. Sem vínculo com a Bandai Co., Ltd.
        </p>
      </div>
    </div>
  );
};
