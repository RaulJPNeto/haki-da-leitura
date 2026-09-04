import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Camera, Loader2, Zap, Sparkles, RefreshCw, Focus } from 'lucide-react';
import { Card, CardType, CardAttribute, CardColor } from '../types';
import { CandidateModal } from './CandidateModal';

export interface DetectedSignals {
  code?: string | null;
  set?: string | null;
  cardType?: CardType | null;
  attribute?: CardAttribute | null;
  power?: number | null;
  cost?: number | null;
  counter?: number | null;
  hasTrigger?: boolean;
  color?: CardColor | null;
  colors?: CardColor[];
  subtypes?: string[];
  keywords?: string[];
}

const KNOWN_SUBTYPES = [
  'STRAW HAT CREW', 'SUPERNOVAS', 'NAVY', 'WHITEBEARD PIRATES',
  'BIG MOM PIRATES', 'ANIMAL KINGDOM PIRATES', 'LAND OF WANO',
  'SEVEN WARLORDS', 'FISHMAN', 'HEART PIRATES', 'KID PIRATES',
  'GERMA 66', 'CP9', 'CP0', 'BAROQUE WORKS', 'DONQUIXOTE PIRATES',
  'REVOLUTIONARY ARMY', 'ALABASTA', 'DRESSROSA', 'EGGHEAD', 'SWORD', 'FILM'
];

interface ScannerOverlayProps {
  cards: Card[];
  onSelectCard: (card: Card) => void;
  isScanning: boolean;
}

export const ScannerOverlay: React.FC<ScannerOverlayProps> = ({
  cards,
  onSelectCard,
  isScanning
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const workerRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [hasCamera, setHasCamera] = useState<boolean>(false);
  const [cameraLoading, setCameraLoading] = useState<boolean>(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scannedFeedback, setScannedFeedback] = useState<string | null>(null);
  const [ocrReady, setOcrReady] = useState<boolean>(false);
  const [isRecognizing, setIsRecognizing] = useState<boolean>(false);

  // Lanterna / Flash (Torch) e Foco
  const [torchAvailable, setTorchAvailable] = useState<boolean>(false);
  const [torchOn, setTorchOn] = useState<boolean>(false);
  const [focusRing, setFocusRing] = useState<{ x: number; y: number } | null>(null);
  const [focusSupported, setFocusSupported] = useState<boolean>(false);

  // Modal de Candidatos Intermediário (Pausa a câmera para escolha tranquila)
  const [candidateModalCards, setCandidateModalCards] = useState<Card[] | null>(null);

  // Sinais detectados no frame
  const [detectedSignals, setDetectedSignals] = useState<DetectedSignals | null>(null);

  // Modo de Validação por Tipo de Carta (Auto, Personagem, Líder, Evento, Palco)
  const [scannerMode, setScannerMode] = useState<'AUTO' | 'CHARACTER' | 'LEADER' | 'EVENT' | 'STAGE'>('AUTO');

  // Sincronização da tela de desempate com o histórico do navegador (botão Voltar do celular)
  useEffect(() => {
    const handlePopState = () => {
      if (window.location.hash !== '#candidates' && candidateModalCards) {
        setCandidateModalCards(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [candidateModalCards]);

  // Inicializar Tesseract Worker para OCR em background com modo SPARSE_TEXT (Ideal para cartas)
  useEffect(() => {
    let worker: any = null;
    let isMounted = true;

    async function initOcr() {
      try {
        const { createWorker } = await import('tesseract.js');
        worker = await createWorker('eng');
        // Configurar Tesseract para modo SPARSE_TEXT (Modo 11: textos dispersos em cartas/itens)
        await worker.setParameters({
          tessedit_pageseg_mode: '11' as any
        });
        if (isMounted) {
          workerRef.current = worker;
          setOcrReady(true);
        }
      } catch (err: any) {
        console.warn('Aviso OCR:', err);
      }
    }

    initOcr();

    return () => {
      isMounted = false;
      if (worker) {
        worker.terminate().catch(() => {});
      }
    };
  }, []);

  // Encerrar Câmera e Liberar Hardware/Bateria
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {}
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setTorchOn(false);
  }, []);

  // Recarregar Câmera do Zero (Destrói stream velho e conecta feed limpo com feedback visual)
  const reloadCamera = useCallback(async () => {
    setCameraLoading(true);
    setCameraError(null);

    // 1. Destruir qualquer stream anterior com segurança
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {}
      });
      streamRef.current = null;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setHasCamera(false);
      setCameraLoading(false);
      setCameraError('Câmera não suportada neste navegador.');
      return;
    }

    let stream: MediaStream | null = null;
    try {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1280 },
            height: { ideal: 720 },
            // @ts-ignore
            focusMode: { ideal: 'continuous' }
          },
          audio: false
        });
      } catch (e1) {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
      }

      streamRef.current = stream;

      const track = stream.getVideoTracks()[0];
      if (track && (track.getCapabilities as any)) {
        const caps = (track.getCapabilities as any)();
        if (caps && 'torch' in caps) setTorchAvailable(true);
        if (caps && 'focusMode' in caps) setFocusSupported(true);
      }

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.setAttribute('webkit-playsinline', 'true');
        videoRef.current.muted = true;

        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {});
        }

        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(() => {});
          setCameraLoading(false);
        };
      }

      setHasCamera(true);
      setCameraError(null);
    } catch (err: any) {
      console.warn('[Haki Vision] Erro ao carregar câmera:', err);
      setHasCamera(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Permissão da câmera bloqueada. Toque no botão para permitir o acesso.');
      } else {
        setCameraError('Câmera temporariamente indisponível. Toque no botão para recarregar.');
      }
    } finally {
      // Garante que o loading conclua após o tempo de inicialização do sensor
      setTimeout(() => setCameraLoading(false), 500);
    }
  }, []);

  // Ciclo de Vida: Inicia a recarga limpa ao entrar e ao retornar à visibilidade
  useEffect(() => {
    reloadCamera();

    const handleVisibilityChange = () => {
      if (document.hidden || document.visibilityState === 'hidden') {
        stopCamera();
      } else if (document.visibilityState === 'visible') {
        reloadCamera();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      stopCamera();
    };
  }, [reloadCamera, stopCamera]);

  // Alternar Lanterna com Feedback Háptico
  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (!track) return;

    try {
      const next = !torchOn;
      await (track as any).applyConstraints({
        advanced: [{ torch: next }]
      });
      setTorchOn(next);
      if (navigator.vibrate) navigator.vibrate(25);
    } catch (err) {
      console.warn('Erro ao alternar lanterna:', err);
    }
  };

  // Foco Manual / Tap-to-Focus com Anel Visual e Refoco de Câmera
  const triggerFocus = useCallback(async (clientX?: number, clientY?: number, containerRect?: DOMRect) => {
    if (navigator.vibrate) navigator.vibrate(18);

    if (clientX !== undefined && clientY !== undefined && containerRect) {
      setFocusRing({
        x: clientX - containerRect.left,
        y: clientY - containerRect.top
      });
      setTimeout(() => setFocusRing(null), 1000);
    }

    if (streamRef.current) {
      const track = streamRef.current.getVideoTracks()[0];
      if (track) {
        try {
          const caps = (track.getCapabilities as any)?.();
          if (caps?.focusMode?.includes('continuous')) {
            await (track as any).applyConstraints({
              advanced: [{ focusMode: 'continuous' }]
            });
          }
        } catch (err) {
          console.warn('Tap to focus não suportado:', err);
        }
      }
    }
  }, []);

  // Alternar Modo de Carta com Feedback Háptico
  const handleModeChange = (mode: 'AUTO' | 'CHARACTER' | 'LEADER' | 'EVENT' | 'STAGE') => {
    if (navigator.vibrate) navigator.vibrate(15);
    setScannerMode(mode);
  };

  // Disparar Seleção de Carta com Feedback
  const handleCardSelected = useCallback((card: Card) => {
    setScannedFeedback(`${card.code} - ${card.namePt}`);
    setCandidateModalCards(null);
    if (navigator.vibrate) navigator.vibrate([40, 60, 40]);
    setTimeout(() => {
      onSelectCard(card);
      setScannedFeedback(null);
    }, 350);
  }, [onSelectCard]);

  // Filtro de Visão Computacional para Shields (Anti-Reflexo e Realce de Contraste no Canvas)
  const enhanceFrameForShield = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;

    let min = 255;
    let max = 0;
    const gray = new Uint8Array(width * height);

    // 1. Escala de cinza e busca de mínimos e máximos locais
    for (let i = 0, j = 0; i < data.length; i += 4, j++) {
      const g = Math.round(data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
      gray[j] = g;
      if (g < min) min = g;
      if (g > max) max = g;
    }

    // 2. Expansão dinâmica de histograma (corta a "névoa" do plástico fosco do sleeve)
    const range = max - min || 1;
    for (let i = 0, j = 0; i < data.length; i += 4, j++) {
      let val = Math.round(((gray[j] - min) / range) * 255);
      
      // Curva S de alto contraste para destacar letras e números pretos/brancos
      if (val < 125) {
        val = Math.max(0, val * 0.65);
      } else {
        val = Math.min(255, val * 1.35);
      }

      data[i] = val;
      data[i + 1] = val;
      data[i + 2] = val;
    }

    ctx.putImageData(imgData, 0, 0);
  };

    // Motor Multi-Sinal Avançado: Código + Nome + Coleção + Tipo + Atributo + Poder + Custo + Counter + Trigger + Subtipos + Keywords + Efeito
  const matchCardMultiSignal = useCallback((rawText: string): { exactCard?: Card; candidates?: Card[]; signals?: DetectedSignals } => {
    if (!rawText) return {};

    const textClean = rawText.toUpperCase().replace(/[\n\r]/g, ' ');

    // Normalização universal de nomes: remove pontos, traços, aspas, estrelas (Patch★Work), pontos médios (A・O), interrogações e variações de OCR
    const normalizeName = (s: string) =>
      s
        .toUpperCase()
        .replace(/PATCH[X*×]WORK/gi, 'PATCH WORK')
        .replace(/[.\-_:'★*・?×!"]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    const textCleanNorm = normalizeName(rawText);

    // Filtragem Prévia de Busca: Se o usuário selecionou um tipo específico, foca exclusivamente nele
    const activeTypeFilter = scannerMode !== 'AUTO' ? scannerMode : null;
    const baseCards = activeTypeFilter ? cards.filter((c) => c.cardType === activeTypeFilter) : cards;

    // SINAL 1: Código Exato Ultra-Resiliente (OP17-106, ST10-006, etc.)
    // Tolera confusão de OCR: 0/O/o, 1/I/i/l/L, prefixos 0P/OI/OR/5T, dígito 8 como E, sufixos de raridade/copyright (m8, 08, E, @)
    const codeMatch = textClean.match(/(OP|0P|OI|0I|OR|0R|ST|5T|EB|P)[\s\-_.:]?([0-9OIL]{2,3})[\s\-_.:]?([0-9OILE]{3})/i);
    let detectedCode: string | null = null;
    if (codeMatch) {
      const p = codeMatch[1].toUpperCase().replace(/^0P|^OI|^0I|^OR|^0R/, 'OP').replace(/^5T/, 'ST');
      const s = codeMatch[2].replace(/[O]/g, '0').replace(/[IL]/g, '1');
      const c = codeMatch[3].replace(/[O]/g, '0').replace(/[IL]/g, '1').replace(/[E]/g, '8');
      detectedCode = p === 'P' ? `P-${c}` : `${p}${s}-${c}`;

      const cardByCode = baseCards.find((card) => card.code.toUpperCase() === detectedCode);
      if (cardByCode) {
        // BLINDAGEM 1: Validação Cruzada entre Código e Nome
        // Se o código apontar para uma carta (ex: "Izo"), mas o frame contiver com clareza
        // o nome de outro personagem (ex: "MONKEY.D.LUFFY"), não dê match cego no código!
        const cardNameNorm = normalizeName(cardByCode.nameEn);
        const hasDirectNameMatch = textCleanNorm.includes(cardNameNorm);

        const hasConflictingCharacter = cards.some(
          (c) =>
            c.cardType === 'CHARACTER' &&
            c.nameEn.length >= 5 &&
            normalizeName(c.nameEn) !== cardNameNorm &&
            textCleanNorm.includes(normalizeName(c.nameEn)) &&
            !KNOWN_SUBTYPES.includes(c.nameEn.toUpperCase())
        );

        if (hasDirectNameMatch || !hasConflictingCharacter) {
          return {
            exactCard: cardByCode,
            signals: { code: detectedCode, set: cardByCode.setId, cardType: cardByCode.cardType }
          };
        }
      }
    }

    // SINAL 2: Coleção detectada (ex: OP17, OP03, ST10, EB01)
    const setMatch = textClean.match(/\b(OP|ST|EB)[ -]?(0[1-9]|1[0-9]|2[0-9]|3[0-9])\b/i);
    const detectedSet = setMatch ? `${setMatch[1].toUpperCase()}-${setMatch[2]}` : null;

    // SINAL 3: Tipo de Carta (LEADER, CHARACTER, EVENT, STAGE)
    let detectedType: CardType | null = null;
    if (/\bLEADER\b/.test(textClean)) detectedType = 'LEADER';
    else if (/\bCHARACTER\b/.test(textClean)) detectedType = 'CHARACTER';
    else if (/\bEVENT\b/.test(textClean)) detectedType = 'EVENT';
    else if (/\bSTAGE\b/.test(textClean)) detectedType = 'STAGE';

    // SINAL 4: Atributo de Batalha (SLASH, STRIKE, RANGED, SPECIAL, WISDOM)
    let detectedAttribute: CardAttribute | null = null;
    if (/\bSLASH\b/.test(textClean)) detectedAttribute = 'SLASH';
    else if (/\bSTRIKE\b/.test(textClean)) detectedAttribute = 'STRIKE';
    else if (/\bRANGED\b/.test(textClean)) detectedAttribute = 'RANGED';
    else if (/\bSPECIAL\b/.test(textClean)) detectedAttribute = 'SPECIAL';
    else if (/\bWISDOM\b/.test(textClean)) detectedAttribute = 'WISDOM';

    // SINAL 5: Poder detectado (números de 1000 a 12000)
    const powerMatch = textClean.match(/(?:^|[^\d])(1[0-2]000|[1-9]000)(?:[^\d]|$)/);
    const detectedPower = powerMatch ? Number(powerMatch[1]) : null;

    // SINAL 6: Custo ou Vida de Líder (Custo 1 a 10, Vida de Líder 3 a 6)
    const costMatch = textClean.match(/(?:^|[^\d])([1-9]|10)\s*COST(?:[^\d]|$)/)
      || textClean.match(/COST\s*([1-9]|10)/)
      || textClean.match(/\b([3-6])\s*LIFE\b/)
      || textClean.match(/\bLIFE\s*([3-6])\b/);
    const detectedCost = costMatch ? Number(costMatch[1] || costMatch[2]) : null;

    // SINAL 7: Contra-Ataque / Counter (+1000, +2000)
    let detectedCounter: number | null = null;
    if (/(?:COUNTER\s*)?\+\s*2[0O,.\s]{3,4}|\b2[0O]{3}\s*COUNTER\b/i.test(textClean)) {
      detectedCounter = 2000;
    } else if (/(?:COUNTER\s*)?\+\s*1[0O,.\s]{3,4}|\b1[0O]{3}\s*COUNTER\b/i.test(textClean)) {
      detectedCounter = 1000;
    }

    // SINAL 8: Trigger detectado
    const hasTrigger = textClean.includes('TRIGGER');

    // SINAL 9: Palavras-chave / Tags de Ação
    const detectedKeywords: string[] = [];
    if (textClean.includes('BLOCKER') || textClean.includes('BLOQUEADOR')) detectedKeywords.push('blocker');
    if (textClean.includes('RUSH') || textClean.includes('INVESTIDA')) detectedKeywords.push('rush');
    if (textClean.includes('ON PLAY') || textClean.includes('AO JOGAR') || textClean.includes('ON PL') || textClean.includes('ON PY')) detectedKeywords.push('on-play');
    if (textClean.includes('ON K.O.') || textClean.includes('ON KO') || textClean.includes('AO SER K.O.')) detectedKeywords.push('on-ko');
    if (textClean.includes('UNBLOCKABLE') || textClean.includes('NOT BE BLOCKED') || textClean.includes('CANNOT BE BLOCKED') || textClean.includes('NÃO PODE SER BLOQUEADA')) detectedKeywords.push('unblockable');
    if (textClean.includes('WHEN ATTACKING') || textClean.includes('AO ATACAR')) detectedKeywords.push('when-attacking');
    if (textClean.includes('DOUBLE ATTACK') || textClean.includes('ATAQUE DUPLO')) detectedKeywords.push('double-attack');
    if (textClean.includes('BANISH') || textClean.includes('BANIMENTO')) detectedKeywords.push('banish');

    // SINAL 10: Subtipos / Afiliações
    const detectedSubtypes = KNOWN_SUBTYPES.filter((sub) => textClean.includes(sub));

    // SINAL 11: Cores (Color Wheel: Red, Green, Blue, Purple, Black, Yellow)
    const detectedColors: CardColor[] = [];
    if (/\bRED\b/.test(textClean) || /\bVERMELHO\b/.test(textClean)) detectedColors.push('RED');
    if (/\bGREEN\b/.test(textClean) || /\bVERDE\b/.test(textClean)) detectedColors.push('GREEN');
    if (/\bBLUE\b/.test(textClean) || /\bAZUL\b/.test(textClean)) detectedColors.push('BLUE');
    if (/\bPURPLE\b/.test(textClean) || /\bROXO\b/.test(textClean)) detectedColors.push('PURPLE');
    if (/\bBLACK\b/.test(textClean) || /\bPRETO\b/.test(textClean)) detectedColors.push('BLACK');
    if (/\bYELLOW\b/.test(textClean) || /\bAMARELO\b/.test(textClean)) detectedColors.push('YELLOW');
    const detectedColor = detectedColors.length > 0 ? detectedColors[0] : null;

    const currentSignals: DetectedSignals = {
      code: detectedCode,
      set: detectedSet,
      cardType: detectedType,
      attribute: detectedAttribute,
      power: detectedPower,
      cost: detectedCost,
      counter: detectedCounter,
      hasTrigger,
      color: detectedColor,
      colors: detectedColors,
      subtypes: detectedSubtypes,
      keywords: detectedKeywords
    };

    // POOL DE CANDIDATOS:
    // 1. Busca por Nome da Carta com Normalização Robusta
    let candidatePool: Card[] = [];
    for (const card of baseCards) {
      const cleanCardName = normalizeName(card.nameEn);
      const cardUpper = card.nameEn.toUpperCase();

      // BLINDAGEM 2: Se o nome for igual a um Subtipo (ex: "BAROQUE WORKS", "WHITEBEARD PIRATES")
      // e houver outro nome de carta no frame (ex: "Disappointed?" ou "Portgas.D.Ace"), não pegue a carta-subtipo!
      const isSubtypeName = KNOWN_SUBTYPES.includes(cardUpper);
      if (isSubtypeName) {
        if (detectedType === 'CHARACTER' || textClean.includes('CHARACTER')) {
          continue;
        }
        const hasSpecificOtherName = baseCards.some(
          (other) =>
            other.code !== card.code &&
            other.nameEn.length >= 5 &&
            !KNOWN_SUBTYPES.includes(other.nameEn.toUpperCase()) &&
            textCleanNorm.includes(normalizeName(other.nameEn))
        );
        if (hasSpecificOtherName) {
          continue;
        }
      }

      // BLINDAGEM 3: Nomes ultracurtos (ex: "A・O", "IZO", "LEO")
      // Devem estar isolados por word-boundary e exigir ao menos 1 sinal auxiliar para evitar ruído de foco
      if (cleanCardName.length < 4) {
        const shortRegex = new RegExp(`\\b${cleanCardName.replace(/\\s+/g, '\\s+')}\\b`);
        if (shortRegex.test(textCleanNorm) && (detectedCost !== null || detectedPower !== null || detectedSet !== null)) {
          candidatePool.push(card);
        }
      } else if (cleanCardName.includes(' ')) {
        if (textCleanNorm.includes(cleanCardName) || textClean.includes(cardUpper)) {
          candidatePool.push(card);
        }
      } else if (cleanCardName.length >= 4) {
        const regex = new RegExp(`\\b${cleanCardName}\\b`);
        if (regex.test(textCleanNorm) || textCleanNorm.includes(cleanCardName)) {
          candidatePool.push(card);
        }
      }
    }

    // 2. Fallback: Se o nome não foi lido com clareza, mas temos Coleção + Poder/Custo/Tipo/Atributo
    if (candidatePool.length === 0 && detectedSet) {
      candidatePool = baseCards.filter((card) => {
        if (card.setId !== detectedSet && !card.code.startsWith(detectedSet.replace('-', ''))) return false;
        let matchCount = 0;
        if (detectedPower !== null && card.power === detectedPower) matchCount++;
        if (detectedCost !== null && card.cost === detectedCost) matchCount++;
        if (detectedType && card.cardType === detectedType) matchCount++;
        if (detectedAttribute && card.attribute === detectedAttribute) matchCount++;
        return matchCount >= 2;
      });
    }

    // 3. Validação Automática por Tipo (Modo AUTO):
    // Se o OCR detectou com clareza 'LEADER', 'EVENT' ou 'STAGE', restringe os candidatos
    // para esse tipo imediatamente, eliminando falsos positivos com cartas de mesmo nome!
    if (scannerMode === 'AUTO' && detectedType && candidatePool.length > 1) {
      const sameTypeCandidates = candidatePool.filter((c) => c.cardType === detectedType);
      if (sameTypeCandidates.length > 0) {
        candidatePool = sameTypeCandidates;
      }
    }

    if (candidatePool.length === 0) return { signals: currentSignals };
    if (candidatePool.length === 1) return { exactCard: candidatePool[0], signals: currentSignals };

    // SCORING MULTI-SINAL PONDERADO
    const scoredCandidates = candidatePool.map((card) => {
      let score = 0;
      const cleanCardName = normalizeName(card.nameEn);

      // Nome
      if (textCleanNorm.includes(cleanCardName) || textClean.includes(card.nameEn.toUpperCase())) {
        score += 10;
      }

      // Código parcial (ex: "006" ou parte do código)
      if (textClean.includes(card.code.toUpperCase())) {
        score += 15;
      } else {
        const codeNum = card.code.split('-')[1];
        if (codeNum && textClean.includes(codeNum)) score += 6;
      }

      // Coleção
      if (detectedSet && (card.setId === detectedSet || card.code.startsWith(detectedSet.replace('-', '')))) {
        score += 6;
      }

      // Tipo de Carta
      if (detectedType && card.cardType === detectedType) {
        score += 4;
      }

      // Atributo
      if (detectedAttribute && card.attribute === detectedAttribute) {
        score += 4;
      }

      // Poder
      if (detectedPower !== null && card.power === detectedPower) {
        score += 4;
      }

      // Custo / Vida
      if (detectedCost !== null && card.cost === detectedCost) {
        score += 4;
      }

      // Counter (com discriminação ativa!)
      if (detectedCounter !== null) {
        if (card.counter === detectedCounter) {
          score += 4;
        } else if (card.counter === null) {
          // Penaliza carta sem counter se um counter explícito (+1000/+2000) foi lido na câmera
          score -= 4;
        }
      }

      // Trigger
      if (hasTrigger && (card.keywordIds.includes('trigger') || card.triggerEn)) {
        score += 3;
      }

      // Palavras-chave
      for (const kw of detectedKeywords) {
        if (card.keywordIds.includes(kw) || (kw === 'unblockable' && card.effectEn?.toUpperCase().includes('BLOCKED'))) {
          score += 3;
        }
      }

      // Subtipos
      for (const st of detectedSubtypes) {
        if (card.subtypes.some((s) => s.toUpperCase().includes(st))) score += 3;
      }

      // Cor / Color Wheel Matching (Prioridade de Desempate entre Versões Homônimas)
      if (detectedColors.length > 0) {
        const matchingColors = card.colors.filter((c) => detectedColors.includes(c));
        if (matchingColors.length > 0) {
          // Bônus proporcional a cada cor detectada
          score += matchingColors.length * 4;
          // Bônus extra se a carta for multicolorida e combinar com todas as cores detectadas
          if (card.colors.length > 1 && matchingColors.length === card.colors.length) {
            score += 4;
          }
        } else {
          // Penalidade se o frame capturou com clareza uma cor que a carta NÃO possui
          score -= 3;
        }
      }

      // Palavras de Efeito (Deduplicadas para evitar que textos longos com repetições inflem o score)
      if (card.effectEn) {
        const uniqueWords = new Set(
          card.effectEn.toUpperCase().split(/[^A-Z0-9]+/).filter((w) => w.length >= 4)
        );
        for (const w of uniqueWords) {
          if (textClean.includes(w)) score += 0.5;
        }
      }

      return { card, score };
    });

    scoredCandidates.sort((a, b) => b.score - a.score);

    const top = scoredCandidates[0];
    const runnerUp = scoredCandidates[1];

    // REGRA DE DECISÃO ESTRITA (ZERO CHUTES):
    // Se temos dois ou mais candidatos:
    if (top && runnerUp) {
      // Se duas cartas compartilham o mesmo nome, mesmo poder e mesmo custo (ex: as duas Yamatos C8/8000),
      // palavras de efeito sozinhas não devem cravar match cego; exige desempate por Counter ou abre o modal!
      const isHomonymSameStat =
        normalizeName(top.card.nameEn) === normalizeName(runnerUp.card.nameEn) &&
        top.card.power === runnerUp.card.power &&
        top.card.cost === runnerUp.card.cost;

      if (!isHomonymSameStat && top.score >= 12 && top.score - runnerUp.score >= 3) {
        return { exactCard: top.card, signals: currentSignals };
      }

      if (isHomonymSameStat && top.score - runnerUp.score >= 5) {
        return { exactCard: top.card, signals: currentSignals };
      }

      // Dúvida ou Empate Técnico: abre tela intermediária com os melhores candidatos
      const topCandidates = scoredCandidates
        .filter((sc) => sc.score >= 8 && sc.score >= top.score - 4)
        .slice(0, 6)
        .map((sc) => sc.card);
      return { candidates: topCandidates, signals: currentSignals };
    }

    // Se só existe 1 candidato no pool
    if (top && !runnerUp) {
      if (top.score >= 8) {
        return { exactCard: top.card, signals: currentSignals };
      }
      return { candidates: [top.card], signals: currentSignals };
    }

    return { signals: currentSignals };
  }, [cards, scannerMode]);

  // Executar 1 reconhecimento instantâneo no frame atual
  const processFrame = useCallback(async () => {
    if (isRecognizing || scannedFeedback || candidateModalCards || !videoRef.current || !canvasRef.current || !workerRef.current) {
      return;
    }

    const video = videoRef.current;
    if (video.readyState < 2 || video.videoWidth === 0) return;

    setIsRecognizing(true);
    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      const vw = video.videoWidth;
      const vh = video.videoHeight;

      // Proporção de carta padrão TCG (63mm x 88mm = ~0.716)
      // Recorte amplo e vertical correspondente à nova moldura expandida
      let cropW = Math.round(vw * 0.86);
      let cropH = Math.round(cropW * (88 / 63));

      if (cropH > vh * 0.88) {
        cropH = Math.round(vh * 0.88);
        cropW = Math.round(cropH * (63 / 88));
      }

      const cropX = Math.round((vw - cropW) / 2);
      const cropY = Math.round((vh - cropH) / 2);

      canvas.width = cropW;
      canvas.height = cropH;

      ctx.drawImage(video, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

      // Aplica o filtro de visão computacional para shield
      enhanceFrameForShield(ctx, cropW, cropH);

      // OCR
      const ret = await workerRef.current.recognize(canvas);
      const detectedText = ret?.data?.text || '';

      const { exactCard, candidates: matchedCandidates, signals } = matchCardMultiSignal(detectedText);
      if (signals) {
        setDetectedSignals(signals);
      }

      if (exactCard) {
        handleCardSelected(exactCard);
      } else if (matchedCandidates && matchedCandidates.length > 0) {
        if (matchedCandidates.length >= 2) {
          // Pausa o scanner e abre a tela intermediária para escolha tranquila!
          window.history.pushState({ view: 'candidates' }, '', '#candidates');
          setCandidateModalCards(matchedCandidates);
        } else if (matchedCandidates.length === 1) {
          handleCardSelected(matchedCandidates[0]);
        }
      }
    } catch (err) {
      // Ignorar delays de frame
    } finally {
      setIsRecognizing(false);
    }
  }, [isRecognizing, scannedFeedback, candidateModalCards, matchCardMultiSignal, handleCardSelected]);

  // Loop Contínuo de Reconhecimento OCR (a cada 900ms)
  useEffect(() => {
    if (!hasCamera || !ocrReady || !isScanning || candidateModalCards) return;

    const interval = setInterval(() => {
      processFrame();
    }, 950);

    return () => clearInterval(interval);
  }, [hasCamera, ocrReady, isScanning, candidateModalCards, processFrame]);

  return (
    <div className="relative w-full flex-1 h-full min-h-0 bg-slate-950 overflow-hidden flex flex-col justify-between items-center select-none">
      {/* Feed da Câmera ou Tela de Fallback */}
      {hasCamera ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
      ) : (
        /* Tela de Permissão / Solicitação de Câmera */
        <div className="absolute inset-0 z-0 flex flex-col items-center justify-center p-6 bg-slate-950 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#0e1320] border border-sky-500/30 flex items-center justify-center mb-3 shadow-xl">
            {cameraLoading ? (
              <RefreshCw className="w-8 h-8 text-amber-400 animate-spin" />
            ) : (
              <Camera className="w-8 h-8 text-sky-400 animate-pulse" />
            )}
          </div>

          <h3 className="text-base font-bold text-white font-heading">
            {cameraLoading ? 'Conectando Câmera...' : 'Câmera Indisponível'}
          </h3>

          <p className="text-xs text-slate-400 max-w-xs mt-1 leading-relaxed">
            {cameraError || 'Aponte a câmera para a carta (mesmo no shield fosco) e o sistema lerá o efeito em português automaticamente.'}
          </p>

          <button
            onClick={() => reloadCamera()}
            disabled={cameraLoading}
            className="mt-5 px-6 py-3.5 bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-500 hover:to-sky-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-sky-950/50 active:scale-95 transition-all flex items-center gap-2 font-heading"
          >
            <RefreshCw className={`w-4 h-4 ${cameraLoading ? 'animate-spin' : ''}`} />
            {cameraLoading ? 'Conectando...' : 'Recarregar Câmera'}
          </button>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />

      {/* Visor HUD Limpo e Cristalino (Sem Blur dentro da Carta) */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-center p-2">
        {/* Seletor Rápido de Tipo de Carta (Pílulas Ergonômicas do Design System) */}
        <div className="flex items-center gap-1.5 p-1 bg-[#090d16]/90 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl pointer-events-auto mb-2.5 z-30 overflow-x-auto no-scrollbar max-w-[95vw]">
          {[
            { id: 'AUTO', label: '🪄 Auto', desc: 'Detecção Automática' },
            { id: 'CHARACTER', label: '⚔️ Personagem', desc: 'Com Poder/Counter' },
            { id: 'LEADER', label: '👑 Líder', desc: 'Líder com Vida' },
            { id: 'EVENT', label: '⚡ Evento', desc: 'Sem Poder/Counter' },
            { id: 'STAGE', label: '🏛️ Palco', desc: 'Palco' }
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => handleModeChange(mode.id as any)}
              className={`pill-tab ${
                scannerMode === mode.id ? 'pill-tab-active' : 'pill-tab-inactive'
              }`}
              title={mode.desc}
            >
              {mode.label}
            </button>
          ))}
        </div>

        {/* Moldura Ampliada com Proporção de Carta Real (90vw / max 370px) + Tap-to-Focus */}
        <div
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            triggerFocus(e.clientX, e.clientY, rect);
          }}
          className="relative w-[90vw] max-w-[370px] aspect-[63/88] rounded-2xl border-2 border-sky-500/60 shadow-[0_0_30px_rgba(2,132,199,0.25)] flex flex-col items-center justify-between p-3 bg-transparent transition-all duration-300 pointer-events-auto cursor-crosshair overflow-hidden"
          title="Toque na tela para focar a câmera na carta"
        >
          {/* Anel de Foco Tátil Interativo (Tap-to-Focus) */}
          {focusRing && (
            <div
              className="absolute pointer-events-none w-14 h-14 -translate-x-1/2 -translate-y-1/2 border-2 border-amber-400 rounded-full animate-ping shadow-[0_0_15px_rgba(251,191,36,0.9)] z-40"
              style={{ left: focusRing.x, top: focusRing.y }}
            />
          )}

          {/* Retículos de Cantoneira no Formato da Carta */}
          <div className="reticle-corner -top-1.5 -left-1.5 border-t-4 border-l-4 rounded-tl-xl w-5 h-5 border-amber-400" />
          <div className="reticle-corner -top-1.5 -right-1.5 border-t-4 border-r-4 rounded-tr-xl w-5 h-5 border-amber-400" />
          <div className="reticle-corner -bottom-1.5 -left-1.5 border-b-4 border-l-4 rounded-bl-xl w-5 h-5 border-amber-400" />
          <div className="reticle-corner -bottom-1.5 -right-1.5 border-b-4 border-r-4 rounded-br-xl w-5 h-5 border-amber-400" />

          {/* ================================================================= */}
          {/* RELEVO ANATÔMICO ADAPTATIVO ("GHOST WIREFRAME") ILUMINADO POR OCR */}
          {/* ================================================================= */}
          {(() => {
            const effectiveType = scannerMode === 'AUTO' 
              ? (detectedSignals?.cardType || 'CHARACTER') 
              : scannerMode;

            const hasCost = detectedSignals?.cost !== null && detectedSignals?.cost !== undefined;
            const hasPower = detectedSignals?.power !== null && detectedSignals?.power !== undefined;
            const hasCounter = Boolean(detectedSignals?.counter);
            const hasCode = Boolean(detectedSignals?.code);

            return (
              <>
                {/* 1. Relevo de Custo (Topo Esquerdo - Não existe em Líderes) */}
                {effectiveType !== 'LEADER' && (
                  <div className={`absolute top-3 left-3 w-10 h-10 rounded-full flex flex-col items-center justify-center pointer-events-none transition-all duration-300 ${
                    hasCost
                      ? 'border-2 border-emerald-400 bg-emerald-950/70 text-emerald-200 shadow-[0_0_14px_rgba(52,211,153,0.7)] scale-105'
                      : 'border border-dashed border-sky-400/40 bg-sky-950/20 text-sky-300/80'
                  }`}>
                    <span className="text-[7px] font-black tracking-widest uppercase">Custo</span>
                    <span className="text-[10px] font-mono font-bold leading-none">
                      {hasCost ? detectedSignals?.cost : '★'}
                    </span>
                  </div>
                )}

                {/* 2. Relevo de Poder & Atributo (Topo Direito - Personagens e Líderes) */}
                {(effectiveType === 'CHARACTER' || effectiveType === 'LEADER') && (
                  <div className={`absolute top-3 right-3 px-2 py-1 rounded-xl flex flex-col items-center justify-center pointer-events-none transition-all duration-300 ${
                    hasPower
                      ? 'border-2 border-amber-400 bg-amber-950/70 text-amber-200 shadow-[0_0_14px_rgba(251,191,36,0.7)] scale-105'
                      : 'border border-dashed border-amber-400/40 bg-amber-950/20 text-amber-300/80'
                  }`}>
                    <span className="text-[7px] font-black tracking-wider uppercase flex items-center gap-0.5">
                      ⚡ Poder
                    </span>
                    <span className="text-[9px] font-mono font-bold leading-none">
                      {hasPower ? detectedSignals?.power : (effectiveType === 'LEADER' ? '5000' : 'PWR')}
                    </span>
                  </div>
                )}

                {/* 3. Relevo de Counter (Lateral Esquerda Central - Exclusivo de Personagens) */}
                {effectiveType === 'CHARACTER' && (
                  <div className={`absolute top-1/2 -translate-y-1/2 left-2 px-1 py-2 rounded-lg flex flex-col items-center justify-center pointer-events-none transition-all duration-300 ${
                    hasCounter
                      ? 'border-2 border-cyan-400 bg-cyan-950/70 text-cyan-200 shadow-[0_0_14px_rgba(6,182,212,0.7)] scale-105'
                      : 'border border-dashed border-cyan-400/40 bg-cyan-950/20 text-cyan-300/80'
                  }`}>
                    <span className="text-[7px] font-black [writing-mode:vertical-lr] rotate-180 uppercase tracking-widest">
                      {hasCounter ? `+${detectedSignals?.counter}` : '+Counter 🛡️'}
                    </span>
                  </div>
                )}

                {/* 4. Relevo da Color Wheel (Canto Inferior Esquerdo - Presente em todas as cartas) */}
                <div className={`absolute bottom-3 left-3 w-8 h-8 rounded-xl flex flex-col items-center justify-center pointer-events-none transition-all duration-300 ${
                  detectedSignals?.color || (detectedSignals?.colors && detectedSignals.colors.length > 0)
                    ? 'border-2 border-purple-400 bg-purple-950/70 text-purple-200 shadow-[0_0_14px_rgba(192,132,252,0.7)]'
                    : 'border border-dashed border-purple-400/40 bg-purple-950/20 text-purple-300/80'
                }`}>
                  <span className="text-[7px] font-black leading-none uppercase tracking-tighter">Cor</span>
                  <span className="text-[9px] leading-none mt-0.5 font-bold">
                    {detectedSignals?.color ? detectedSignals.color[0] : '⬡'}
                  </span>
                </div>

                {/* 5. Relevo do Canto Inferior Direito: Vida em Líderes ou Código em outras */}
                {effectiveType === 'LEADER' ? (
                  <div className="absolute bottom-3 right-3 px-2 py-1 rounded-xl border border-dashed border-red-500/50 bg-red-950/30 flex flex-col items-center justify-center pointer-events-none transition-all duration-300">
                    <span className="text-[7px] font-black text-red-300 uppercase tracking-wider flex items-center gap-0.5">
                      ❤️ Vida
                    </span>
                    <span className="text-[9px] font-mono font-black text-white">4 / 5</span>
                  </div>
                ) : (
                  <div className={`absolute bottom-3 right-3 px-2 py-0.5 rounded-md flex flex-col items-center justify-center pointer-events-none transition-all duration-300 ${
                    hasCode
                      ? 'border-2 border-sky-400 bg-sky-950/80 text-sky-200 shadow-[0_0_14px_rgba(56,189,248,0.7)] font-black scale-105'
                      : 'border border-dashed border-sky-400/40 bg-sky-950/20 text-sky-300/70'
                  }`}>
                    <span className="text-[8px] font-mono font-bold tracking-wider">
                      {hasCode ? detectedSignals?.code : 'OP##-###'}
                    </span>
                  </div>
                )}
              </>
            );
          })()}

          {/* Barra de Controles Rápidos Flutuantes (Foco, Lanterna, Recarregar Câmera) */}
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-30 pointer-events-auto">
            {/* Botão de Refoco Manual */}
            {hasCamera && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  triggerFocus();
                }}
                className={`w-9 h-9 rounded-xl border flex items-center justify-center shadow-lg active:scale-90 transition-all ${
                  focusSupported
                    ? 'bg-slate-900/90 border-amber-500/30 text-amber-400'
                    : 'bg-slate-900/90 border-white/10 text-slate-300 hover:text-white'
                }`}
                title={focusSupported ? 'Ajustar Foco da Câmera (Hardware com Foco Contínuo)' : 'Ajustar Foco da Câmera'}
              >
                <Focus className="w-4 h-4" />
              </button>
            )}

            {/* Botão de Lanterna (Torch) */}
            {torchAvailable && hasCamera && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleTorch();
                }}
                className={`w-9 h-9 rounded-xl border flex items-center justify-center shadow-lg transition-all active:scale-90 ${
                  torchOn
                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.9)]'
                    : 'bg-slate-900/90 text-slate-300 border-white/10 hover:text-white'
                }`}
                title={torchOn ? 'Desligar Lanterna' : 'Ligar Lanterna (Anti-Sombra)'}
              >
                <Zap className="w-4 h-4 fill-current" />
              </button>
            )}

            {/* Botão Único de Recarregar Câmera (gira enquanto carrega ao entrar ou ao clicar) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (navigator.vibrate) navigator.vibrate(20);
                reloadCamera();
              }}
              disabled={cameraLoading}
              className={`w-9 h-9 rounded-xl border flex items-center justify-center shadow-lg active:scale-90 transition-all ${
                cameraLoading
                  ? 'bg-slate-900/95 border-amber-500/50 text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.4)]'
                  : 'bg-slate-900/90 border-slate-700 text-slate-300 hover:text-white hover:border-slate-500'
              }`}
              title={cameraLoading ? 'Iniciando sensor da câmera...' : 'Recarregar Câmera'}
            >
              <RefreshCw className={`w-4 h-4 ${cameraLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Feixe de Laser de Escaneamento Animado */}
          {isScanning && hasCamera && <div className="animate-scan-beam" />}

          {/* Badge Instrução Flutuante no Rodapé da Moldura */}
          <div className="px-4 py-2 rounded-xl bg-slate-950/95 border border-sky-400/40 text-xs font-bold text-slate-100 tracking-wider shadow-xl flex items-center gap-1.5 pointer-events-none mt-auto mb-2">
            {cameraLoading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                <span>Conectando Câmera...</span>
              </>
            ) : isRecognizing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 text-sky-400 animate-spin" />
                <span>Lendo Carta...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>Toque para focar ou alinhe a carta</span>
              </>
            )}
          </div>
        </div>

        {/* Badges de Sinais Detectados no Frame em Tempo Real (Limpos e Polidos) */}
        {detectedSignals && !scannedFeedback && (
          <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 max-w-xs">
            {detectedSignals.set && (
              <span className="pill-badge pill-badge-sky font-mono text-[10px]">
                {detectedSignals.set}
              </span>
            )}
            {detectedSignals.cardType && (
              <span className="pill-badge pill-badge-blue text-[10px]">
                {detectedSignals.cardType}
              </span>
            )}
            {detectedSignals.attribute && (
              <span className="pill-badge pill-badge-emerald text-[10px]">
                {detectedSignals.attribute}
              </span>
            )}
            {detectedSignals.cost !== null && detectedSignals.cost !== undefined && (
              <span className="pill-badge pill-badge-amber text-[10px]">
                {detectedSignals.cardType === 'LEADER' ? `Vida: ${detectedSignals.cost}` : `Custo: ${detectedSignals.cost}`}
              </span>
            )}
            {detectedSignals.power !== null && detectedSignals.power !== undefined && (
              <span className="pill-badge pill-badge-red text-[10px]">
                Poder: {detectedSignals.power}
              </span>
            )}
            {detectedSignals.counter !== null && detectedSignals.counter !== undefined && (
              <span className="pill-badge pill-badge-blue text-[10px]">
                +{detectedSignals.counter}
              </span>
            )}
            {detectedSignals.hasTrigger && (
              <span className="pill-badge pill-badge-amber text-[10px]">
                Trigger
              </span>
            )}
            {detectedSignals.color && (
              <span className="pill-badge pill-badge-slate text-[10px]">
                {detectedSignals.color}
              </span>
            )}
            {detectedSignals.keywords && detectedSignals.keywords.map((kw) => (
              <span key={kw} className="pill-badge pill-badge-slate text-[10px]">
                [{kw.toUpperCase()}]
              </span>
            ))}
          </div>
        )}

        {/* Banner de Sucesso de Leitura */}
        {scannedFeedback && (
          <div className="mt-4 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black rounded-lg text-sm shadow-xl shadow-emerald-500/50 flex items-center gap-2 animate-bounce">
            ✓ Carta Identificada: {scannedFeedback}
          </div>
        )}
      </div>

      {/* Modal Intermediário de Seleção de Candidatos (Pausa a câmera para escolha tranquila) */}
      {candidateModalCards && candidateModalCards.length > 0 && (
        <CandidateModal
          candidates={candidateModalCards}
          signals={detectedSignals || undefined}
          onSelectCard={(card) => {
            if (window.location.hash === '#candidates') {
              window.history.replaceState({ view: 'card', code: card.code }, '', `#card=${card.code}`);
            }
            setCandidateModalCards(null);
            handleCardSelected(card);
          }}
          onClose={() => {
            if (window.location.hash === '#candidates') {
              window.history.back();
            } else {
              setCandidateModalCards(null);
            }
          }}
        />
      )}
    </div>
  );
};
