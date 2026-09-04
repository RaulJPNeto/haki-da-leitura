import React, { useEffect } from 'react';
import { KeywordRule } from '../types';
import { X, Clock, HelpCircle, Sparkles, BookOpen, CheckCircle2 } from 'lucide-react';

interface KeywordDrawerProps {
  keyword: KeywordRule | null;
  onClose: () => void;
}

export const KeywordDrawer: React.FC<KeywordDrawerProps> = ({ keyword, onClose }) => {
  useEffect(() => {
    if (!keyword) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keyword, onClose]);

  if (!keyword) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/85 backdrop-blur-md transition-opacity duration-300 animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />

      {/* Painel Deslizante Bottom Sheet */}
      <div className="relative w-full max-w-lg max-h-[88vh] bg-[#0b0e14] border-t border-white/15 rounded-t-2xl p-6 sm:p-8 overflow-y-auto z-10 shadow-2xl flex flex-col gap-5 animate-slide-up">
        
        {/* Puxador da Gaveta */}
        <div className="w-12 h-1 bg-white/20 rounded mx-auto shrink-0 mb-1" />

        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white active:scale-95 transition-all shadow-md flex items-center justify-center"
          title="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cabeçalho da Palavra-Chave */}
        <div className="flex items-start gap-4 pr-10">
          <div className="p-3.5 rounded-xl bg-[#101522] border border-sky-500/30 shrink-0 shadow-lg shadow-black/40">
            <Sparkles className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded bg-sky-950/80 border border-sky-700/50 text-sky-300 text-[11px] font-mono font-bold uppercase tracking-wider">
                {keyword.rawTagEn || keyword.rawTag}
              </span>
              {keyword.namePt && keyword.namePt !== keyword.nameEn && (
                <span className="px-2 py-0.5 rounded bg-amber-950/80 border border-amber-700/50 text-amber-300 text-[10px] font-medium">
                  Tradução: {keyword.namePt}
                </span>
              )}
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1.5 font-heading leading-tight flex items-baseline gap-2.5 flex-wrap">
              <span>{keyword.nameEn || keyword.namePt}</span>
              {keyword.nameEn && keyword.namePt !== keyword.nameEn && (
                <span className="text-base sm:text-lg font-normal text-slate-400 font-sans">({keyword.namePt})</span>
              )}
            </h3>
          </div>
        </div>

        {/* Comparação com a Carta Original em Inglês */}
        <div className="p-4 sm:p-5 bg-[#0e1320] rounded-xl border border-white/10 text-sm shadow-md space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400 font-heading">
              Termo Oficial vs Tradução Didática:
            </span>
            <span className="px-2 py-0.5 rounded bg-sky-950 border border-sky-700/40 text-sky-300 text-[10px] font-bold">
              Oficial em Torneios
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <span className="text-slate-400 font-medium">Na carta física:</span>
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-white/15 text-slate-200 font-bold text-xs sm:text-sm tracking-wide font-mono">
              {keyword.rawTagEn || `[${keyword.nameEn}]`}
            </span>
            <span className="text-slate-400">➜</span>
            <span className="px-2.5 py-1 rounded bg-sky-950/80 border border-sky-500/50 text-sky-300 font-bold text-xs sm:text-sm tracking-wide font-heading">
              {keyword.namePt} {keyword.rawTagPt ? `(${keyword.rawTagPt})` : ''}
            </span>
          </div>
        </div>

        {/* Resumo Direto */}
        <div className="p-5 rounded-xl bg-amber-950/20 border border-amber-500/25 text-sm sm:text-base font-semibold text-amber-200 leading-relaxed shadow-sm">
          💡 {keyword.summaryPt}
        </div>

        {/* Janela de Ativação / Timing */}
        <div className="flex items-start gap-3.5 p-4 sm:p-5 rounded-xl bg-sky-950/25 border border-sky-800/30 text-sm shadow-md">
          <Clock className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-sky-300 block text-xs uppercase tracking-wider font-heading">
              Timing de Ativação (Quando ocorre?):
            </span>
            <span className="text-slate-200 font-medium leading-relaxed block">
              {keyword.activationTimingPt}
            </span>
          </div>
        </div>

        {/* Explicação Detalhada */}
        <div className="space-y-2">
          <h4 className="font-bold text-slate-200 text-sm sm:text-base flex items-center gap-2 font-heading">
            <BookOpen className="w-4 h-4 text-sky-400" /> Como funciona na prática:
          </h4>
          <div className="bg-[#0e1320] p-5 sm:p-6 rounded-xl border border-white/5 text-sm sm:text-base font-normal leading-relaxed text-slate-200 shadow-inner">
            {keyword.fullDescriptionPt}
          </div>
        </div>

        {/* Dúvidas Frequentes / FAQs de Juízes */}
        {keyword.faqs.length > 0 && (
          <div className="space-y-3 pt-2 border-t border-white/10">
            <h4 className="font-bold text-amber-400 text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 font-heading">
              <HelpCircle className="w-4 h-4 text-amber-400" /> Dúvidas Frequentes & Perguntas de Juízes:
            </h4>
            <div className="space-y-2.5">
              {keyword.faqs.map((faq, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#0e1320] border border-amber-500/20 shadow-md space-y-1.5">
                  <p className="font-bold text-amber-300 text-sm sm:text-base flex items-start gap-2 leading-snug">
                    <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-700/50 text-[10px] shrink-0 mt-0.5 font-mono">P</span>
                    <span>{faq.question}</span>
                  </p>
                  <p className="text-slate-300 text-sm sm:text-base font-normal leading-relaxed pl-5 border-l-2 border-amber-500/40">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Botão Entendi */}
        <button
          onClick={onClose}
          className="w-full h-13 py-3.5 bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-500 hover:to-sky-600 text-white font-bold text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-sky-950/50 active:scale-98 transition-all font-heading mt-2 flex items-center justify-center gap-2 shrink-0"
        >
          <CheckCircle2 className="w-5 h-5" /> Entendi a Regra
        </button>
      </div>
    </div>
  );
};
