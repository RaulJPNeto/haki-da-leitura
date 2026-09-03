import React from 'react';
import { Card, CardColor } from '../types';
import { Camera, Shield, Sparkles, Layers, Award, ArrowRight } from 'lucide-react';
import { ColorWheelHexagon } from './ColorWheelHexagon';

interface CandidateModalProps {
  candidates: Card[];
  signals?: {
    code?: string | null;
    set?: string | null;
    cardType?: string | null;
    power?: number | null;
    cost?: number | null;
    counter?: number | null;
    color?: string | null;
    colors?: CardColor[] | null;
  };
  onSelectCard: (card: Card) => void;
  onClose: () => void;
}

const colorBadgeStyle: Record<string, string> = {
  RED: 'bg-red-950/80 text-red-300 border-red-500/40',
  GREEN: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40',
  BLUE: 'bg-blue-950/80 text-blue-300 border-blue-500/40',
  PURPLE: 'bg-purple-950/80 text-purple-300 border-purple-500/40',
  BLACK: 'bg-slate-900 text-slate-300 border-slate-600/40',
  YELLOW: 'bg-amber-950/80 text-amber-300 border-amber-500/40',
  MULTI: 'bg-gradient-to-r from-red-900/80 to-blue-900/80 text-white border-white/30'
};

export const CandidateModal: React.FC<CandidateModalProps> = ({
  candidates,
  signals,
  onSelectCard,
  onClose
}) => {
  if (!candidates || candidates.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center items-center bg-black/85 backdrop-blur-md p-2 sm:p-4 overflow-hidden animate-fadeIn">
      {/* Container Principal Mobile-First */}
      <div className="w-full max-w-lg max-h-[90vh] flex flex-col bg-[#0b0e14] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="p-4 border-b border-white/10 bg-gradient-to-r from-sky-950/40 via-black to-slate-900/40 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide font-heading">
                Cartas Compatíveis
              </h2>
              <span className="pill-badge pill-badge-sky font-mono">
                {candidates.length} encontradas
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Pausamos o scanner. Toque na sua carta para ver a tradução e regras:
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
            title="Voltar ao Scanner"
          >
            <Camera className="w-5 h-5 text-sky-400" />
          </button>
        </div>

        {/* Resumo de Sinais Detectados (se houver) */}
        {signals && (signals.power || signals.cost || signals.set || signals.color || signals.colors || (signals.counter !== null && signals.counter !== undefined)) && (
          <div className="px-4 py-2.5 bg-sky-950/20 border-b border-white/5 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium mr-1">Detectado no frame:</span>
            {(signals.colors?.length || signals.color) && (
              <div className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-lg border border-white/10">
                <ColorWheelHexagon colors={signals.colors || [signals.color as CardColor]} size={20} />
                <span className="text-[10px] font-bold text-slate-300">
                  {signals.colors?.join('/') || signals.color}
                </span>
              </div>
            )}
            {signals.set && (
              <span className="pill-badge pill-badge-sky font-mono">
                {signals.set}
              </span>
            )}
            {signals.power && (
              <span className="pill-badge pill-badge-amber">
                ⚡ {signals.power}
              </span>
            )}
            {signals.cost && (
              <span className="pill-badge pill-badge-slate">
                {signals.cardType === 'LEADER' ? `❤️ ${signals.cost} Vidas` : `⭐ Custo ${signals.cost}`}
              </span>
            )}
            {signals.counter !== null && signals.counter !== undefined && (
              <span className="pill-badge pill-badge-blue">
                🛡️ +{signals.counter}
              </span>
            )}
          </div>
        )}

        {/* Lista Rolável de Cards Candidatos */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5 divide-y divide-white/5">
          {candidates.map((card) => {
            const hasCounter = card.counter !== null && card.counter > 0;

            return (
              <div
                key={card.id || card.code}
                onClick={() => onSelectCard(card)}
                className="pt-2.5 first:pt-0 group cursor-pointer"
              >
                <div className="p-3 rounded-xl bg-white/[0.02] hover:bg-sky-950/20 border border-white/8 hover:border-sky-500/40 transition-all duration-200 flex gap-3.5 items-start">
                  {/* Imagem da Carta com Fallback */}
                  <div className="w-16 h-22 flex-shrink-0 rounded-lg overflow-hidden border border-white/10 bg-black/60 relative">
                    {card.imageUrl ? (
                      <img
                        src={card.imageUrl}
                        alt={card.namePt || card.nameEn}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-[10px] text-slate-500 font-mono text-center p-1">
                        <Layers className="w-4 h-4 mb-1 text-slate-600" />
                        {card.code}
                      </div>
                    )}
                  </div>

                  {/* Informações Comparativas do Card */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <div className="flex items-center gap-1.5">
                        <ColorWheelHexagon colors={card.colors} size={22} />
                        <span className="font-mono text-xs font-bold text-sky-400">
                          {card.code}
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-400">
                        {card.setId || card.setName}
                      </span>
                    </div>

                    {/* Nomes */}
                    <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                      {card.namePt || card.nameEn}
                    </h3>
                    {card.namePt && card.namePt !== card.nameEn && (
                      <p className="text-[11px] text-slate-400 truncate">
                        {card.nameEn}
                      </p>
                    )}

                    {/* Atributos Críticos de Desempate (Poder, Custo, Counter, Cor) */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      {/* Cor */}
                      {card.colors?.map((col) => (
                        <span
                          key={col}
                          className={`pill-badge border ${
                            colorBadgeStyle[col] || 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                        >
                          {col}
                        </span>
                      ))}

                      {/* Custo */}
                      {card.cost !== null && (
                        <span className="pill-badge pill-badge-slate">
                          {card.cardType === 'LEADER' ? `❤️ ${card.cost} Vidas` : `⭐ Custo ${card.cost}`}
                        </span>
                      )}

                      {/* Poder */}
                      {card.power !== null && (
                        <span className="pill-badge pill-badge-amber">
                          ⚡ {card.power}
                        </span>
                      )}

                      {/* Counter */}
                      {hasCounter ? (
                        <span className="pill-badge pill-badge-blue">
                          <Shield className="w-3.5 h-3.5 text-blue-300" />
                          +{card.counter}
                        </span>
                      ) : (
                        <span className="pill-badge pill-badge-slate text-slate-500">
                          Sem Counter
                        </span>
                      )}

                      {/* Atributo */}
                      {card.attribute && (
                        <span className="pill-badge pill-badge-slate">
                          <Award className="w-3.5 h-3.5 text-amber-400" />
                          {card.attribute}
                        </span>
                      )}
                    </div>

                    {/* Resumo do Efeito */}
                    {card.effectPt && (
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-2 leading-relaxed bg-black/30 p-1.5 rounded border border-white/5">
                        {card.effectPt}
                      </p>
                    )}
                  </div>

                  {/* Seta de Seleção */}
                  <div className="self-center flex-shrink-0 text-slate-600 group-hover:text-amber-400 transition-colors pl-1">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Rodapé de Ações */}
        <div className="p-3 bg-black/60 border-t border-white/10 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-white/10 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <Camera className="w-4 h-4 text-sky-400" />
            Voltar ao Scanner
          </button>
        </div>
      </div>
    </div>
  );
};
