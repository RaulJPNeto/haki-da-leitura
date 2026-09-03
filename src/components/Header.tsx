import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { NavigationDrawer } from './NavigationDrawer';

interface HeaderProps {
  onOpenGlossary: () => void;
  onOpenCardList: () => void;
  onResetScan: () => void;
  hapticEnabled: boolean;
  onToggleHaptic: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenGlossary,
  onOpenCardList,
  onResetScan,
  hapticEnabled,
  onToggleHaptic
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 h-20 px-4 sm:px-8 glass-panel rounded-none border-t-0 border-x-0 border-b border-white/10 backdrop-blur-2xl flex items-center justify-between shadow-xl">
        {/* Lado Esquerdo: Botão Menu Principal (Ícone Tradicional Hamburger) & Nome */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="w-11 h-11 rounded-xl bg-white/5 hover:bg-sky-950/40 border border-white/10 hover:border-sky-500/40 text-amber-400 flex items-center justify-center active:scale-95 transition-all focus:outline-none shadow-md"
            title="Abrir Menu de Navegação"
            aria-label="Menu Principal"
          >
            <Menu className="w-6 h-6" />
          </button>

          <button 
            onClick={onResetScan} 
            className="flex items-center gap-3 bg-transparent border-0 text-left cursor-pointer group focus:outline-none"
          >
            <div className="flex relative w-11 h-11 rounded-2xl overflow-hidden shadow-lg shadow-sky-950/60 p-[1.5px] bg-gradient-to-tr from-amber-400 via-sky-500 to-sky-600 shrink-0 group-active:scale-95 transition-transform duration-200">
              <img src="/favicon.svg" alt="Haki da Leitura" className="w-full h-full object-cover rounded-[14px]" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-white leading-none font-heading flex items-center gap-1.5">
                  <span>Haki da Leitura</span>
                  <span className="pill-badge pill-badge-sky font-mono font-bold tracking-wider">
                    OPTCG
                  </span>
                </h1>
              </div>
              <div className="flex items-center gap-1.5 mt-1 text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/90 shadow-[0_0_6px_rgba(52,211,153,0.6)] shrink-0" />
                <span className="text-[11px] font-medium tracking-wide text-slate-400">Scanner & Guia Não Oficial</span>
              </div>
            </div>
          </button>
        </div>

      </header>

      {/* Menu Lateral Deslizante (Drawer) */}
      <NavigationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpenGlossary={onOpenGlossary}
        onOpenCardList={onOpenCardList}
        onResetCamera={onResetScan}
        hapticEnabled={hapticEnabled}
        onToggleHaptic={onToggleHaptic}
      />
    </>
  );
};
