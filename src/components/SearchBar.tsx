import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Card } from '../types';
import { Search, X, ChevronRight } from 'lucide-react';
import { formatCardType } from '../utils/formatters';
import { searchCards } from '../utils/cardSearch';

interface SearchBarProps {
  cards: Card[];
  onSelectCard: (card: Card) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ cards, onSelectCard }) => {
  const [query, setQuery] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const trimmedQuery = query.trim();

  // Motor de busca de alta precisão e performance
  const filteredCards = useMemo(() => {
    if (trimmedQuery.length < 2) return [];
    return searchCards(cards, { query: trimmedQuery, limit: 30 });
  }, [cards, trimmedQuery]);

  // Fechar dropdown ao clicar fora ou pressionar Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const getBadgeClass = (type: string) => {
    switch (type) {
      case 'LEADER': return 'badge-leader';
      case 'CHARACTER': return 'badge-character';
      case 'EVENT': return 'badge-event';
      case 'STAGE': return 'badge-stage';
      default: return 'pill-badge-slate';
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-full z-30 px-6 sm:px-10 pt-4 pb-3 shrink-0">
      {/* Campo de Busca Principal - Layout Clean Náutico */}
      <div className="w-full h-14 sm:h-16 px-4 bg-[#0e1320]/95 border border-white/10 hover:border-sky-500/60 focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-500/20 rounded-2xl flex items-center gap-3 shadow-xl backdrop-blur-2xl transition-all">
        {/* 1. Lupa (Elemento Flex Nativo à Esquerda) */}
        <Search className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 shrink-0 select-none drop-shadow-sm" />

        {/* 2. Campo de Texto (Inicia estritamente DEPOIS da lupa) */}
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Buscar carta por código (ex: OP01-025) ou nome..."
          className="flex-1 min-w-0 h-full bg-transparent border-none outline-none text-sm sm:text-base font-bold text-white placeholder-slate-400 focus:outline-none focus:ring-0 p-0"
        />

        {/* 3. Botão Limpar (À Direita) */}
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center shrink-0 transition-all active:scale-95 shadow-md"
            title="Limpar busca"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown Flutuante de Resultados da Busca */}
      {isOpen && trimmedQuery.length > 0 && (
        <div className="absolute left-6 right-6 sm:left-10 sm:right-10 mt-2 max-h-72 bg-[#0c1018]/98 border border-white/10 rounded-2xl shadow-2xl overflow-y-auto z-50 p-2 space-y-1.5 backdrop-blur-2xl animate-fadeIn">
          {trimmedQuery.length === 1 ? (
            <div className="p-4 text-center text-xs font-semibold text-slate-400">
              Digite pelo menos 2 caracteres para buscar (ex: OP01, Luffy, Zoro)...
            </div>
          ) : filteredCards.length > 0 ? (
            filteredCards.map((card) => (
              <button
                key={card.id}
                onClick={() => {
                  onSelectCard(card);
                  setIsOpen(false);
                  setQuery('');
                }}
                className="w-full p-3 rounded-xl bg-white/[0.02] hover:bg-sky-950/20 border border-white/5 hover:border-sky-500/40 flex items-center justify-between text-left transition-all active:scale-98 group"
              >
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="pill-badge pill-badge-sky font-mono">
                      {card.code}
                    </span>
                    <span className={`pill-badge ${getBadgeClass(card.cardType)}`}>
                      {formatCardType(card.cardType)}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors font-heading">
                    {card.namePt}
                  </h4>
                </div>

                <div className="flex items-center gap-2">
                  {card.power !== null && (
                    <span className="pill-badge pill-badge-slate">
                      {card.power}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                </div>
              </button>
            ))
          ) : (
            <div className="p-4 text-center text-xs font-bold text-slate-400">
              Nenhuma carta encontrada com "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};
