import React, { useState } from 'react';
import { Search, Sparkles, HelpCircle, Volume2, Copy, Check, X, BookOpen, Globe2, MessageSquare, Feather, Layers } from 'lucide-react';
import { queryGrammarEngine, GrammarQAResult } from '../utils/grammarEngine';
import { SynonymWord } from '../types';
import { soundFX } from '../utils/sound';

interface GrammarQABarProps {
  dictionaryWords: SynonymWord[];
  onSelectWord?: (wordId: string) => void;
}

const PRESET_QUESTIONS = [
  'ترجم واشرح تصريف وإعراب فعل «كَتَبَ» باللغات الأربع',
  'ما الفرق بين الاسم والفعل في قواعد النحو العربي؟',
  'كيف أعرب الفعل الماضي والمضارع والأمر بالتفصيل؟',
  'ما هو إعراب ووزن كلمة «العَسْجَدُ» وترجمتها إلى Kannada و Urdu و Malayalam؟',
  'ما الفرق بين الفعل اللازم والفعل المتعدي في قواعد اللغة العربية؟',
  'كيف نصوغ اسم الفاعل واسم المفعول من الثلاثي وغير الثلاثي؟',
  'ما هي علامات الإعراب الأصلية والفرعية في لغة الضاد؟',
  'تحليل وإعراب وترجمة كلمة «السَّمَيْدَعُ» باللغات الأربع'
];

export const GrammarQABar: React.FC<GrammarQABarProps> = ({ dictionaryWords, onSelectWord }) => {
  const [questionInput, setQuestionInput] = useState('');
  const [activeResult, setActiveResult] = useState<GrammarQAResult | null>(() => {
    // Default open on "كَتَبَ" to match the benchmark card immediately
    return queryGrammarEngine('ترجم واشرح تصريف وإعراب فعل «كَتَبَ» باللغات الأربع', dictionaryWords);
  });
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAsk = (query: string) => {
    if (!query.trim()) return;
    soundFX.playClick();
    setIsLoading(true);

    setTimeout(() => {
      const res = queryGrammarEngine(query.trim(), dictionaryWords);
      setActiveResult(res);
      setIsLoading(false);
      soundFX.playSuccess();
    }, 200);
  };

  const handleSpeech = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    soundFX.playClick();
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.85;

    const voices = window.speechSynthesis.getVoices();
    const arVoice = voices.find((v) => v.lang.startsWith('ar'));
    if (arVoice) utterance.voice = arVoice;

    window.speechSynthesis.speak(utterance);
  };

  const handleCopyCard = (word?: SynonymWord, res?: GrammarQAResult) => {
    soundFX.playClick();
    const title = word?.word || res?.topic || 'إجابة نحوية';
    const meaning = word?.meaning || res?.summary || '';
    const part = word?.grammar.partOfSpeech || res?.grammarExplanation[0] || '';
    const irab = word?.grammar.irabCase || res?.grammarExplanation[1] || '';
    const trans = word?.translations || res?.translations;

    const text = `المفردة / الموضوع: ${title} (${word?.typeLabel || 'نحو'})
الجذر: ${word?.root || '-'}
الوزن الصرفي: ${word?.grammar.wazn || '-'}
المعنى الدلالي: ${meaning}
الشرح النحوي: ${part}
الحكم الإعرابي: ${irab}

الترجمات الرباعية المعتمدة:
- English: ${trans?.english || '-'}
- Kannada (ಕನ್ನಡ): ${trans?.kannada || '-'}
- Urdu (اردو): ${trans?.urdu || '-'}
- Malayalam (മലയാളം): ${trans?.malayalam || '-'}

المثال والإعراب: ${word?.grammar.exampleSentence || res?.exampleSentence || '-'}
${word?.grammar.irabOfSentence || res?.sentenceIrab || ''}
${word?.verseExample ? `\nالشاهد الشعري: ${word.verseExample} (${word.verseAuthor || ''})` : ''}`;

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Helper to get active display word (either from matchedWord or synthesized from activeResult)
  const displayWord: SynonymWord | null = activeResult?.matchedWord || (activeResult ? {
    id: 'res-custom',
    word: activeResult.topic.split(':')[1]?.trim() || activeResult.topic,
    wordType: activeResult.topic.includes('فعل') ? 'verb' : activeResult.topic.includes('اسم') ? 'noun' : 'vocabulary',
    typeLabel: activeResult.topic.includes('فعل') ? 'فعل' : activeResult.topic.includes('اسم') ? 'اسم' : 'قاعدة نحوية',
    root: activeResult.relatedTerms?.[0] || 'ثلاثي',
    category: activeResult.topic,
    meaning: activeResult.summary,
    synonyms: activeResult.relatedTerms || [],
    antonyms: [],
    grammar: {
      partOfSpeech: activeResult.grammarExplanation[0] || 'تحليل نحوي مقارن',
      wazn: 'فَعَلَ',
      irabCase: activeResult.grammarExplanation[1] || 'معرب بالحركات الظاهرة.',
      ruleExplanation: activeResult.grammarExplanation.join(' '),
      exampleSentence: activeResult.exampleSentence,
      irabOfSentence: activeResult.sentenceIrab,
    },
    translations: activeResult.translations || {
      english: 'Arabic Grammar & Linguistics',
      kannada: 'ಅರಬ್ಬಿ ವ್ಯಾಕರಣ ಮತ್ತು ಭಾಷಾಶಾಸ್ತ್ರ',
      urdu: 'عربی گرامر اور لسانیات',
      malayalam: 'അറബിക് വ്യാകരണവും ഭാഷാശാസ്ത്രവും'
    },
    verseExample: activeResult.exampleSentence,
    verseAuthor: 'الشواهد النحوية الفصيحة',
  } : null);

  return (
    <div className="relative mb-10 overflow-hidden rounded-3xl border-2 border-emerald-900/20 bg-gradient-to-br from-emerald-50/70 via-white to-amber-50/50 p-6 sm:p-8 shadow-md dark:border-emerald-500/30 dark:from-stone-900 dark:via-stone-900 dark:to-emerald-950/20 text-right">
      
      {/* Top Banner Tag */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-200/60 pb-4 dark:border-stone-800">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-xs dark:bg-emerald-700">
            <MessageSquare className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-[11px] font-black text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-300">
                💬 شريط السؤال والإجابة النحوية والترجمة الفورية
              </span>
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400">مباشر ومفصل</span>
            </div>
            <h3 className="font-serif-arabic mt-1 text-xl sm:text-2xl font-black text-stone-950 dark:text-stone-50">
              اسأل أي سؤال في النحو والصرف والإعراب والترجمة 💡
            </h3>
            <p className="text-xs font-bold text-stone-600 dark:text-stone-300">
              اكتب سؤالك أو الكلمة وسيشرح لك الموقع القاعدة، والميزان الصرفي، والإعراب، مع ترجمة فورية إلى: English و Kannada و Urdu و Malayalam.
            </p>
          </div>
        </div>

        {/* 4 Languages Badge Pill */}
        <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto rounded-2xl bg-white/90 p-2 border border-emerald-200 shadow-2xs dark:bg-stone-800 dark:border-stone-700">
          <Globe2 className="h-4 w-4 text-emerald-700 dark:text-emerald-400 ml-1" />
          <span className="text-[11px] font-black text-stone-700 dark:text-stone-300">ترجمة فورية رباعية:</span>
          <span className="rounded-md bg-stone-100 px-1.5 py-0.5 text-[10px] font-bold dark:bg-stone-700">English 🇬🇧</span>
          <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300">ಕನ್ನಡ (Kannada) 🇮🇳</span>
          <span className="rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-amber-900 dark:bg-amber-950/60 dark:text-amber-300">اردو (Urdu) 🇵🇰</span>
          <span className="rounded-md bg-rose-50 px-1.5 py-0.5 text-[10px] font-bold text-rose-900 dark:bg-rose-950/60 dark:text-rose-300">മലയാളം (Malayalam) 🇮🇳</span>
        </div>
      </div>

      {/* Main Interactive Question Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAsk(questionInput);
        }}
        className="mt-6"
      >
        <div className="relative flex items-center rounded-2xl border-2 border-emerald-700/40 bg-white shadow-sm transition focus-within:border-emerald-700 focus-within:ring-2 focus-within:ring-emerald-700/20 dark:border-emerald-600/50 dark:bg-stone-800">
          <div className="pointer-events-none pr-4 text-emerald-700 dark:text-emerald-400">
            <HelpCircle className="h-6 w-6" />
          </div>
          <input
            type="text"
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
            placeholder="اكتب سؤالك هنا (مثال: ما الفرق بين الاسم والفعل؟ أو: ما إعراب وترجمة كلمة كَتَبَ أو سَارَ إلى الكانادا والأردية؟)..."
            className="w-full bg-transparent py-4 pr-3 pl-32 text-sm sm:text-base font-bold text-stone-950 placeholder-stone-400 focus:outline-none dark:text-stone-50 dark:placeholder-stone-500"
          />
          <div className="absolute left-2 flex items-center gap-1.5">
            {questionInput && (
              <button
                type="button"
                onClick={() => setQuestionInput('')}
                className="p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer"
                title="مسح السؤال"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <button
              type="submit"
              disabled={!questionInput.trim() || isLoading}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-800 px-4 py-2.5 text-xs sm:text-sm font-black text-white shadow-xs transition hover:bg-emerald-700 disabled:opacity-50 cursor-pointer dark:bg-emerald-600 dark:hover:bg-emerald-500"
            >
              <Sparkles className="h-4 w-4" />
              <span>{isLoading ? 'جاري التحليل...' : 'إجابة وشرح فوري 🚀'}</span>
            </button>
          </div>
        </div>
      </form>

      {/* Preset Question Pills for Quick 1-Click Questions */}
      <div className="mt-4">
        <div className="text-xs font-black text-stone-700 dark:text-stone-300 mb-2 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
          <span>أو انقر لاختيار سؤال فوري من الأسئلة الشائعة المقترحة:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESET_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuestionInput(q);
                handleAsk(q);
              }}
              className="rounded-xl border border-emerald-300/80 bg-white/90 px-3 py-1.5 text-xs font-bold text-stone-800 shadow-2xs transition hover:border-emerald-600 hover:bg-emerald-50 hover:text-emerald-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200 dark:hover:border-emerald-500 dark:hover:bg-emerald-950/40 cursor-pointer text-right"
            >
              «{q}»
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================
          USER BENCHMARK CARD: EXACT LAYOUT OF IMAGE_DDBA4712.PNG
      ======================================================== */}
      {displayWord && (
        <div className="mt-8 overflow-hidden rounded-3xl border-2 border-emerald-900/30 bg-stone-950/95 p-6 sm:p-8 text-stone-100 shadow-2xl transition-all">
          
          {/* Top Row: Word Type Pill, Category, Root, Wazn, Speak & Copy Buttons */}
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-stone-800 pb-5">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-black">
                <span className="rounded-lg bg-emerald-600/30 border border-emerald-500/60 px-3 py-1 text-xs font-black text-emerald-300">
                  {displayWord.wordType === 'verb' ? '⚡ فعل' : displayWord.wordType === 'noun' ? '📜 اسم' : '💎 مفردة'}
                </span>
                <span className="text-stone-600">·</span>
                <span className="text-amber-400 font-bold">🏷️ {displayWord.category}</span>
                {displayWord.root && (
                  <>
                    <span className="text-stone-600">·</span>
                    <span className="font-mono text-stone-300 bg-stone-900 border border-stone-800 px-2 py-0.5 rounded-md">
                      الجذر: {displayWord.root}
                    </span>
                  </>
                )}
                {displayWord.grammar?.wazn && (
                  <>
                    <span className="text-stone-600">·</span>
                    <span className="font-serif-arabic text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-800/40">
                      الوزن: ({displayWord.grammar.wazn})
                    </span>
                  </>
                )}
              </div>

              {/* Large Word / Concept Title */}
              <h4 className="font-serif-arabic mt-3 text-3xl sm:text-5xl font-black tracking-tight text-amber-400">
                {displayWord.word}
              </h4>
            </div>

            {/* Action Buttons: Audio Pronunciation & Copy Card */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSpeech(`${displayWord.word}. ${displayWord.meaning}`)}
                title="استمع لنطق الكلمة والشرح بالصوت"
                className="inline-flex items-center gap-1.5 rounded-xl bg-amber-950/70 border border-amber-800/50 px-3.5 py-2 text-xs font-black text-amber-300 transition hover:bg-amber-900 cursor-pointer"
              >
                <Volume2 className="h-4 w-4" />
                <span>نطق الكلمة 🎙️</span>
              </button>

              <button
                onClick={() => handleCopyCard(displayWord, activeResult || undefined)}
                title="نسخ البطاقة كاملة مع الشرح والترجمات"
                className="inline-flex items-center gap-1.5 rounded-xl bg-stone-900 border border-stone-800 px-3.5 py-2 text-xs font-black text-stone-300 transition hover:bg-stone-800 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span className="text-emerald-400">تم النسخ</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>نسخ البطاقة</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Section: Meaning in Arabic Dictionaries */}
          <div className="mt-5">
            <span className="block text-xs font-black text-stone-400 mb-1">
              📖 المعنى الدلالي في المعاجم العربية:
            </span>
            <p className="font-serif-arabic text-lg sm:text-xl font-bold text-amber-100 leading-relaxed">
              {displayWord.meaning}
            </p>
          </div>

          {/* Section: Grammar & Morphology Detailed Explanation Box */}
          <div className="mt-6 rounded-2xl border-2 border-emerald-800/40 bg-stone-900/90 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800 pb-3 mb-4">
              <span className="text-xs font-black text-emerald-400 flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" />
                <span>الشرح النحوي والصرفي المفصل (Grammar & Morphology Explanation):</span>
              </span>
              <span className="rounded-md bg-emerald-950 border border-emerald-800/60 px-2.5 py-1 text-xs font-black text-emerald-300">
                {displayWord.grammar.partOfSpeech}
              </span>
            </div>

            {/* 2 Sub-boxes: I'rab Cases and Wazn / Transitivity */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs sm:text-sm font-bold">
              <div className="rounded-xl bg-stone-950/80 p-3.5 border border-stone-800">
                <span className="text-xs font-black text-stone-400 block mb-1">
                  🎯 الحكم الإعرابي وحالات البناء:
                </span>
                <span className="font-serif-arabic text-stone-200 leading-relaxed">
                  {displayWord.grammar.irabCase}
                </span>
              </div>

              <div className="rounded-xl bg-stone-950/80 p-3.5 border border-stone-800">
                <span className="text-xs font-black text-stone-400 block mb-1">
                  ⚖️ الميزان الصرفي والاشتقاق:
                </span>
                <span className="font-serif-arabic text-base text-amber-300 font-black">
                  {displayWord.grammar.wazn}
                </span>
                {displayWord.grammar.transitivity && (
                  <span className="block mt-1 text-xs text-emerald-400">
                    • اللزوم والتعدي: {displayWord.grammar.transitivity}
                  </span>
                )}
              </div>
            </div>

            {/* Conjugation & Derivations Ribbon */}
            {displayWord.grammar.conjugationOrDerivatives && (
              <div className="mt-3 rounded-xl bg-stone-950/80 p-3.5 border border-stone-800 text-xs">
                <span className="font-black text-stone-400 block mb-2">
                  🔄 جدول التصريف والاشتقاق:
                </span>
                <div className="flex flex-wrap gap-2 text-xs font-bold font-serif-arabic">
                  {displayWord.grammar.conjugationOrDerivatives.past && (
                    <span className="rounded-md bg-stone-900 border border-stone-800 px-2.5 py-1 text-stone-200">
                      الماضي: {displayWord.grammar.conjugationOrDerivatives.past}
                    </span>
                  )}
                  {displayWord.grammar.conjugationOrDerivatives.present && (
                    <span className="rounded-md bg-stone-900 border border-stone-800 px-2.5 py-1 text-stone-200">
                      المضارع: {displayWord.grammar.conjugationOrDerivatives.present}
                    </span>
                  )}
                  {displayWord.grammar.conjugationOrDerivatives.imperative && (
                    <span className="rounded-md bg-stone-900 border border-stone-800 px-2.5 py-1 text-stone-200">
                      الأمر: {displayWord.grammar.conjugationOrDerivatives.imperative}
                    </span>
                  )}
                  {displayWord.grammar.conjugationOrDerivatives.verbalNoun && (
                    <span className="rounded-md bg-stone-900 border border-stone-800 px-2.5 py-1 text-amber-300">
                      المصدر: {displayWord.grammar.conjugationOrDerivatives.verbalNoun}
                    </span>
                  )}
                  {displayWord.grammar.conjugationOrDerivatives.activeParticiple && (
                    <span className="rounded-md bg-stone-900 border border-stone-800 px-2.5 py-1 text-emerald-300">
                      اسم الفاعل: {displayWord.grammar.conjugationOrDerivatives.activeParticiple}
                    </span>
                  )}
                  {displayWord.grammar.conjugationOrDerivatives.passiveParticiple && (
                    <span className="rounded-md bg-stone-900 border border-stone-800 px-2.5 py-1 text-indigo-300">
                      اسم المفعول: {displayWord.grammar.conjugationOrDerivatives.passiveParticiple}
                    </span>
                  )}
                  {displayWord.grammar.conjugationOrDerivatives.plural && (
                    <span className="rounded-md bg-stone-900 border border-stone-800 px-2.5 py-1 text-rose-300">
                      الجمع: {displayWord.grammar.conjugationOrDerivatives.plural}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Rule Explanation */}
            <div className="mt-3 rounded-xl bg-stone-950/80 p-3.5 border border-stone-800">
              <span className="text-xs font-black text-stone-400 block mb-1">
                القاعدة والشرح:
              </span>
              <p className="font-serif-arabic text-sm text-stone-300 leading-relaxed font-bold">
                {displayWord.grammar.ruleExplanation}
              </p>
            </div>

            {/* Example Sentence with Full I'rab Parsing */}
            {displayWord.grammar.exampleSentence && (
              <div className="mt-3 rounded-xl bg-stone-950/90 p-4 border border-emerald-800/40">
                <span className="text-xs font-black text-emerald-400 block mb-1">
                  المثال النموذجي:
                </span>
                <p className="font-serif-arabic text-base sm:text-lg font-black text-amber-300">
                  «{displayWord.grammar.exampleSentence}»
                </p>
                {displayWord.grammar.irabOfSentence && (
                  <div className="mt-2 text-xs sm:text-sm font-bold text-stone-300 leading-relaxed font-serif-arabic border-t border-stone-800 pt-2">
                    <span className="font-black text-emerald-400 ml-1">إعراب الجملة:</span>
                    {displayWord.grammar.irabOfSentence}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section: 4-Language Translation Matrix */}
          {displayWord.translations && (
            <div className="mt-6 rounded-2xl border-2 border-stone-800 bg-stone-900/80 p-5">
              <div className="flex items-center justify-between text-xs font-black text-stone-300 mb-3">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <Globe2 className="h-4 w-4" />
                  <span>الترجمات الرباعية المعتمدة (Translations to English, Kannada, Urdu, Malayalam):</span>
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                
                {/* 1. English */}
                <div className="rounded-xl bg-stone-950 p-3.5 border border-stone-800">
                  <div className="flex items-center justify-between text-xs font-black text-stone-400">
                    <span>الإنجليزية</span>
                    <span>English 🇬🇧</span>
                  </div>
                  <p className="mt-1.5 text-sm font-bold text-stone-100 ltr text-left">
                    {displayWord.translations.english}
                  </p>
                  {displayWord.translations.englishPhonetic && (
                    <span className="block mt-1 text-[11px] font-mono text-emerald-400 ltr text-left">
                      [{displayWord.translations.englishPhonetic}]
                    </span>
                  )}
                </div>

                {/* 2. Kannada */}
                <div className="rounded-xl bg-stone-950 p-3.5 border border-stone-800">
                  <div className="flex items-center justify-between text-xs font-black text-emerald-400">
                    <span>الكانادا</span>
                    <span>ಕನ್ನಡ 🇮🇳</span>
                  </div>
                  <p className="mt-1.5 text-sm font-bold text-stone-100 ltr text-left">
                    {displayWord.translations.kannada}
                  </p>
                </div>

                {/* 3. Urdu */}
                <div className="rounded-xl bg-stone-950 p-3.5 border border-stone-800">
                  <div className="flex items-center justify-between text-xs font-black text-amber-400">
                    <span>الأردية</span>
                    <span>اردو 🇵🇰</span>
                  </div>
                  <p className="mt-1.5 text-base font-bold text-stone-100 font-serif-arabic">
                    {displayWord.translations.urdu}
                  </p>
                </div>

                {/* 4. Malayalam */}
                <div className="rounded-xl bg-stone-950 p-3.5 border border-stone-800">
                  <div className="flex items-center justify-between text-xs font-black text-rose-400">
                    <span>المالايالامية</span>
                    <span>മലയാളം 🇮🇳</span>
                  </div>
                  <p className="mt-1.5 text-sm font-bold text-stone-100 ltr text-left">
                    {displayWord.translations.malayalam}
                  </p>
                </div>

              </div>
            </div>
          )}

          {/* Synonyms & Antonyms Row */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            
            {/* Synonyms */}
            {displayWord.synonyms && displayWord.synonyms.length > 0 && (
              <div className="rounded-xl bg-stone-900/80 p-4 border border-stone-800">
                <span className="text-xs font-black text-emerald-400 block mb-2">
                  ✨ المترادفات البلاغية ({displayWord.synonyms.length}):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {displayWord.synonyms.map((s, idx) => (
                    <span
                      key={idx}
                      className="rounded-lg bg-emerald-950/60 border border-emerald-800/40 px-2.5 py-1 text-xs font-bold font-serif-arabic text-emerald-200"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Antonyms */}
            {displayWord.antonyms && displayWord.antonyms.length > 0 && (
              <div className="rounded-xl bg-stone-900/80 p-4 border border-stone-800">
                <span className="text-xs font-black text-rose-400 block mb-2">
                  ⚖️ الأضداد في لغة العرب ({displayWord.antonyms.length}):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {displayWord.antonyms.map((a, idx) => (
                    <span
                      key={idx}
                      className="rounded-lg bg-rose-950/60 border border-rose-800/40 px-2.5 py-1 text-xs font-bold font-serif-arabic text-rose-200"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Poetic Witness Box */}
          {displayWord.verseExample && (
            <div className="mt-6 rounded-2xl bg-gradient-to-r from-amber-950/40 via-stone-900 to-amber-950/40 p-4 border border-amber-800/40">
              <div className="flex items-center justify-between text-xs font-black text-amber-400 mb-1">
                <span className="flex items-center gap-1.5">
                  <Feather className="h-4 w-4" />
                  <span>الشاهد الشعري والبلاغي:</span>
                </span>
                {displayWord.verseAuthor && (
                  <span className="text-stone-400 font-bold">{displayWord.verseAuthor}</span>
                )}
              </div>
              <p className="font-serif-arabic text-base sm:text-lg font-black text-amber-200 leading-relaxed text-center py-2">
                «{displayWord.verseExample}»
              </p>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
