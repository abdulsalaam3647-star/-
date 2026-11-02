export type WorkCategory = 'poetry' | 'article' | 'story' | 'media';

export interface VisitorComment {
  id: string;
  visitorName: string;
  comment: string;
  date: string;
}

export interface LiteraryWork {
  id: string;
  title: string;
  category: WorkCategory;
  tag: string;
  author: string;
  content: string;
  embedUrl?: string;
  mediaDesc?: string;
  date: string;
  likes: number;
  visitorComments?: VisitorComment[];
}

export type CommunityCategory = 'قصيدة شعرية' | 'مقال فكري' | 'قصة أدبية' | 'خاطرة وجدانية';

export interface CommunityPost {
  id: string;
  author: string;
  category: CommunityCategory;
  title: string;
  content: string;
  date: string;
  likes: number;
  visitorComments?: VisitorComment[];
}

export interface QuizOption {
  text: string;
  isCorrect: boolean;
  feedback: string;
}

export interface QuizItem {
  id: string;
  gameNumber: number;
  gameTitle: string;
  gameSubtitle: string;
  question: string;
  options: QuizOption[];
  points: number;
}

export interface RareWord {
  id: string;
  word: string;
  question: string;
  answer: string;
  type: 'meaning' | 'antonym';
}

export type WordType = 'verb' | 'noun' | 'vocabulary';

export interface GrammarDetails {
  partOfSpeech: string; // e.g. فعل ماضٍ ثلاثي مجرد، اسم فاعل، مصدر صريح
  wazn: string; // e.g. فَعَلَ، اسْتَفْعَلَ، فَاعِل، فَعِيل
  irabCase: string; // Parsing rule & grammatical status
  transitivity?: string; // لازم أو متعدٍ للأفعال
  conjugationOrDerivatives?: {
    past?: string;
    present?: string;
    imperative?: string;
    verbalNoun?: string;
    activeParticiple?: string;
    passiveParticiple?: string;
    plural?: string;
    singular?: string;
  };
  ruleExplanation: string; // Full explanation of the grammar rule
  exampleSentence?: string; // Example sentence
  irabOfSentence?: string; // Full i'rab breakdown of the sentence
}

export interface MultilingualTranslations {
  english: string;
  englishPhonetic?: string;
  kannada: string;
  urdu: string;
  malayalam: string;
}

export interface SynonymWord {
  id: string;
  word: string;
  wordType: WordType; // 'verb' | 'noun' | 'vocabulary'
  typeLabel: string; // 'فعل' | 'اسم' | 'مفردة بلاغية'
  root?: string;
  category: string;
  meaning: string;
  synonyms: string[];
  antonyms: string[];
  grammar: GrammarDetails;
  translations: MultilingualTranslations;
  verseExample?: string;
  verseAuthor?: string;
}

