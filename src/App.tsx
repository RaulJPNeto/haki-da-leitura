import React, { useState } from 'react';
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

  // Manipulador de Seleção Direta de Carta
  const handleSelectCard = (card: Card) => {
    if (hapticEnabled && navigator.vibrate) {
      navigator.vibrate([40, 60, 40]);
    }
    setSelectedCard(card);
    setIsScanning(false);
  };

  // Abrir regra por ID (clique na tag dentro do efeito da carta)
  const handleSelectKeywordById = (keywordId: string) => {
    const kw = keywords.find((k) => k.id === keywordId);
    if (kw) {
      setSelectedKeyword(kw);
    }
  };

  const handleResetToScan = () => {
    setSelectedCard(null);
    setSelectedKeyword(null);
    setIsScanning(true);
  };

  return (
    <div className="h-[100dvh] w-full max-w-full bg-slate-950 text-slate-100 flex flex-col font-sans select-none overflow-hidden">
      
      {/* 1. Header Fixo com Menu em Pizza Embutido */}
      <Header
        onOpenGlossary={() => setIsGlossaryOpen(true)}
        onOpenCardList={() => setIsCardListOpen(true)}
        onResetScan={handleResetToScan}
        onOpenAdminSync={() => setIsAdminSyncOpen(true)}
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
            onOpenGlossary={() => setIsGlossaryOpen(true)}
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
        onClose={() => setSelectedKeyword(null)}
      />

      {/* 5. Modal de Coleção/Banco de Cartas (Acessível via Menu em Pizza) */}
      {isCardListOpen && (
        <ManualSearchModal
          cards={cards}
          onSelectCard={(card) => {
            setSelectedCard(card);
            setIsScanning(false);
            setIsCardListOpen(false);
          }}
          onClose={() => setIsCardListOpen(false)}
        />
      )}

      {/* 6. Modal do Dicionário de Regras (Acessível via Menu em Pizza) */}
      {isGlossaryOpen && (
        <GlossaryModal
          keywords={keywords}
          onSelectKeyword={(kw) => {
            setSelectedKeyword(kw);
            setIsGlossaryOpen(false);
          }}
          onClose={() => setIsGlossaryOpen(false)}
        />
      )}

      {/* 7. Modal Administrativo de Sincronização */}
      <AdminSyncModal
        isOpen={isAdminSyncOpen}
        onClose={() => setIsAdminSyncOpen(false)}
      />

      {/* 8. Banner de Notificação de Novas Cartas / Atualização */}
      <SyncNotificationBanner />
    </div>
  );
};

export default App;
