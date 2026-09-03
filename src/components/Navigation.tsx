import React, { useState } from 'react';
import { Search, BookOpen, WifiOff, Menu, X, Camera, Sparkles, Volume2, VolumeX, ChevronRight } from 'lucide-react';

interface NavigationProps {
  onOpenSearch: () => void;
  onOpenGlossary: () => void;
  onResetScan: () => void;
  currentView: 'scanner' | 'card' | 'search' | 'glossary';
  hapticEnabled: boolean;
  onToggleHaptic: () => void;
  totalCardsCount: number;
  totalKeywordsCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  onOpenSearch,
  onOpenGlossary,
  onResetScan,
  currentView,
  hapticEnabled,
  onToggleHaptic,
  totalCardsCount,
  totalKeywordsCount
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const handleNavAction = (action: () => void) => {
    action();
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Navbar Principal Expandida (Altura: 80px) */}
      <header className="fixed top-0 left-0 right-0 z-40 h-20 px-4 sm:px-6 glass-panel rounded-none border-t-0 border-x-0 border-b border-white/10 backdrop-blur-2xl flex items-center justify-between shadow-xl">
        
        {/* Marca & Logo (Lado Esquerdo) */}
        <button
          onClick={() => handleNavAction(onResetScan)}
          className="flex items-center gap-3.5 bg-transparent border-0 text-left cursor-pointer group focus:outline-none"
        >
          <div className="relative w-12 h-12 rounded-2xl overflow-hidden shadow-lg shadow-sky-950/60 p-[1.5px] bg-gradient-to-tr from-amber-400 via-sky-500 to-sky-600 shrink-0 group-active:scale-95 transition-transform duration-200">
            <img src="/favicon.svg" alt="Haki da Leitura" className="w-full h-full object-cover rounded-[14px]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white leading-none font-heading">
                Haki da Leitura
              </h1>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">
              Scanner & Guia de Regras OPTCG
            </p>
          </div>
        </button>

        {/* Lado Direito: Ações Rápidas em Telas Grandes + Botão de Menu Hamburguer em Celulares */}
        <div className="flex items-center gap-2.5">
          {/* Botões Rápidos Visíveis em Telas Maiores */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={onOpenSearch}
              className="px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-200 text-xs font-black flex items-center gap-2 shadow-md active:scale-95 transition-all font-heading"
            >
              <Search className="w-4 h-4 text-amber-400" />
              <span>Busca Manual</span>
            </button>

            <button
              onClick={onOpenGlossary}
              className="px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-200 text-xs font-black flex items-center gap-2 shadow-md active:scale-95 transition-all font-heading"
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Dicionário de Regras</span>
            </button>
          </div>

          {/* Badge 100% Offline */}
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[11px] font-black uppercase tracking-wider shadow-sm">
            <WifiOff className="w-3.5 h-3.5" /> 100% Offline
          </div>

          {/* Botão de Menu Hambúrguer (Destacado e Fácil de Tocar no Celular - 48px x 48px) */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-900/90 to-slate-900 border-2 border-purple-500/50 text-amber-300 flex items-center justify-center shadow-lg active:scale-95 transition-all focus:outline-none"
            aria-label="Abrir Menu Principal"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Menu Gaveta Full-Screen Mobile (Drawer Overlay) */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/95 backdrop-blur-2xl animate-fadeIn overflow-y-auto pt-24 px-6 pb-8">
          
          {/* Header do Menu */}
          <div className="flex items-center justify-between pb-4 border-b border-purple-500/30 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl overflow-hidden border border-sky-400/40 shadow-md shrink-0">
                <img src="/favicon.svg" alt="Haki da Leitura" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white font-heading">Menu de Navegação</h3>
                <p className="text-xs text-slate-400 font-semibold">Selecione uma ferramenta ou consulta</p>
              </div>
            </div>

            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Opções Principais de Navegação (Grandes para Toque Fácil com Polegar) */}
          <div className="flex flex-col gap-3.5 mb-8">
            
            {/* Opção 1: Escanear com a Câmera */}
            <button
              onClick={() => handleNavAction(onResetScan)}
              className={`w-full p-4 rounded-2xl border flex items-center justify-between text-left transition-all active:scale-98 shadow-xl ${
                currentView === 'scanner'
                  ? 'bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 border-amber-400/80 text-white shadow-purple-900/50'
                  : 'bg-slate-900/90 border-slate-800 text-slate-200 hover:border-purple-500/40'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-xl bg-purple-950 border border-purple-700/60 text-amber-400">
                  <Camera className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-black font-heading">Visor de Câmera (Scanner)</h4>
                  <p className="text-xs text-slate-400">Apontar câmera para ler o código da carta</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-amber-400" />
            </button>

            {/* Opção 2: Busca Manual de Cartas */}
            <button
              onClick={() => handleNavAction(onOpenSearch)}
              className="w-full p-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-500/50 flex items-center justify-between text-left transition-all active:scale-98 shadow-lg group"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-xl bg-amber-950 border border-amber-600/50 text-amber-400">
                  <Search className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-black text-white group-hover:text-amber-300 font-heading">
                      Busca Manual de Cartas
                    </h4>
                    <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-700/50 text-[10px] font-black">
                      {totalCardsCount} cartas
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Pesquisar por código (OP01-025) ou nome</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
            </button>

            {/* Opção 3: Dicionário de Regras */}
            <button
              onClick={() => handleNavAction(onOpenGlossary)}
              className="w-full p-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/50 flex items-center justify-between text-left transition-all active:scale-98 shadow-lg group"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-xl bg-cyan-950 border border-cyan-600/50 text-cyan-400">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-black text-white group-hover:text-cyan-300 font-heading">
                      Dicionário de Regras & Keywords
                    </h4>
                    <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-700/50 text-[10px] font-black">
                      {totalKeywordsCount} verbetes
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Explicações de Blocker, Rush, Timings e FAQs</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
            </button>
          </div>

          {/* Configurações & Preferências */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3 mb-6">
            <h5 className="text-xs font-black uppercase tracking-wider text-slate-400 font-heading">
              Preferências do Dispositivo
            </h5>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2.5">
                {hapticEnabled ? (
                  <Volume2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <VolumeX className="w-5 h-5 text-slate-500" />
                )}
                <div>
                  <span className="text-sm font-bold text-slate-200 block">Feedback de Vibração (Haptic)</span>
                  <span className="text-[11px] text-slate-400">Vibrar celular ao detectar código da carta</span>
                </div>
              </div>

              <button
                onClick={onToggleHaptic}
                className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center ${
                  hapticEnabled ? 'bg-emerald-500 justify-end' : 'bg-slate-700 justify-start'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-white shadow-md" />
              </button>
            </div>
          </div>

          {/* Card Informativo Rodapé */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 to-slate-900 border border-purple-500/30 text-xs text-slate-300 leading-relaxed shadow-lg">
            <span className="font-extrabold text-amber-400 block mb-1">💡 Dica de Torneio:</span>
            O Haki da Leitura armazena todas as cartas e regras no armazenamento do seu dispositivo. Você pode usar normalmente em ambientes sem internet ou sinal 4G.
          </div>
        </div>
      )}
    </>
  );
};
