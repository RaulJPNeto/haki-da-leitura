/**
 * Módulo de Regras de Tradução e Higienização de Texto de Cartas.
 * Isolado segundo o Princípio Aberto/Fechado (OCP) e Responsabilidade Única (SRP).
 */
import { TRAIT_TRANSLATIONS } from '../traits.js';

export function translateText(en) {
  if (!en) return '';
  let t = en;

  // 1. Tags de Efeito e Gatilhos (Padronização Oficial em Inglês)
  t = t.replace(/\[Ao Jogar\]/gi, '[On Play]');
  t = t.replace(/\[Ao Atacar\]/gi, '[When Attacking]');
  t = t.replace(/\[Quando Atacar\]/gi, '[When Attacking]');
  t = t.replace(/\[Quando esta carta atacar\]/gi, '[When Attacking]');
  t = t.replace(/\[Seu Turno\]/gi, '[Your Turn]');
  t = t.replace(/\[Turno do Oponente\]/gi, '[Opponent\'s Turn]');
  t = t.replace(/\[Fim do Seu Turno\]/gi, '[End of Your Turn]');
  t = t.replace(/\[Fim do Turno do Oponente\]/gi, '[End of Opponent\'s Turn]');
  t = t.replace(/\[No Ataque do Oponente\]/gi, '[On Your Opponent\'s Attack]');
  t = t.replace(/\[Ativar: Principal\]/gi, '[Activate: Main]');
  t = t.replace(/\[Contra-Ataque\]/gi, '[Counter]');
  t = t.replace(/\[Gatilho\]/gi, '[Trigger]');
  t = t.replace(/\[Bloqueador\]/gi, '[Blocker]');
  t = t.replace(/\[Investida\]/gi, '[Rush]');
  t = t.replace(/\[Investida: Personagem\]/gi, '[Rush: Character]');
  t = t.replace(/\[Ataque Duplo\]/gi, '[Double Attack]');
  t = t.replace(/\[Banimento\]/gi, '[Banish]');
  t = t.replace(/\[1 Vez por Turno\]/gi, '[Once Per Turn]');
  t = t.replace(/\[Principal\]/gi, '[Main]');
  t = t.replace(/\[Ao Ser K\.O\.\]/gi, '[On K.O.]');
  t = t.replace(/\[Ao Bloquear\]/gi, '[On Block]');
  t = t.replace(/\[Inbloqueável\]/gi, '[Unblockable]');

  // 1.1 Atributos de Batalha (Mantidos em inglês para alinhamento com a carta física)
  t = t.replace(/[<＜]Slash[>＞]/gi, '<Slash>');
  t = t.replace(/[<＜]Strike[>＞]/gi, '<Strike>');
  t = t.replace(/[<＜]Special[>＞]/gi, '<Special>');
  t = t.replace(/[<＜]Ranged[>＞]/gi, '<Ranged>');
  t = t.replace(/[<＜]Wisdom[>＞]/gi, '<Wisdom>');
  t = t.replace(/"Red-Haired Pirates"/gi, '"Piratas do Ruivo"');
  t = t.replace(/Red-Haired Pirates/gi, 'Piratas do Ruivo');

  // 2. Parênteses explicativos, Regras Especiais e Cláusulas Completas
  t = t.replace(/When your deck is reduced to 0, you win the game instead of losing, according to the rules\./gi, 'Quando seu Deck for reduzido a 0, você vence o jogo em vez de perder, de acordo com as regras.');
  t = t.replace(/When your deck is reduced to 0, you win the game instead of losing/gi, 'Quando seu Deck for reduzido a 0, você vence o jogo em vez de perder');
  t = t.replace(/when your deck is reduced to 0, you win the game instead of losing/gi, 'quando seu Deck for reduzido a 0, você vence o jogo em vez de perder');
  t = t.replace(/select all of your opponent's Characters\. They cannot attack during this turn\./gi, 'selecione todos os Personagens do seu oponente. Eles não podem atacar durante este turno.');
  t = t.replace(/select all of your opponent's Characters/gi, 'selecione todos os Personagens do seu oponente');
  t = t.replace(/They cannot attack during this turn\./gi, 'Eles não podem atacar durante este turno.');
  t = t.replace(/They cannot attack during this turn/gi, 'Eles não podem atacar durante este turno');
  t = t.replace(/They cannot attack/gi, 'Eles não podem atacar');
  t = t.replace(/Apply each of the following effects based on the number of cards in your trash:/gi, 'Aplique cada um dos seguintes efeitos com base no número de cartas na sua lixeira:');
  t = t.replace(/based on the number of cards in your trash:/gi, 'com base no número de cartas na sua lixeira:');
  t = t.replace(/If you did, trash up to (\d+) cards from your hand\./gi, 'Se o fez, descarte até $1 cartas da sua mão.');
  t = t.replace(/If you did,/gi, 'Se o fez,');
  t = t.replace(/If you did/gi, 'Se o fez');
  t = t.replace(/in a way that/gi, 'de modo que');
  t = t.replace(/that do not have a type including/gi, 'que não tiverem um tipo que inclua');
  t = t.replace(/do not have a type/gi, 'não tiverem um tipo');
  t = t.replace(/do not have/gi, 'não tiverem');
  t = t.replace(/Change the target of the attack to/gi, 'Mude o alvo do ataque para');
  t = t.replace(/your monocolored Leader's base power/gi, 'o Poder base do seu Líder monocolorido');
  t = t.replace(/monocolored Leader's base power/gi, 'Poder base do seu Líder monocolorido');
  t = t.replace(/monocolored/gi, 'monocolorido');
  t = t.replace(/or for attacked/gi, 'ou for atacado');
  t = t.replace(/or is attacked/gi, 'ou for atacado');
  t = t.replace(/by choosing (\d+) of your opponent's Characters/gi, 'escolhendo $1 dos Personagens do seu oponente');
  t = t.replace(/by choosing/gi, 'escolhendo');
  t = t.replace(/Charactes/gi, 'Personagens');
  t = t.replace(/has a \+(\d+) Counter/gi, 'tem Contra-Ataque +$1');
  t = t.replace(/has a Counter/gi, 'tem Contra-Ataque');
  t = t.replace(/type Leaders and Characters/gi, 'Líderes e Personagens do tipo');
  t = t.replace(/type Leaders/gi, 'Líderes do tipo');
  t = t.replace(/with a different card name/gi, 'com um nome de carta diferente');
  t = t.replace(/different card name/gi, 'nome de carta diferente');
  t = t.replace(/you lose at the end of the turn in which your deck reaches 0 cards/gi, 'você perde no fim do turno no qual seu Deck chega a 0 cartas');
  t = t.replace(/you lose at the end of the turn/gi, 'você perde no fim do turno');
  t = t.replace(/instead of losing/gi, 'em vez de perder');
  t = t.replace(/you win the game\./gi, 'você vence o jogo.');
  t = t.replace(/you win the game/gi, 'você vence o jogo');
  t = t.replace(/Apply each of the following effects based on/gi, 'Aplique cada um dos seguintes efeitos com base em');
  t = t.replace(/the counter of all of your/gi, 'o contra-ataque de todas as suas');
  t = t.replace(/your DON!! deck consists of 6 cards/gi, 'seu Deck de DON!! consiste de 6 cartas');
  t = t.replace(/second turn or later/gi, 'segundo turno ou posterior');
  t = t.replace(/at the start of the game/gi, 'no início do jogo');
  t = t.replace(/has been K\.O\.'d/gi, 'tiver sido nocauteado');
  t = t.replace(/reorganize them in any order/gi, 'reorganize-as em qualquer ordem');
  t = t.replace(/outside of your Draw Phase/gi, 'fora da sua Fase de Compra');
  t = t.replace(/Draw Phase/gi, 'Fase de Compra');
  t = t.replace(/on your opponent's field/gi, 'no campo do seu oponente');
  t = t.replace(/on your field/gi, 'no seu campo');
  t = t.replace(/when a DON!! card is given/gi, 'quando esta carta receber uma carta de DON!!');
  t = t.replace(/given these DON!! cards/gi, 'receber estas cartas de DON!!');
  t = t.replace(/when the card given/gi, 'quando a carta receber');
  t = t.replace(/with the same name/gi, 'com o mesmo nome');
  t = t.replace(/for every/gi, 'para cada');

  t = t.replace(/if they do not/gi, 'se ele não o fizer');
  t = t.replace(/they do not/gi, 'eles não o fizerem');
  t = t.replace(/the chosen cost/gi, 'o custo escolhido');
  t = t.replace(/chosen cost/gi, 'custo escolhido');
  t = t.replace(/None of your/gi, 'Nenhum dos seus');
  t = t.replace(/none of your/gi, 'nenhum dos seus');
  t = t.replace(/with different card names/gi, 'com nomes de carta diferentes');
  t = t.replace(/different card names/gi, 'nomes de carta diferentes');

  t = t.replace(/when this Character battles/gi, 'quando este Personagem batalhar');
  t = t.replace(/battles your opponent's/gi, 'batalhar com o do seu oponente');
  t = t.replace(/when your opponent plays a Character/gi, 'quando o seu oponente jogar um Personagem');
  t = t.replace(/plays a Character/gi, 'jogar um Personagem');
  t = t.replace(/are played rested/gi, 'forem jogados descansados');

  t = t.replace(/no least (\d+) less/gi, 'pelo menos $1 a menos');
  t = t.replace(/at least (\d+) less/gi, 'pelo menos $1 a menos');
  t = t.replace(/at least/gi, 'pelo menos');
  t = t.replace(/unless your opponent/gi, 'a menos que seu oponente');
  t = t.replace(/back to your hand/gi, 'de volta para a sua mão');
  t = t.replace(/back to the bottom of the deck/gi, 'de volta ao fundo do Deck');
  t = t.replace(/back to the bottom/gi, 'de volta ao fundo');

  // Bloco 5: Cláusulas Finais Aprovadas
  t = t.replace(/is given to 1 of your/gi, 'for concedida a 1 dos seus');
  t = t.replace(/is given to your Leader/gi, 'for concedida ao seu Líder');
  t = t.replace(/is given to/gi, 'for concedido(a) a');
  t = t.replace(/the only Characters on your field/gi, 'os únicos Personagens no seu campo');
  t = t.replace(/the only Characters/gi, 'os únicos Personagens');
  t = t.replace(/only if/gi, 'somente se');
  t = t.replace(/this Leader's attack/gi, 'o ataque deste Líder');
  t = t.replace(/Leader's attack/gi, 'ataque do Líder');
  t = t.replace(/if there are (\d+) or more/gi, 'se houverem $1 ou mais');
  t = t.replace(/if there are/gi, 'se houverem');
  t = t.replace(/if there is/gi, 'se houver');
  t = t.replace(/there are/gi, 'houverem');
  t = t.replace(/there is/gi, 'houver');
  t = t.replace(/take up to (\d+) Life cards?/gi, 'pegue até $1 carta(s) de Vida');
  t = t.replace(/by Leaders/gi, 'por Líderes');
  t = t.replace(/if your Leader's colors include/gi, 'se as cores do seu Líder incluírem');
  t = t.replace(/swap the base power/gi, 'troque o poder base');
  t = t.replace(/during your DON!! Phase/gi, 'durante a sua Fase de DON!!');
  t = t.replace(/during your DON!! phase/gi, 'durante a sua Fase de DON!!');
  t = t.replace(/draws (\d+) cards?/gi, 'compra $1 carta(s)');
  t = t.replace(/haven't drawn a card/gi, 'não tiver comprado uma carta');
  t = t.replace(/you do not lose when/gi, 'você não perde quando');

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
  t = t.replace(/When a DON!! card on your field is returned to your DON!! deck,/gi, 'Quando uma carta de DON!! no seu campo for retornada para o seu Deck de DON!!,');
  t = t.replace(/When a DON!! card on your field is returned to your DON!! deck/gi, 'Quando uma carta de DON!! no seu campo for retornada para o seu Deck de DON!!');
  t = t.replace(/When a DON!! card on the field is returned to your DON!! deck,/gi, 'Quando uma carta de DON!! em campo for retornada para o seu Deck de DON!!,');
  t = t.replace(/When a DON!! card on the field is returned to your DON!! deck/gi, 'Quando uma carta de DON!! em campo for retornada para o seu Deck de DON!!');
  t = t.replace(/When DON!! cards on your field are returned to your DON!! deck,/gi, 'Quando cartas de DON!! no seu campo forem retornadas para o seu Deck de DON!!,');
  t = t.replace(/When DON!! cards on your field are returned to your DON!! deck/gi, 'Quando cartas de DON!! no seu campo forem retornadas para o seu Deck de DON!!');
  t = t.replace(/When a DON!! card is returned to your DON!! deck,/gi, 'Quando uma carta de DON!! for retornada para o seu Deck de DON!!,');
  t = t.replace(/When a DON!! card is returned to your DON!! deck/gi, 'Quando uma carta de DON!! for retornada para o seu Deck de DON!!');
  t = t.replace(/When (\d+) or more DON!! cards on your field are returned to your DON!! deck/gi, 'Quando $1 ou mais cartas de DON!! no seu campo forem retornadas para o seu Deck de DON!!');
  t = t.replace(/is returned to your DON!! deck/gi, 'for retornada para o seu Deck de DON!!');
  t = t.replace(/are returned to your DON!! deck/gi, 'forem retornadas para o seu Deck de DON!!');
  t = t.replace(/are returned to your hand/gi, 'forem retornadas para a sua mão');
  t = t.replace(/Add up to (\d+) DON!! cards? from your DON!! deck and set it as active\./gi, 'Adicione até $1 carta(s) de DON!! do seu Deck de DON!! e coloque-a como ativa.');
  t = t.replace(/Add up to (\d+) DON!! cards? from your DON!! deck and rest it\./gi, 'Adicione até $1 carta(s) de DON!! do seu Deck de DON!! e descanse-a.');
  t = t.replace(/Give up to (\d+) of your currently given DON!! cards to (\d+) of your/gi, 'Dê até $1 das suas cartas de DON!! atualmente anexadas a $2 dos seus');
  t = t.replace(/by [<＜]Strike[>＞] attribute Characters/gi, 'por Personagens com o atributo <Strike>');
  t = t.replace(/by [<＜]([^>＞]+)[>＞] attribute Characters/gi, 'por Personagens com o atributo <$1>');
  t = t.replace(/by ([^ ]+) attribute Characters/gi, 'por Personagens com o atributo $1');
  t = t.replace(/Give this Character up to (\d+) rested DON!! cards?\./gi, 'Dê até $1 carta(s) de DON!! descansada(s) a este Personagem.');
  t = t.replace(/Give this Character up to (\d+) rested DON!! cards?/gi, 'Dê até $1 carta(s) de DON!! descansada(s) a este Personagem');
  t = t.replace(/Give this Leader up to (\d+) rested DON!! cards?\./gi, 'Dê até $1 carta(s) de DON!! descansada(s) a este Líder.');
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

  // 8. Condições de Campo e Oponente
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

  // 20. Conectivos e Pronomes
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

  // Atributos (Mantidos oficialmente em inglês)
  t = t.replace(/[<＜]Slash[>＞]/gi, '<Slash>');
  t = t.replace(/[<＜]Strike[>＞]/gi, '<Strike>');
  t = t.replace(/[<＜]Ranged[>＞]/gi, '<Ranged>');
  t = t.replace(/[<＜]Special[>＞]/gi, '<Special>');
  t = t.replace(/[<＜]Wisdom[>＞]/gi, '<Wisdom>');
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

  // 24. Esteira de Higienização Gramatical e Limpeza de Resíduos
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

  t = t.replace(/\beste\/esta\s+Personagem\b/gi, 'este Personagem');
  t = t.replace(/\este\/esta\s+Líder\b/gi, 'este Líder');
  t = t.replace(/\beste\/esta\s+efeito\b/gi, 'este efeito');
  t = t.replace(/\beste\/esta\s+turno\b/gi, 'este turno');
  t = t.replace(/\beste\/esta\s+jogo\b/gi, 'este jogo');
  t = t.replace(/\beste\/esta\s+carta\b/gi, 'esta carta');
  t = t.replace(/\beste\/esta\s+batalha\b/gi, 'esta batalha');
  t = t.replace(/\beste\/esta\s+/gi, 'este ');
  t = t.replace(/\beste\/esta\b/gi, 'este');

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

  t = t.replace(/\bon este turno\b/gi, 'neste turno');
  t = t.replace(/\bon o turno\b/gi, 'no turno');
  t = t.replace(/\bon your field\b/gi, 'no seu campo');
  t = t.replace(/se\s+fizer\s+isso\s+not\s+tiver/gi, 'se ao fazê-lo não tiver');
  t = t.replace(/Se\s+fizer\s+isso\s+not\s+tiver/gi, 'Se ao fazê-lo não tiver');
  t = t.replace(/todos\s+os\s+dos\s+seus/gi, 'todos os seus');
  t = t.replace(/todas\s+as\s+das\s+suas/gi, 'todas as suas');
  t = t.replace(/1\s+DON!!\s+carta/gi, '1 carta de DON!!');
  t = t.replace(/a\s+DON!!\s+carta/gi, 'uma carta de DON!!');
  t = t.replace(/uma\s+DON!!\s+carta/gi, 'uma carta de DON!!');
  t = t.replace(/DON!!\s+carta/gi, 'carta de DON!!');
  t = t.replace(/qualquer\s+cartas\s+de\s+DON!!/gi, 'qualquer carta de DON!!');
  t = t.replace(/descartar\s+Até\s+1/gi, 'descarte até 1');
  t = t.replace(/Once\s+[Pp]er\s+turno/gi, '[Once Per Turn]');
  t = t.replace(/Personagem's\s+base\s+Poder/gi, 'Poder base deste Personagem');
  t = t.replace(/Personagem's\s+attack/gi, 'ataque deste Personagem');
  t = t.replace(/Líder's\s+attack/gi, 'ataque deste Líder');
  t = t.replace(/Líder's\s+colors/gi, 'cores do seu Líder');
  t = t.replace(/\bdo not become\b/gi, 'não ficam');
  t = t.replace(/\bwill not become\b/gi, 'não ficará');
  t = t.replace(/\bbattles e K\.O\.'s\b/gi, 'batalha e nocauteia');
  t = t.replace(/\bthey forem played\b/gi, 'eles forem jogados');
  t = t.replace(/\bthey are played\b/gi, 'eles são jogados');
  t = t.replace(/\bcannot be blocked\b/gi, 'não pode ser bloqueado');
  t = t.replace(/\bcan't be blocked\b/gi, 'não pode ser bloqueado');
  t = t.replace(/\bstages\b/gi, 'Palcos');
  t = t.replace(/\bgiven\b/gi, 'anexada(s)');
  t = t.replace(/\bsame\b/gi, 'mesmo');
  t = t.replace(/\battacks\b/gi, 'atacar');
  t = t.replace(/\bblocked\b/gi, 'bloqueado');
  t = t.replace(/\bback\b/gi, 'de volta');
  t = t.replace(/\bnegated\b/gi, 'anulados');
  t = t.replace(/\bits\b/gi, 'seu(s)');
  t = t.replace(/\bonly\b/gi, 'apenas');
  t = t.replace(/\bown\b/gi, 'próprio(a)');
  t = t.replace(/\bwill\b/gi, 'irá');
  t = t.replace(/\breduced\b/gi, 'reduzido(a)');
  t = t.replace(/\btake\b/gi, 'pegue');
  t = t.replace(/\bplaced\b/gi, 'colocado(a)');
  t = t.replace(/\bplayed\b/gi, 'jogado(a)');
  t = t.replace(/\bincluding\b/gi, 'incluindo');
  t = t.replace(/\bchooses\b/gi, 'escolhe');
  t = t.replace(/\btime\b/gi, 'vez');
  t = t.replace(/\bso\b/gi, 'de modo');
  t = t.replace(/\bhands\b/gi, 'mãos');
  t = t.replace(/\badded\b/gi, 'adicionado(a)');
  t = t.replace(/\bwhenever\b/gi, 'sempre que');
  t = t.replace(/\bthey\b/gi, 'eles');
  t = t.replace(/\beither\b/gi, 'qualquer um de');
  t = t.replace(/\bgame\b/gi, 'jogo');
  t = t.replace(/\binclude\b/gi, 'incluir');
  t = t.replace(/\badds\b/gi, 'adiciona');
  t = t.replace(/\bdamage\b/gi, 'dano');
  t = t.replace(/\bbecome\b/gi, 'ficar');
  t = t.replace(/\bthose\b/gi, 'essas');
  t = t.replace(/\bdrawing\b/gi, 'comprar');
  t = t.replace(/\battacking\b/gi, 'atacar');
  t = t.replace(/\bbeing\b/gi, 'sendo');
  t = t.replace(/\boutside\b/gi, 'fora');
  t = t.replace(/\bplaying\b/gi, 'jogar');
  t = t.replace(/\bleave\b/gi, 'sair do');
  t = t.replace(/\bafter\b/gi, 'após');
  t = t.replace(/\bmust\b/gi, 'deve');
  t = t.replace(/\bshuffles\b/gi, 'embaralha');
  t = t.replace(/\bnone\b/gi, 'nenhum');

  // 25. Padronização Canônica Final das Tags Oficiais em Inglês (Anti-Resíduo)
  t = t.replace(/\[(?:On Play|On Jogue|Ao Jogar)\]/gi, '[On Play]');
  t = t.replace(/\[(?:When Attacking|Quando Attacking|Ao Atacar)\]/gi, '[When Attacking]');
  t = t.replace(/\[(?:Your Turn|Seu Turno)\]/gi, '[Your Turn]');
  t = t.replace(/\[(?:Opponent's Turn|Oponente's Turno|Oponente's turno|Turno do Oponente)\]/gi, "[Opponent's Turn]");
  t = t.replace(/\[(?:End of Your Turn|Fim do Seu Turno)\]/gi, '[End of Your Turn]');
  t = t.replace(/\[(?:End of Opponent's Turn|Fim do Turno do Oponente)\]/gi, "[End of Opponent's Turn]");
  t = t.replace(/\[(?:On Your Opponent's Attack|On do seu oponente Attack|No Ataque do Oponente)\]/gi, "[On Your Opponent's Attack]");
  t = t.replace(/\[(?:Activate:\s*Main|Ative:\s*Main|Ativar:\s*Principal)\]/gi, '[Activate: Main]');
  t = t.replace(/\[(?:Counter|Contra-Ataque)\]/gi, '[Counter]');
  t = t.replace(/\[(?:Trigger|Gatilho)\]/gi, '[Trigger]');
  t = t.replace(/\[(?:Blocker|Bloqueador)\]/gi, '[Blocker]');
  t = t.replace(/\[(?:Rush|Investida)\]/gi, '[Rush]');
  t = t.replace(/\[(?:Rush:\s*Character|Investida:\s*Personagem)\]/gi, '[Rush: Character]');
  t = t.replace(/\[(?:Double Attack|Ataque Duplo)\]/gi, '[Double Attack]');
  t = t.replace(/\[(?:Banish|Banimento)\]/gi, '[Banish]');
  t = t.replace(/\[(?:Once Per Turn|Once Per Turno|Once Per turno|1 Vez por Turno)\]/gi, '[Once Per Turn]');
  t = t.replace(/\[(?:Main|Principal)\]/gi, '[Main]');
  t = t.replace(/\[(?:On K\.O\.|Ao Ser K\.O\.)\]/gi, '[On K.O.]');
  t = t.replace(/\[(?:On Block|Ao Bloquear)\]/gi, '[On Block]');
  t = t.replace(/\[(?:Unblockable|Inbloqueável)\]/gi, '[Unblockable]');
  t = t.replace(/\[\[([^\]]+)\]\]/g, '[$1]');

  return t;
}
