import React, { useState, useEffect } from 'react';
import { Sparkles, X } from 'lucide-react';
import syncMeta from '../data/sync_meta.json';

const STORAGE_KEY = 'haki_acknowledged_sync';

export const SyncNotificationBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const acknowledged = localStorage.getItem(STORAGE_KEY);
      if (!acknowledged || acknowledged !== syncMeta.lastSync) {
        setIsVisible(true);
      }
    } catch {
      // Ignora se localStorage estiver desabilitado
    }
  }, []);

  const handleDismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, syncMeta.lastSync);
    } catch {
      // Ignora
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 animate-slide-up">
      <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-sky-950/90 to-[#0c121e]/95 border border-sky-500/30 backdrop-blur-xl shadow-2xl flex items-start gap-3 text-slate-100">
        <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/30 text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4" />
        </div>

        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-bold text-white font-heading">Base Atualizada</h4>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">
              {syncMeta.totalCards} cartas
            </span>
          </div>
          <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
            {syncMeta.message}
          </p>
        </div>

        <button
          onClick={handleDismiss}
          className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors shrink-0"
          title="Fechar notificação"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
