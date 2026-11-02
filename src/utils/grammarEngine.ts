/**
 * Arabic Grammar & Multilingual Linguistic Intelligence Engine
 * Provides instant in-depth explanations for Arabic grammar (Nahu & Sarf),
 * sentence parsing (I'rab), verb conjugations, noun derivations,
 * and translations into English, Kannada (ಕನ್ನಡ), Urdu (اردو), and Malayalam (മലയാളം).
 */

import { SynonymWord } from '../types';

export interface MultilingualTranslation {
  english: string;
  englishPhonetic?: string;
  kannada: string;
  urdu: string;
  malayalam: string;
}

export interface GrammarQAResult {
  question: string;
  topic: string;
  summary: string;
  grammarExplanation: string[];
  keyRules: string[];
  exampleSentence?: string;
  sentenceIrab?: string;
  translations?: MultilingualTranslation;
  relatedTerms?: string[];
  matchedWord?: SynonymWord;
}

// Arabic text normalizer
function cleanArabic(text: string): string {
  return text
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .replace(/[إأآا]/g, 'ا')
    .replace(/[ى]/g, 'ي')
    .replace(/[ة]/g, 'ه')
    .toLowerCase()
    .trim();
}

/**
 * Knowledge Base for Grammar Rules and Concepts
 */
const GRAMMAR_KNOWLEDGE_BASE: Record<string, GrammarQAResult> = {
  difference_noun_verb: {
    question: 'ما الفرق بين الاسم والفعل في قواعد النحو العربي؟',
    topic: 'أقسام الكلمة (الاسم والفعل والحرف)',
    summary: 'الاسم يدل على معنى في نفسه غير مقترن بزمن، بينما الفعل يدل على حدث مقترن بزمن محدد (ماضٍ، حاضر، مستقبل).',
    grammarExplanation: [
      '📌 الاسم: يقبل علامات التمييز مثل: دخول (أل) التعريف (الكِتَاب)، والتنوين (كِتَابٌ)، والجر بحروف الجر (في الكِتَابِ)، والنداء (يا رَجُلُ)، والإسناد إليه.',
      '📌 الفعل: يقبل تاء الفاعل (كَتَبْتُ)، وتاء التأنيث الساكنة (كَتَبَتْ)، وياء المخاطبة (اُكْتُبِي)، ونوني التوكيد (لَيَكْتُبَنَّ)، وسين وسوف ولن وقد.',
      '📌 الحرف: لا يقبل علامات الاسم ولا علامات الفعل، بل يربط بين الكلمات ويوضح معناها بالسياق (مثل: مِنْ، إِلَى، عَنْ، عَلَى).'
    ],
    keyRules: [
      'الاسم لا يرتبط بزمن (جامد أو مشتق).',
      'الفعل ينقسم إلى: ماضٍ (مبني دائماً)، ومضارع (معرب غالباً ومبني مع نوني التوكيد والإناث)، وأمر (مبني دائماً).',
      'الجملة التي تبدأ باسم تسمى "جملة اسمية" (مبتدأ وخبر)، والتي تبدأ بفعل تسمى "جملة فعلية" (فعل وفاعل ومفعول به).'
    ],
    exampleSentence: 'العِلْمُ يَرْفَعُ صَاحِبَهُ فِي المَجَالِسِ.',
    sentenceIrab: 'العِلْمُ: مبتدأ مرفوع وعلامة رفعه الضمة الظاهرة على آخره. يَرْفَعُ: فعل مضارع مرفوع بالضمة، والفاعل ضمير مستتر تقديره هو، والجملة الفعلية في محل رفع خبر المبتدأ.',
    translations: {
      english: 'Difference between Noun (Ism) and Verb (Fi\'l)',
      englishPhonetic: 'Al-Farq bayna al-Ism wa al-Fi\'l',
      kannada: 'ನಾಮಪದ (Noun) ಮತ್ತು ಕ್ರಿಯಾಪದ (Verb) ನಡುವಿನ ವ್ಯತ್ಯಾಸ',
      urdu: 'اسم اور فعل کے درمیان بنیادی نحوی فرق',
      malayalam: 'നാമവും (Noun) ക്രിയയും (Verb) തമ്മിലുള്ള വ്യാകരണ വ്യത്യാസം'
    },
    relatedTerms: ['اسم', 'فعل', 'حرف', 'مبتدأ', 'خبر', 'فاعل']
  },

  past_present_imperative: {
    question: 'كيف أعرب الفعل الماضي والمضارع والأمر بالتفصيل؟',
    topic: 'أقسام الأفعال وأحكام إعرابها وبنائها',
    summary: 'الفعل الماضي مبني دائماً، وفعل الأمر مبني دائماً، أما الفعل المضارع فهو معرب (مرفوع أو منصوب أو مجزوم) إلا إذا اتصلت به نون التوكيد أو نون النسوة فيبنى.',
    grammarExplanation: [
      '1️⃣ الفعل الماضي: مبني دائماً. يبنى على الفتح (كَتَبَ)، أو على الضم إذا اتصل بواو الجماعة (كَتَبُوا)، أو على السكون إذا اتصل بتاء الفاعل أو نون النسوة (كَتَبْتُ، كَتَبْنَ).',
      '2️⃣ الفعل المضارع: الأصل فيه الإعراب. يرفع بالضمة (يَكْتُبُ) أو ثبوت النون بالأفعال الخمسة (يَكْتُبُونَ). ينصب بالفتحة إذا سبق بناصب (أَنْ يَكْتُبَ). يجزم بالسكون أو حذف حرف العلة أو حذف النون إذا سبق بجازم (لَمْ يَكْتُبْ).',
      '3️⃣ فعل الأمر: مبني على ما يجزم به مضارعه؛ يبنى على السكون (اُكْتُبْ)، أو حذف حرف العلة (اِدْعُ)، أو حذف النون (اُكْتُبُوا).'
    ],
    keyRules: [
      'الماضي: مبني على الفتح، الضم، أو السكون.',
      'المضارع: معرب بالرفع، النصب، أو الجزم، ويبنى في حالتين (نون التوكيد: مبني على الفتح، نون النسوة: مبني على السكون).',
      'الأمر: مبني على السكون، حذف حرف العلة، أو حذف النون.'
    ],
    exampleSentence: 'صَبَرَ الفَارِسُ عَلَى الشَّدَائِدِ فَانْتَصَرَ.',
    sentenceIrab: 'صَبَرَ: فعل ماضٍ مبني على الفتح الظاهر على آخره لا محل له من الإعراب. الفَارِسُ: فاعل مرفوع وعلامة رفعه الضمة الظاهرة على آخره.',
    translations: {
      english: 'Conjugation & Parsing of Past, Present, and Imperative Verbs',
      englishPhonetic: 'I\'rab al-Fi\'l al-Madi, al-Mudari\', wa al-Amr',
      kannada: 'ಭೂತಕಾಲ, ವರ್ತಮಾನಕಾಲ ಮತ್ತು ಆಜ್ಞಾರ್ಥಕ ಕ್ರಿಯಾಪದಗಳ ವಿಶ್ಲೇಷಣೆ',
      urdu: 'ماضی، مضارع اور امر کے افعال کی مکمل گردان اور اعراب',
      malayalam: 'ഭൂതകാലം, വർത്തമാനകാലം, ആജ്ഞാക്രിയകളുടെ വ്യാകരണ വിഭക്തികൾ'
    },
    relatedTerms: ['فعل ماض', 'فعل مضارع', 'فعل أمر', 'إعراب الفعل', 'حروف الجزم']
  },

  active_passive_participle: {
    question: 'كيف نصوغ اسم الفاعل واسم المفعول من الثلاثي وغير الثلاثي؟',
    topic: 'علم الصرف والمشتقات القياسية',
    summary: 'يُصاغ اسم الفاعل من الفعل الثلاثي على وزن (فَاعِل) ومن غير الثلاثي على وزن مضارعه بإبدال حرف المضارعة ميماً مضمومة وكسر ما قبل الآخر. واسم المفعول من الثلاثي على (مَفْعُول) ومن غيره بفتح ما قبل الآخر.',
    grammarExplanation: [
      '🔹 اسم الفاعل من الثلاثي: على وزن (فَاعِل)؛ مثل: كَتَبَ ➔ كَاتِب، نَصَرَ ➔ نَاصِر، صَبَرَ ➔ صَابِر، سَارَ ➔ سَائِر.',
      '🔹 اسم الفاعل من غير الثلاثي: نأتي بالمضارع ثم نقلب ياء المضارعة ميماً مضمومة مع كسر ما قبل الآخر؛ مثل: انْطَلَقَ ➔ يَنْطَلِقُ ➔ مُنْطَلِق، اسْتَغْفَرَ ➔ مُسْتَغْفِر.',
      '🔸 اسم المفعول من الثلاثي: على وزن (مَفْعُول)؛ مثل: كَتَبَ ➔ مَكْتُوب، قَرَأَ ➔ مَقْرُوء، عَلِمَ ➔ مَعْلُوم.',
      '🔸 اسم المفعول من غير الثلاثي: نأتي بالمضارع ثم نقلب ياء المضارعة ميماً مضمومة مع فتح ما قبل الآخر؛ مثل: اسْتَفْهَمَ ➔ مُسْتَفْهَم، أَكْرَمَ ➔ مُكْرَم.'
    ],
    keyRules: [
      'اسم الفاعل يدل على من قام بالفعل أو اتصف به اتصافاً مؤقتاً أو حركياً.',
      'اسم المفعول يدل على من وقع عليه الفعل.',
      'يعمل اسم الفاعل واسم المفعول عمل فعلهما بشروط (دخول أل، أو الاعتماد على نفي واستفهام ومبتدأ).'
    ],
    exampleSentence: 'المُتَفَائِلُ كَاتِبٌ رِسَالَةَ أَمَلٍ إِلَى النَّاسِ.',
    sentenceIrab: 'المُتَفَائِلُ: مبتدأ مرفوع بالضمة (وهو اسم فاعل من غير الثلاثي). كَاتِبٌ: خبر المبتدأ مرفوع بالضمة (اسم فاعل من الثلاثي). رِسَالَةَ: مفعول به لاسم الفاعل منصوب بالفتحة.',
    translations: {
      english: 'Formation of Active Participle (Ism Fa\'il) and Passive Participle (Ism Maf\'ul)',
      englishPhonetic: 'Siyaghat Ism al-Fa\'il wa Ism al-Maf\'ul',
      kannada: 'ಕರ್ತೃವಾಚಕ (Active Participle) ಮತ್ತು ಕರ್ಮವಾಚಕ (Passive Participle) ರಚನೆ',
      urdu: 'اسم فاعل اور اسم مفعول کے اوزان اور بنانے کا مکمل طریقہ',
      malayalam: 'കർതൃനാമവും (Active Participle) കർമ്മനാമവും (Passive Participle) നിർമ്മിക്കുന്ന രീതി'
    },
    relatedTerms: ['اسم الفاعل', 'اسم المفعول', 'المشتقات', 'الصرف', 'الميزان الصرفي']
  },

  transitive_intransitive: {
    question: 'ما الفرق بين الفعل اللازم والفعل المتعدي في قواعد اللغة العربية؟',
    topic: 'التعدي واللزوم في الأفعال',
    summary: 'الفعل اللازم هو الذي يكتفي بفاعله ولا يحتاج إلى مفعول به لإتمام المعنى، بينما الفعل المتعدي يحتاج إلى مفعول به أو أكثر.',
    grammarExplanation: [
      '✅ الفعل اللازم (Intransitive Verb): يتم معناه بالفاعل فقط دون مفعول به؛ مثل: (سَارَ الرَّجُلُ)، (انْطَلَقَ الفَارِسُ)، (فَرِحَ الطِّفْلُ). إذا أردنا إيصال معناه لاسم آخر نستخدم حرف الجر (سَارَ بِهِ).',
      '✅ الفعل المتعدي (Transitive Verb): لا يكتمل معناه بالفاعل وحده، بل يتعداه إلى مفعول به منصوب؛ مثل: (قَرَأَ الطَّالِبُ كِتَاباً)، (كَتَبَ الأَدِيبُ قَصِيدَةً).',
      '✅ تحويل اللازم إلى متعدٍ: بالهمزة (أَخْرَجَ)، أو بالتضعيف (فَرَّحَ)، أو بزيادة ألف المفاعلة (جَالَسَ).'
    ],
    keyRules: [
      'علامة الفعل المتعدي: قبوله هاء الغائب التي تعود على غير المصدر (كَتَبَهُ، قَرَأَهُ).',
      'الفعل اللازم لا يقبل هاء المفعول (لا يصح أن تقول: نامَهُ أو انطلقَهُ).',
      'هناك أفعال تتعدى لمفعولين (ظن وأخواتها، وأعطى وأخواتها) أو ثلاثة مفاعيل (أعلم، أرى).'
    ],
    exampleSentence: 'كَتَبَ الشَّاعِرُ شُجَاعٌ قَصِيدَةً غَرَّاءَ.',
    sentenceIrab: 'كَتَبَ: فعل ماضٍ متعدٍ مبني على الفتح. الشَّاعِرُ: فاعل مرفوع بالضمة. شُجَاعٌ: بدل مرفوع بالضمة. قَصِيدَةً: مفعول به منصوب وعلامة نصبه الفتحة الظاهرة.',
    translations: {
      english: 'Transitive Verbs (Muta\'addi) vs. Intransitive Verbs (Laazim)',
      englishPhonetic: 'Al-Fi\'l al-Laazim wa al-Fi\'l al-Muta\'addi',
      kannada: 'ಸಕರ್ಮಕ ಕ್ರಿಯಾಪದ (Transitive) ಮತ್ತು ಅಕರ್ಮಕ ಕ್ರಿಯಾಪದ (Intransitive) ನಿಯಮಗಳು',
      urdu: 'فعل لازم اور فعل متعدی کی پہچان اور ان کے احکام',
      malayalam: 'സകർമ്മക ക്രിയയും (Transitive) അകർമ്മക ക്രിയയും (Intransitive)'
    },
    relatedTerms: ['فعل لازم', 'فعل متعدي', 'المفعول به', 'تعدية الفعل']
  },

  irab_signs_primary_secondary: {
    question: 'ما هي علامات الإعراب الأصلية والفرعية في لغة الضاد؟',
    topic: 'علامات الإعراب في الأسماء والأفعال',
    summary: 'علامات الإعراب الأصلية هي الحركات الأربع (الضمة للرفع، الفتحة للنصب، الكسرة للجر، السكون للجزم). وما عداها علامات فرعية كالحروف وحذف النون وحذف العلة.',
    grammarExplanation: [
      '🟢 علامات الإعراب الأصلية: الضمة في الرفع (جَاءَ زَيْدٌ)، الفتحة في النصب (رَأَيْتُ زَيْداً)، الكسرة في الجر (مَرَرْتُ بِزَيْدٍ)، السكون في جزم الفعل المضارع (لَمْ يَكْتُبْ).',
      '🟡 علامات الإعراب الفرعية: تنوب عن الحركات في أبواب سبعة:',
      '  - المثنى: يرفع بالألف وينصب ويجر بالياء.',
      '  - جمع المذكر السالم: يرفع بالواو وينصب ويجر بالياء.',
      '  - الأسماء الخمسة (أبو، أخو، حمو، فو، ذو): ترفع بالواو وتنصب بالألف وتجر بالياء.',
      '  - الأفعال الخمسة: ترفع بثبوت النون وتجزم وتنصب بحذفها.',
      '  - جمع المؤنث السالم: ينصب بالكسرة نيابة عن الفتحة.',
      '  - الممنوع من الصرف: يجر بالفتحة نيابة عن الكسرة.',
      '  - المضارع المعتل الآخر: يجزم بحذف حرف العلة.'
    ],
    keyRules: [
      'الرفع والنصب يشترك فيهما الاسم والفعل المضارع.',
      'الجر خاص بالأسماء (لا تجر الأفعال أبداً).',
      'الجزم خاص بالأفعال (لا تجزم الأسماء أبداً).'
    ],
    exampleSentence: 'يَجُودُ ذُو الفَضْلِ بِمَالِهِ لِلْمُحْتَاجِينَ.',
    sentenceIrab: 'يَجُودُ: فعل مضارع مرفوع بالضمة (علامة أصلية). ذُو: فاعل مرفوع بالواو لأنه من الأسماء الخمسة (علامة فرعية). المَالِ: اسم مجرور بالكسرة. لِلْمُحْتَاجِينَ: اللام حرف جر، المُحْتَاجِينَ: اسم مجرور بالياء لأنه جمع مذكر سالم (علامة فرعية).',
    translations: {
      english: 'Primary (Asliyyah) and Secondary (Far\'iyyah) Grammatical Markers',
      englishPhonetic: '\'Alamat al-I\'rab al-Asliyyah wa al-Far\'iyyah',
      kannada: 'ಅರಬ್ಬಿ ಭಾಷೆಯ ಮೂಲ ಮತ್ತು ಗೌಣ ವಿಭಕ್ತಿ ಪ್ರತ್ಯಯಗಳು (Inflection Marks)',
      urdu: 'اعراب کی اصلی اور فرعی علامات کی مفصل وضاحت',
      malayalam: 'അറബി വ്യാകരണത്തിലെ പ്രധാനപ്പെട്ടതും അപ്രധാനവുമായ വിഭക്തി അടയാളങ്ങൾ'
    },
    relatedTerms: ['علامات الإعراب', 'الأسماء الخمسة', 'جمع المذكر السالم', 'الممنوع من الصرف']
  }
};

/**
 * Detailed word responses for specific vocabulary queries
 */
export function queryGrammarEngine(query: string, dictionaryItems?: any[]): GrammarQAResult {
  const cleanQ = cleanArabic(query);

  // 1. Direct matches in standard questions
  if (cleanQ.includes('فرق') && (cleanQ.includes('اسم') || cleanQ.includes('فعل'))) {
    return GRAMMAR_KNOWLEDGE_BASE['difference_noun_verb'];
  }
  if (cleanQ.includes('ماضي') || cleanQ.includes('مضارع') || cleanQ.includes('امر') || cleanQ.includes('اقسام الفعل')) {
    return GRAMMAR_KNOWLEDGE_BASE['past_present_imperative'];
  }
  if (cleanQ.includes('فاعل') && cleanQ.includes('مفعول')) {
    return GRAMMAR_KNOWLEDGE_BASE['active_passive_participle'];
  }
  if (cleanQ.includes('لازم') || cleanQ.includes('متعد')) {
    return GRAMMAR_KNOWLEDGE_BASE['transitive_intransitive'];
  }
  if (cleanQ.includes('علامات') || cleanQ.includes('فرعي') || cleanQ.includes('اصلي') || cleanQ.includes('اعراب')) {
    return GRAMMAR_KNOWLEDGE_BASE['irab_signs_primary_secondary'];
  }

  // 2. Search if the query names one of the dictionary words (Verbs or Nouns)
  if (dictionaryItems && dictionaryItems.length > 0) {
    const matched = dictionaryItems.find((item) => {
      const wClean = cleanArabic(item.word);
      return cleanQ.includes(wClean) || (item.root && cleanQ.includes(cleanArabic(item.root)));
    });

    if (matched) {
      return {
        question: `تحليل وإعراب وترجمة كلمة «${matched.word}»`,
        topic: `${matched.typeLabel}: ${matched.word} (الجذر: ${matched.root || 'ثلاثي'})`,
        summary: `«${matched.word}» هي ${matched.grammar.partOfSpeech} على وزن (${matched.grammar.wazn}). المعنى: ${matched.meaning}`,
        grammarExplanation: [
          `🔹 النوع والوزن الصرفي: ${matched.grammar.partOfSpeech}، صِيغَت على وزن «${matched.grammar.wazn}».`,
          `🔹 حكم الإعراب والبناء: ${matched.grammar.irabCase}.`,
          matched.grammar.transitivity ? `🔹 اللزوم والتعدي: الفعل ${matched.grammar.transitivity}.` : `🔹 الخصائص الصرفية: ${matched.typeLabel} مشتق أو جامد بليغ.`,
          `🔹 القاعدة والشرح: ${matched.grammar.ruleExplanation}`
        ],
        keyRules: [
          `الجذر اللغوي: ${matched.root || 'ثلاثي أصيل'}.`,
          `المترادفات البلاغية: ${matched.synonyms.slice(0, 4).join('، ')}.`,
          `الأضداد في المعاجم: ${matched.antonyms.slice(0, 3).join('، ')}.`
        ],
        exampleSentence: matched.grammar.exampleSentence || matched.verseExample,
        sentenceIrab: matched.grammar.irabOfSentence || `الشاهد البلاغي: ${matched.verseExample || ''}`,
        translations: matched.translations,
        relatedTerms: [matched.word, ...(matched.synonyms || []).slice(0, 3)],
        matchedWord: matched
      };
    }
  }

  // 3. Multilingual Translation Specific Query
  if (cleanQ.includes('ترجم') || cleanQ.includes('translate') || cleanQ.includes('kannada') || cleanQ.includes('urdu') || cleanQ.includes('malayalam') || cleanQ.includes('اردو') || cleanQ.includes('كانادا') || cleanQ.includes('مالايالام')) {
    return {
      question: query,
      topic: 'الترجمة الرباعية للمفردات والمصطلحات النحوية',
      summary: 'المعجم يدعم الترجمة الحرفية والمجازية الفصيحة من اللغة العربية إلى ٤ لغات رئيسية: الإنجليزية، الكانادا (ಕನ್ನಡ)، الأردية (اردو)، والمالايالامية (മലയാളം).',
      grammarExplanation: [
        '🌐 اللغة الإنجليزية (English): تقدم المعنى مع التدوين الصوتي (Phonetic Transliteration) والمصطلح الأكاديمي.',
        '🌐 لغة الكانادا (Kannada - ಕನ್ನಡ): لغة درافيدية كلاسيكية عريقة، نوفر بها المعنى الدقيق مع الحفاظ على البعد البلاغي.',
        '🌐 اللغة الأردية (Urdu - اردو): لغة أدبية وثيقة الصلة بالعربية، تشترك معها في رسم الحروف ومعظم الجذور اللغوية والمصطلحات.',
        '🌐 لغة المالايالام (Malayalam - മലയാളം): لغة بليغة من جنوب الهند، نوفر بها الترجمة الدقيقة لمفاهيم النحو والمعاجم.'
      ],
      keyRules: [
        'اختر أي كلمة من شريط الانتقاء السريع أعلاه للاطلاع على جدول الترجمات الرباعية الكامل فوراً.',
        'استمع إلى النطق الصوتي العربي الفصيح للمفردات عبر زر النطق 🎙️ في كل بطاقة.'
      ],
      translations: {
        english: 'Grammar and Literary Vocabulary in 4 Languages',
        englishPhonetic: 'Tarjamat al-Qawa\'id wa al-Mufradat',
        kannada: 'ಅರಬ್ಬಿ ವ್ಯಾಕರಣ ಮತ್ತು ಸಾಹಿತ್ಯಿಕ ಶಬ್ದಕೋಶದ ೪ ಭಾಷೆಗಳ ಅನುವಾದ',
        urdu: 'عربی قواعد اور ادبی ذخیرہ الفاظ کا چار زبانوں میں ترجمہ',
        malayalam: 'അറബിക് വ്യാകരണത്തിന്റെയും സാഹിത്യ പദാവലിയുടെയും 4 ഭാഷകളിലെ പരിഭാഷ'
      },
      relatedTerms: ['ترجمة', 'الإنجليزية', 'الكانادا', 'الأردية', 'المالايالامية']
    };
  }

  // 4. Default Comprehensive Academic Explainer
  return {
    question: query,
    topic: 'قواعد النحو العربي والصرف والترجمة المقارنة',
    summary: `بناءً على سؤالك حول «${query}»، فاللغة العربية تقوم على ثنائية البناء والإعراب في الكلمات، والترابط الدلالي بين الأفعال والأسماء والمشتقات.`,
    grammarExplanation: [
      '📖 أقسام الكلمة في لغة الضاد: اسم (يدل على معنى غير مقترن بزمن)، وفعل (حدث مقترن بزمن ماضٍ أو حاضر أو مستقبل)، وحرف (رابط دلالي).',
      '⚖️ الميزان الصرفي: وضعه علماء العربية على أصل الثلاثي (ف-ع-ل)، وتوزن به كل الأسماء المشتقة والأفعال لبيان الزيادة والأصالة والإعلال والإبدال.',
      '🎯 الإعراب: هو الأثر الظاهر أو المقدر الذي يجلبه العامل في آخر الكلمة؛ ويميز بين الفاعل والمفعول به والمجرور والمبني.'
    ],
    keyRules: [
      'يمكنك كتابة اسم أي فعل (مثل: سار، كتب، قرأ، انطلق) أو اسم (مثل: العسجد، الديجور، الفارس) للحصول على تحليله وإعرابه وترجمته.',
      'يدعم شريط البحث المعجمي العلوي الانتقاء المباشر لأي مفردة بنقرة واحدة.'
    ],
    exampleSentence: 'العَرَبِيَّةُ لُغَةُ الحِكْمَةِ وَالبَيَانِ السَّامِي.',
    sentenceIrab: 'العَرَبِيَّةُ: مبتدأ مرفوع بالضمة الظاهرة. لُغَةُ: خبر المبتدأ مرفوع بالضمة وهو مضاف. الحِكْمَةِ: مضاف إليه مجرور بالكسرة.',
    translations: {
      english: 'Arabic Grammar, Morphology, and Multi-language Translation',
      englishPhonetic: 'Qawa\'id an-Nahu wa as-Sarf',
      kannada: 'ಅರಬ್ಬಿ ವ್ಯಾಕರಣ, ರೂಪವಿಜ್ಞಾನ ಮತ್ತು ಬಹುಭಾಷಾ ಅನುವಾದ',
      urdu: 'عربی نحو، صرف اور کثیر لسانی ترجمہ',
      malayalam: 'അറബി വ്യാകരണം, രൂപാന്തരവിദ്യ, ബഹുഭാഷാ പരിഭാഷ'
    },
    relatedTerms: ['النحو', 'الصرف', 'الإعراب', 'الميزان الصرفي']
  };
}
