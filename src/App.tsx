import React, { useState, useEffect } from 'react';
import { Card, KeywordRule } from './types';
import cardsData from './data/cards';
import keywordsData from './data/keywords.json';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { ScannerOverlay } from './components/ScannerOverlay';
import { CardDetail } from './components/CardDetail';
import { KeywordDrawer } from './components/KeywordDrawer';
import { ManualSearchModal } from './components/ManualSearchModal';
import { GlossaryModal } from './components/GlossaryModal';
import { AdminSyncModal } from './components/AdminSyncModal';
import { SyncNotificationBanner } from './components/SyncNotificationBanner';

export const App: React.FC = () => {
  const cards: Card[] = cardsData as Card[];
  const keywords: KeywordRule[] = keywordsData as KeywordRule[];

  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [selectedKeyword, setSelectedKeyword] = useState<KeywordRule | null>(null);
  const [isCardListOpen, setIsCardListOpen] = useState<boolean>(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState<boolean>(false);
  const [isAdminSyncOpen, setIsAdminSyncOpen] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(true);
  const [hapticEnabled, setHapticEnabled] = useState<boolean>(true);

  // Sincronização com o histórico do navegador (Botão Voltar do celular / Gesto de voltar Android e iOS)
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash;
      const pathname = window.location.pathname;

      // 1. Rota de administração
      const isAdmin = pathname === '/admin' || window.location.search.includes('admin') || hash === '#admin';
      setIsAdminSyncOpen(isAdmin);

      // 2. Modais globais
      setIsGlossaryOpen(hash === '#glossary');
      setIsCardListOpen(hash === '#search');

      // 3. Gaveta de Regras
      if (hash.startsWith('#rule=')) {
        const ruleId = hash.replace('#rule=', '');
        const kw = keywords.find((k) => k.id === ruleId);
        setSelectedKeyword(kw || null);
      } else {
        setSelectedKeyword(null);
      }

      // 4. Ficha da Carta vs Scanner Inicial
      if (hash.startsWith('#card=')) {
        const cardCode = hash.replace('#card=', '');
        const found = cards.find((c) => c.code.toLowerCase() === cardCode.toLowerCase());
        if (found) {
          setSelectedCard(found);
          setIsScanning(false);
        }
      } else if (!hash.startsWith('#rule=')) {
        // Se voltou para a raiz sem #card, restaura a tela inicial com a câmera
        setSelectedCard(null);
        setIsScanning(true);
      }
    };

    // Avalia o estado inicial da URL
    handlePopState();

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [cards, keywords]);

  const handleCloseAdminSync = () => {
    setIsAdminSyncOpen(false);
    if (
      window.location.pathname === '/admin' ||
      window.location.search.includes('admin') ||
      window.location.hash === '#admin'
    ) {
      window.history.replaceState({}, '', '/');
    }
  };

  // Manipulador de Seleção Direta de Carta (Scanner ou Busca rápida)
  const handleSelectCard = (card: Card) => {
    if (hapticEnabled && navigator.vibrate) {
      navigator.vibrate([40, 60, 40]);
    }
    // Adiciona entrada na pilha de histórico do navegador
    window.history.pushState({ view: 'card', code: card.code }, '', `#card=${card.code}`);
    setSelectedCard(card);
    setIsScanning(false);
  };

  // Abrir regra por ID (clique na tag dentro do efeito da carta)
  const handleSelectKeywordById = (keywordId: string) => {
    const kw = keywords.find((k) => k.id === keywordId);
    if (kw) {
      window.history.pushState({ view: 'rule', id: kw.id }, '', `#rule=${kw.id}`);
      setSelectedKeyword(kw);
    }
  };

  // Fechar gaveta de regras
  const handleCloseKeyword = () => {
    if (window.location.hash.startsWith('#rule=')) {
      window.history.back();
    } else {
      setSelectedKeyword(null);
    }
  };

  // Abrir e fechar glossário
  const handleOpenGlossary = () => {
    window.history.pushState({ view: 'glossary' }, '', '#glossary');
    setIsGlossaryOpen(true);
  };

  const handleCloseGlossary = () => {
    if (window.location.hash === '#glossary') {
      window.history.back();
    } else {
      setIsGlossaryOpen(false);
    }
  };

  // Abrir e fechar banco de cartas (busca manual)
  const handleOpenCardList = () => {
    window.history.pushState({ view: 'search' }, '', '#search');
    setIsCardListOpen(true);
  };

  const handleCloseCardList = () => {
    if (window.location.hash === '#search') {
      window.history.back();
    } else {
      setIsCardListOpen(false);
    }
  };

  // Seleção de carta a partir do modal de busca manual
  const handleSelectCardFromModal = (card: Card) => {
    if (hapticEnabled && navigator.vibrate) {
      navigator.vibrate([40, 60, 40]);
    }
    window.history.replaceState({ view: 'card', code: card.code }, '', `#card=${card.code}`);
    setSelectedCard(card);
    setIsScanning(false);
    setIsCardListOpen(false);
  };

  // Voltar para a câmera / scanner via botão da UI ("Escanear Outra")
  const handleResetToScan = () => {
    if (window.location.hash) {
      window.history.back();
    } else {
      setSelectedCard(null);
      setSelectedKeyword(null);
      setIsScanning(true);
    }
  };

  return (
    <div className="h-[100dvh] w-full max-w-full bg-slate-950 text-slate-100 flex flex-col font-sans select-none overflow-hidden">
      
      {/* 1. Header Fixo com Menu Embutido */}
      <Header
        onOpenGlossary={handleOpenGlossary}
        onOpenCardList={handleOpenCardList}
        onResetScan={handleResetToScan}
        hapticEnabled={hapticEnabled}
        onToggleHaptic={() => setHapticEnabled(!hapticEnabled)}
      />

      {/* Espaçador para o Header Fixo (80px) */}
      <div className="h-20 shrink-0" />

      {/* Visualização: Se tiver carta selecionada, mostra a Ficha da Carta */}
      {selectedCard ? (
        <div className="flex-1 min-h-0 w-full overflow-y-auto overflow-x-hidden">
          <CardDetail
            card={selectedCard}
            keywords={keywords}
            onSelectKeyword={handleSelectKeywordById}
            onBackToScan={handleResetToScan}
            onOpenGlossary={handleOpenGlossary}
          />
        </div>
      ) : (
        /* Tela Inicial Pura: Apenas Busca e Scanner ocupando exatamente 100% da viewport */
        <main className="flex-1 min-h-0 flex flex-col items-center w-full max-w-full overflow-hidden relative">
          {/* 2. Campo de Busca Instantâneo com Dropdown */}
          <SearchBar
            cards={cards}
            onSelectCard={handleSelectCard}
          />

          {/* 3. Visor de Câmera (Scanner) Multi-Sinal */}
          <ScannerOverlay
            cards={cards}
            onSelectCard={handleSelectCard}
            isScanning={isScanning}
          />
        </main>
      )}

      {/* 4. Gaveta de Regras Contextual (Bottom Sheet) */}
      <KeywordDrawer
        keyword={selectedKeyword}
        onClose={handleCloseKeyword}
      />

      {/* 5. Modal de Coleção/Banco de Cartas */}
      {isCardListOpen && (
        <ManualSearchModal
          cards={cards}
          onSelectCard={handleSelectCardFromModal}
          onClose={handleCloseCardList}
        />
      )}

      {/* 6. Modal do Dicionário de Regras */}
      {isGlossaryOpen && (
        <GlossaryModal
          keywords={keywords}
          onSelectKeyword={(kw) => {
            handleSelectKeywordById(kw.id);
            handleCloseGlossary();
          }}
          onClose={handleCloseGlossary}
        />
      )}

      {/* 7. Modal Administrativo de Sincronização (Acesso restrito via link /admin) */}
      <AdminSyncModal
        isOpen={isAdminSyncOpen}
        onClose={handleCloseAdminSync}
      />

      {/* 8. Banner de Notificação de Novas Cartas / Atualização */}
      <SyncNotificationBanner />
    </div>
  );
};

export default App;
