import React from 'react';
import { Card, KeywordRule } from '../types';
import { Zap, Sparkles, ArrowLeft, BookOpen } from 'lucide-react';
import { formatCardType, formatAttribute } from '../utils/formatters';
import { ColorWheelHexagon } from './ColorWheelHexagon';

interface CardDetailProps {
  card: Card;
  keywords: KeywordRule[];
  onSelectKeyword: (keywordId: string) => void;
  onBackToScan: () => void;
  onOpenGlossary: () => void;
}

export const CardDetail: React.FC<CardDetailProps> = ({
  card,
  keywords,
  onSelectKeyword,
  onBackToScan,
  onOpenGlossary
}) => {
  // Parser de Texto de Efeito: Converte tags [Tag] em pílulas interativas clicáveis
  const renderFormattedEffectText = (text: string) => {
    if (!text) return null;

    const tagRegex = /(\[[^\]]+\])/g;
    const parts = text.split(tagRegex);

    return parts.map((part, index) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        const matchedKeyword = keywords.find(
          (k) =>
            k.rawTagPt?.toLowerCase() === part.toLowerCase() ||
            k.rawTagEn?.toLowerCase() === part.toLowerCase() ||
            k.rawTag.toLowerCase() === part.toLowerCase() ||
            k.namePt.toLowerCase() === part.replace(/[\[\]]/g, '').toLowerCase() ||
            k.nameEn.toLowerCase() === part.replace(/[\[\]]/g, '').toLowerCase()
        );

        if (matchedKeyword) {
          return (
            <button
              key={index}
              onClick={() => onSelectKeyword(matchedKeyword.id)}
              className="keyword-tag inline-flex items-center font-heading"
            >
              <span>{matchedKeyword.rawTagPt || matchedKeyword.rawTag}</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-300 ml-1.5" />
            </button>
          );
        } else {
          return (
            <span
              key={index}
              className="pill-badge pill-badge-slate my-1 mx-1 font-bold shadow-sm align-middle"
            >
              {part}
            </span>
          );
        }
      }
      return <span key={index}>{part}</span>;
    });
  };

  // Mapeamento de Estilos de Cor das Cartas OPTCG
  const getColorStyle = (colors: string[]) => {
    if (colors.includes('RED')) {
      return {
        border: 'border-red-500/60',
        glow: 'shadow-[0_0_35px_rgba(239,68,68,0.25)]',
        bg: 'from-red-950/60 via-slate-900 to-slate-950',
        accent: 'text-red-400'
      };
    }
    if (colors.includes('GREEN')) {
      return {
        border: 'border-emerald-500/60',
        glow: 'shadow-[0_0_35px_rgba(16,185,129,0.25)]',
        bg: 'from-emerald-950/60 via-slate-900 to-slate-950',
        accent: 'text-emerald-400'
      };
    }
    if (colors.includes('BLUE')) {
      return {
        border: 'border-blue-500/60',
        glow: 'shadow-[0_0_35px_rgba(59,130,246,0.25)]',
        bg: 'from-blue-950/60 via-slate-900 to-slate-950',
        accent: 'text-blue-400'
      };
    }
    if (colors.includes('PURPLE')) {
      return {
        border: 'border-purple-500/60',
        glow: 'shadow-[0_0_35px_rgba(168,85,247,0.25)]',
        bg: 'from-purple-950/60 via-slate-900 to-slate-950',
        accent: 'text-purple-400'
      };
    }
    if (colors.includes('YELLOW')) {
      return {
        border: 'border-yellow-500/60',
        glow: 'shadow-[0_0_35px_rgba(234,179,8,0.25)]',
        bg: 'from-yellow-950/60 via-slate-900 to-slate-950',
        accent: 'text-yellow-400'
      };
    }
    return {
      border: 'border-slate-700/60',
      glow: 'shadow-[0_0_35px_rgba(148,163,184,0.15)]',
      bg: 'from-slate-900 via-slate-950 to-slate-950',
      accent: 'text-slate-300'
    };
  };

  // Regra OPTCG: apenas Leader pode ser multicolorido. Characters, Stages e Events possuem apenas UMA cor.
  const effectiveColors = card.cardType === 'LEADER' ? card.colors : [card.colors[0]];
  const colorStyle = getColorStyle(effectiveColors);

  return (
    <div className="w-full bg-slate-950 px-5 sm:px-8 py-5 pb-32 flex flex-col items-center animate-fadeIn">
      <div className="w-full max-w-lg flex flex-col gap-4">
        
        {/* Top Action Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToScan}
            className="h-11 px-4 rounded-lg bg-slate-900/90 border border-slate-700/80 hover:border-amber-400/60 text-slate-200 text-xs sm:text-sm font-bold active:scale-95 transition-all shadow-lg font-heading flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            Escanear Outra
          </button>

          <span className="h-10 px-3.5 rounded-lg bg-[#0e1320] border border-white/10 text-sky-300 text-xs font-mono font-bold tracking-widest uppercase shadow-md flex items-center justify-center">
            {card.code}
          </span>
        </div>

        {/* Ficha Principal da Carta - Anatomia One Piece Card Game */}
        <div className={`glass-card p-0 rounded-xl border-2 ${colorStyle.border} ${colorStyle.glow} bg-gradient-to-b ${colorStyle.bg} flex flex-col relative overflow-hidden shadow-2xl`}>
          
          {/* Fundo sutil com padrão de textura da carta */}
          <div className="absolute inset-0 bg-radial-gradient opacity-20 pointer-events-none" />

          {/* ========================================================================= */}
          {/* 1. CABEÇALHO / CANTO SUPERIOR (Custo à esquerda, Poder e Atributo à direita) */}
          {/* ========================================================================= */}
          <div className="p-4 sm:p-5 pb-3 flex items-start justify-between relative z-10">
            
            {/* Canto Superior Esquerdo: Selo Circular DON!! de Custo (apenas para Personagem/Evento/Palco; Vazio para Líderes) */}
            <div className="flex items-center gap-2">
              {card.cardType !== 'LEADER' && card.cost !== null ? (
                /* Selo Circular DON!! de Custo (apenas para Personagem/Evento/Palco) */
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-b from-slate-900 via-amber-950 to-slate-950 border-2 border-amber-400/90 shadow-lg shadow-amber-950/60 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest leading-none">Custo</span>
                  <span className="text-xl sm:text-2xl font-black text-amber-300 font-heading leading-tight">{card.cost}</span>
                </div>
              ) : (
                <div />
              )}
            </div>

            {/* Canto Superior Direito: Poder (5000) e Atributo (Apenas a palavra: Corte, Impacto...) */}
            <div className="flex items-center gap-3">
              {/* Power (5000): Numerais em caixa alta, sans-serif condensada, bold branca */}
              {card.power !== null && (
                <div className="flex flex-col items-end justify-center">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider leading-none">Poder</span>
                  <span className="text-3xl sm:text-4xl font-black text-white font-heading tracking-tight leading-none mt-0.5">
                    {card.power}
                  </span>
                </div>
              )}

              {/* Atributo em texto puro (sem ícone/kanji, apenas a palavra) */}
              {card.attribute && (
                <div className="h-10 px-3 bg-slate-900/90 border border-slate-700/80 rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-xs sm:text-sm font-black text-amber-400 uppercase tracking-wider">
                    {formatAttribute(card.attribute)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 2. TERÇO MÉDIO-INFERIOR (Caixa de Efeito) */}
          {/* ========================================================================= */}
          <div className="px-4 sm:px-6 py-2 flex flex-col items-center relative z-10 w-full">
            <div className="w-full bg-slate-950/85 backdrop-blur-md rounded-lg p-5 sm:p-6 border border-slate-700/60 shadow-2xl flex flex-col gap-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-2 font-heading">
                <Zap className="w-4 h-4 text-sky-400" /> Efeito Traduzido:
              </h4>
              <div className="text-base sm:text-lg leading-relaxed sm:leading-loose text-slate-100 font-medium whitespace-pre-line">
                {renderFormattedEffectText(card.effectPt)}
              </div>
            </div>

            {/* Caixa de Gatilho [Trigger] se houver */}
            {card.triggerPt && (
              <div className="w-full mt-3 bg-gradient-to-r from-amber-950/70 to-amber-900/50 rounded-lg p-4 sm:p-5 border border-amber-500/50 text-sm sm:text-base leading-relaxed text-amber-100 shadow-xl">
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-2 font-heading">
                  <Sparkles className="w-4 h-4 text-amber-400" /> Gatilho de Vida [Trigger]:
                </h4>
                <div className="whitespace-pre-line font-medium leading-relaxed">
                  {renderFormattedEffectText(card.triggerPt)}
                </div>
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* 3. RODAPÉ INFERIOR (Identidade do Líder / Carta - Barra Preta Sólida) */}
          {/* ========================================================================= */}
          <div className="mt-4 w-full bg-slate-950 border-t-2 border-slate-700/80 p-5 pt-4 pb-4 relative z-10 flex flex-col items-center">
            
            {/* Color Wheel Oficial (Canto Inferior Esquerdo da barra - Idêntico à carta física) */}
            <div className="absolute left-4 sm:left-6 bottom-3.5 sm:bottom-4 flex items-center">
              <ColorWheelHexagon colors={card.colors} size={44} />
            </div>

            {/* Vida (5 VIDA) ou Counter (Canto Inferior Direito da barra) */}
            <div className="absolute right-4 sm:right-6 bottom-4 flex flex-col items-center justify-center">
              {card.cardType === 'LEADER' ? (
                <div className="flex flex-col items-center bg-red-950/50 border border-red-500/40 px-3 py-1.5 rounded-xl shadow-md">
                  <div className="flex items-center gap-1">
                    <span className="text-red-400 text-xs sm:text-sm leading-none">❤️</span>
                    <span className="text-2xl sm:text-3xl font-black text-white font-heading leading-none">
                      {card.cost ?? (effectiveColors.length > 1 ? 4 : 5)}
                    </span>
                  </div>
                  <span className="text-[9px] font-black text-red-300 uppercase tracking-widest leading-none mt-0.5">
                    VIDA
                  </span>
                </div>
              ) : card.counter !== null ? (
                <div className="flex flex-col items-center">
                  <span className="text-base sm:text-lg font-black text-emerald-400 font-heading leading-none">
                    +{card.counter}
                  </span>
                  <span className="text-[9px] font-black text-emerald-500 uppercase tracking-wider leading-none mt-1">
                    COUNTER
                  </span>
                </div>
              ) : null}
            </div>

            {/* Centro da Barra: 1. Categoria (LEADER), 2. Nome, 3. Traço/Família (Pílula sem a palavra trait) */}
            <div className="w-full max-w-[68%] sm:max-w-[72%] flex flex-col items-center text-center">
              {/* Rótulo de Categoria (LEADER) com kerning bem aberto */}
              <span className="text-[11px] sm:text-xs font-black text-slate-400 tracking-[0.3em] uppercase font-heading">
                {formatCardType(card.cardType)}
              </span>

              {/* Nome do Líder / Carta (Title Case, destaque branco) */}
              <h2 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight leading-tight mt-0.5">
                {card.namePt}
              </h2>

              {/* Traço / Família / Arquétipo: Acomodado em pílula horizontal escura SEM a palavra trait */}
              <div className="mt-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700/80 text-slate-200 text-xs font-medium max-w-full truncate shadow-inner">
                {card.subtypes.join(' / ')}
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 4. LINHA DE METADADOS / RODAPÉ EXTERNO */}
          {/* ========================================================================= */}
          <div className="w-full bg-slate-950 px-4 sm:px-6 py-2.5 border-t border-slate-900 flex items-center justify-between text-xs text-slate-400 font-semibold relative z-10">
            {/* Atalho Dicionário */}
            <button 
              onClick={onOpenGlossary}
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 font-bold text-xs active:scale-95 transition-all"
            >
              <BookOpen className="w-4 h-4" /> Dicionário de Regras
            </button>

            {/* Metadados: Código + Raridade (Caixa Branca com letra preta) */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-300">
                {card.code}
              </span>

              {/* Caixinha de Raridade L / SR */}
              <span className="w-5 h-5 rounded bg-white text-slate-950 font-black text-xs flex items-center justify-center font-heading shadow-sm">
                {card.cardType === 'LEADER' ? 'L' : card.power && card.power >= 10000 ? 'SR' : 'R'}
              </span>
            </div>
          </div>
        </div>

        {/* Aviso Legal de Não Oficialidade */}
        <p className="text-[10px] text-slate-500 text-center px-4 leading-tight">
          One Piece Card Game é marca registrada da Bandai Co., Ltd. e Eiichiro Oda / Shueisha. Este é um aplicativo não oficial desenvolvido por fãs para auxílio e tradução comunitária.
        </p>
      </div>
    </div>
  );
};
