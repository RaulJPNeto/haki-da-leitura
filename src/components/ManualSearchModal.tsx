import React, { useState, useMemo, useEffect } from 'react';
import { Card } from '../types';
import { X, Search, ChevronRight, Filter } from 'lucide-react';
import { formatCardType } from '../utils/formatters';
import { searchCards } from '../utils/cardSearch';

interface ManualSearchModalProps {
  cards: Card[];
  onSelectCard: (card: Card) => void;
  onClose: () => void;
}

export const ManualSearchModal: React.FC<ManualSearchModalProps> = ({
  cards,
  onSelectCard,
  onClose
}) => {
  const [query, setQuery] = useState<string>('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('ALL');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const trimmedQuery = query.trim();

  // Motor de busca de alta precisão e performance
  const filteredCards = useMemo(() => {
    return searchCards(cards, {
      query: trimmedQuery,
      typeFilter: selectedTypeFilter,
      limit: 60
    });
  }, [cards, trimmedQuery, selectedTypeFilter]);

  const isPromoCard = (card: Card) => {
    return card.code.startsWith('P-');
  };

  const getBadgeClass = (card: Card) => {
    if (isPromoCard(card)) {
      return 'badge-promo';
    }
    switch (card.cardType) {
      case 'LEADER': return 'badge-leader';
      case 'CHARACTER': return 'badge-character';
      case 'EVENT': return 'badge-event';
      case 'STAGE': return 'badge-stage';
      default: return 'pill-badge-slate';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-lg h-[85vh] bg-[#0b0e14] border border-white/10 rounded-2xl p-5 sm:p-6 flex flex-col gap-4 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30">
              <Search className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-heading">Busca Manual de Cartas</h3>
              <p className="text-[11px] text-slate-400 font-medium">Filtre por código, nome ou tipo</p>
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

        {/* Input Search Bar */}
        <div className="w-full py-3 px-4 bg-[#101420] border border-white/10 rounded-xl flex items-center gap-3 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-500/20 shadow-inner">
          <Search className="w-5 h-5 text-sky-400 shrink-0 select-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Digite código (ex: OP01-025) ou nome..."
            autoFocus
            className="flex-1 min-w-0 bg-transparent border-none outline-none text-sm font-semibold text-white placeholder-slate-500 focus:outline-none focus:ring-0 p-0"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs font-bold text-slate-300 hover:text-white bg-white/10 px-3 py-1.5 rounded-lg shrink-0"
            >
              Limpar
            </button>
          )}
        </div>

        {/* Filtros por Tipo de Carta */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Tipo:
          </span>
          {[
            { id: 'ALL', label: 'Todos' },
            { id: 'LEADER', label: 'Líder' },
            { id: 'CHARACTER', label: 'Personagem' },
            { id: 'EVENT', label: 'Evento' },
            { id: 'STAGE', label: 'Palco' },
            { id: 'PROMO', label: 'Promo' }
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedTypeFilter(type.id)}
              className={`pill-tab ${
                selectedTypeFilter === type.id ? 'pill-tab-active' : 'pill-tab-inactive'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Lista Resultante */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 no-scrollbar">
          {trimmedQuery.length === 1 ? (
            <div className="text-center py-12 text-slate-400 text-xs font-semibold">
              Digite pelo menos 2 caracteres (ex: OP01, Luffy, Zoro) para filtrar...
            </div>
          ) : filteredCards.length > 0 ? (
            filteredCards.map((card) => (
              <button
                key={card.id}
                onClick={() => {
                  onSelectCard(card);
                  onClose();
                }}
                className="w-full p-3.5 rounded-2xl bg-white/[0.02] hover:bg-sky-950/20 border border-white/5 hover:border-sky-500/40 flex items-center justify-between text-left transition-all active:scale-98 group shadow-sm"
              >
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="pill-badge pill-badge-sky font-mono">
                      {card.code}
                    </span>
                    <span className={`pill-badge ${getBadgeClass(card)}`}>
                      {formatCardType(card.cardType)}
                    </span>
                    {isPromoCard(card) && (
                      <span className="pill-badge badge-promo">
                        Promo
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors font-heading">
                    {card.namePt}
                  </h4>
                </div>

                <div className="flex items-center gap-3">
                  {card.power !== null && (
                    <span className="text-xs font-bold text-slate-300 bg-slate-900 border border-white/10 px-2.5 py-1 rounded-lg">
                      {card.power} PWR
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                </div>
              </button>
            ))
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs font-semibold">
              Nenhuma carta encontrada{trimmedQuery ? ` com "${trimmedQuery}"` : ''}.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
