import React, { useEffect } from 'react';
import { Card, CardColor } from '../types';
import { Camera, Shield, Sparkles, Layers, Award, ArrowRight, X, Check } from 'lucide-react';
import { ColorWheelHexagon } from './ColorWheelHexagon';
import { formatCardType, formatAttribute, formatColor } from '../utils/formatters';

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
  const handleSelect = (card: Card) => {
    if (navigator.vibrate) navigator.vibrate(30);
    onSelectCard(card);
  };

  const handleClose = () => {
    if (navigator.vibrate) navigator.vibrate(15);
    onClose();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!candidates || candidates.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center items-center bg-black/85 backdrop-blur-md p-0 sm:p-4 overflow-hidden animate-fadeIn">
      {/* Container Principal Mobile-First com Estilo Bottom-Sheet no Mobile */}
      <div className="w-full max-w-lg max-h-[92dvh] flex flex-col bg-[#0b0e14] border-t sm:border border-white/10 rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden animate-slide-up sm:animate-scale-up">
        
        {/* Alça de Arraste Visual para Mobile */}
        <div className="pt-2 pb-1 flex justify-center sm:hidden bg-gradient-to-r from-sky-950/40 via-black to-slate-900/40">
          <div className="w-12 h-1.5 rounded-full bg-slate-700/80" />
        </div>

        {/* Top Header */}
        <div className="p-4 border-b border-white/10 bg-gradient-to-r from-sky-950/40 via-black to-slate-900/40 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide font-heading">
                Desempate Visual
              </h2>
              <span className="pill-badge pill-badge-sky font-mono font-bold">
                {candidates.length} candidatas
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 leading-tight">
              A câmera pausou para escolha segura. Toque na versão correspondente da sua carta:
            </p>
          </div>

          <button
            onClick={handleClose}
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-all active:scale-95 shrink-0 ml-2"
            title="Voltar ao Scanner"
            aria-label="Fechar desempate"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Resumo de Sinais Detectados no Frame pelo OCR */}
        {signals && (signals.power || signals.cost || signals.set || signals.color || signals.colors || (signals.counter !== null && signals.counter !== undefined)) && (
          <div className="px-4 py-2 bg-sky-950/30 border-b border-white/5 flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-medium text-[11px] mr-1">Sinais no visor:</span>
            {(signals.colors?.length || signals.color) && (
              <div className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-lg border border-white/10">
                <ColorWheelHexagon colors={signals.colors || [signals.color as CardColor]} size={16} />
                <span className="text-[10px] font-bold text-slate-300">
                  {signals.colors?.map(formatColor).join('/') || (signals.color ? formatColor(signals.color) : '')}
                </span>
              </div>
            )}
            {signals.set && (
              <span className="pill-badge pill-badge-sky font-mono font-bold">
                {signals.set}
              </span>
            )}
            {signals.power && (
              <span className="pill-badge pill-badge-amber font-bold">
                ⚡ {signals.power}
              </span>
            )}
            {signals.cost && (
              <span className="pill-badge pill-badge-slate font-bold">
                {signals.cardType === 'LEADER' ? `❤️ ${signals.cost} Vidas` : `⭐ Custo ${signals.cost}`}
              </span>
            )}
            {signals.counter !== null && signals.counter !== undefined && (
              <span className="pill-badge pill-badge-blue font-bold">
                🛡️ +{signals.counter}
              </span>
            )}
          </div>
        )}

        {/* Lista Rolável de Cards Candidatos com Comparação de Atributos */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {candidates.map((card) => {
            const hasCounter = card.counter !== null && card.counter > 0;

            // Comparação direta de sinais para guiar a escolha do usuário
            const powerMatches = Boolean(signals?.power && card.power === signals.power);
            const costMatches = Boolean(signals?.cost && card.cost === signals.cost);
            const counterMatches = Boolean(signals?.counter !== null && signals?.counter !== undefined && card.counter === signals.counter);
            const setMatches = Boolean(signals?.set && (card.setId === signals.set || card.code.startsWith(signals.set)));

            return (
              <div
                key={card.id || card.code}
                onClick={() => handleSelect(card)}
                className="group cursor-pointer rounded-2xl bg-white/[0.03] hover:bg-sky-950/30 border border-white/10 hover:border-sky-500/50 p-3 sm:p-3.5 transition-all duration-200 active:scale-[0.98] shadow-md flex gap-3.5 items-start"
              >
                {/* Imagem da Carta com Fallback */}
                <div className="w-16 h-22 sm:w-18 sm:h-24 flex-shrink-0 rounded-xl overflow-hidden border border-white/10 bg-black/60 relative shadow-inner">
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
                    <div className="w-full h-full flex flex-col items-center justify-center text-[10px] text-slate-400 font-mono text-center p-1">
                      <Layers className="w-4 h-4 mb-1 text-slate-500" />
                      {card.code}
                    </div>
                  )}
                </div>

                {/* Informações Comparativas do Card */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <div className="flex items-center gap-1.5">
                      <ColorWheelHexagon colors={card.colors} size={20} />
                      <span className={`font-mono text-xs font-bold ${setMatches ? 'text-emerald-400' : 'text-sky-400'}`}>
                        {card.code}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {card.cardType && (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300">
                          {formatCardType(card.cardType)}
                        </span>
                      )}
                      <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-400">
                        {card.setId || card.setName}
                      </span>
                    </div>
                  </div>

                  {/* Nomes da Carta */}
                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-amber-300 transition-colors truncate font-heading">
                    {card.namePt || card.nameEn}
                  </h3>
                  {card.namePt && card.namePt !== card.nameEn && (
                    <p className="text-[11px] text-slate-400 truncate">
                      {card.nameEn}
                    </p>
                  )}

                  {/* Subtipos da Carta */}
                  {card.subtypes && card.subtypes.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {card.subtypes.map((trait) => (
                        <span key={trait} className="text-[10px] text-sky-300/90 font-medium italic">
                          {`{${trait}}`}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Atributos Críticos de Desempate (Poder, Custo, Counter, Atributo) */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    {/* Cores */}
                    {card.colors?.map((col) => (
                      <span
                        key={col}
                        className={`pill-badge border ${
                          colorBadgeStyle[col] || 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        {formatColor(col)}
                      </span>
                    ))}

                    {/* Custo / Vidas com Destaque de Match */}
                    {card.cost !== null && (
                      <span className={`pill-badge ${
                        costMatches
                          ? 'border-2 border-emerald-400 bg-emerald-950/70 text-emerald-200 font-bold shadow-[0_0_8px_rgba(52,211,153,0.5)]'
                          : 'pill-badge-slate'
                      }`}>
                        {costMatches && <Check className="w-3 h-3 text-emerald-400 mr-0.5 inline" />}
                        {card.cardType === 'LEADER' ? `❤️ ${card.cost} Vidas` : `⭐ Custo ${card.cost}`}
                      </span>
                    )}

                    {/* Poder com Destaque de Match */}
                    {card.power !== null && (
                      <span className={`pill-badge ${
                        powerMatches
                          ? 'border-2 border-amber-400 bg-amber-950/70 text-amber-200 font-bold shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                          : 'pill-badge-amber'
                      }`}>
                        {powerMatches && <Check className="w-3 h-3 text-amber-400 mr-0.5 inline" />}
                        ⚡ {card.power}
                      </span>
                    )}

                    {/* Counter com Destaque de Match */}
                    {hasCounter ? (
                      <span className={`pill-badge ${
                        counterMatches
                          ? 'border-2 border-cyan-400 bg-cyan-950/70 text-cyan-200 font-bold shadow-[0_0_8px_rgba(6,182,212,0.5)]'
                          : 'pill-badge-blue'
                      }`}>
                        <Shield className="w-3 h-3 text-blue-300" />
                        +{card.counter}
                      </span>
                    ) : (
                      <span className="pill-badge pill-badge-slate text-slate-500">
                        Sem Counter
                      </span>
                    )}

                    {/* Atributo de Batalha */}
                    {card.attribute && (
                      <span className="pill-badge pill-badge-slate">
                        <Award className="w-3 h-3 text-amber-400" />
                        {formatAttribute(card.attribute)}
                      </span>
                    )}
                  </div>

                  {/* Resumo do Efeito */}
                  {card.effectPt && (
                    <p className="text-[11px] text-slate-300 line-clamp-2 mt-2 leading-relaxed bg-black/40 p-2 rounded-xl border border-white/5">
                      {card.effectPt}
                    </p>
                  )}
                </div>

                {/* Seta de Seleção Ergonômica */}
                <div className="self-center flex-shrink-0 w-8 h-8 rounded-full bg-white/5 group-hover:bg-amber-400 group-hover:text-slate-950 text-slate-400 flex items-center justify-center transition-all">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Rodapé de Ações com Botão Encorpado e Ergonômico para o Polegar */}
        <div className="p-3.5 sm:p-4 pb-6 sm:pb-4 bg-[#080b12] border-t border-white/10 shrink-0">
          <button
            onClick={handleClose}
            className="w-full h-13 sm:h-14 px-5 rounded-2xl bg-gradient-to-r from-slate-800 via-slate-850 to-slate-800 hover:from-slate-750 hover:to-slate-750 active:from-sky-950 active:to-sky-900 border border-white/15 hover:border-sky-500/40 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl shadow-black/60 active:scale-[0.98] transition-all cursor-pointer"
          >
            <Camera className="w-5 h-5 text-sky-400 shrink-0" />
            <span>Continuar Escaneando</span>
          </button>
        </div>
      </div>
    </div>
  );
};
