import React from 'react';
import { BookOpen, Layers, RefreshCw, Volume2, VolumeX, X, ChevronRight, ShieldCheck } from 'lucide-react';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenGlossary: () => void;
  onOpenCardList: () => void;
  onResetCamera: () => void;
  hapticEnabled: boolean;
  onToggleHaptic: () => void;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  onClose,
  onOpenGlossary,
  onOpenCardList,
  onResetCamera,
  hapticEnabled,
  onToggleHaptic
}) => {
  if (!isOpen) return null;

  const handleAction = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-start animate-fadeIn">
      {/* Backdrop Escuro com Blur */}
      <div 
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Painel Deslizante Lateral Esquerdo (Drawer) */}
      <div className="relative w-[85vw] max-w-xs sm:max-w-sm h-full bg-[#0c1018] border-r border-white/10 shadow-2xl flex flex-col justify-between z-10 animate-slide-left">
        
        {/* Topo do Menu: Marca e Botão Fechar */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-sky-950/30 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl overflow-hidden p-[1px] bg-gradient-to-tr from-amber-400 via-sky-500 to-sky-600 shadow-md shrink-0">
              <img src="/favicon.svg" alt="Haki da Leitura" className="w-full h-full object-cover rounded-[14px]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight font-heading">
                Haki da Leitura
              </h2>
              <span className="text-[10px] text-slate-400 font-medium">Menu Principal</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white flex items-center justify-center active:scale-95 transition-all"
            title="Fechar menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lista de Navegação Principal */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          
          {/* Opção 1: Dicionário de Regras */}
          <button
            onClick={() => handleAction(onOpenGlossary)}
            className="w-full p-3.5 rounded-xl bg-white/[0.02] hover:bg-sky-950/30 border border-white/5 hover:border-sky-500/40 flex items-center justify-between text-left transition-all active:scale-98 group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-sky-950/80 border border-sky-600/40 text-sky-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                  Dicionário de Regras
                </h3>
                <p className="text-[11px] text-slate-400">
                  Palavras-chave, timing e dúvidas
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
          </button>

          {/* Opção 2: Banco de Cartas */}
          <button
            onClick={() => handleAction(onOpenCardList)}
            className="w-full p-3.5 rounded-xl bg-white/[0.02] hover:bg-sky-950/30 border border-white/5 hover:border-sky-500/40 flex items-center justify-between text-left transition-all active:scale-98 group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-amber-950/60 border border-amber-600/40 text-amber-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                  Banco de Cartas
                </h3>
                <p className="text-[11px] text-slate-400">
                  Pesquisa por código, nome e tipo
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
          </button>

          {/* Opção 3: Reiniciar Câmera */}
          <button
            onClick={() => handleAction(onResetCamera)}
            className="w-full p-3.5 rounded-xl bg-white/[0.02] hover:bg-sky-950/30 border border-white/5 hover:border-sky-500/40 flex items-center justify-between text-left transition-all active:scale-98 group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-slate-800/80 border border-white/10 text-slate-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                  Reiniciar Scanner
                </h3>
                <p className="text-[11px] text-slate-400">
                  Recarregar câmera e foco
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
          </button>

          {/* Divisor */}
          <div className="my-3 border-t border-white/5" />

          {/* Opção 4: Configuração de Vibração (Toggle Interativo) */}
          <div className="p-3.5 rounded-xl bg-[#0f1422] border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${
                hapticEnabled 
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400' 
                  : 'bg-slate-800/60 border-white/10 text-slate-400'
              }`}>
                {hapticEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Resposta Tátil</h4>
                <p className="text-[11px] text-slate-400">
                  Vibrar ao identificar cartas
                </p>
              </div>
            </div>

            {/* Switch Toggle Estilo iOS */}
            <button
              onClick={onToggleHaptic}
              className={`w-12 h-7 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none ${
                hapticEnabled ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
              role="switch"
              aria-checked={hapticEnabled}
              title={hapticEnabled ? 'Desativar vibração' : 'Ativar vibração'}
            >
              <div
                className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                  hapticEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Rodapé do Menu: Status Offline e Metadados */}
        <div className="p-4 border-t border-white/10 bg-[#090d14] flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium text-[11px]">Banco de regras 100% offline</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
            <span>One Piece Card Game</span>
            <span>v1.0.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};
