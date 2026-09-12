/**
 * Módulo de Tradução Inteligente via Google Gemini Flash API.
 * Integrado ao Haki da Leitura para tradução contextual do One Piece Card Game.
 */

const CANDIDATE_MODELS = [
  'gemini-3.8-flash',
  'gemini-3.7-flash',
  'gemini-3.6-flash',
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
  'gemini-3-flash-preview',
  'gemini-flash-latest',
  'gemini-2.5-flash-lite',
  'gemini-2.5-flash',
  'gemini-3.1-pro-preview',
  'gemini-2.5-pro'
];

const SYSTEM_INSTRUCTION = `
Você é um tradutor especialista oficial do jogo de cartas One Piece Card Game (OPTCG) para o Português do Brasil (PT-BR).
Sua função é traduzir os nomes em inglês (nameEn), efeitos (effectEn) e gatilhos (triggerEn) das cartas enviadas em lote para o português fluente e preciso.

REGRAS DE OURO E GLOSSÁRIO OBRIGATÓRIO DE TERMINOLOGIA DE OPTCG:
1. Deck: Mantido SEMPRE como "Deck" (NUNCA traduza como "baralho").
2. Trash:
   - Zona física no campo: "Lixeira" (ex: "jogue da sua lixeira", "na sua lixeira").
   - Ação ou custo: "Descartar" (ex: "Você pode descartar 1 carta da sua mão").
3. Rest / Rested: "Descansar" / "Descansado(a)" (ex: "descanse este Personagem", "Personagem descansado").
4. Active: "Ativo(a)" ou "como ativa" (ex: "coloque até 1 carta de DON!! como ativa").
5. Life Cards: "Cartas de Vida" (ou "Vida").
6. K.O.: Mantido como "K.O." / "Dê K.O." / "Nocauteado".
7. DON!! Cards: Mantido como "cartas de DON!!" ou "DON!!".
8. Atributos de Batalha: Mantidos SEMPRE em inglês com tags: <Slash>, <Strike>, <Special>, <Ranged>, <Wisdom>.
9. Tags de Efeito e Gatilhos: Preservadas em colchetes em inglês para alinhamento com a carta física: [On Play], [When Attacking], [Your Turn], [Opponent's Turn], [Activate: Main], [Counter], [Trigger], [Blocker], [Rush], [Double Attack], [Banish], [Once Per Turn], [Main], [On K.O.], [On Block], [On Your Opponent's Attack], [Unblockable].
10. Cores das Cartas: Vermelho(a), Azul, Verde, Roxo(a), Preto(a), Amarelo(a).

EXEMPLOS DE TRANSLACÃO (FEW-SHOT):
- Entrada: { "code": "OP01-001", "nameEn": "Roronoa Zoro", "effectEn": "[Activate: Main] [Once Per Turn] Give your Leader or 1 of your Characters up to 1 rested DON!! card." }
  Saída: { "code": "OP01-001", "namePt": "Roronoa Zoro", "effectPt": "[Activate: Main] [Once Per Turn] Dê ao seu Líder ou a 1 dos seus Personagens até 1 carta de DON!! descansada." }
- Entrada: { "code": "OP01-016", "nameEn": "Nami", "effectEn": "[On Play] Look at 5 cards from the top of your deck; reveal up to 1 {Straw Hat Crew} type card other than [Nami] and add it to your hand. Then, place the remaining cards at the bottom of your deck in any order." }
  Saída: { "code": "OP01-016", "namePt": "Nami", "effectPt": "[On Play] Olhe até 5 cartas do topo do seu Deck; revele até 1 carta do tipo {Bando do Chapéu de Palha} diferente de [Nami] e adicione-a à sua mão. Em seguida, coloque as cartas restantes no fundo do seu Deck em qualquer ordem." }

FORMATO DE RESPOSTA OBRIGATÓRIO:
Retorne APENAS um array JSON válido contendo objetos no seguinte formato, sem formatação markdown extra fora da resposta de texto:
[
  {
    "code": "CÓDIGO_DA_CARTA",
    "namePt": "NOME_EM_PORTUGUÊS",
    "effectPt": "EFEITO_EM_PORTUGUÊS",
    "triggerPt": "GATILHO_EM_PORTUGUÊS_OU_UNDEFINED"
  }
]
`;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function extractRetryDelay(errorText, defaultDelayMs = 15000) {
  try {
    const json = JSON.parse(errorText);
    const details = json?.error?.details || [];
    for (const d of details) {
      if (d?.retryDelay) {
        const sec = parseFloat(String(d.retryDelay).replace('s', ''));
        if (!isNaN(sec) && sec > 0) return Math.ceil(sec * 1000) + 2000;
      }
    }
    const msg = json?.error?.message || errorText;
    const match = msg.match(/retry in (\d+(?:\.\d+)?)s/i);
    if (match && match[1]) {
      const sec = parseFloat(match[1]);
      if (!isNaN(sec) && sec > 0) return Math.ceil(sec * 1000) + 2000;
    }
  } catch (e) {}
  return defaultDelayMs;
}

let activeModelIndex = 0;

/**
 * Retorna o nome do modelo atualmente ativo no ciclo de tradução.
 * @returns {string}
 */
export function getActiveModelName() {
  return CANDIDATE_MODELS[activeModelIndex] || CANDIDATE_MODELS[CANDIDATE_MODELS.length - 1];
}

/**
 * Reinicia o índice do modelo ativo para o primeiro candidato (útil para testes ou novos ciclos).
 */
export function resetActiveModelIndex() {
  activeModelIndex = 0;
}

/**
 * Traduz um lote de cartas utilizando a API do Google Gemini Flash com fallback automático e retentativas em 503/429.
 * Mantém em memória o último modelo que respondeu com sucesso, reutilizando-o nos lotes seguintes até que falhe.
 * @param {Array<{code: string, nameEn: string, effectEn: string, triggerEn?: string}>} batch
 * @param {string} apiKey
 * @returns {Promise<Array<{code: string, namePt: string, effectPt: string, triggerPt?: string}>>}
 */
export async function translateBatchWithGemini(batch, apiKey) {
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY não foi informada.');
  }

  if (!batch || batch.length === 0) {
    return [];
  }

  const promptText = `Traduza o seguinte lote de ${batch.length} cartas de One Piece TCG para o português respeitando rigorosamente as regras de terminologia:\n\n${JSON.stringify(batch, null, 2)}`;

  const payload = {
    systemInstruction: {
      parts: [{ text: SYSTEM_INSTRUCTION }]
    },
    contents: [
      {
        role: 'user',
        parts: [{ text: promptText }]
      }
    ],
    generationConfig: {
      temperature: 0.1,
      responseMimeType: 'application/json'
    }
  };

  let lastError = null;

  for (let i = activeModelIndex; i < CANDIDATE_MODELS.length; i++) {
    const modelName = CANDIDATE_MODELS[i];
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${encodeURIComponent(apiKey)}`;

    const maxRetries = 6;
    const defaultDelays = [4000, 8000, 12000, 16000, 20000, 30000];

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const errorText = await response.text();
          if (response.status === 404) {
            console.warn(`  ⚠️ Modelo ${modelName} não encontrado (HTTP 404). Alternando para o próximo modelo candidato...`);
            lastError = new Error(`HTTP 404: Modelo ${modelName} não encontrado.`);
            activeModelIndex = i + 1;
            break;
          }

          if ((response.status === 503 || response.status === 429 || response.status >= 500) && attempt < maxRetries) {
            // Se for estouro de cota diária do modelo (ex: limit 20 RPD do 3.6-flash), alterna para o próximo modelo sem esperar 6x60s
            if (errorText.includes('PerDay') || errorText.includes('Quota exceeded for metric')) {
              console.warn(`  ⚠️ Cota diária do modelo ${modelName} esgotada no Free Tier. Alternando imediatamente para o próximo modelo candidato...`);
              lastError = new Error(`Cota diária do modelo ${modelName} esgotada.`);
              activeModelIndex = i + 1;
              break; // passa para o próximo modelo da lista CANDIDATE_MODELS
            }

            const calculatedDelay = extractRetryDelay(errorText, defaultDelays[attempt - 1] || 25000);
            console.warn(`  ⚠️ Gemini API HTTP ${response.status} (${modelName}). Tentativa ${attempt}/${maxRetries} falhou. Aguardando ${calculatedDelay / 1000}s conforme indicado pela API...`);
            await sleep(calculatedDelay);
            continue;
          }

          console.warn(`  ⚠️ Modelo ${modelName} falhou com HTTP ${response.status}. Alternando para o próximo modelo candidato...`);
          lastError = new Error(`HTTP ${response.status}: ${errorText}`);
          activeModelIndex = i + 1;
          break;
        }

        const data = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!rawText) {
          throw new Error('Resposta vazia recebida do Gemini.');
        }

        let parsed;
        try {
          parsed = JSON.parse(rawText);
        } catch (err) {
          const cleanJson = rawText.replace(/```json\s*/gi, '').replace(/```\s*$/gi, '').trim();
          parsed = JSON.parse(cleanJson);
        }

        // Fixa o modelo atual que respondeu com sucesso para os próximos lotes
        activeModelIndex = i;
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch (err) {
        lastError = err;
        if (err.message.includes('HTTP 404')) {
          activeModelIndex = i + 1;
          break;
        }
        if (attempt < maxRetries && (err.message.includes('503') || err.message.includes('429'))) {
          const calculatedDelay = extractRetryDelay(err.message, defaultDelays[attempt - 1] || 25000);
          console.warn(`  ⚠️ Tentativa ${attempt}/${maxRetries} falhou com erro temporário (${err.message.slice(0, 50)}). Aguardando ${calculatedDelay / 1000}s...`);
          await sleep(calculatedDelay);
          continue;
        }

        if (attempt === maxRetries) {
          console.warn(`  ⚠️ Esgotadas todas as ${maxRetries} tentativas para o modelo ${modelName}. Alternando para o próximo modelo candidato...`);
          activeModelIndex = i + 1;
          break;
        }
      }
    }
  }

  throw lastError || new Error('Nenhum modelo Gemini Flash respondeu com sucesso (todos os modelos candidatos foram esgotados).');
}
