export type CardType = 'LEADER' | 'CHARACTER' | 'EVENT' | 'STAGE';
export type CardColor = 'RED' | 'GREEN' | 'BLUE' | 'PURPLE' | 'BLACK' | 'YELLOW' | 'MULTI';
export type CardAttribute = 'STRIKE' | 'SLASH' | 'SPECIAL' | 'WISDOM' | 'RANGED';

export interface Card {
  id: string;
  code: string;
  namePt: string;
  nameEn: string;
  cardType: CardType;
  colors: CardColor[];
  cost: number | null;
  power: number | null;
  counter: number | null;
  attribute?: CardAttribute;
  subtypes: string[];
  effectPt: string;
  effectEn: string;
  triggerPt?: string;
  triggerEn?: string;
  keywordIds: string[];
  setId: string;
  setName: string;
  imageUrl?: string;
}

export type KeywordCategory = 'TIMING' | 'KEYWORD_EFFECT' | 'COST' | 'RULE';

export interface RuleFaq {
  question: string;
  answer: string;
}

export interface KeywordRule {
  id: string;
  rawTag: string;
  rawTagPt: string;
  rawTagEn: string;
  namePt: string;
  nameEn: string;
  category: KeywordCategory;
  summaryPt: string;
  fullDescriptionPt: string;
  activationTimingPt: string;
  faqs: RuleFaq[];
}

export interface ScanCandidate {
  code: string;
  confidence: number;
}

export interface ScanResult {
  timestamp: number;
  rawTextFound: string;
  detectedCode: string | null;
  confidence: number;
  status: 'SUCCESS' | 'AMBIGUOUS' | 'NOT_FOUND';
  matchedCard?: Card;
  candidates?: ScanCandidate[];
}
