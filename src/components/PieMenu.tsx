import React, { useState } from 'react';
import { BookOpen, Layers, Volume2, VolumeX, RefreshCw, X, Compass } from 'lucide-react';

interface PieMenuProps {
  onOpenGlossary: () => void;
  onOpenCardList: () => void;
  onResetCamera: () => void;
  hapticEnabled: boolean;
  onToggleHaptic: () => void;
}

export const PieMenu: React.FC<PieMenuProps> = ({
  onOpenGlossary,
  onOpenCardList,
  onResetCamera,
  hapticEnabled,
  onToggleHaptic
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleAction = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Botão de Disparo no Header (Ícone Compasso Náutico / Log Pose) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 shadow-md border active:scale-95 focus:outline-none ${
          isOpen
            ? 'bg-amber-500 border-amber-300 text-slate-950 rotate-90 shadow-amber-500/30'
            : 'bg-[#121622] hover:bg-[#181d2e] border-white/10 hover:border-amber-500/50 text-amber-400 shadow-black/40'
        }`}
        title="Menu Rápido Náutico"
        aria-label="Abrir Menu Rápido"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Compass className="w-5 h-5" />}
      </button>

      {/* Overlay do Menu em Pizza (Radial Dial Overlay) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl animate-fadeIn">
          {/* Backdrop click para fechar */}
          <div className="absolute inset-0" onClick={() => setIsOpen(false)} />

          {/* Disco / Roda de Pizza Central */}
          <div className="relative w-80 h-80 rounded-full bg-[#0c1018]/95 border border-sky-500/30 shadow-[0_0_50px_rgba(2,132,199,0.2)] flex items-center justify-center p-2 z-10 animate-scaleUp">
            
            {/* Linhas Divisórias Náuticas Sutis */}
            <div className="absolute inset-0 rounded-full border border-white/10 pointer-events-none" />
            <div className="absolute w-full h-[1px] bg-white/10 pointer-events-none" />
            <div className="absolute h-full w-[1px] bg-white/10 pointer-events-none" />

            {/* Fatia Superior: 📖 Dicionário de Regras */}
            <button
              onClick={() => handleAction(onOpenGlossary)}
              className="absolute top-4 flex flex-col items-center gap-1 group active:scale-90 transition-transform focus:outline-none"
            >
              <div className="w-12 h-12 p-2.5 rounded-xl bg-gradient-to-b from-sky-600 to-sky-900 text-white shadow-md shadow-sky-900/40 border border-sky-400/50 group-hover:scale-110 transition-transform flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-sky-300 uppercase tracking-wider font-heading">
                Regras
              </span>
            </button>

            {/* Fatia Direita: 🃏 Banco de Cartas */}
            <button
              onClick={() => handleAction(onOpenCardList)}
              className="absolute right-4 flex flex-col items-center gap-1 group active:scale-90 transition-transform focus:outline-none"
            >
              <div className="w-12 h-12 p-2.5 rounded-xl bg-gradient-to-b from-amber-500 to-amber-700 text-slate-950 shadow-md shadow-amber-900/40 border border-amber-300/50 group-hover:scale-110 transition-transform flex items-center justify-center">
                <Layers className="w-5 h-5 font-bold" />
              </div>
              <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider font-heading">
                Cartas
              </span>
            </button>

            {/* Fatia Inferior: 📳 Feedback Tátil (Haptic) */}
            <button
              onClick={() => {
                onToggleHaptic();
              }}
              className="absolute bottom-4 flex flex-col items-center gap-1 group active:scale-90 transition-transform focus:outline-none"
            >
              <div
                className={`w-12 h-12 p-2.5 rounded-xl border transition-all duration-200 shadow-md group-hover:scale-110 flex items-center justify-center ${
                  hapticEnabled
                    ? 'bg-gradient-to-b from-emerald-600 to-emerald-900 text-white border-emerald-400/60 shadow-emerald-900/40'
                    : 'bg-slate-800/80 text-slate-400 border-white/10'
                }`}
              >
                {hapticEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </div>
              <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider font-heading">
                {hapticEnabled ? 'Vibração: ON' : 'Vibração: OFF'}
              </span>
            </button>

            {/* Fatia Esquerda: 🔄 Resetar / Recarregar Scanner */}
            <button
              onClick={() => handleAction(onResetCamera)}
              className="absolute left-4 flex flex-col items-center gap-1 group active:scale-90 transition-transform focus:outline-none"
            >
              <div className="w-12 h-12 p-2.5 rounded-xl bg-gradient-to-b from-slate-700 to-slate-900 text-slate-200 shadow-md border border-white/15 group-hover:scale-110 transition-transform flex items-center justify-center">
                <RefreshCw className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider font-heading">
                Reset Cam
              </span>
            </button>

            {/* Núcleo Central do Menu (Botão Fechar) */}
            <button
              onClick={() => setIsOpen(false)}
              className="w-14 h-14 rounded-full bg-[#0a0d14] border border-amber-400/80 text-amber-300 flex items-center justify-center shadow-2xl active:scale-95 transition-all z-20 group"
            >
              <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
            </button>
          </div>

          {/* Dica no Rodapé */}
          <div className="absolute bottom-10 px-4 py-2 rounded-full bg-slate-900/90 border border-white/10 text-xs font-semibold text-slate-300 shadow-lg">
            Toque em uma das opções para acessar
          </div>
        </div>
      )}
    </div>
  );
};
