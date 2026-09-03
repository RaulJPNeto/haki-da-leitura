/**
 * Script de Tradução Ultra-Exaustiva de Cartas de One Piece TCG
 * Traduz do original em inglês (effectEn / triggerEn) em ordem rigorosa de precedência.
 * Preserva 'Deck', trata 'trash' (verbo vs substantivo), 'rest/active', timing e gramática formal.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cardsBaseDir = path.resolve(__dirname, '..', 'src', 'data', 'cards');
import { TRAIT_TRANSLATIONS } from './traits.js';


export function translateText(en) {
  if (!en) return '';
  let t = en;

  // 1. Tags de Efeito e Gatilhos
  t = t.replace(/\[On Play\]/gi, '[Ao Jogar]');
  t = t.replace(/\[When Attacking\]/gi, '[Ao Atacar]');
  t = t.replace(/\[Your Turn\]/gi, '[Seu Turno]');
  t = t.replace(/\[Opponent's Turn\]/gi, '[Turno do Oponente]');
  t = t.replace(/\[End of Your Turn\]/gi, '[Fim do Seu Turno]');
  t = t.replace(/\[End of Opponent's Turn\]/gi, '[Fim do Turno do Oponente]');
  t = t.replace(/\[On Your Opponent's Attack\]/gi, '[No Ataque do Oponente]');
  t = t.replace(/\[Activate: Main\]/gi, '[Ativar: Principal]');
  t = t.replace(/\[Counter\]/gi, '[Contra-Ataque]');
  t = t.replace(/\[Trigger\]/gi, '[Gatilho]');
  t = t.replace(/\[Blocker\]/gi, '[Bloqueador]');
  t = t.replace(/\[Rush\]/gi, '[Investida]');
  t = t.replace(/\[Double Attack\]/gi, '[Ataque Duplo]');
  t = t.replace(/\[Banish\]/gi, '[Banimento]');
  t = t.replace(/\[Once Per Turn\]/gi, '[1 Vez por Turno]');
  t = t.replace(/\[Main\]/gi, '[Principal]');
  t = t.replace(/\[On K\.O\.\]/gi, '[Ao Ser K.O.]');
  t = t.replace(/\[On Block\]/gi, '[Ao Bloquear]');

  // 2. Parênteses explicativos e regras de DON!! -X
  t = t.replace(/\(You may return the specified number of DON!! cards from your field to your DON!! deck\.\)/gi, '(Você pode retornar o número especificado de cartas de DON!! do seu campo para o seu Deck de DON!!.)');
  t = t.replace(/\(You may return the specified number of DON!! cards from your field to your DON!! deck\)/gi, '(Você pode retornar o número especificado de cartas de DON!! do seu campo para o seu Deck de DON!!)');
  t = t.replace(/\(This card can attack on the turn in which it is played\.\)/gi, '(Esta carta pode atacar no turno em que é jogada.)');
  t = t.replace(/\(After your opponent declares an attack, you may rest this card to make it the new target of the attack\.\)/gi, '(Após o oponente declarar um ataque, você pode descansar esta carta para torná-la o novo alvo do ataque.)');
  t = t.replace(/\(This card deals (\d+) damage to Life\.\)/gi, '(Esta carta causa $1 de dano à Vida.)');
  t = t.replace(/\(When this card deals damage, the target card is trashed without activating its Trigger\.\)/gi, '(Quando esta carta causa dano, a carta alvo é descartada sem ativar seu Gatilho.)');

  // 2.1 Regras de Nomes Alternativos e Regras de Jogo (Under the rules of this game)
  t = t.replace(/Under the rules of this game,\s*also treat this card's name as\s*\[([^\]]+)\](?:\s*and\s*\[([^\]]+)\])?\./gi, (m, p1, p2) => {
    return `De acordo com as regras deste jogo, o nome desta carta também é considerado [${p1}]${p2 ? ` e [${p2}]` : ''}.`;
  });
  t = t.replace(/Under the rules of this game,\s*also treat this card's name as\s*\[([^\]]+)\](?:\s*and\s*\[([^\]]+)\])?/gi, (m, p1, p2) => {
    return `De acordo com as regras deste jogo, o nome desta carta também é considerado [${p1}]${p2 ? ` e [${p2}]` : ''}`;
  });
  t = t.replace(/Under the rules of this game/gi, 'De acordo com as regras deste jogo');
  t = t.replace(/also treat this card's name as/gi, "o nome desta carta também é considerado");
  t = t.replace(/treat this card's name as/gi, "o nome desta carta é considerado");
  t = t.replace(/also treats this card's name as/gi, "o nome desta carta também é considerado");

  // 2.2 Rush de Personagem e Ataque
  t = t.replace(/\[Rush: Character\]/gi, '[Investida: Personagem]');
  t = t.replace(/\(This card can attack Characters on the turn in which it is played\.\)/gi, '(Esta carta pode atacar Personagens no turno em que é jogada.)');
  t = t.replace(/\(this card can attack Characters on the turn in which it is played\.\)/gi, '(Esta carta pode atacar Personagens no turno em que é jogada.)');
  t = t.replace(/can attack Characters on the turn in which it is played/gi, 'pode atacar Personagens no turno em que é jogada');
  t = t.replace(/on the turn in which it is played/gi, 'no turno em que é jogada');

  // 2.3 Efeitos de Substituição de Remoção (OP15, OP11, ST22, etc.)
  t = t.replace(/If your Character with (\d+) base power or less would be removed from the field by your opponent's effect, you may (.+?) instead\./gi, 'Se um Personagem seu com poder base de $1 ou menos for ser removido de campo por um efeito do seu oponente, você pode $2 em vez disso.');
  t = t.replace(/If your Character with a base cost of (\d+) or less (.+?) would be removed from the field by your opponent's effect, you may (.+?) instead\./gi, 'Se um Personagem seu com custo base de $1 ou menos $2 for ser removido de campo por um efeito do seu oponente, você pode $3 em vez disso.');
  t = t.replace(/If this Character would be removed from the field by your opponent's effect, you may (.+?) instead\./gi, 'Se este Personagem for ser removido de campo por um efeito do seu oponente, você pode $1 em vez disso.');
  t = t.replace(/If one of your Characters would be removed from the field by your opponent's effect, you may (.+?) instead\./gi, 'Se um de seus Personagens for ser removido de campo por um efeito do seu oponente, você pode $1 em vez disso.');
  t = t.replace(/would be removed from the field by your opponent's effect/gi, 'for ser removido de campo por um efeito do seu oponente');
  t = t.replace(/would be removed from the field/gi, 'for ser removido de campo');

  // 2.4 Alvo do Ataque e DON!! Concedido
  t = t.replace(/Change the target of the attack to\s*\[([^\]]+)\]/gi, 'Mude o alvo do ataque para [$1]');
  t = t.replace(/Change the target of the attack to/gi, 'Mude o alvo do ataque para');
  t = t.replace(/When this Leader or any of your Characters is given a DON!! card/gi, 'Quando este Líder ou qualquer um dos seus Personagens receber uma carta de DON!!');
  t = t.replace(/is given a DON!! card/gi, 'receber uma carta de DON!!');
  t = t.replace(/are given a DON!! card/gi, 'receberem uma carta de DON!!');
  t = t.replace(/is given DON!! cards/gi, 'receber cartas de DON!!');

  // 2.5 Custo e Restauração de Área
  t = t.replace(/rest the specified number of DON!! cards in your cost area/gi, 'descanse o número especificado de cartas de DON!! na sua área de custo');
  t = t.replace(/the specified number of DON!! cards in your cost area/gi, 'o número especificado de cartas de DON!! na sua área de custo');
  t = t.replace(/in your cost area/gi, 'na sua área de custo');
  t = t.replace(/will not become active in the next Refresh Phase/gi, 'não ficará ativo na próxima Fase de Restauração');
  t = t.replace(/during your opponent's next Refresh Phase/gi, 'na próxima Fase de Restauração do seu oponente');
  t = t.replace(/in your opponent's next Refresh Phase/gi, 'na próxima Fase de Restauração do seu oponente');
  t = t.replace(/until the end of your opponent's next turn/gi, 'até o fim do próximo turno do seu oponente');
  t = t.replace(/until the end of your opponent's next End Phase/gi, 'até o fim da próxima Fase Final do seu oponente');
  t = t.replace(/at the end of your opponent's next turn/gi, 'no fim do próximo turno do seu oponente');

  // 3. Regras de Wano / Counters especiais
  t = t.replace(/All of your (\{[^}]+\}) type Character cards without a Counter have a \+(\d+) Counter, according to the rules\./gi, 'Todas as suas cartas de Personagem do tipo $1 sem Contra-Ataque têm Contra-Ataque +$2, de acordo com as regras.');
  t = t.replace(/without a Counter have a \+(\d+) Counter, according to the rules\./gi, 'sem Contra-Ataque têm Contra-Ataque +$1, de acordo com as regras.');
  t = t.replace(/without a Counter/gi, 'sem Contra-Ataque');
  t = t.replace(/have a \+(\d+) Counter/gi, 'têm Contra-Ataque +$1');
  t = t.replace(/according to the rules\./gi, 'de acordo com as regras.');
  t = t.replace(/according to the rules/gi, 'de acordo com as regras');

  // 4. DON!! Deck, Retorno e Transferência
  t = t.replace(/When (\d+) or more DON!! cards on your field are returned to your DON!! deck/gi, 'Quando $1 ou mais cartas de DON!! no seu campo forem retornadas para o seu Deck de DON!!');
  t = t.replace(/are returned to your DON!! deck/gi, 'forem retornadas para o seu Deck de DON!!');
  t = t.replace(/are returned to your hand/gi, 'forem retornadas para a sua mão');
  t = t.replace(/Add up to (\d+) DON!! cards? from your DON!! deck and set it as active\./gi, 'Adicione até $1 carta(s) de DON!! do seu Deck de DON!! e coloque-a como ativa.');
  t = t.replace(/Add up to (\d+) DON!! cards? from your DON!! deck and rest it\./gi, 'Adicione até $1 carta(s) de DON!! do seu Deck de DON!! e descanse-a.');
  t = t.replace(/Give up to (\d+) of your currently given DON!! cards to (\d+) of your/gi, 'Dê até $1 das suas cartas de DON!! atualmente anexadas a $2 dos seus');
  t = t.replace(/Give up to (\d+) rested DON!! cards? to your Leader or (\d+) of your Characters\./gi, 'Dê até $1 carta(s) de DON!! descansada(s) ao seu Líder ou a $2 dos seus Personagens.');
  t = t.replace(/Give up to (\d+) rested DON!! cards? to your Leader or up to (\d+) of your Characters\./gi, 'Dê até $1 carta(s) de DON!! descansada(s) ao seu Líder ou a até $2 dos seus Personagens.');
  t = t.replace(/Give up to (\d+) rested DON!! cards? to your Leader\./gi, 'Dê até $1 carta(s) de DON!! descansada(s) ao seu Líder.');
  t = t.replace(/Give up to (\d+) rested DON!! cards? to up to (\d+) of your Characters\./gi, 'Dê até $1 carta(s) de DON!! descansada(s) a até $2 dos seus Personagens.');
  t = t.replace(/Give up to (\d+) rested DON!! cards? to (\d+) of your Leader\./gi, 'Dê até $1 carta(s) de DON!! descansada(s) a $2 do seu Líder.');
  t = t.replace(/Give this Leader or (\d+) of your Characters up to (\d+) rested DON!! cards?\./gi, 'Dê a este Líder ou a até $1 dos seus Personagens até $2 carta(s) de DON!! descansada(s).');
  t = t.replace(/Give up to (\d+) of your Characters up to (\d+) rested DON!! cards?\./gi, 'Dê a até $1 dos seus Personagens até $2 carta(s) de DON!! descansada(s).');
  t = t.replace(/Give this Leader or (\d+) of your Characters up to (\d+) DON!! cards?\./gi, 'Dê a este Líder ou a até $1 dos seus Personagens até $2 carta(s) de DON!!.');
  t = t.replace(/give your (\d+) active Leader [−-](\d+) power during this turn:/gi, 'dê ao seu $1 Líder ativo −$2 de Poder durante este turno:');

  t = t.replace(/from your DON!! deck/gi, 'do seu Deck de DON!!');
  t = t.replace(/from your DON!! area/gi, 'da sua área de DON!!');
  t = t.replace(/to your DON!! deck/gi, 'para o seu Deck de DON!!');
  t = t.replace(/DON!! deck/gi, 'Deck de DON!!');
  t = t.replace(/DON!! area/gi, 'área de DON!!');
  t = t.replace(/currently given DON!! cards/gi, 'cartas de DON!! atualmente anexadas');
  t = t.replace(/currently given/gi, 'atualmente anexada(s)');
  t = t.replace(/given DON!! cards/gi, 'cartas de DON!! anexadas');

  // 5. Triggers de Tempo (When...)
  t = t.replace(/When this Leader attacks or is attacked,/gi, 'Quando este Líder atacar ou for atacado,');
  t = t.replace(/When this Leader attacks or is attacked/gi, 'Quando este Líder atacar ou for atacado');
  t = t.replace(/When this Character attacks or is attacked,/gi, 'Quando este Personagem atacar ou for atacado,');
  t = t.replace(/When this Character attacks or is attacked/gi, 'Quando este Personagem atacar ou for atacado');
  t = t.replace(/When you deal damage to your opponent's Life,/gi, 'Quando você causar dano à Vida do seu oponente,');
  t = t.replace(/When you deal damage to your opponent's Life/gi, 'Quando você causar dano à Vida do seu oponente');
  t = t.replace(/deals damage to your opponent's Life/gi, 'causa dano à Vida do seu oponente');
  t = t.replace(/deal damage to your opponent's Life/gi, 'causar dano à Vida do seu oponente');
  t = t.replace(/deal damage to your opponent/gi, 'causar dano ao seu oponente');
  t = t.replace(/deals damage to your opponent/gi, 'causa dano ao seu oponente');
  t = t.replace(/When this Character is K\.O\.'d by your opponent's effect,/gi, 'Quando este Personagem for nocauteado por um efeito do seu oponente,');
  t = t.replace(/When this Character is K\.O\.'d by an opponent's effect,/gi, 'Quando este Personagem for nocauteado por um efeito do oponente,');
  t = t.replace(/When this Character is K\.O\.'d,/gi, 'Quando este Personagem for nocauteado,');
  t = t.replace(/When your opponent's Character is K\.O\.'d,/gi, 'Quando um Personagem do seu oponente for nocauteado,');
  t = t.replace(/When a Character is K\.O\.'d,/gi, 'Quando um Personagem for nocauteado,');
  t = t.replace(/When this Leader attacks,/gi, 'Quando este Líder atacar,');
  t = t.replace(/When this Character attacks,/gi, 'Quando este Personagem atacar,');
  t = t.replace(/When your opponent attacks,/gi, 'Quando o seu oponente atacar,');
  t = t.replace(/is K\.O\.'d/gi, 'for nocauteado');

  // 6. Proteções contra K.O. e Batalha
  t = t.replace(/would be K\.O\.'d by an effect,/gi, 'for ser nocauteado por um efeito,');
  t = t.replace(/would be K\.O\.'d by an effect/gi, 'for ser nocauteado por um efeito');
  t = t.replace(/would be K\.O\.'d in battle,/gi, 'for ser nocauteado em batalha,');
  t = t.replace(/would be K\.O\.'d in battle/gi, 'for ser nocauteado em batalha');
  t = t.replace(/would be K\.O\.'d,/gi, 'for ser nocauteado,');
  t = t.replace(/would be K\.O\.'d/gi, 'for ser nocauteado');

  t = t.replace(/cannot attack during this turn\./gi, 'não pode atacar durante este turno.');
  t = t.replace(/cannot attack during this turn/gi, 'não pode atacar durante este turno');
  t = t.replace(/cannot attack\./gi, 'não pode atacar.');
  t = t.replace(/cannot attack/gi, 'não pode atacar');
  t = t.replace(/cannot be K\.O\.'d in battle/gi, 'não pode ser nocauteado em batalha');
  t = t.replace(/cannot be K\.O\.'d by your opponent's effects/gi, 'não pode ser nocauteado por efeitos do seu oponente');
  t = t.replace(/cannot be K\.O\.'d by an effect/gi, 'não pode ser nocauteado por um efeito');
  t = t.replace(/cannot be K\.O\.'d/gi, 'não pode ser nocauteado');
  t = t.replace(/cannot be rested/gi, 'não pode ser descansado');
  t = t.replace(/cannot play Character cards during this turn\./gi, 'não pode jogar cartas de Personagem durante este turno.');
  t = t.replace(/cannot play Character cards/gi, 'não pode jogar cartas de Personagem');
  t = t.replace(/cannot activate/gi, 'não pode ativar');
  t = t.replace(/cannot/gi, 'não pode');

  // 7. Ataques e Fases
  t = t.replace(/this Character can attack Characters on the turn in which it is played\./gi, 'este Personagem pode atacar Personagens no turno em que é jogado.');
  t = t.replace(/this Character can attack Characters on the turn in which it is played/gi, 'este Personagem pode atacar Personagens no turno em que é jogado');
  t = t.replace(/this Character can attack on the turn in which it is played\./gi, 'este Personagem pode atacar no turno em que é jogado.');
  t = t.replace(/this Character can attack on the turn in which it is played/gi, 'este Personagem pode atacar no turno em que é jogado');
  t = t.replace(/can attack active Characters\./gi, 'pode atacar Personagens ativos.');
  t = t.replace(/can attack active Characters/gi, 'pode atacar Personagens ativos');
  t = t.replace(/can attack rested Characters\./gi, 'pode atacar Personagens descansados.');
  t = t.replace(/can attack rested Characters/gi, 'pode atacar Personagens descansados');
  t = t.replace(/can attack Characters\./gi, 'pode atacar Personagens.');
  t = t.replace(/can attack Characters/gi, 'pode atacar Personagens');
  t = t.replace(/can attack/gi, 'pode atacar');

  t = t.replace(/will not become active in your opponent's next Refresh Phase\./gi, 'não ficará ativo na próxima Fase de Restauração do seu oponente.');
  t = t.replace(/will not become active during your opponent's next Refresh Phase\./gi, 'não ficará ativo durante a próxima Fase de Restauração do seu oponente.');
  t = t.replace(/will not become active/gi, 'não ficará ativo');
  t = t.replace(/Refresh Phase/gi, 'Fase de Restauração');
  t = t.replace(/End Phase/gi, 'Fase Final');
  t = t.replace(/Main Phase/gi, 'Fase Principal');

  t = t.replace(/at the end of your opponent's next End Phase\./gi, 'no final da próxima Fase Final do seu oponente.');
  t = t.replace(/at the end of your opponent's next End Phase/gi, 'no final da próxima Fase Final do seu oponente');
  t = t.replace(/at the end of this turn\./gi, 'no final deste turno.');
  t = t.replace(/at the end of this turn/gi, 'no final deste turno');
  t = t.replace(/at the end of your turn\./gi, 'no final do seu turno.');
  t = t.replace(/at the end of your turn/gi, 'no final do seu turno');
  t = t.replace(/at the end of your opponent's turn\./gi, 'no final do turno do seu oponente.');
  t = t.replace(/at the end of your opponent's turn/gi, 'no final do turno do seu oponente');
  t = t.replace(/at the start of your next turn\./gi, 'no início do seu próximo turno.');
  t = t.replace(/at the start of your next turn/gi, 'no início do seu próximo turno');
  t = t.replace(/at the start of your turn\./gi, 'no início do seu turno.');
  t = t.replace(/at the start of your turn/gi, 'no início do seu turno');

  t = t.replace(/until the end of your opponent's next End Phase\./gi, 'até o final da próxima Fase Final do seu oponente.');
  t = t.replace(/until the end of your opponent's next End Phase/gi, 'até o final da próxima Fase Final do seu oponente');
  t = t.replace(/until the end of this turn\./gi, 'até o final deste turno.');
  t = t.replace(/until the end of this turn/gi, 'até o final deste turno');
  t = t.replace(/until the end of your turn\./gi, 'até o final do seu turno.');
  t = t.replace(/until the end of your turn/gi, 'até o final do seu turno');
  t = t.replace(/until the start of your next turn\./gi, 'até o início do seu próximo turno.');
  t = t.replace(/until the start of your next turn/gi, 'até o início do seu próximo turno');
  t = t.replace(/until the start of your turn\./gi, 'até o início do seu turno.');
  t = t.replace(/until the start of your turn/gi, 'até o início do seu turno');

  // 8. Condições de Campo e Oponente (If you have / If your opponent has / If the only...)
  t = t.replace(/If the only Characters on your field are/gi, 'Se os únicos Personagens no seu campo forem');
  t = t.replace(/the only Characters on your field/gi, 'os únicos Personagens no seu campo');
  t = t.replace(/If your Leader has the (\{[^}]+\}) type or (\{[^}]+\}) type,/gi, 'Se o seu Líder tiver o tipo $1 ou tipo $2,');
  t = t.replace(/If your Leader has the (\{[^}]+\}) or (\{[^}]+\}) type,/gi, 'Se o seu Líder tiver o tipo $1 ou $2,');
  t = t.replace(/If your Leader has the (\{[^}]+\}) type,/gi, 'Se o seu Líder tiver o tipo $1,');
  t = t.replace(/If your Leader has the (\{[^}]+\}) type/gi, 'Se o seu Líder tiver o tipo $1');
  t = t.replace(/If your Leader has the/gi, 'Se o seu Líder tiver o');
  t = t.replace(/If your Leader is \[([^\]]+)\],/gi, 'Se o seu Líder for [$1],');
  t = t.replace(/If your Leader is \[([^\]]+)\]/gi, 'Se o seu Líder for [$1]');
  t = t.replace(/If your Leader is/gi, 'Se o seu Líder for');
  t = t.replace(/If your Leader's type includes "([^"]+)"/gi, 'Se o tipo do seu Líder incluir "$1"');
  t = t.replace(/If your Leader's type includes/gi, 'Se o tipo do seu Líder incluir');

  t = t.replace(/If you have (\d+) or less cards in your hand,/gi, 'Se você tiver $1 ou menos cartas na sua mão,');
  t = t.replace(/If you have (\d+) or more cards in your hand,/gi, 'Se você tiver $1 ou mais cartas na sua mão,');
  t = t.replace(/If you have (\d+) or more cards in your trash,/gi, 'Se você tiver $1 ou mais cartas na sua lixeira,');
  t = t.replace(/If you have (\d+) or less Life cards,/gi, 'Se você tiver $1 ou menos cartas de Vida,');
  t = t.replace(/If your opponent has (\d+) or less Life cards,/gi, 'Se o seu oponente tiver $1 ou menos cartas de Vida,');
  t = t.replace(/If you have (\d+) or more DON!! cards on your field,/gi, 'Se você tiver $1 ou mais cartas de DON!! no seu campo,');
  t = t.replace(/If you have (\d+) or less DON!! cards on your field,/gi, 'Se você tiver $1 ou menos cartas de DON!! no seu campo,');
  t = t.replace(/If you have (\d+) or more DON!! cards in your DON!! area,/gi, 'Se você tiver $1 ou mais cartas de DON!! na sua área de DON!!,');
  t = t.replace(/If your opponent has (\d+) or more DON!! cards/gi, 'Se o seu oponente tiver $1 ou mais cartas de DON!!');
  t = t.replace(/If either you or your opponent has (\d+) DON!! cards on the field,/gi, 'Se você ou o seu oponente tiver $1 cartas de DON!! em campo,');

  t = t.replace(/If you have a (\{[^}]+\}) type Character with a cost of (\d+) or more,/gi, 'Se você tiver um Personagem do tipo $1 com custo de $2 ou mais,');
  t = t.replace(/If you have a Character with a cost of (\d+) or more,/gi, 'Se você tiver um Personagem com custo de $1 ou mais,');
  t = t.replace(/If there is a Character with a cost of (\d+) or more,/gi, 'Se houver um Personagem com custo de $1 ou mais,');
  t = t.replace(/If you have a \[([^\]]+)\],/gi, 'Se você tiver um [$1],');
  t = t.replace(/If you have a \[([^\]]+)\]/gi, 'Se você tiver um [$1]');
  t = t.replace(/If you have a Character with/gi, 'Se você tiver um Personagem com');
  t = t.replace(/If there is a Character with/gi, 'Se houver um Personagem com');
  t = t.replace(/If your opponent has (\d+) or more Characters,/gi, 'Se o seu oponente tiver $1 ou mais Personagens,');
  t = t.replace(/If your opponent has (\d+) or less Characters,/gi, 'Se o seu oponente tiver $1 ou menos Personagens,');
  t = t.replace(/If your opponent has (\d+) or more Characters/gi, 'Se o seu oponente tiver $1 ou mais Personagens');
  t = t.replace(/If your opponent has (\d+) or less Characters/gi, 'Se o seu oponente tiver $1 ou menos Personagens');
  t = t.replace(/If your opponent has a Character with a cost of (\d+),/gi, 'Se o seu oponente tiver um Personagem com custo de $1,');
  t = t.replace(/If your opponent has a Character with/gi, 'Se o seu oponente tiver um Personagem com');

  // 9. Custos de Ativação / Descarte / Descanso
  t = t.replace(/You may rest (\d+) of your DON!! cards:/gi, 'Você pode descansar $1 das suas cartas de DON!!:');
  t = t.replace(/You may rest this card and place (\d+) of your Characters with (\d+) base power at the bottom of your Deck:/gi, 'Você pode descansar esta carta e colocar $1 dos seus Personagens com $2 de Poder base no fundo do seu Deck:');
  t = t.replace(/You may rest this Stage:/gi, 'Você pode descansar este Palco:');
  t = t.replace(/You may rest this card:/gi, 'Você pode descansar esta carta:');
  t = t.replace(/You may rest this card and/gi, 'Você pode descansar esta carta e');
  t = t.replace(/You may rest this Leader or Character:/gi, 'Você pode descansar este Líder ou Personagem:');
  t = t.replace(/You may rest this Character:/gi, 'Você pode descansar este Personagem:');
  t = t.replace(/You may rest this Leader:/gi, 'Você pode descansar este Líder:');

  t = t.replace(/You may trash (\d+) cards? with a \[Gatilho\] from your hand:/gi, 'Você pode descartar $1 carta(s) com [Gatilho] da sua mão:');
  t = t.replace(/You may trash (\d+) cards? with a \[Trigger\] from your hand:/gi, 'Você pode descartar $1 carta(s) com [Gatilho] da sua mão:');
  t = t.replace(/You may trash (\d+) cards? from your hand:/gi, 'Você pode descartar $1 carta(s) da sua mão:');
  t = t.replace(/You may trash (\d+) cards? from the top of your deck:/gi, 'Você pode descartar $1 carta(s) do topo do seu Deck:');
  t = t.replace(/You may trash (\d+) cards? from your (hand|trash)/gi, (m, c, from) => {
    return `Você pode descartar ${c} carta(s) da sua ${from === 'hand' ? 'mão' : 'lixeira'}`;
  });

  t = t.replace(/trash (\d+) cards? from your hand/gi, 'descarte $1 carta(s) da sua mão');
  t = t.replace(/trash (\d+) cards? from the top of your deck/gi, 'descarte $1 carta(s) do topo do seu Deck');
  t = t.replace(/trash cards from the top of your Life cards until you have (\d+) Life cards?\./gi, 'descarte cartas do topo das suas cartas de Vida até você ter $1 carta(s) de Vida.');
  t = t.replace(/trash cards from the top of your Life cards until you have (\d+) Life cards?/gi, 'descarte cartas do topo das suas cartas de Vida até você ter $1 carta(s) de Vida');

  // 10. Seleção e Alvo de Ataque
  t = t.replace(/Change the attack target to the selected Character\./gi, 'Mude o alvo do ataque para o Personagem selecionado.');
  t = t.replace(/Change the attack target to the selected Personagem\./gi, 'Mude o alvo do ataque para o Personagem selecionado.');
  t = t.replace(/Change the attack target to/gi, 'Mude o alvo do ataque para');
  t = t.replace(/Select up to (\d+) of your Characters\./gi, 'Selecione até $1 dos seus Personagens.');
  t = t.replace(/Select (\d+) of your Characters\./gi, 'Selecione $1 dos seus Personagens.');
  t = t.replace(/select up to (\d+) of your Characters\./gi, 'selecione até $1 dos seus Personagens.');
  t = t.replace(/select (\d+) of your Characters\./gi, 'selecione $1 dos seus Personagens.');
  t = t.replace(/select (\d+) of your Characters/gi, 'selecione $1 dos seus Personagens');

  // 11. Rest e K.O.
  t = t.replace(/Rest up to (\d+) of your opponent's Characters with a cost of (\d+) or less\./gi, 'Descanse até $1 Personagem(ns) do seu oponente com custo de $2 ou menos.');
  t = t.replace(/Rest up to (\d+) of your opponent's Characters\./gi, 'Descanse até $1 Personagem(ns) do seu oponente.');
  t = t.replace(/Rest up to (\d+) of your opponent's Leader or Characters\./gi, 'Descanse até $1 Líder ou Personagem(ns) do seu oponente.');
  t = t.replace(/rest up to (\d+) of your opponent's Characters/gi, 'descanse até $1 Personagem(ns) do seu oponente');

  t = t.replace(/K\.O\. up to (\d+) of your opponent's rested Characters with a cost of (\d+) or less\./gi, 'Dê K.O. em até $1 Personagem(ns) descansado(s) do seu oponente com custo de $2 ou menos.');
  t = t.replace(/K\.O\. up to (\d+) of your opponent's rested Characters\./gi, 'Dê K.O. em até $1 Personagem(ns) descansado(s) do seu oponente.');
  t = t.replace(/K\.O\. up to (\d+) of your opponent's Characters with (\d+) base power or less\./gi, 'Dê K.O. em até $1 Personagem(ns) do seu oponente com $2 ou menos de Poder base.');
  t = t.replace(/K\.O\. up to (\d+) of your opponent's Characters with (\d+) or less base power\./gi, 'Dê K.O. em até $1 Personagem(ns) do seu oponente com $2 ou menos de Poder base.');
  t = t.replace(/K\.O\. up to (\d+) of your opponent's Characters with a cost of (\d+) or less\./gi, 'Dê K.O. em até $1 Personagem(ns) do seu oponente com custo de $2 ou menos.');
  t = t.replace(/K\.O\. up to (\d+) of your opponent's Characters with (\d+) or less power\./gi, 'Dê K.O. em até $1 Personagem(ns) do seu oponente com $2 ou menos de Poder.');
  t = t.replace(/K\.O\. up to (\d+) of your opponent's Characters with a cost of (\d+)\./gi, 'Dê K.O. em até $1 Personagem(ns) do seu oponente com custo de $2.');
  t = t.replace(/K\.O\. up to (\d+) of your opponent's Characters\./gi, 'Dê K.O. em até $1 Personagem(ns) do seu oponente.');

  // 12. Frases de Play
  t = t.replace(/Play up to (\d+) Character cards? with (\d+) power or less other than \[([^\]]+)\] from your (trash|hand)\./gi, (m, c, p, other, from) => {
    return `Jogue até ${c} carta(s) de Personagem com ${p} ou menos de Poder diferente de [${other}] da sua ${from === 'trash' ? 'lixeira' : 'mão'}.`;
  });
  t = t.replace(/Play up to (\d+) Character cards? with a cost of (\d+) or less other than \[([^\]]+)\] from your (trash|hand)\./gi, (m, c, cost, other, from) => {
    return `Jogue até ${c} carta(s) de Personagem com custo de ${cost} ou menos diferente de [${other}] da sua ${from === 'trash' ? 'lixeira' : 'mão'}.`;
  });
  t = t.replace(/Play up to (\d+) Character cards? with a cost of (\d+) or less from your (hand|trash)\./gi, (m, c, cost, from) => {
    return `Jogue até ${c} carta(s) de Personagem com custo de ${cost} ou menos da sua ${from === 'hand' ? 'mão' : 'lixeira'}.`;
  });
  t = t.replace(/Play up to (\d+) Character cards? with (\d+) or less power from your (hand|trash)\./gi, (m, c, p, from) => {
    return `Jogue até ${c} carta(s) de Personagem com ${p} ou menos de Poder da sua ${from === 'hand' ? 'mão' : 'lixeira'}.`;
  });
  t = t.replace(/Play up to (\d+) Character cards? with (\d+) power or less from your (hand|trash)\./gi, (m, c, p, from) => {
    return `Jogue até ${c} carta(s) de Personagem com ${p} ou menos de Poder da sua ${from === 'hand' ? 'mão' : 'lixeira'}.`;
  });
  t = t.replace(/Play up to (\d+) Character cards? from your (hand|trash)\./gi, (m, c, from) => {
    return `Jogue até ${c} carta(s) de Personagem da sua ${from === 'hand' ? 'mão' : 'lixeira'}.`;
  });

  // 13. Look at & Reveal
  t = t.replace(/Look at (\d+) cards from the top of your deck and play up to (\d+) (\{[^}]+\}) type Character cards with a cost of (\d+) or less\./gi, 'Olhe as $1 cartas do topo do seu Deck e jogue até $2 carta(s) de Personagem do tipo $3 com custo de $4 ou menos.');
  t = t.replace(/Look at (\d+) cards from the top of your deck;/gi, 'Olhe as $1 cartas do topo do seu Deck;');
  t = t.replace(/Look at (\d+) cards from the top of your deck/gi, 'Olhe as $1 cartas do topo do seu Deck');
  t = t.replace(/Reveal (\d+) card from the top of your deck\./gi, 'Revele $1 carta do topo do seu Deck.');
  t = t.replace(/reveal up to (\d+)/gi, 'revele até $1');
  t = t.replace(/If the revealed card has a cost of (\d+) or more,/gi, 'Se a carta revelada tiver custo de $1 ou mais,');
  t = t.replace(/Then, place the revealed card at the bottom of your deck\./gi, 'Em seguida, coloque a carta revelada no fundo do seu Deck.');
  t = t.replace(/place the revealed card at the bottom of your deck/gi, 'coloque a carta revelada no fundo do seu Deck');

  // 14. Deck, Vida e Compras
  t = t.replace(/Add up to (\d+) cards? from the top of your deck to the top of your Life cards\./gi, 'Adicione até $1 carta(s) do topo do seu Deck ao topo das suas cartas de Vida.');
  t = t.replace(/add up to (\d+) cards? from the top of your deck to the top of your Life cards\./gi, 'adicione até $1 carta(s) do topo do seu Deck ao topo das suas cartas de Vida.');
  t = t.replace(/add (\d+) card from the top or bottom of your Life cards to your hand:/gi, 'adicione $1 carta do topo ou fundo das suas cartas de Vida para a sua mão:');
  t = t.replace(/add (\d+) card from the top of your Life cards to your hand:/gi, 'adicione $1 carta do topo das suas cartas de Vida para a sua mão:');
  t = t.replace(/add (\d+) card from the bottom of your Life cards to your hand:/gi, 'adicione $1 carta do fundo das suas cartas de Vida para a sua mão:');
  t = t.replace(/Add up to (\d+) Character cards? with a cost of (\d+) or less from your trash to your hand\./gi, 'Adicione até $1 carta(s) de Personagem com custo de $2 ou menos da sua lixeira para a sua mão.');
  t = t.replace(/add up to (\d+) Character cards? with a cost of (\d+) or less from your trash to your hand\./gi, 'adicione até $1 carta(s) de Personagem com custo de $2 ou menos da sua lixeira para a sua mão.');
  t = t.replace(/Add up to (\d+) cards? from your trash to your hand\./gi, 'Adicione até $1 carta(s) da sua lixeira para a sua mão.');
  t = t.replace(/Then, your opponent trashes (\d+) cards? from their hand\./gi, 'Em seguida, seu oponente descarta $1 carta(s) da mão dele.');
  t = t.replace(/Draw (\d+) cards?\./gi, 'Compre $1 carta(s).');
  t = t.replace(/Draw (\d+) cards? and/gi, 'Compre $1 carta(s) e');

  t = t.replace(/from the top or bottom of your Life cards/gi, 'do topo ou fundo das suas cartas de Vida');
  t = t.replace(/from the top of your Life cards/gi, 'do topo das suas cartas de Vida');
  t = t.replace(/from the bottom of your Life cards/gi, 'do fundo das suas cartas de Vida');

  t = t.replace(/type card and add it to your hand\./gi, 'e adicione-a à sua mão.');
  t = t.replace(/and add it to your hand\./gi, 'e adicione-a à sua mão.');
  t = t.replace(/Then, place the rest at the bottom of your deck in any order\./gi, 'Em seguida, coloque o restante no fundo do seu Deck em qualquer ordem.');
  t = t.replace(/place the rest at the bottom of your deck in any order\./gi, 'coloque o restante no fundo do seu Deck em qualquer ordem.');
  t = t.replace(/place (\d+) cards? with a type including "([^"]+)" from your trash at the bottom of your deck in any order:/gi, 'coloque $1 carta(s) com um tipo que inclua "$2" da sua lixeira no fundo do seu Deck em qualquer ordem:');
  t = t.replace(/place (\d+) cards? with a type including "([^"]+)" from your trash at the bottom of your deck:/gi, 'coloque $1 carta(s) com um tipo que inclua "$2" da sua lixeira no fundo do seu Deck:');
  t = t.replace(/place (\d+) cards? from your trash at the bottom of your deck in any order/gi, 'coloque $1 carta(s) da sua lixeira no fundo do seu Deck em qualquer ordem');
  t = t.replace(/place (\d+) cards? from your trash at the bottom of your deck/gi, 'coloque $1 carta(s) da sua lixeira no fundo do seu Deck');
  t = t.replace(/place this card and (\d+) card from your hand at the bottom of your deck in any order:/gi, 'coloque esta carta e $1 carta da sua mão no fundo do seu Deck em qualquer ordem:');
  t = t.replace(/place this card at the bottom of your deck/gi, 'coloque esta carta no fundo do seu Deck');
  t = t.replace(/place (\d+) cards? at the bottom of your deck/gi, 'coloque $1 carta(s) no fundo do seu Deck');
  t = t.replace(/place the rest at the bottom of your deck/gi, 'coloque o restante no fundo do seu Deck');

  // 15. Set Active / Rest
  t = t.replace(/set up to (\d+) of your DON!! cards as active\./gi, 'coloque até $1 das suas cartas de DON!! como ativas.');
  t = t.replace(/set up to (\d+) of your rested DON!! cards as active\./gi, 'coloque até $1 das suas cartas de DON!! descansadas como ativas.');
  t = t.replace(/set this card as active\./gi, 'coloque esta carta como ativa.');
  t = t.replace(/set this Character as active\./gi, 'coloque este Personagem como ativo.');
  t = t.replace(/set this Leader as active\./gi, 'coloque este Líder como ativo.');
  t = t.replace(/set it as active\./gi, 'coloque-a como ativa.');
  t = t.replace(/set it as active/gi, 'coloque-a como ativa');

  // 16. Buffs de Poder e Custo
  t = t.replace(/Up to (\d+) of your Leader or Character cards gains? \+(\d+) power during this battle\./gi, 'Até $1 carta(s) de Líder ou Personagem ganha +$2 de Poder durante esta batalha.');
  t = t.replace(/Up to (\d+) of your Leader or Characters gains? \+(\d+) power during this battle\./gi, 'Até $1 do seu Líder ou Personagens ganha +$2 de Poder durante esta batalha.');
  t = t.replace(/Up to (\d+) of your Characters gains? \+(\d+) power during this battle\./gi, 'Até $1 dos seus Personagens ganha +$2 de Poder durante esta batalha.');
  t = t.replace(/Your Leader or (\d+) of your Characters gains? \+(\d+) power during this battle\./gi, 'O seu Líder ou $1 dos seus Personagens ganha +$2 de Poder durante esta batalha.');
  t = t.replace(/Your Leader or up to (\d+) of your Characters gains? \+(\d+) power during this battle\./gi, 'O seu Líder ou até $1 dos seus Personagens ganha +$2 de Poder durante esta batalha.');
  t = t.replace(/Up to (\d+) of your \[([^\]]+)\] Characters gains? \+(\d+) power during this turn\./gi, 'Até $1 dos seus Personagens [$2] ganha +$3 de Poder durante este turno.');

  t = t.replace(/this Character gains \[Rush\] during this turn\./gi, 'este Personagem ganha [Investida] durante este turno.');
  t = t.replace(/this Character gains \[Blocker\] during this turn\./gi, 'este Personagem ganha [Bloqueador] durante este turno.');
  t = t.replace(/this Character gains \[Double Attack\] during this turn\./gi, 'este Personagem ganha [Ataque Duplo] durante este turno.');
  t = t.replace(/this Character gains \[Rush\]\./gi, 'este Personagem ganha [Investida].');
  t = t.replace(/this Character gains \[Rush\]/gi, 'este Personagem ganha [Investida]');
  t = t.replace(/this Character gains \[Blocker\]/gi, 'este Personagem ganha [Bloqueador]');

  t = t.replace(/this Leader gains \+(\d+) power until the start of your next turn\./gi, 'este Líder ganha +$1 de Poder até o início do seu próximo turno.');
  t = t.replace(/this Character gains \+(\d+) power until the start of your next turn\./gi, 'este Personagem ganha +$1 de Poder até o início do seu próximo turno.');
  t = t.replace(/gains? \+(\d+) power until the end of your opponent's next End Phase\./gi, 'ganha +$1 de Poder até o final da próxima Fase Final do seu oponente.');
  t = t.replace(/gains? \+(\d+) power until the end of your turn\./gi, 'ganha +$1 de Poder até o final do seu turno.');
  t = t.replace(/gains? \+(\d+) power during this turn\./gi, 'ganha +$1 de Poder durante este turno.');
  t = t.replace(/gains? \+(\d+) power during this battle\./gi, 'ganha +$1 de Poder durante esta batalha.');
  t = t.replace(/gains? \+(\d+) power\./gi, 'ganha +$1 de Poder.');
  t = t.replace(/gains? \+(\d+) power until/gi, 'ganha +$1 de Poder até');
  t = t.replace(/gains? \+(\d+) power/gi, 'ganha +$1 de Poder');
  t = t.replace(/gains? \+(\d+) cost\./gi, 'ganha +$1 de custo.');
  t = t.replace(/gains? \+(\d+) cost/gi, 'ganha +$1 de custo');

  t = t.replace(/Give up to (\d+) of your opponent's Characters [−-](\d+) power during this turn\./gi, 'Dê a até $1 Personagem(ns) do seu oponente −$2 de Poder durante este turno.');
  t = t.replace(/Give up to (\d+) of your opponent's Characters [−-](\d+) cost during this turn\./gi, 'Dê a até $1 Personagem(ns) do seu oponente −$2 de custo durante este turno.');
  t = t.replace(/Give up to (\d+) of your opponent's Characters [−-](\d+) power until/gi, 'Dê a até $1 Personagem(ns) do seu oponente −$2 de Poder até');
  t = t.replace(/Give up to (\d+) of your opponent's Leader or Character cards [−-](\d+) power during this turn\./gi, 'Dê a até $1 cartas de Líder ou Personagem do seu oponente −$2 de Poder durante este turno.');

  // 17. For Every
  t = t.replace(/for every (\d+) of your rested DON!! cards/gi, 'para cada $1 das suas cartas de DON!! descansadas');
  t = t.replace(/for every (\d+) Events in your trash/gi, 'para cada $1 Eventos na sua lixeira');
  t = t.replace(/for every (\d+) cards in your trash/gi, 'para cada $1 cartas na sua lixeira');
  t = t.replace(/for every (\d+) DON!! cards/gi, 'para cada $1 cartas de DON!!');

  // 18. Returns, Remoções e Trocas
  t = t.replace(/When your opponent's Character is returned to the owner's hand by your effect,/gi, 'Quando um Personagem do seu oponente for retornado para a mão do dono por um efeito seu,');
  t = t.replace(/When your opponent's Character is returned to the owner's hand/gi, 'Quando um Personagem do seu oponente for retornado para a mão do dono');
  t = t.replace(/When a Character is returned to the owner's hand/gi, 'Quando um Personagem for retornado para a mão do dono');
  t = t.replace(/is returned to the owner's hand by your effect/gi, 'for retornado para a mão do dono por um efeito seu');
  t = t.replace(/is returned to the owner's hand/gi, 'for retornado para a mão do dono');
  t = t.replace(/are returned to the owner's hand/gi, 'forem retornados para a mão do dono');
  t = t.replace(/cannot be removed from the field by your opponent's effects\./gi, 'não pode ser removido de campo por efeitos do seu oponente.');
  t = t.replace(/cannot be removed from the field by your opponent's effects/gi, 'não pode ser removido de campo por efeitos do seu oponente');
  t = t.replace(/cannot be removed from the field\./gi, 'não pode ser removido de campo.');
  t = t.replace(/cannot be removed from the field/gi, 'não pode ser removido de campo');
  t = t.replace(/cannot be removed/gi, 'não pode ser removido');

  t = t.replace(/your opponent returns (\d+) of their (active|rested)? Characters to the owner's hand\./gi, (m, c, state) => {
    return `seu oponente retorna ${c} dos seus Personagens ${state ? (state.toLowerCase() === 'active' ? 'ativos' : 'descansados') : ''} para a mão do dono.`;
  });
  t = t.replace(/your opponent returns (\d+) of their (active|rested)? Characters to the owner's hand/gi, (m, c, state) => {
    return `seu oponente retorna ${c} dos seus Personagens ${state ? (state.toLowerCase() === 'active' ? 'ativos' : 'descansados') : ''} para a mão do dono`;
  });
  t = t.replace(/return (\d+) of their (active|rested)? Characters to the owner's hand/gi, (m, c, state) => {
    return `retorne ${c} dos seus Personagens ${state ? (state.toLowerCase() === 'active' ? 'ativos' : 'descansados') : ''} para a mão do dono`;
  });
  t = t.replace(/return (\d+) of your Characters to the owner's hand/gi, 'retorne $1 dos seus Personagens para a mão do dono');
  t = t.replace(/return (\d+) of your (\{[^}]+\}) type Characters to the owner's hand/gi, 'retorne $1 dos seus Personagens do tipo $2 para a mão do dono');
  t = t.replace(/return up to (\d+) Character with a cost of (\d+) or less to the owner's hand\./gi, 'retorne até $1 Personagem com custo de $2 ou menos para a mão do dono.');
  t = t.replace(/return up to (\d+) of your Characters to the owner's hand\./gi, 'retorne até $1 dos seus Personagens para a mão do dono.');
  t = t.replace(/Return up to (\d+) Character to the owner's hand\./gi, 'Retorne até $1 Personagem para a mão do dono.');
  t = t.replace(/Return up to (\d+) of your opponent's Characters to the owner's hand\./gi, 'Retorne até $1 Personagem(ns) do seu oponente para a mão do dono.');
  t = t.replace(/to the owner's hand\./gi, 'para a mão do dono.');
  t = t.replace(/to the owner's hand/gi, 'para a mão do dono');
  t = t.replace(/to the owner's deck/gi, 'para o Deck do dono');
  t = t.replace(/that is a different color than the returned Character/gi, 'que seja de uma cor diferente do Personagem retornado');
  t = t.replace(/and you have no other \[([^\]]+)\] Characters/gi, 'e você não tiver outros Personagens [$1]');
  t = t.replace(/you have no other \[([^\]]+)\] Characters/gi, 'você não tiver outros Personagens [$1]');
  t = t.replace(/you have no other \[([^\]]+)\]/gi, 'você não tiver outros [$1]');
  t = t.replace(/the selected Character/gi, 'o Personagem selecionado');
  t = t.replace(/the selected Personagem/gi, 'o Personagem selecionado');

  t = t.replace(/or is \[([^\]]+)\]/gi, 'ou for [$1]');
  t = t.replace(/is \[([^\]]+)\]/gi, 'for [$1]');
  t = t.replace(/on your field/gi, 'no seu campo');
  t = t.replace(/on their field/gi, 'no campo dele(a)');
  t = t.replace(/from the field/gi, 'de campo');

  t = t.replace(/Choose one: •/gi, 'Escolha um: •');
  t = t.replace(/choose one: •/gi, 'escolha um: •');
  t = t.replace(/Choose one:/gi, 'Escolha um:');
  t = t.replace(/choose one:/gi, 'escolha um:');

  // 19. Vida e Chooses
  t = t.replace(/Choose one: • Look at all of your opponent's Life cards and place them back in their Life area in any order\. • Turn all of your Life cards face-down\./gi, 'Escolha um: • Olhe todas as cartas de Vida do seu oponente e coloque-as de volta na área de Vida dele em qualquer ordem. • Vire todas as suas cartas de Vida para baixo.');
  t = t.replace(/Turn all of your Life cards face-down\./gi, 'Vire todas as suas cartas de Vida para baixo.');
  t = t.replace(/Turn all of your Life cards face-up\./gi, 'Vire todas as suas cartas de Vida para cima.');
  t = t.replace(/Place up to (\d+) of your opponent's Characters with a cost of (\d+) or less at the top or bottom of your opponent's Life cards face-up\./gi, 'Coloque até $1 Personagem(ns) do seu oponente com custo de $2 ou menos no topo ou fundo das cartas de Vida do seu oponente viradas para cima.');
  t = t.replace(/turn (\d+) card from the top of your Life cards face-up:/gi, 'virar $1 carta do topo das suas cartas de Vida para cima:');
  t = t.replace(/turn (\d+) card from the top of your Life cards face-down:/gi, 'virar $1 carta do topo das suas cartas de Vida para baixo:');

  // 20. Conectivos e Pronomes (Substituição estrita de ponta a ponta)
  t = t.replace(/\bUp to (\d+) of your opponent's rested Characters\b/gi, 'Até $1 Personagem(ns) descansado(s) do seu oponente');
  t = t.replace(/\bup to (\d+) of your opponent's rested Characters\b/gi, 'até $1 Personagem(ns) descansado(s) do seu oponente');
  t = t.replace(/\bof your opponent's Characters\b/gi, 'dos Personagens do seu oponente');
  t = t.replace(/\bof your opponent's Character\b/gi, 'do Personagem do seu oponente');
  t = t.replace(/\bof your opponent's Leader\b/gi, 'do Líder do seu oponente');
  t = t.replace(/\bof your opponent's\b/gi, 'do seu oponente');
  t = t.replace(/\bof your Characters\b/gi, 'dos seus Personagens');
  t = t.replace(/\bof your Character\b/gi, 'do seu Personagem');
  t = t.replace(/\bof your Leader\b/gi, 'do seu Líder');
  t = t.replace(/\bof your Life cards\b/gi, 'das suas cartas de Vida');
  t = t.replace(/\bof your Life\b/gi, 'da sua Vida');
  t = t.replace(/\bof your DON!! cards\b/gi, 'das suas cartas de DON!!');
  t = t.replace(/\bof your DON!!\b/gi, 'do seu DON!!');
  t = t.replace(/\bof your Deck\b/gi, 'do seu Deck');
  t = t.replace(/\bof your hand\b/gi, 'da sua mão');
  t = t.replace(/\bof your trash\b/gi, 'da sua lixeira');
  t = t.replace(/\bof your\b/gi, 'dos seus');

  t = t.replace(/\bfrom your hand or trash\b/gi, 'da sua mão ou lixeira');
  t = t.replace(/\bfrom your hand\b/gi, 'da sua mão');
  t = t.replace(/\bfrom your trash\b/gi, 'da sua lixeira');
  t = t.replace(/\bfrom your deck\b/gi, 'do seu Deck');
  t = t.replace(/\bfrom your field\b/gi, 'do seu campo');
  t = t.replace(/\bfrom your\b/gi, 'da sua');
  t = t.replace(/\bto your hand\b/gi, 'para a sua mão');
  t = t.replace(/\bto your trash\b/gi, 'para a sua lixeira');
  t = t.replace(/\bto your deck\b/gi, 'para o seu Deck');
  t = t.replace(/\bto your field\b/gi, 'para o seu campo');
  t = t.replace(/\bto your Leader\b/gi, 'ao seu Líder');

  t = t.replace(/\byour opponent's\b/gi, 'do seu oponente');
  t = t.replace(/\byour opponent\b/gi, 'seu oponente');
  t = t.replace(/\byour Leader\b/gi, 'seu Líder');
  t = t.replace(/\byour Characters\b/gi, 'seus Personagens');
  t = t.replace(/\byour Character\b/gi, 'seu Personagem');
  t = t.replace(/\byour hand\b/gi, 'sua mão');
  t = t.replace(/\byour trash\b/gi, 'sua lixeira');
  t = t.replace(/\byour deck\b/gi, 'seu Deck');
  t = t.replace(/\byour Life\b/gi, 'sua Vida');
  t = t.replace(/\byour field\b/gi, 'seu campo');
  t = t.replace(/\byour turn\b/gi, 'seu turno');
  t = t.replace(/\byour\b/gi, 'seu');

  t = t.replace(/\bAll of your\b/gi, 'Todos os seus');
  t = t.replace(/\ball of your\b/gi, 'todos os seus');
  t = t.replace(/\ball of them\b/gi, 'todos eles');
  t = t.replace(/\ball Characters\b/gi, 'todos os Personagens');
  t = t.replace(/\ball your\b/gi, 'todos os seus');
  t = t.replace(/\ball\b/gi, 'todos os');

  t = t.replace(/\bon the field\b/gi, 'em campo');
  t = t.replace(/\bon your field\b/gi, 'no seu campo');
  t = t.replace(/\bon your opponent's field\b/gi, 'no campo do seu oponente');
  t = t.replace(/\bin battle\b/gi, 'em batalha');
  t = t.replace(/\bby battle or your opponent's effects\b/gi, 'em batalha ou por efeitos do seu oponente');
  t = t.replace(/\bby your opponent's effects\b/gi, 'por efeitos do seu oponente');
  t = t.replace(/\bby your opponent's effect\b/gi, 'por um efeito do seu oponente');
  t = t.replace(/\bby an effect\b/gi, 'por um efeito');
  t = t.replace(/\bby effect\b/gi, 'por efeito');
  t = t.replace(/\bby battle\b/gi, 'em batalha');
  t = t.replace(/\ban effect\b/gi, 'um efeito');

  t = t.replace(/\btheir hand\b/gi, 'a mão dele(a)');
  t = t.replace(/\btheir Life\b/gi, 'a Vida dele(a)');
  t = t.replace(/\btheir owner's hand\b/gi, 'a mão do seu dono');
  t = t.replace(/\btheir field\b/gi, 'o campo dele(a)');
  t = t.replace(/\btheir\b/gi, 'dele(a)');

  t = t.replace(/\bface-up\b/gi, 'virada(s) para cima');
  t = t.replace(/\bface-down\b/gi, 'virada(s) para baixo');
  t = t.replace(/\bChoose one:\b/gi, 'Escolha um:');
  t = t.replace(/\bthis card\b/gi, 'esta carta');
  t = t.replace(/\bthis Character\b/gi, 'este Personagem');
  t = t.replace(/\bthis Leader\b/gi, 'este Líder');
  t = t.replace(/\bthis Stage\b/gi, 'este Palco');
  t = t.replace(/\bin your hand\b/gi, 'na sua mão');
  t = t.replace(/\bin your trash\b/gi, 'na sua lixeira');

  t = t.replace(/\bother than\b/gi, 'diferente de');
  t = t.replace(/\bwith (\d+) power or less\b/gi, 'com $1 ou menos de Poder');
  t = t.replace(/\bwith (\d+) power or more\b/gi, 'com $1 ou mais de Poder');
  t = t.replace(/\bwith a cost of (\d+) or less\b/gi, 'com custo de $1 ou menos');
  t = t.replace(/\bwith a cost of (\d+) or more\b/gi, 'com custo de $1 ou mais');
  t = t.replace(/\bwith a cost of (\d+)\b/gi, 'com custo de $1');
  t = t.replace(/\bcost of (\d+) or less\b/gi, 'custo de $1 ou menos');
  t = t.replace(/\bcost of (\d+) or more\b/gi, 'custo de $1 ou mais');
  t = t.replace(/\bcost of (\d+)\b/gi, 'custo de $1');
  t = t.replace(/\bwith a type including\b/gi, 'com um tipo que inclua');

  t = t.replace(/\bUp to (\d+)\b/gi, 'Até $1');
  t = t.replace(/\bup to (\d+)\b/gi, 'até $1');
  t = t.replace(/\bPlay up to (\d+)\b/gi, 'Jogue até $1');
  t = t.replace(/\bplay up to (\d+)\b/gi, 'jogue até $1');
  t = t.replace(/\bPlay up to 1\b/gi, 'Jogue até 1');
  t = t.replace(/\bplay up to 1\b/gi, 'jogue até 1');
  t = t.replace(/\bPlay this card\./gi, 'Jogue esta carta.');
  t = t.replace(/\bplay this card\./gi, 'jogue esta carta.');
  t = t.replace(/\bPlay\b/g, 'Jogue');
  t = t.replace(/\bplay\b/g, 'jogue');

  t = t.replace(/\bEvent or Stage card\b/gi, 'carta de Evento ou Palco');
  t = t.replace(/\bEvent or Stage cards\b/gi, 'cartas de Evento ou Palco');
  t = t.replace(/\bEvent cards?\b/gi, 'carta(s) de Evento');
  t = t.replace(/\bStage cards?\b/gi, 'carta(s) de Palco');
  t = t.replace(/\bCharacter cards?\b/gi, 'carta(s) de Personagem');
  t = t.replace(/\bLeader cards?\b/gi, 'carta(s) de Líder');
  t = t.replace(/\bCharacters\b/g, 'Personagens');
  t = t.replace(/\bCharacter\b/g, 'Personagem');
  t = t.replace(/\bLeader\b/g, 'Líder');
  t = t.replace(/\bStage\b/g, 'Palco');

  t = t.replace(/\btype card\b/gi, 'carta do tipo');
  t = t.replace(/\btype Character\b/gi, 'Personagem do tipo');
  t = t.replace(/\bhas the\b/gi, 'tem o');
  t = t.replace(/\btype\b/gi, 'tipo');

  t = t.replace(/\bLife cards\b/gi, 'cartas de Vida');
  t = t.replace(/\bLife card\b/gi, 'carta de Vida');
  t = t.replace(/\bLife\b/g, 'Vida');

  t = t.replace(/\bcard\b/gi, 'carta');
  t = t.replace(/\bcards\b/gi, 'cartas');
  t = t.replace(/\bwith\b/gi, 'com');
  t = t.replace(/\bpower\b/gi, 'Poder');
  t = t.replace(/\bpower or less\b/gi, 'ou menos de Poder');
  t = t.replace(/\bpower or more\b/gi, 'ou mais de Poder');

  t = t.replace(/\bYou may\b/gi, 'Você pode');
  t = t.replace(/\byou may\b/gi, 'você pode');
  t = t.replace(/\bThen,\b/gi, 'Em seguida,');
  t = t.replace(/\bthen,\b/gi, 'em seguida,');
  t = t.replace(/\bThen\b/gi, 'Em seguida,');
  t = t.replace(/\bthen\b/gi, 'em seguida,');
  t = t.replace(/\binstead\./gi, 'em vez disso.');
  t = t.replace(/\binstead\b/gi, 'em vez disso');
  t = t.replace(/\bduring this turn\./gi, 'durante este turno.');
  t = t.replace(/\bduring this turn\b/gi, 'durante este turno');
  t = t.replace(/\bduring this battle\./gi, 'durante esta batalha.');
  t = t.replace(/\bduring this battle\b/gi, 'durante esta batalha');
  t = t.replace(/\bthis turn\b/gi, 'este turno');

  t = t.replace(/at the bottom do seu Deck in any order/gi, 'no fundo do seu Deck em qualquer ordem');
  t = t.replace(/at the bottom of your deck in any order/gi, 'no fundo do seu Deck em qualquer ordem');
  t = t.replace(/at the bottom do seu Deck/gi, 'no fundo do seu Deck');
  t = t.replace(/at the bottom of your deck/gi, 'no fundo do seu Deck');
  t = t.replace(/at the top do seu Deck/gi, 'no topo do seu Deck');
  t = t.replace(/at the top of your deck/gi, 'no topo do seu Deck');
  t = t.replace(/in any order/gi, 'em qualquer ordem');

  t = t.replace(/\bplace\b/gi, 'coloque');
  t = t.replace(/\band a cost of\b/gi, 'e custo de');
  t = t.replace(/\band a\b/gi, 'e um(a)');
  t = t.replace(/\band\b/gi, 'e');
  t = t.replace(/\bor\b/gi, 'ou');

  t = t.replace(/\brested\./gi, 'descansado(a).');
  t = t.replace(/\brested\b/gi, 'descansado(a)');

  t = t.replace(/Você pode coloque/gi, 'Você pode colocar');
  t = t.replace(/você pode coloque/gi, 'você pode colocar');
  t = t.replace(/Em seguida,,/g, 'Em seguida,');
  // 21. Traits entre chaves {Big Mom Pirates}
  for (const [enTrait, ptTrait] of Object.entries(TRAIT_TRANSLATIONS)) {
    const re = new RegExp(`\\{${enTrait}\\}`, 'gi');
    t = t.replace(re, `{${ptTrait}}`);
  }

  // 22. Varredura residual de palavras isoladas
  t = t.replace(/\bIf\b/g, 'Se');
  t = t.replace(/\bif\b/g, 'se');
  t = t.replace(/\byou have no other\b/gi, 'você não tiver outros');
  t = t.replace(/\bhave no other\b/gi, 'não tiver outros');
  t = t.replace(/\byou have\b/gi, 'você tiver');
  t = t.replace(/\byou may\b/gi, 'você pode');
  t = t.replace(/\bYou may\b/g, 'Você pode');
  t = t.replace(/\bhave\b/gi, 'tiver');
  t = t.replace(/\bhas\b/gi, 'tiver');
  t = t.replace(/\btrash\b/gi, 'descartar');
  t = t.replace(/\brest\b/gi, 'descanse');
  t = t.replace(/\bactive\b/gi, 'ativo(a)');
  t = t.replace(/\bgains\b/gi, 'ganha');
  t = t.replace(/\bgain\b/gi, 'ganha');
  t = t.replace(/\badd\b/gi, 'adicione');
  t = t.replace(/\bAdd\b/g, 'Adicione');
  t = t.replace(/\bmore\b/gi, 'mais');
  t = t.replace(/\bless\b/gi, 'menos');
  t = t.replace(/\bequal to\b/gi, 'igual a');
  t = t.replace(/\bnumber of\b/gi, 'número de');
  t = t.replace(/\bfield\b/gi, 'campo');
  t = t.replace(/\bhand\b/gi, 'mão');
  t = t.replace(/\bcost\b/gi, 'custo');
  t = t.replace(/\bpower\b/gi, 'Poder');
  t = t.replace(/\bturn\b/gi, 'turno');
  t = t.replace(/\bbattle\b/gi, 'batalha');
  t = t.replace(/\bopponent\b/gi, 'oponente');
  t = t.replace(/\bopponents\b/gi, 'oponentes');
  t = t.replace(/\bowner\b/gi, 'dono');
  t = t.replace(/\bowners\b/gi, 'donos');
  t = t.replace(/\breturn\b/gi, 'retorne');
  t = t.replace(/\breturned\b/gi, 'retornado(a)');
  t = t.replace(/\bremove\b/gi, 'remova');
  t = t.replace(/\bremoved\b/gi, 'removido(a)');
  t = t.replace(/\bWhen\b/g, 'Quando');
  t = t.replace(/\bwhen\b/g, 'quando');
  t = t.replace(/\bor is\b/gi, 'ou for');
  t = t.replace(/\bis\b/gi, 'for');
  t = t.replace(/\bare\b/gi, 'forem');
  t = t.replace(/\bbe\b/gi, 'ser');
  t = t.replace(/\bthat\b/gi, 'que');
  t = t.replace(/\bthan\b/gi, 'do que');
  t = t.replace(/\bother\b/gi, 'outro(a)');
  t = t.replace(/\bup to\b/gi, 'até');
  t = t.replace(/\bup to\b/gi, 'até');
  t = t.replace(/\bUp to\b/g, 'Até');
  t = t.replace(/\bfrom\b/gi, 'de');
  t = t.replace(/\bto\b/gi, 'para');
  t = t.replace(/\bthe\b/gi, 'o/a');
  t = t.replace(/\btop\b/gi, 'topo');
  t = t.replace(/\bbottom\b/gi, 'fundo');
  t = t.replace(/\byou\b/gi, 'você');
  t = t.replace(/\bGive\b/g, 'Dê');
  t = t.replace(/\bgive\b/gi, 'dê');
  t = t.replace(/\bnext\b/gi, 'próximo(a)');
  t = t.replace(/\bend\b/gi, 'fim');
  t = t.replace(/\bactivate\b/gi, 'ative');
  t = t.replace(/\bset\b/gi, 'coloque');
  t = t.replace(/\buntil\b/gi, 'até');
  t = t.replace(/\barea\b/gi, 'área');
  t = t.replace(/\bnumber\b/gi, 'número');
  t = t.replace(/\bspecified\b/gi, 'especificado');
  t = t.replace(/\bReveal\b/g, 'Revele');
  t = t.replace(/\breveal\b/gi, 'revele');
  t = t.replace(/\bthem\b/gi, 'eles/elas');
  t = t.replace(/\bit\b/gi, 'ela');
  t = t.replace(/\bDraw\b/g, 'Compre');
  t = t.replace(/\bdraw\b/gi, 'compre');
  t = t.replace(/\bwould\b/gi, 'for');
  t = t.replace(/\bbecomes\b/gi, 'torna-se');
  t = t.replace(/\bany\b/gi, 'qualquer');
  t = t.replace(/\btrashes\b/gi, 'descarta');
  t = t.replace(/\bmulticolored\b/gi, 'multicolorido');
  t = t.replace(/\bLook\b/g, 'Olhe');
  t = t.replace(/\blook\b/gi, 'olhe');
  t = t.replace(/\bAn\b/g, 'Um(a)');
  t = t.replace(/\ban\b/gi, 'um(a)');
  t = t.replace(/\bThis\b/g, 'Este/Esta');
  t = t.replace(/\bthis\b/gi, 'este/esta');
  t = t.replace(/\bby\b/gi, 'por');
  t = t.replace(/\bwith\b/gi, 'com');
  t = t.replace(/\bwithout\b/gi, 'sem');
  t = t.replace(/\beffect\b/gi, 'efeito');
  t = t.replace(/\beffects\b/gi, 'efeitos');

  t = t.replace(/\bSelect\b/g, 'Selecione');
  t = t.replace(/\bselect\b/g, 'selecione');
  t = t.replace(/\bNegate\b/g, 'Anule');
  t = t.replace(/\bnegate\b/g, 'anule');
  t = t.replace(/\bplaces\b/gi, 'coloca');
  t = t.replace(/\bactivates\b/gi, 'ativar');
  t = t.replace(/\bactivated\b/gi, 'ativado(a)');
  t = t.replace(/\breveals\b/gi, 'revela');
  t = t.replace(/\brevealed\b/gi, 'revelada');
  t = t.replace(/\bEvents\b/g, 'Eventos');
  t = t.replace(/\bevents\b/g, 'eventos');
  t = t.replace(/\bEvent\b/g, 'Evento');
  t = t.replace(/\bevent\b/g, 'evento');
  t = t.replace(/\bsame name\b/gi, 'mesmo nome');
  t = t.replace(/\bname\b/gi, 'nome');
  t = t.replace(/\bexcept\b/gi, 'exceto');
  t = t.replace(/\badditional\b/gi, 'adicional');
  t = t.replace(/\bwhich\b/gi, 'o qual');
  t = t.replace(/\beach\b/gi, 'cada');
  t = t.replace(/\bone\b/gi, 'um');

  // Cores
  t = t.replace(/\bred\b/gi, 'vermelho(a)');
  t = t.replace(/\bblue\b/gi, 'azul');
  t = t.replace(/\bgreen\b/gi, 'verde');
  t = t.replace(/\bpurple\b/gi, 'roxo(a)');
  t = t.replace(/\bblack\b/gi, 'preto(a)');
  t = t.replace(/\byellow\b/gi, 'amarelo(a)');

  // Atributos
  t = t.replace(/<Slash>/gi, '<Corte>');
  t = t.replace(/<Strike>/gi, '<Impacto>');
  t = t.replace(/<Ranged>/gi, '<Distância>');
  t = t.replace(/<Special>/gi, '<Especial>');
  t = t.replace(/<Wisdom>/gi, '<Sabedoria>');
  t = t.replace(/\battribute\b/gi, 'atributo');

  // Dano, Embaralhar e Vitória
  t = t.replace(/deals (\d+) damage/gi, 'causa $1 de dano');
  t = t.replace(/deal (\d+) damage/gi, 'causa $1 de dano');
  t = t.replace(/damage to Life/gi, 'dano à Vida');
  t = t.replace(/\bshuffle\b/gi, 'embaralhe');
  t = t.replace(/you win the game/gi, 'você vence o jogo');

  // Regras de nome e histórico de jogo
  t = t.replace(/Also, treat this card's name as/gi, 'Também trate o nome desta carta como');
  t = t.replace(/Also treat this card's name as/gi, 'Também trate o nome desta carta como');
  t = t.replace(/treat this card's name as/gi, 'trate o nome desta carta como');
  t = t.replace(/was played during this turn/gi, 'foi jogado durante este turno');
  t = t.replace(/was played this turn/gi, 'foi jogado neste turno');
  t = t.replace(/was played\b/gi, 'foi jogado');
  t = t.replace(/can also attack/gi, 'também pode atacar');
  t = t.replace(/\balso\b/gi, 'também');
  t = t.replace(/reveal a total of up to (\d+)/gi, 'revele um total de até $1');
  t = t.replace(/a total of up to (\d+)/gi, 'um total de até $1');
  t = t.replace(/a total of (\d+)/gi, 'um total de $1');

  // Limpeza de pontuações duplicadas e conectivos colados
  t = t.replace(/\s+/g, ' ').trim();
  t = t.replace(/Em seguida,,/g, 'Em seguida,');
  t = t.replace(/em seguida,,/g, 'em seguida,');

  // 23. Regras de Deck e limpeza final
  t = t.replace(/\bdeck\b/gi, 'Deck');
  t = t.replace(/\bbaralho\b/gi, 'Deck');

  // 24. Esteira de Higienização Gramatical e Limpeza de Resíduos (Post-Processing Pipeline)
  // Substantivos com artigos definidos
  t = t.replace(/\bo\/a\s+turno\b/gi, 'o turno');
  t = t.replace(/\bo\/a\s+fim\b/gi, 'o fim');
  t = t.replace(/\bo\/a\s+número\b/gi, 'o número');
  t = t.replace(/\bo\/a\s+total\b/gi, 'o total');
  t = t.replace(/\bo\/a\s+topo\b/gi, 'o topo');
  t = t.replace(/\bo\/a\s+fundo\b/gi, 'o fundo');
  t = t.replace(/\bo\/a\s+campo\b/gi, 'o campo');
  t = t.replace(/\bo\/a\s+dono\b/gi, 'o dono');
  t = t.replace(/\bo\/a\s+efeito\b/gi, 'o efeito');
  t = t.replace(/\bo\/a\s+custo\b/gi, 'o custo');
  t = t.replace(/\bo\/a\s+ataque\b/gi, 'o ataque');
  t = t.replace(/\bo\/a\s+alvo\b/gi, 'o alvo');
  t = t.replace(/\bo\/a\s+carta\b/gi, 'a carta');
  t = t.replace(/\bo\/a\s+mão\b/gi, 'a mão');
  t = t.replace(/\bo\/a\s+lixeira\b/gi, 'a lixeira');
  t = t.replace(/\bo\/a\s+área\b/gi, 'a área');
  t = t.replace(/\bo\/a\s+batalha\b/gi, 'a batalha');
  t = t.replace(/\bo\/a\s+/gi, 'o ');
  t = t.replace(/\bo\/a\b/gi, 'o');

  // Pronomes demonstrativos
  t = t.replace(/\beste\/esta\s+Personagem\b/gi, 'este Personagem');
  t = t.replace(/\beste\/esta\s+Líder\b/gi, 'este Líder');
  t = t.replace(/\beste\/esta\s+efeito\b/gi, 'este efeito');
  t = t.replace(/\beste\/esta\s+turno\b/gi, 'este turno');
  t = t.replace(/\beste\/esta\s+jogo\b/gi, 'este jogo');
  t = t.replace(/\beste\/esta\s+carta\b/gi, 'esta carta');
  t = t.replace(/\beste\/esta\s+batalha\b/gi, 'esta batalha');
  t = t.replace(/\beste\/esta\s+/gi, 'este ');
  t = t.replace(/\beste\/esta\b/gi, 'este');

  // Preposições combinadas e fragmentos em inglês
  t = t.replace(/\bat\s+o\/a\b/gi, 'no');
  t = t.replace(/\bat\s+o\b/gi, 'no');
  t = t.replace(/\bat\s+a\b/gi, 'na');
  t = t.replace(/\bat\s+todos\b/gi, 'em todos');
  t = t.replace(/\bat\s+/gi, 'no ');

  t = t.replace(/\bof\s+o\/a\b/gi, 'do');
  t = t.replace(/\bof\s+o\b/gi, 'do');
  t = t.replace(/\bof\s+a\b/gi, 'da');
  t = t.replace(/\bof\s+being\b/gi, 'de ser');
  t = t.replace(/\bof\s+dele\(a\)\b/gi, 'dele(a)');
  t = t.replace(/\bof\s+/gi, 'de ');

  t = t.replace(/\bin\s+o\/a\b/gi, 'no');
  t = t.replace(/\bin\s+o\b/gi, 'no');
  t = t.replace(/\bin\s+a\b/gi, 'na');
  t = t.replace(/\bin\s+sua\b/gi, 'na sua');
  t = t.replace(/\bin\s+seu\b/gi, 'no seu');
  t = t.replace(/\bin\s+/gi, 'em ');

  t = t.replace(/\beles\/elas\b/gi, 'elas');
  t = t.replace(/\bfor\s+cada\b/gi, 'para cada');
  t = t.replace(/\bfor\s+played\b/gi, 'for jogada');
  t = t.replace(/\bis\s+played\b/gi, 'é jogada');
  t = t.replace(/\btrashed\b/gi, 'descartada');

  t = t.replace(/\bSe você do\b/gi, 'Se fizer isso');
  t = t.replace(/\bse você do\b/gi, 'se fizer isso');
  t = t.replace(/\bChange\s+o\s+alvo\b/gi, 'Mude o alvo');
  t = t.replace(/\bChange\s+the\s+target\b/gi, 'Mude o alvo');
  t = t.replace(/\bUnder\s+as\s+regras\b/gi, 'De acordo com as regras');
  t = t.replace(/\btambém\s+treat\s+esta\s+carta's\s+nome\s+as\b/gi, 'o nome desta carta também é considerado');
  t = t.replace(/\btreat\s+esta\s+carta's\s+nome\s+as\b/gi, 'o nome desta carta é considerado');
  t = t.replace(/esta\s+carta's\s+nome\s+as/gi, 'o nome desta carta como');
  t = t.replace(/for\s+given\s+a\s+DON!!\s+carta/gi, 'receber uma carta de DON!!');
  t = t.replace(/por\s+do\s+seu\s+oponente\s+efeito/gi, 'por um efeito do seu oponente');
  t = t.replace(/do\s+seu\s+oponente\s+próximo\(a\)\s+turno/gi, 'próximo turno do seu oponente');
  t = t.replace(/do\s+seu\s+oponente\s+próximo\(a\)\s+Fase\s+Final/gi, 'próxima Fase Final do seu oponente');
  t = t.replace(/próximo\(a\)\s+turno/gi, 'próximo turno');
  t = t.replace(/próximo\(a\)\s+Fase/gi, 'próxima Fase');
  t = t.replace(/dos\s+seus\s+próximo\(a\)/gi, 'do seu próximo');
  t = t.replace(/back\s+in\s+sua\s+Vida\s+área/gi, 'de volta na sua área de Vida');
  t = t.replace(/coloque\s+o\s+descanse/gi, 'coloque o restante');
  t = t.replace(/o\s+descanse\s+no/gi, 'o restante no');
  t = t.replace(/o\s+descanse\s+na/gi, 'o restante na');
  t = t.replace(/\bturno\s+1\s+carta\b/gi, 'vire 1 carta');
  t = t.replace(/\bturno\s+(\d+)\s+cartas\b/gi, 'vire $1 cartas');
  t = t.replace(/\bchooses\s+um\b/gi, 'escolhe um');
  t = t.replace(/\bChoose\b/g, 'Escolha');
  t = t.replace(/\bchoose\b/gi, 'escolha');
  t = t.replace(/\bde\s+a\s+mão\s+dele\(a\)\b/gi, 'da mão dele(a)');
  t = t.replace(/\ba\s+mão\s+dele\(a\)\b/gi, 'a mão dele(a)');
  t = t.replace(/\bde\s+dele\(a\)\s+Deck\b/gi, 'do Deck dele(a)');
  t = t.replace(/\bde\s+dele\(a\)\b/gi, 'dele(a)');
  t = t.replace(/dono's\s+Deck/gi, 'Deck do dono');
  t = t.replace(/dono's\s+cartas\s+de\s+Vida/gi, 'cartas de Vida do dono');
  t = t.replace(/seu\s+oponente\s+cartas\s+de\s+Vida/gi, 'cartas de Vida do seu oponente');
  t = t.replace(/suas\s+cartas\s+de\s+Vida\s+virada\(s\)/gi, 'suas cartas de Vida viradas');

  // Limpeza de can, using, returns, includes e possessivos
  t = t.replace(/\bvocê can\b/gi, 'você pode');
  t = t.replace(/\bcan\s+ser\b/gi, 'pode ser');
  t = t.replace(/\bcan\b/gi, 'pode');
  t = t.replace(/\bincludes\b/gi, 'incluir');
  t = t.replace(/\breturns\b/gi, 'retorna');
  t = t.replace(/\busing\b/gi, 'usando');
  t = t.replace(/\bdo\s+seu\s+oponente\s+Vida\b/gi, 'à Vida do seu oponente');
  t = t.replace(/para\s+do\s+seu\s+oponente\s+Vida/gi, 'à Vida do seu oponente');
  t = t.replace(/oponente's\s+mão/gi, 'mão do seu oponente');
  t = t.replace(/sua\s+oponente's\s+mão/gi, 'mão do seu oponente');
  t = t.replace(/Líder's\s+tipo/gi, 'tipo do Líder');
  t = t.replace(/seu\s+Líder's\s+tipo/gi, 'o tipo do seu Líder');
  t = t.replace(/carta's\s+tipo/gi, 'tipo da carta');
  t = t.replace(/que\s+carta's\s+tipo/gi, 'o tipo daquela carta');
  t = t.replace(/revelada\s+carta's\s+tipo/gi, 'o tipo da carta revelada');
  t = t.replace(/Líder's\s+base\s+Poder/gi, 'Poder base do seu Líder');
  t = t.replace(/dê\s+(\d+)\s+ativo\(a\)\s+DON!!\s+cartas/gi, 'dê $1 cartas de DON!! ativas');
  t = t.replace(/DON!!\s+cartas\s+as\s+ativo\(a\)/gi, 'cartas de DON!! como ativas');
  t = t.replace(/DON!!\s+cartas/gi, 'cartas de DON!!');

  return t;
}

function detectKeywordIds(effectText) {
  if (!effectText) return [];
  const ids = [];
  const lower = effectText.toLowerCase();
  if (lower.includes('[blocker]') || lower.includes('[bloqueador]')) ids.push('blocker');
  if (lower.includes('[rush]') || lower.includes('[investida]')) ids.push('rush');
  if (lower.includes('[on play]') || lower.includes('[ao jogar]')) ids.push('on-play');
  if (lower.includes('[when attacking]') || lower.includes('[ao atacar]')) ids.push('when-attacking');
  if (lower.includes('[trigger]') || lower.includes('[gatilho]')) ids.push('trigger');
  if (lower.includes('[counter]') || lower.includes('[contra-ataque]')) ids.push('counter');
  if (lower.includes('[double attack]') || lower.includes('[ataque duplo]')) ids.push('double-attack');
  if (lower.includes('[banish]') || lower.includes('[banimento]')) ids.push('banish');
  if (lower.includes('[once per turn]') || lower.includes('[1 vez por turno]')) ids.push('once-per-turn');
  if (lower.includes('[your turn]') || lower.includes('[seu turno]')) ids.push('your-turn');
  if (lower.includes('[on k.o.]') || lower.includes('[ao ser k.o.]')) ids.push('on-ko');
  return ids;
}

// Percorrer todas as pastas e arquivos JSON
let totalUpdated = 0;
let fileCount = 0;

function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      processDirectory(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      const cards = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
      let modified = false;

      for (const card of cards) {
        if (card.effectEn) {
          card.effectPt = translateText(card.effectEn);
          modified = true;
        }
        if (card.triggerEn) {
          card.triggerPt = translateText(card.triggerEn);
          modified = true;
        }
        card.keywordIds = detectKeywordIds((card.effectEn || '') + ' ' + (card.triggerEn || ''));
        totalUpdated++;
      }

      if (modified) {
        fs.writeFileSync(fullPath, JSON.stringify(cards, null, 2), 'utf8');
        fileCount++;
      }
    }
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  console.log('🔄 Executando varredura ultra-exaustiva de traduções...');
  processDirectory(cardsBaseDir);
  console.log(`✨ Sucesso! ${totalUpdated} cartas atualizadas em ${fileCount} arquivos.`);
}

