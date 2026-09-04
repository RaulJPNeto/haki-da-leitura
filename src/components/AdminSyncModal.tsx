import React, { useState, useEffect } from 'react';
import { X, RefreshCw, Lock, KeyRound, CheckCircle2, AlertTriangle, ExternalLink, Terminal, ShieldAlert } from 'lucide-react';

interface AdminSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface WorkflowRun {
  id: number;
  status: string;
  conclusion: string | null;
  html_url: string;
  created_at: string;
}

const DEFAULT_REPO = 'RaulJPNeto/haki-da-leitura';
const ADMIN_PIN_KEY = 'haki_admin_pin';
const GITHUB_TOKEN_KEY = 'haki_gh_token';

export const AdminSyncModal: React.FC<AdminSyncModalProps> = ({ isOpen, onClose }) => {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinError, setPinError] = useState('');
  
  const [githubToken, setGithubToken] = useState(() => localStorage.getItem(GITHUB_TOKEN_KEY) || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: ''
  });

  const [lastRun, setLastRun] = useState<WorkflowRun | null>(null);
  const [isLoadingRuns, setIsLoadingRuns] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Validar PIN de acesso (PIN padrão de segurança: 1337 ou configurável)
  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPin = localStorage.getItem(ADMIN_PIN_KEY) || '1337';
    if (pin.trim() === storedPin) {
      setIsAuthenticated(true);
      setPinError('');
    } else {
      setPinError('PIN incorreto. (PIN padrão: 1337)');
    }
  };

  // Buscar última execução do GitHub Actions
  const fetchWorkflowRuns = async () => {
    setIsLoadingRuns(true);
    try {
      const response = await fetch(
        `https://api.github.com/repos/${DEFAULT_REPO}/actions/workflows/sync-cards.yml/runs?per_page=1`,
        {
          headers: {
            Accept: 'application/vnd.github.v3+json',
            ...(githubToken ? { Authorization: `Bearer ${githubToken}` } : {})
          }
        }
      );
      if (response.ok) {
        const data = await response.json();
        if (data.workflow_runs && data.workflow_runs.length > 0) {
          setLastRun(data.workflow_runs[0]);
        }
      }
    } catch {
      // Falha silenciosa se o repositório ainda não tiver runs ou for privado
    } finally {
      setIsLoadingRuns(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchWorkflowRuns();
    }
  }, [isAuthenticated]);

  // Acionar Sincronização via Repository Dispatch API
  const handleTriggerSync = async () => {
    if (!githubToken.trim()) {
      setSyncStatus({
        type: 'error',
        message: 'Insira um GitHub Personal Access Token (PAT) com permissão repo ou actions.'
      });
      return;
    }

    setIsSubmitting(true);
    setSyncStatus({ type: 'idle', message: '' });

    try {
      localStorage.setItem(GITHUB_TOKEN_KEY, githubToken.trim());
      const response = await fetch(`https://api.github.com/repos/${DEFAULT_REPO}/dispatches`, {
        method: 'POST',
        headers: {
          Accept: 'application/vnd.github.v3+json',
          Authorization: `Bearer ${githubToken.trim()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          event_type: 'sync-cards'
        })
      });

      if (response.status === 204) {
        setSyncStatus({
          type: 'success',
          message: 'Sinal de sincronização enviado! O GitHub Actions iniciou a ingestão.'
        });
        setTimeout(fetchWorkflowRuns, 3000);
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
        setSyncStatus({
          type: 'error',
          message: `Falha ao acionar (${response.status}): ${errorData.message || 'Verifique suas permissões de token'}`
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha na conexão com a API do GitHub';
      setSyncStatus({ type: 'error', message: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Janela Modal */}
      <div className="relative w-full max-w-lg bg-[#0d131f] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90dvh] z-10 animate-scale-up">
        {/* Topo */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-sky-950/40 via-transparent to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-heading">Painel de Sincronização (ADM)</h2>
              <span className="text-[11px] text-slate-400">Ingestão de cartas & GitHub Actions</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-5 overflow-y-auto space-y-5 text-sm">
          {!isAuthenticated ? (
            /* Tela de Autenticação por PIN */
            <form onSubmit={handleVerifyPin} className="space-y-4 py-2">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 flex items-start gap-3">
                <Lock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs leading-relaxed">
                  Área restrita para manutenção da base de cartas. Insira o PIN de segurança para gerenciar automações e disparos.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300" htmlFor="admin-pin-input">
                  Código PIN de Acesso
                </label>
                <input
                  id="admin-pin-input"
                  type="password"
                  maxLength={8}
                  placeholder="Digite o PIN (ex: 1337)"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono tracking-widest text-center text-lg"
                  autoFocus
                />
                {pinError && (
                  <p className="text-xs text-rose-400 font-medium flex items-center gap-1 mt-1">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    {pinError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-950/40 active:scale-98 transition-all"
              >
                Acessar Painel
              </button>
            </form>
          ) : (
            /* Painel Administrativo Ativo */
            <div className="space-y-5">
              {/* Status do Workflow */}
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">Status no GitHub Actions:</span>
                  <button
                    onClick={fetchWorkflowRuns}
                    disabled={isLoadingRuns}
                    className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 ${isLoadingRuns ? 'animate-spin' : ''}`} />
                    Atualizar
                  </button>
                </div>

                {lastRun ? (
                  <div className="flex items-center justify-between text-xs pt-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          lastRun.status === 'completed' && lastRun.conclusion === 'success'
                            ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]'
                            : lastRun.status === 'in_progress'
                            ? 'bg-amber-400 animate-pulse'
                            : 'bg-rose-400'
                        }`}
                      />
                      <span className="text-slate-200 capitalize font-medium">
                        {lastRun.status === 'completed'
                          ? `Concluído (${lastRun.conclusion})`
                          : 'Em execução...'}
                      </span>
                    </div>
                    <a
                      href={lastRun.html_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sky-400 hover:underline inline-flex items-center gap-1 text-[11px]"
                    >
                      Ver Log <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">Nenhuma execução registrada recentemente.</p>
                )}
              </div>

              {/* Gatilho sob demanda */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300" htmlFor="gh-token-input">
                  GitHub Personal Access Token (PAT)
                </label>
                <input
                  id="gh-token-input"
                  type="password"
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                  value={githubToken}
                  onChange={(e) => setGithubToken(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 text-xs font-mono"
                />
                <p className="text-[11px] text-slate-400">
                  Necessário para autenticar no endpoint <code>repository_dispatch</code> do repositório.
                </p>
              </div>

              {syncStatus.message && (
                <div
                  className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                    syncStatus.type === 'success'
                      ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-950/30 border-rose-500/30 text-rose-300'
                  }`}
                >
                  {syncStatus.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                  ) : (
                    <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                  )}
                  <span>{syncStatus.message}</span>
                </div>
              )}

              <button
                onClick={handleTriggerSync}
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-white font-bold text-sm shadow-lg shadow-sky-950/50 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isSubmitting ? 'animate-spin' : ''}`} />
                {isSubmitting ? 'Disparando Sincronização...' : 'Disparar Sincronização no GitHub'}
              </button>

              {/* Guia de Execução Local */}
              <div className="pt-2 border-t border-white/5">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <Terminal className="w-3.5 h-3.5 text-amber-400" />
                  Execução Local via Terminal
                </span>
                <pre className="p-3 rounded-xl bg-black/50 border border-white/5 text-[11px] font-mono text-amber-300/90 overflow-x-auto select-all">
                  node scripts/ingest_cards.js &#10;node scripts/ingest_promos.js &#10;node scripts/split_cards.js &#10;node scripts/audit_words.js
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
