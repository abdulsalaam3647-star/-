import React, { useState, useMemo, useRef } from 'react';
import { SynonymWord, WordType } from '../types';
import { DICTIONARY_WORDS } from '../data/initialData';
import { Search, Volume2, Copy, Check, Sparkles, BookA, Filter, X, PlusCircle, Feather, Globe2, BookOpen, Layers, CheckCircle2 } from 'lucide-react';
import { SectionVisitorBanner } from './SectionVisitorBanner';
import { GrammarQABar } from './GrammarQABar';
import { soundFX } from '../utils/sound';

interface DictionarySectionProps {
  onOpenSuggestWord?: () => void;
}

// Arabic search text normalizer (removes diacritics/tashkeel and unifies hamzas)
function normalizeArabic(text: string): string {
  return text
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .replace(/[إأآا]/g, 'ا')
    .replace(/[ى]/g, 'ي')
    .replace(/[ة]/g, 'ه')
    .toLowerCase();
}

export const DictionarySection: React.FC<DictionarySectionProps> = ({ onOpenSuggestWord }) => {
  // State for words list with localStorage persistence
  const [dictionaryWords, setDictionaryWords] = useState<SynonymWord[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('shujaa_dictionary_words');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Check that saved data has the new grammar and translations schema
          if (Array.isArray(parsed) && parsed.length >= 10 && parsed[0]?.grammar && parsed[0]?.translations) {
            return parsed;
          }
        } catch {
          // fallback
        }
      }
    }
    return DICTIONARY_WORDS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWordType, setSelectedWordType] = useState<string>('all'); // 'all' | 'verb' | 'noun' | 'vocabulary'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form state for visitor adding a new word
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWord, setNewWord] = useState('');
  const [newWordType, setNewWordType] = useState<WordType>('verb');
  const [newRoot, setNewRoot] = useState('');
  const [newWazn, setNewWazn] = useState('');
  const [newCategory, setNewCategory] = useState('أفعال الحركة والبيان');
  const [newMeaning, setNewMeaning] = useState('');
  const [newIrabCase, setNewIrabCase] = useState('');
  const [newGrammarRule, setNewGrammarRule] = useState('');
  const [newEnglish, setNewEnglish] = useState('');
  const [newKannada, setNewKannada] = useState('');
  const [newUrdu, setNewUrdu] = useState('');
  const [newMalayalam, setNewMalayalam] = useState('');
  const [newSynonyms, setNewSynonyms] = useState('');
  const [newAntonyms, setNewAntonyms] = useState('');
  const [newVerse, setNewVerse] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Copy word information with full grammar and 4-language translations
  const handleCopyWord = (item: SynonymWord) => {
    soundFX.playClick();
    const text = `المفردة: ${item.word} (${item.typeLabel})\nالجذر: ${item.root || '-'}\nالوزن الصرفي: ${item.grammar?.wazn || '-'}\nالتصنيف: ${item.category}\nالمعنى: ${item.meaning}\nالحكم الإعرابي: ${item.grammar?.irabCase || '-'}\nالشرح النحوي: ${item.grammar?.ruleExplanation || '-'}\n\nالترجمات الرباعية:\n- English: ${item.translations?.english || '-'}\n- Kannada (ಕನ್ನಡ): ${item.translations?.kannada || '-'}\n- Urdu (اردو): ${item.translations?.urdu || '-'}\n- Malayalam (മലയാളം): ${item.translations?.malayalam || '-'}\n\nالمترادفات: ${item.synonyms.join('، ')}\nالأضداد: ${item.antonyms.join('، ')}${item.verseExample ? `\nالشاهد: ${item.verseExample} (${item.verseAuthor || ''})` : ''}`;
    
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  // Speak word aloud using browser synthesis in clear Arabic
  const handleSpeak = (word: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    soundFX.playClick();
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.85;

    const voices = window.speechSynthesis.getVoices();
    const arVoice = voices.find((v) => v.lang.startsWith('ar'));
    if (arVoice) utterance.voice = arVoice;

    window.speechSynthesis.speak(utterance);
  };

  // Submit visitor suggestion
  const handleAddCustomWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord.trim() || !newMeaning.trim()) {
      return;
    }

    soundFX.playSuccess();
    const created: SynonymWord = {
      id: `syn-user-${Date.now()}`,
      word: newWord.trim(),
      wordType: newWordType,
      typeLabel: newWordType === 'verb' ? 'فعل' : newWordType === 'noun' ? 'اسم' : 'مفردة بلاغية',
      root: newRoot.trim() || undefined,
      category: newCategory.trim() || 'معاجم وفصاحة',
      meaning: newMeaning.trim(),
      synonyms: newSynonyms.split('،').map((s) => s.trim()).filter(Boolean),
      antonyms: newAntonyms.split('،').map((s) => s.trim()).filter(Boolean),
      grammar: {
        partOfSpeech: `${newWordType === 'verb' ? 'فعل' : newWordType === 'noun' ? 'اسم' : 'مفردة بلاغية'} (إضافة الزائر)`,
        wazn: newWazn.trim() || 'فَعَلَ',
        irabCase: newIrabCase.trim() || 'معرب بالحركات الأصلية الظاهرة بحسب موقعه في الجملة.',
        ruleExplanation: newGrammarRule.trim() || 'كلمة عربية فصيحة مدونة في المعاجم.',
        exampleSentence: newVerse.trim() || undefined,
        irabOfSentence: newAuthor.trim() || undefined,
      },
      translations: {
        english: newEnglish.trim() || 'Arabic Vocabulary',
        kannada: newKannada.trim() || 'ಅರಬ್ಬಿ ಪದ',
        urdu: newUrdu.trim() || 'عربی لفظ',
        malayalam: newMalayalam.trim() || 'അറബിക് പദം',
      },
      verseExample: newVerse.trim() || undefined,
      verseAuthor: newAuthor.trim() || undefined,
    };

    const updated = [created, ...dictionaryWords];
    setDictionaryWords(updated);
    localStorage.setItem('shujaa_dictionary_words', JSON.stringify(updated));

    setNewWord('');
    setNewRoot('');
    setNewWazn('');
    setNewMeaning('');
    setNewIrabCase('');
    setNewGrammarRule('');
    setNewEnglish('');
    setNewKannada('');
    setNewUrdu('');
    setNewMalayalam('');
    setNewSynonyms('');
    setNewAntonyms('');
    setNewVerse('');
    setNewAuthor('');
    setFormSuccess('✨ تم حفظ وإضافة الكلمة والشرح النحوي والترجمات بنجاح!');
    setTimeout(() => {
      setFormSuccess(null);
      setShowAddForm(false);
    }, 2500);
  };

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    dictionaryWords.forEach((w) => set.add(w.category));
    return ['all', ...Array.from(set)];
  }, [dictionaryWords]);

  // Letters list for quick jump
  const letters = useMemo(() => {
    const set = new Set<string>();
    dictionaryWords.forEach((w) => {
      const clean = normalizeArabic(w.word);
      if (clean.length > 0) {
        set.add(clean.charAt(0));
      }
    });
    return Array.from(set).sort();
  }, [dictionaryWords]);

  // Filtered words
  const filteredWords = useMemo(() => {
    return dictionaryWords.filter((w) => {
      // Word Type filter (Verb, Noun, Vocabulary)
      if (selectedWordType !== 'all' && w.wordType !== selectedWordType) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && w.category !== selectedCategory) {
        return false;
      }

      // Letter filter
      if (selectedLetter && !normalizeArabic(w.word).startsWith(selectedLetter)) {
        return false;
      }

      // Word ID selected from up-side quick-selector
      if (selectedWordId && w.id !== selectedWordId) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = normalizeArabic(searchQuery.trim());
        const wordMatch = normalizeArabic(w.word).includes(q);
        const rootMatch = w.root && normalizeArabic(w.root).includes(q);
        const meaningMatch = normalizeArabic(w.meaning).includes(q);
        const waznMatch = w.grammar?.wazn && normalizeArabic(w.grammar.wazn).includes(q);
        const synMatch = w.synonyms.some((s) => normalizeArabic(s).includes(q));
        const antMatch = w.antonyms.some((a) => normalizeArabic(a).includes(q));
        const engMatch = w.translations?.english && w.translations.english.toLowerCase().includes(q.toLowerCase());
        const urduMatch = w.translations?.urdu && normalizeArabic(w.translations.urdu).includes(q);
        return wordMatch || rootMatch || meaningMatch || waznMatch || synMatch || antMatch || engMatch || urduMatch;
      }

      return true;
    });
  }, [dictionaryWords, selectedWordType, selectedCategory, selectedLetter, selectedWordId, searchQuery]);

  const verbsCount = useMemo(() => dictionaryWords.filter((w) => w.wordType === 'verb').length, [dictionaryWords]);
  const nounsCount = useMemo(() => dictionaryWords.filter((w) => w.wordType === 'noun').length, [dictionaryWords]);
  const vocCount = useMemo(() => dictionaryWords.filter((w) => w.wordType === 'vocabulary').length, [dictionaryWords]);

  return (
    <section className="py-12 sm:py-16 text-right">
      
      {/* SECTION HEADER: High section name banner with bold typography */}
      <div className="mb-10 text-right">
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-200/80 px-4 py-1.5 text-xs font-black text-amber-950 shadow-xs dark:bg-amber-950/70 dark:text-amber-200">
          <span>📖 اسم القسم: معجم الأفعال والأسماء والمفردات والشرح النحوي والترجمة</span>
          <span aria-hidden="true">·</span>
          <span>كنوز لسان العرب</span>
        </div>
        <h2 className="font-serif-arabic mt-3 text-3xl sm:text-4xl font-black tracking-tight text-stone-950 dark:text-stone-50">
          معجم الأفعال والأسماء وقواعد النحو والترجمة الرباعية 🌐
        </h2>
        <p className="mt-2 text-sm sm:text-base font-bold text-stone-600 dark:text-stone-300 max-w-4xl leading-relaxed">
          قاموسٌ لغوي نحوي شامل يجمع الأفعال (الماضية والمضارعة والأمر)، والأسماء (المشتقة والجامدة)، والمفردات البلاغية؛ مع شرحٍ نحوي وصرفي مفصل لكل مفردة على حدة، وإعراب نموذجي، وترجمة معتمدة إلى: الإنجليزية، الكانادا (ಕನ್ನಡ)، الأردية (اردو)، والمالايالامية (മലയാളം).
        </p>
      </div>

      {/* 1. INTERACTIVE QUESTION & EXPLANATION BAR (USER REQUEST: Give me a bar when asked a question then you answer and explain) */}
      <GrammarQABar
        dictionaryWords={dictionaryWords}
        onSelectWord={(id) => {
          setSelectedWordId(id);
          const el = document.getElementById(`word-${id}`);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 2. UP SIDE SEARCH LINK & WORD SELECTOR BAR */}
      <div className="mb-10 overflow-hidden rounded-3xl border-2 border-amber-900/15 bg-gradient-to-br from-amber-50 via-white to-rose-50/40 p-6 sm:p-8 shadow-sm dark:border-stone-800 dark:from-stone-900 dark:via-stone-900 dark:to-stone-900">
        
        {/* Search header row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-200/60 pb-4 dark:border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-200/80 text-amber-950 dark:bg-amber-500/20 dark:text-amber-300 shadow-xs">
              <BookA className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif-arabic text-xl sm:text-2xl font-black text-stone-950 dark:text-stone-50">
                محرك البحث واختيار المفردات في المعجم 🔍
              </h3>
              <p className="text-xs font-bold text-stone-500 dark:text-stone-400">
                ابحث بالكلمة، أو الجذر، أو المترادف، أو اختر الكلمة مباشرة من الشريط العلوي
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-1.5 rounded-2xl bg-amber-900 px-4 py-2 text-xs font-black text-white shadow-xs transition hover:bg-amber-800 dark:bg-amber-700 dark:hover:bg-amber-600 cursor-pointer self-start sm:self-auto"
          >
            <PlusCircle className="h-4 w-4" />
            <span>{showAddForm ? 'إغلاق نموذج الإضافة' : '✍️ أضف فعلاً أو اسماً جديداً للمعجم'}</span>
          </button>
        </div>

        {/* PARTS OF SPEECH FILTER TABS: VERBS, NOUNS, VOCABULARIES */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="text-xs font-black text-stone-600 dark:text-stone-300 flex items-center gap-1">
            <Layers className="h-4 w-4 text-amber-700 dark:text-amber-400" />
            <span>نوع الكلمة النحوي:</span>
          </span>

          <button
            onClick={() => {
              soundFX.playClick();
              setSelectedWordType('all');
              setSelectedWordId(null);
            }}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-black transition cursor-pointer whitespace-nowrap shadow-xs ${
              selectedWordType === 'all'
                ? 'bg-amber-900 text-white dark:bg-amber-600'
                : 'bg-white text-stone-800 border border-stone-200 hover:bg-stone-100 dark:bg-stone-800 dark:text-stone-200 dark:border-stone-700'
            }`}
          >
            الكل ({dictionaryWords.length}) ✨
          </button>

          <button
            onClick={() => {
              soundFX.playClick();
              setSelectedWordType('verb');
              setSelectedWordId(null);
            }}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-black transition cursor-pointer whitespace-nowrap shadow-xs ${
              selectedWordType === 'verb'
                ? 'bg-emerald-800 text-white dark:bg-emerald-600'
                : 'bg-white text-emerald-900 border border-emerald-200 hover:bg-emerald-50 dark:bg-stone-800 dark:text-emerald-300 dark:border-stone-700'
            }`}
          >
            ⚡ الأفعال (Verbs) ({verbsCount})
          </button>

          <button
            onClick={() => {
              soundFX.playClick();
              setSelectedWordType('noun');
              setSelectedWordId(null);
            }}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-black transition cursor-pointer whitespace-nowrap shadow-xs ${
              selectedWordType === 'noun'
                ? 'bg-indigo-800 text-white dark:bg-indigo-600'
                : 'bg-white text-indigo-900 border border-indigo-200 hover:bg-indigo-50 dark:bg-stone-800 dark:text-indigo-300 dark:border-stone-700'
            }`}
          >
            📜 الأسماء (Nouns) ({nounsCount})
          </button>

          <button
            onClick={() => {
              soundFX.playClick();
              setSelectedWordType('vocabulary');
              setSelectedWordId(null);
            }}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-black transition cursor-pointer whitespace-nowrap shadow-xs ${
              selectedWordType === 'vocabulary'
                ? 'bg-rose-800 text-white dark:bg-rose-600'
                : 'bg-white text-rose-900 border border-rose-200 hover:bg-rose-50 dark:bg-stone-800 dark:text-rose-300 dark:border-stone-700'
            }`}
          >
            💎 المفردات والتراكيب البلاغية ({vocCount})
          </button>
        </div>

        {/* Search Input Box */}
        <div className="mt-5">
          <div className="relative flex items-center rounded-2xl border-2 border-stone-300 bg-white shadow-xs transition focus-within:border-amber-800 focus-within:ring-2 focus-within:ring-amber-800/20 dark:border-stone-700 dark:bg-stone-800">
            <div className="pointer-events-none pr-4 text-stone-400">
              <Search className="h-5 w-5" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (selectedWordId) setSelectedWordId(null);
              }}
              placeholder="ابحث بأي فعل أو اسم (مثال: سَارَ، كَتَبَ، قَرَأَ، العَسْجَدُ، الحِكْمَةُ)، أو الجذر، أو الميزان الصرفي، أو بالإنجليزية/الأردية..."
              className="w-full bg-transparent py-3.5 pr-3 pl-4 text-sm font-bold text-stone-950 placeholder-stone-400 focus:outline-none dark:text-stone-50 dark:placeholder-stone-500"
            />
            {(searchQuery || selectedWordId || selectedLetter || selectedWordType !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedWordId(null);
                  setSelectedLetter(null);
                  setSelectedWordType('all');
                  setSelectedCategory('all');
                }}
                className="pl-4 text-xs font-black text-rose-600 hover:text-rose-800 dark:text-rose-400 cursor-pointer flex items-center gap-1"
              >
                <X className="h-3.5 w-3.5" />
                <span>إعادة ضبط البحث</span>
              </button>
            )}
          </div>
        </div>

        {/* UP SIDE: QUICK WORD SELECTOR CHIPS WITH TYPE BADGES */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs font-black text-amber-950 dark:text-amber-300 mb-2">
            <span>✨ انقر لاختيار الكلمة مباشرة وعرض تفاصيلها النحوية وترجماتها الرباعية:</span>
            <span className="text-stone-500 font-bold">{filteredWords.length} مفردة معروضة</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 max-h-40 overflow-y-auto p-1 scrollbar-thin">
            {dictionaryWords.map((item) => {
              const isSelected = selectedWordId === item.id;
              const typeIcon = item.wordType === 'verb' ? '⚡' : item.wordType === 'noun' ? '📜' : '💎';
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    soundFX.playClick();
                    if (isSelected) {
                      setSelectedWordId(null);
                    } else {
                      setSelectedWordId(item.id);
                      setSearchQuery('');
                      setSelectedLetter(null);
                    }
                  }}
                  className={`rounded-xl px-3 py-1.5 text-xs font-black transition cursor-pointer whitespace-nowrap shadow-xs flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-amber-900 text-white scale-105 shadow-md dark:bg-amber-600 ring-2 ring-amber-500'
                      : 'bg-white text-stone-800 border border-stone-200 hover:border-amber-700 hover:bg-amber-50 dark:bg-stone-800 dark:text-stone-200 dark:border-stone-700 dark:hover:border-amber-500'
                  }`}
                >
                  <span className="text-[10px] opacity-75">{typeIcon}</span>
                  <span>{item.word}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Filters row */}
        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-amber-200/40 pt-4 dark:border-stone-800">
          <span className="text-xs font-black text-stone-600 dark:text-stone-300 flex items-center gap-1">
            <Filter className="h-3.5 w-3.5" />
            <span>التصنيف الدلالي:</span>
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                soundFX.playClick();
                setSelectedCategory(cat);
                setSelectedWordId(null);
              }}
              className={`rounded-xl px-3 py-1 text-xs font-black transition cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-rose-700 text-white shadow-xs dark:bg-rose-600'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300'
              }`}
            >
              {cat === 'all' ? 'كافة التصنيفات ✨' : cat}
            </button>
          ))}
        </div>

      </div>

      {/* Visitor Form: Add New Word with Grammar & Translations to Dictionary */}
      {showAddForm && (
        <div className="mb-12 rounded-3xl border-2 border-amber-300 bg-amber-50/60 p-6 sm:p-8 text-right dark:border-stone-700 dark:bg-stone-900">
          <div className="mb-4 flex items-center justify-between border-b border-amber-200 pb-3 dark:border-stone-800">
            <h3 className="font-serif-arabic text-xl sm:text-2xl font-black text-stone-950 dark:text-stone-50 flex items-center gap-2">
              <Feather className="h-5 w-5 text-amber-800 dark:text-amber-400" />
              <span>إضافة فعل أو اسم مع شرحه النحوي وترجماته الرباعية</span>
            </h3>
            <span className="text-xs font-bold text-amber-900 dark:text-amber-300">توثيق مباشر ومتاح للجميع</span>
          </div>

          <form onSubmit={handleAddCustomWord} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
              <div>
                <label className="block text-xs font-black text-stone-800 dark:text-stone-200">
                  الكلمة بالتشكيل:
                </label>
                <input
                  type="text"
                  required
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  placeholder="مثال: انْتَصَرَ / السَّيْفُ"
                  className="mt-1 w-full rounded-xl border border-stone-300 bg-white p-2.5 text-sm font-bold text-stone-900 focus:border-amber-800 focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-stone-800 dark:text-stone-200">
                  نوع الكلمة النحوي:
                </label>
                <select
                  value={newWordType}
                  onChange={(e) => setNewWordType(e.target.value as WordType)}
                  className="mt-1 w-full rounded-xl border border-stone-300 bg-white p-2.5 text-sm font-bold text-stone-900 focus:border-amber-800 focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
                >
                  <option value="verb">فعل (Verb)</option>
                  <option value="noun">اسم (Noun)</option>
                  <option value="vocabulary">مفردة بلاغية (Vocabulary)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-stone-800 dark:text-stone-200">
                  الجذر اللغوي:
                </label>
                <input
                  type="text"
                  value={newRoot}
                  onChange={(e) => setNewRoot(e.target.value)}
                  placeholder="مثال: ن-ص-ر / س-ي-ف"
                  className="mt-1 w-full rounded-xl border border-stone-300 bg-white p-2.5 text-sm font-bold text-stone-900 focus:border-amber-800 focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-stone-800 dark:text-stone-200">
                  الوزن الصرفي (Wazn):
                </label>
                <input
                  type="text"
                  value={newWazn}
                  onChange={(e) => setNewWazn(e.target.value)}
                  placeholder="مثال: افْتَعَلَ / فَعْل"
                  className="mt-1 w-full rounded-xl border border-stone-300 bg-white p-2.5 text-sm font-bold text-stone-900 focus:border-amber-800 focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-stone-800 dark:text-stone-200">
                الشرح والمعنى الدلالي في المعاجم:
              </label>
              <textarea
                required
                rows={2}
                value={newMeaning}
                onChange={(e) => setNewMeaning(e.target.value)}
                placeholder="اكتب المعنى الدقيق للكلمة من لسان العرب أو القاموس المحيط..."
                className="mt-1 w-full rounded-xl border border-stone-300 bg-white p-2.5 text-sm font-bold text-stone-900 focus:border-amber-800 focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-black text-stone-800 dark:text-stone-200">
                  الحكم الإعرابي:
                </label>
                <input
                  type="text"
                  value={newIrabCase}
                  onChange={(e) => setNewIrabCase(e.target.value)}
                  placeholder="مثال: مبني على الفتح الظاهر / معرب بالضمة رفعاً"
                  className="mt-1 w-full rounded-xl border border-stone-300 bg-white p-2.5 text-sm font-bold text-stone-900 focus:border-amber-800 focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-stone-800 dark:text-stone-200">
                  شرح القاعدة النحوية والصرفية:
                </label>
                <input
                  type="text"
                  value={newGrammarRule}
                  onChange={(e) => setNewGrammarRule(e.target.value)}
                  placeholder="مثال: صيغ على وزن افتعل للدلالة على المبالغة في الانتصار والطلب"
                  className="mt-1 w-full rounded-xl border border-stone-300 bg-white p-2.5 text-sm font-bold text-stone-900 focus:border-amber-800 focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
                />
              </div>
            </div>

            {/* 4 Languages Translation Inputs */}
            <div className="rounded-2xl border border-amber-300/80 bg-white/70 p-4 dark:border-stone-700 dark:bg-stone-800/80">
              <span className="block text-xs font-black text-stone-800 dark:text-stone-200 mb-2">
                🌐 الترجمات الرباعية للكلمة (English, Kannada, Urdu, Malayalam):
              </span>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                <div>
                  <label className="block text-[11px] font-black text-stone-600 dark:text-stone-400">
                    English 🇬🇧
                  </label>
                  <input
                    type="text"
                    value={newEnglish}
                    onChange={(e) => setNewEnglish(e.target.value)}
                    placeholder="e.g. triumphed / sword"
                    className="mt-1 w-full rounded-lg border border-stone-300 p-2 text-xs font-bold text-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 ltr text-left"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-emerald-800 dark:text-emerald-400">
                    Kannada 🇮🇳 (ಕನ್ನಡ)
                  </label>
                  <input
                    type="text"
                    value={newKannada}
                    onChange={(e) => setNewKannada(e.target.value)}
                    placeholder="ಉದಾ: ಗೆದ್ದನು / ಖಡ್ಗ"
                    className="mt-1 w-full rounded-lg border border-stone-300 p-2 text-xs font-bold text-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 ltr text-left"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-amber-800 dark:text-amber-400">
                    Urdu 🇵🇰 (اردو)
                  </label>
                  <input
                    type="text"
                    value={newUrdu}
                    onChange={(e) => setNewUrdu(e.target.value)}
                    placeholder="مثال: فتح یاب ہوا / تلوار"
                    className="mt-1 w-full rounded-lg border border-stone-300 p-2 text-xs font-bold text-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-rose-800 dark:text-rose-400">
                    Malayalam 🇮🇳 (മലയാളം)
                  </label>
                  <input
                    type="text"
                    value={newMalayalam}
                    onChange={(e) => setNewMalayalam(e.target.value)}
                    placeholder="ഉദാ: വിജയിച്ചു / വാൾ"
                    className="mt-1 w-full rounded-lg border border-stone-300 p-2 text-xs font-bold text-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 ltr text-left"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-black text-stone-800 dark:text-stone-200">
                  قائمة المترادفات (افصل بينها بفاصلة):
                </label>
                <input
                  type="text"
                  value={newSynonyms}
                  onChange={(e) => setNewSynonyms(e.target.value)}
                  placeholder="مثال: فازَ، ظَفِرَ، غَلَبَ"
                  className="mt-1 w-full rounded-xl border border-stone-300 bg-white p-2.5 text-sm font-bold text-stone-900 focus:border-amber-800 focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-stone-800 dark:text-stone-200">
                  قائمة الأضداد (افصل بينها بفاصلة):
                </label>
                <input
                  type="text"
                  value={newAntonyms}
                  onChange={(e) => setNewAntonyms(e.target.value)}
                  placeholder="مثال: انْهَزَمَ، خَسِرَ، فَشِلَ"
                  className="mt-1 w-full rounded-xl border border-stone-300 bg-white p-2.5 text-sm font-bold text-stone-900 focus:border-amber-800 focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-black text-stone-800 dark:text-stone-200">
                  شاهد شعري أو أدبي (اختياري):
                </label>
                <input
                  type="text"
                  value={newVerse}
                  onChange={(e) => setNewVerse(e.target.value)}
                  placeholder="مثال: انْتَصَرَ الحَقُّ فَأَزْهَقَ البَاطِلا..."
                  className="mt-1 w-full rounded-xl border border-stone-300 bg-white p-2.5 text-sm font-bold text-stone-900 focus:border-amber-800 focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 font-serif-arabic"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-stone-800 dark:text-stone-200">
                  قائل البيت أو المصدر (اختياري):
                </label>
                <input
                  type="text"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder="مثال: الشاعر شجاع / المتنبي"
                  className="mt-1 w-full rounded-xl border border-stone-300 bg-white p-2.5 text-sm font-bold text-stone-900 focus:border-amber-800 focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
                />
              </div>
            </div>

            {formSuccess && (
              <div className="rounded-xl bg-emerald-50 p-3 text-xs font-black text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>{formSuccess}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="rounded-xl border border-stone-300 px-4 py-2 text-xs font-bold text-stone-700 transition hover:bg-stone-100 dark:border-stone-700 dark:text-stone-300 cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="rounded-xl bg-amber-900 px-6 py-2.5 text-xs font-black text-white shadow-xs transition hover:bg-amber-800 dark:bg-amber-700 dark:hover:bg-amber-600 cursor-pointer"
              >
                حفظ الكلمة وشرحها في المعجم فوراً 🚀
              </button>
            </div>
          </form>
        </div>
      )}

      {/* WORDS & VERBS & NOUNS CARDS GRID */}
      <div className="space-y-8">
        {filteredWords.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-stone-300 p-12 text-center dark:border-stone-800">
            <p className="font-serif-arabic text-xl font-black text-stone-800 dark:text-stone-200">
              لم نعثر على مفردات تطابق بحثك: «{searchQuery}»
            </p>
            <p className="mt-1 text-xs font-bold text-stone-500 dark:text-stone-400">
              جرب البحث بكلمة أخرى أو اختر مفردة من الشريط العلوي.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedWordId(null);
                setSelectedWordType('all');
                setSelectedCategory('all');
              }}
              className="mt-4 rounded-xl bg-amber-900 px-4 py-2 text-xs font-black text-white hover:bg-amber-800 cursor-pointer"
            >
              عرض كافة الأفعال والأسماء
            </button>
          </div>
        ) : (
          filteredWords.map((item) => {
            const isCopied = copiedId === item.id;
            const typeBadgeColor =
              item.wordType === 'verb'
                ? 'bg-emerald-100 text-emerald-950 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-200'
                : item.wordType === 'noun'
                ? 'bg-indigo-100 text-indigo-950 border-indigo-300 dark:bg-indigo-950/80 dark:text-indigo-200'
                : 'bg-rose-100 text-rose-950 border-rose-300 dark:bg-rose-950/80 dark:text-rose-200';

            return (
              <article
                key={item.id}
                id={`word-${item.id}`}
                className="group relative rounded-3xl border-2 border-stone-200/80 bg-white p-6 sm:p-8 shadow-sm transition-all duration-300 hover:border-amber-700/40 hover:shadow-lg dark:border-stone-800 dark:bg-stone-900/95 text-right"
              >
                {/* Header row: Word, Root, Category, and Action buttons */}
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-stone-200/80 pb-5 dark:border-stone-800">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-black">
                      <span className={`rounded-lg px-2.5 py-1 border text-[11px] font-black ${typeBadgeColor}`}>
                        {item.wordType === 'verb' ? '⚡ فعل' : item.wordType === 'noun' ? '📜 اسم' : '💎 مفردة بلاغية'}
                      </span>
                      <span className="text-stone-500">·</span>
                      <span className="text-amber-950 dark:text-amber-400">🏷️ {item.category}</span>
                      {item.root && (
                        <>
                          <span className="text-stone-500">·</span>
                          <span className="font-mono text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-md">
                            الجذر: {item.root}
                          </span>
                        </>
                      )}
                      {item.grammar?.wazn && (
                        <>
                          <span className="text-stone-500">·</span>
                          <span className="font-serif-arabic text-stone-800 dark:text-stone-200 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-md border border-amber-200/60 dark:border-amber-900/40">
                            الوزن: ({item.grammar.wazn})
                          </span>
                        </>
                      )}
                    </div>

                    <h3 className="font-serif-arabic mt-3 text-3xl sm:text-4xl font-black tracking-tight text-amber-950 dark:text-amber-200 group-hover:text-amber-800 dark:group-hover:text-amber-300 transition-colors">
                      {item.word}
                    </h3>
                  </div>

                  {/* Audio speak & copy button */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSpeak(item.word)}
                      title="استمع لنطق الكلمة الفصيحة"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-amber-50 px-3.5 py-2 text-xs font-black text-amber-900 transition hover:bg-amber-100 dark:bg-amber-950/60 dark:text-amber-300 dark:hover:bg-amber-950 cursor-pointer"
                    >
                      <Volume2 className="h-4 w-4" />
                      <span>نطق الكلمة 🎙️</span>
                    </button>

                    <button
                      onClick={() => handleCopyWord(item)}
                      title="نسخ البطاقة كاملة مع الشرح والترجمات"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-stone-100 px-3.5 py-2 text-xs font-bold text-stone-700 transition hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700 cursor-pointer"
                    >
                      {isCopied ? (
                        <>
                          <Check className="h-4 w-4 text-emerald-600" />
                          <span className="text-emerald-700 dark:text-emerald-400">تم النسخ</span>
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

                {/* Meaning Explanation in Dictionaries */}
                <div className="mt-4">
                  <p className="text-xs font-black text-stone-500 dark:text-stone-400 mb-1">
                    📖 المعنى الدلالي في المعاجم العربية:
                  </p>
                  <p className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 leading-relaxed font-serif-arabic">
                    {item.meaning}
                  </p>
                </div>

                {/* USER REQUIREMENT: EXPLAIN ALL GRAMMARS FOR ONE BY ONE */}
                {item.grammar && (
                  <div className="mt-5 rounded-2xl border-2 border-emerald-800/15 bg-gradient-to-br from-emerald-50/50 via-white to-stone-50/50 p-5 dark:border-emerald-600/20 dark:from-stone-900 dark:via-stone-900 dark:to-emerald-950/20">
                    <div className="flex items-center justify-between border-b border-emerald-200/60 pb-3 mb-3 dark:border-stone-800">
                      <span className="text-xs font-black text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                        <BookOpen className="h-4 w-4" />
                        <span>الشرح النحوي والصرفي المفصل (Grammar & Morphology Explanation):</span>
                      </span>
                      <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-black text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
                        {item.grammar.partOfSpeech}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs sm:text-sm font-bold text-stone-800 dark:text-stone-200">
                      <div className="rounded-xl bg-white/80 p-3 border border-stone-200 dark:bg-stone-800 dark:border-stone-700">
                        <span className="text-xs font-black text-stone-500 dark:text-stone-400 block mb-1">
                          ⚖️ الميزان الصرفي والوزن:
                        </span>
                        <span className="font-serif-arabic text-base text-amber-950 dark:text-amber-300 font-black">
                          {item.grammar.wazn}
                        </span>
                        {item.grammar.transitivity && (
                          <span className="block mt-1 text-xs text-emerald-800 dark:text-emerald-300">
                            • اللزوم والتعدي: {item.grammar.transitivity}
                          </span>
                        )}
                      </div>

                      <div className="rounded-xl bg-white/80 p-3 border border-stone-200 dark:bg-stone-800 dark:border-stone-700">
                        <span className="text-xs font-black text-stone-500 dark:text-stone-400 block mb-1">
                          🎯 الحكم الإعرابي وحالات البناء:
                        </span>
                        <span className="font-serif-arabic leading-relaxed text-stone-900 dark:text-stone-100">
                          {item.grammar.irabCase}
                        </span>
                      </div>
                    </div>

                    {/* Conjugation & Derivation Ribbon if available */}
                    {item.grammar.conjugationOrDerivatives && (
                      <div className="mt-3 rounded-xl bg-white/80 p-3 border border-stone-200 dark:bg-stone-800 dark:border-stone-700 text-xs">
                        <span className="font-black text-stone-600 dark:text-stone-300 block mb-2">
                          🔄 جدول التصريف والاشتقاق:
                        </span>
                        <div className="flex flex-wrap gap-2 text-xs font-bold font-serif-arabic">
                          {item.grammar.conjugationOrDerivatives.past && (
                            <span className="rounded-md bg-stone-100 dark:bg-stone-700 px-2 py-1">
                              الماضي: {item.grammar.conjugationOrDerivatives.past}
                            </span>
                          )}
                          {item.grammar.conjugationOrDerivatives.present && (
                            <span className="rounded-md bg-stone-100 dark:bg-stone-700 px-2 py-1">
                              المضارع: {item.grammar.conjugationOrDerivatives.present}
                            </span>
                          )}
                          {item.grammar.conjugationOrDerivatives.imperative && (
                            <span className="rounded-md bg-stone-100 dark:bg-stone-700 px-2 py-1">
                              الأمر: {item.grammar.conjugationOrDerivatives.imperative}
                            </span>
                          )}
                          {item.grammar.conjugationOrDerivatives.verbalNoun && (
                            <span className="rounded-md bg-stone-100 dark:bg-stone-700 px-2 py-1">
                              المصدر: {item.grammar.conjugationOrDerivatives.verbalNoun}
                            </span>
                          )}
                          {item.grammar.conjugationOrDerivatives.plural && (
                            <span className="rounded-md bg-stone-100 dark:bg-stone-700 px-2 py-1">
                              الجمع: {item.grammar.conjugationOrDerivatives.plural}
                            </span>
                          )}
                          {item.grammar.conjugationOrDerivatives.activeParticiple && (
                            <span className="rounded-md bg-stone-100 dark:bg-stone-700 px-2 py-1">
                              اسم الفاعل: {item.grammar.conjugationOrDerivatives.activeParticiple}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Rule Explanation */}
                    <div className="mt-3 text-xs sm:text-sm font-bold text-stone-700 dark:text-stone-300 leading-relaxed font-serif-arabic bg-emerald-50/40 p-3 rounded-xl border border-emerald-100 dark:bg-emerald-950/10 dark:border-emerald-900/30">
                      <span className="font-black text-emerald-900 dark:text-emerald-300 ml-1">القاعدة والشرح:</span>
                      {item.grammar.ruleExplanation}
                    </div>

                    {/* Sample sentence & I'rab */}
                    {item.grammar.exampleSentence && (
                      <div className="mt-3 pt-3 border-t border-emerald-200/60 dark:border-stone-800 text-xs sm:text-sm">
                        <div className="font-serif-arabic font-black text-stone-900 dark:text-stone-100">
                          <span className="text-emerald-800 dark:text-emerald-400 ml-1">المثال النموذجي:</span>
                          «{item.grammar.exampleSentence}»
                        </div>
                        {item.grammar.irabOfSentence && (
                          <p className="mt-1 font-serif-arabic text-stone-600 dark:text-stone-400 text-xs leading-relaxed">
                            <span className="font-black text-stone-800 dark:text-stone-200 ml-1">إعراب الجملة:</span>
                            {item.grammar.irabOfSentence}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* USER REQUIREMENT: ARABIC TO ENGLISH, KANNADA, URDU, MALAYALAM */}
                {item.translations && (
                  <div className="mt-5 rounded-2xl border-2 border-stone-200 bg-stone-50/80 p-4 dark:border-stone-700 dark:bg-stone-800/60">
                    <div className="flex items-center justify-between text-xs font-black text-stone-800 dark:text-stone-200 mb-3">
                      <span className="flex items-center gap-1.5 text-stone-900 dark:text-stone-100">
                        <Globe2 className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                        <span>الترجمات الرباعية المعتمدة (Translations to English, Kannada, Urdu, Malayalam):</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
                      
                      {/* 1. English */}
                      <div className="rounded-xl bg-white p-3 shadow-2xs border border-stone-200 dark:bg-stone-800 dark:border-stone-700">
                        <span className="text-[11px] font-black text-stone-500 dark:text-stone-400 block mb-1">
                          English 🇬🇧
                        </span>
                        <p className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 ltr text-left">
                          {item.translations.english}
                        </p>
                        {item.translations.englishPhonetic && (
                          <span className="block mt-1 text-[10px] font-mono text-emerald-700 dark:text-emerald-400 ltr text-left">
                            [{item.translations.englishPhonetic}]
                          </span>
                        )}
                      </div>

                      {/* 2. Kannada */}
                      <div className="rounded-xl bg-white p-3 shadow-2xs border border-stone-200 dark:bg-stone-800 dark:border-stone-700">
                        <span className="text-[11px] font-black text-emerald-800 dark:text-emerald-400 block mb-1">
                          Kannada (ಕನ್ನಡ) 🇮🇳
                        </span>
                        <p className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 ltr text-left">
                          {item.translations.kannada}
                        </p>
                      </div>

                      {/* 3. Urdu */}
                      <div className="rounded-xl bg-white p-3 shadow-2xs border border-stone-200 dark:bg-stone-800 dark:border-stone-700">
                        <span className="text-[11px] font-black text-amber-800 dark:text-amber-400 block mb-1">
                          Urdu (اردو) 🇵🇰
                        </span>
                        <p className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 font-serif-arabic">
                          {item.translations.urdu}
                        </p>
                      </div>

                      {/* 4. Malayalam */}
                      <div className="rounded-xl bg-white p-3 shadow-2xs border border-stone-200 dark:bg-stone-800 dark:border-stone-700">
                        <span className="text-[11px] font-black text-rose-800 dark:text-rose-400 block mb-1">
                          Malayalam (മലയാളം) 🇮🇳
                        </span>
                        <p className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 ltr text-left">
                          {item.translations.malayalam}
                        </p>
                      </div>

                    </div>
                  </div>
                )}

                {/* SYNONYMS & ANTONYMS BLOCKS */}
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  
                  {/* Synonyms list */}
                  <div className="rounded-2xl bg-emerald-50/50 p-4 border border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/30">
                    <span className="text-xs font-black text-emerald-900 dark:text-emerald-300 flex items-center gap-1 mb-2">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>المترادفات البلاغية ({item.synonyms.length}):</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {item.synonyms.map((syn, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setSearchQuery(syn);
                            window.scrollTo({ top: 500, behavior: 'smooth' });
                          }}
                          title={`ابحث عن ${syn} في المعجم`}
                          className="rounded-lg bg-white px-2.5 py-1 text-xs font-black text-emerald-900 shadow-xs border border-emerald-200/80 hover:bg-emerald-100 dark:bg-stone-800 dark:text-emerald-300 dark:border-emerald-800 cursor-pointer transition"
                        >
                          {syn}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Antonyms list */}
                  <div className="rounded-2xl bg-rose-50/50 p-4 border border-rose-100 dark:bg-rose-950/20 dark:border-rose-900/30">
                    <span className="text-xs font-black text-rose-900 dark:text-rose-300 flex items-center gap-1 mb-2">
                      <span>⚖️ الأضداد في لغة العرب ({item.antonyms.length}):</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {item.antonyms.map((ant, idx) => (
                        <span
                          key={idx}
                          className="rounded-lg bg-white px-2.5 py-1 text-xs font-black text-rose-900 shadow-xs border border-rose-200/80 dark:bg-stone-800 dark:text-rose-300 dark:border-rose-800"
                        >
                          {ant}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Poetic verse citation if available */}
                {item.verseExample && (
                  <div className="mt-4 rounded-2xl bg-amber-50/40 p-4 border border-amber-200/60 dark:bg-stone-800/40 dark:border-stone-800">
                    <div className="flex items-center justify-between text-xs font-black text-amber-950 dark:text-amber-400 mb-1">
                      <span>📜 الشاهد الشعري والبلاغي:</span>
                      {item.verseAuthor && <span>{item.verseAuthor}</span>}
                    </div>
                    <p className="font-serif-arabic text-base sm:text-lg font-black text-stone-900 dark:text-stone-100 poetry-verse leading-loose">
                      «{item.verseExample}»
                    </p>
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>

      {/* VISITOR BANNER AT THE END OF THE DICTIONARY SECTION */}
      <SectionVisitorBanner
        badgeEmoji="📖"
        sectionTitle="✍️ هل تعرف فعلاً أو اسماً لغوياً نادراً؟ أضفه إلى المعجم النحوي واللغوي الآن"
        sectionSubtitle="ساهم في إثراء معجم الأفعال والأسماء وقواعد النحو؛ دوّن الكلمة، وشرحها النحوي، وميزانها الصرفي، وترجماتها لتعم الفائدة لكل عشاق لغة الضاد."
        actionText="📖 أضف كلمة مع شرحها النحوي وترجماتها فوراً 🚀"
        onActionClick={() => {
          setShowAddForm(true);
          window.scrollTo({ top: 450, behavior: 'smooth' });
        }}
      />

    </section>
  );
};
