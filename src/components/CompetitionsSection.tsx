import React, { useState, useEffect } from 'react';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Eye,
  EyeOff,
  Award,
  Sparkles,
  Zap,
  Scale,
  LayoutGrid,
  Timer,
  Feather,
  BookOpen,
  HelpCircle,
  Volume2,
  Flame,
  Shuffle,
  Compass,
  ArrowRight
} from 'lucide-react';
import { QUIZ_ITEMS, RARE_WORDS } from '../data/initialData';
import { SectionVisitorBanner } from './SectionVisitorBanner';
import { soundFX } from '../utils/sound';

interface CompetitionsSectionProps {
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  onOpenSuggestQuiz: () => void;
}

// ==================== GAME DATA: 1. I'RAB SYNTACTIC PARSING ARENA ====================
interface IrabChallenge {
  id: string;
  sentence: string;
  targetWord: string;
  question: string;
  options: { text: string; isCorrect: boolean; feedback: string }[];
  points: number;
}

const IRAB_CHALLENGES: IrabChallenge[] = [
  {
    id: 'irab-1',
    sentence: '«إِنَّ العِلْمَ نُورٌ يَهْدِي الحَيَارَى»',
    targetWord: 'نُورٌ',
    question: 'ما هو الإعراب الدقيق لكلمة «نُورٌ» في الجملة؟',
    points: 30,
    options: [
      { text: 'خبر «إنَّ» مرفوع وعلامة رفعه الضمة الظاهرة (+30 نقطة)', isCorrect: true, feedback: 'إجابة ممتازة! «نُورٌ» هو خبر الحرف الناسخ «إنَّ» مرفوع، و«العِلْمَ» اسمها منصوب.' },
      { text: 'نعت منصوب وعلامة نصبه الفتحة', isCorrect: false, feedback: 'غير صحيح؛ «نُورٌ» اسم نكرة تمم معنى الجملة فهو خبر «إنَّ» مرفوع بالضمة.' },
      { text: 'اسم «إنَّ» مؤخر مرفوع بالضمة', isCorrect: false, feedback: 'اسم «إنَّ» هو «العِلْمَ» وهو متقدم ومنصوب.' },
      { text: 'مفعول به ثانٍ منصوب', isCorrect: false, feedback: '«إنَّ» حرف ناسخ يدخل على الجملة الاسمية فينصب المبتدأ ويرفع الخبر.' },
    ],
  },
  {
    id: 'irab-2',
    sentence: '«ظَلَّ الشَّاعِرُ شُجَاعٌ مُتَفَائِلًا رَغْمَ صُرُوفِ الزَّمَانِ»',
    targetWord: 'مُتَفَائِلًا',
    question: 'ما إعراب كلمة «مُتَفَائِلًا»؟',
    points: 30,
    options: [
      { text: 'حال منصوبة بالفتحة الظاهرة', isCorrect: false, feedback: '«ظلَّ» فعل ماضٍ ناسخ يحتاج إلى خبر منصوب.' },
      { text: 'خبر «ظَلَّ» منصوب وعلامة نصبه الفتحة الظاهرة (+30 نقطة)', isCorrect: true, feedback: 'أحسنت! «ظَلَّ» من أخوات كان، ترفع المبتدأ اسماً لها وتنصب الخبر، و«مُتَفَائِلًا» خبرها المنصوب.' },
      { text: 'تمييز منصوب بالفتحة', isCorrect: false, feedback: 'ليست تمييزاً، بل هي متمم إسنادي لفعل ناسخ.' },
      { text: 'نعت منصوب لكلمة الشاعر', isCorrect: false, feedback: 'النعت يتبع المنعوت في التعريف والتنكير والشاعر معرفة ومتفائلاً نكرة منصوبة.' },
    ],
  },
  {
    id: 'irab-3',
    sentence: '«يَكْتُبُ الأَدِيبُ الفَصِيحُ مَلْحَمَتَهُ كِتَابَةً مُتْقَنَةً»',
    targetWord: 'كِتَابَةً',
    question: 'ما المحل الإعرابي لكلمة «كِتَابَةً» المأخوذة من لفظ الفعل؟',
    points: 30,
    options: [
      { text: 'مفعول مطلق منصوب وعلامة نصبه الفتحة الظاهرة (+30 نقطة)', isCorrect: true, feedback: 'رائع! مصدر منصوب من لفظ الفعل «يكتب كِتَابَةً» مبين للنوع لاتصافه بالنعت «مُتقنة».' },
      { text: 'مفعول لأجله منصوب', isCorrect: false, feedback: 'المفعول لأجله يبين علة وسبب حدوث الفعل، أما هنا فالمصدر من لفظ الفعل.' },
      { text: 'مفعول به ثانٍ', isCorrect: false, feedback: 'الفعل كَتَبَ يتعدى لمفعول واحد وهو «مَلْحَمَتَهُ».' },
      { text: 'نائب عن المفعول المطلق', isCorrect: false, feedback: 'هو المفعول المطلق الصريح نفسه لأنه مصدر مشتق مباشرة من لفظ الفعل.' },
    ],
  },
  {
    id: 'irab-4',
    sentence: '«جَاءَ الفَارِسُ المِقْدَامُ يَبْتَسِمُ لِلْمَجْدِ»',
    targetWord: 'يَبْتَسِمُ (الجملة الفعلية)',
    question: 'ما هو المحل الإعرابي لجملة «يَبْتَسِمُ» بعد معرفة «الفَارِسُ»؟',
    points: 30,
    options: [
      { text: 'في محل نصب حال صاحبها الفارس (+30 نقطة)', isCorrect: true, feedback: 'قاعدة ذهبية: الجمل بعد المعارف أحوال، وبعد النكرات صفات. الفارس معرفة فجملة «يبتسم» حال له.' },
      { text: 'في محل رفع نعت للفارس', isCorrect: false, feedback: 'الجمل بعد المعارف أحوال وليست نعوتاً.' },
      { text: 'في محل رفع خبر ثانٍ', isCorrect: false, feedback: 'الجملة فعلية تامة بدأت بفعل ماضٍ تام «جاء»، فلا مبتدأ هنا.' },
      { text: 'لا محل لها من الإعراب', isCorrect: false, feedback: 'لها محل إعرابي لأنها وقعت حالاً لفاعل معرفة.' },
    ],
  },
  {
    id: 'irab-5',
    sentence: '«يَا أَبَتِ لَا تَعْبُدِ الشَّيْطَانَ»',
    targetWord: 'أَبَتِ',
    question: 'ما هو إعراب «أَبَتِ» في النداء؟',
    points: 35,
    options: [
      { text: 'منادى مضاف منصوب بالفتحة المقدرة، والتاء عوض عن ياء المتكلم المحذوفة (+35 نقطة)', isCorrect: true, feedback: 'إجابة عبقرية! أصلها «يا أبي»، حذفت ياء المتكلم وعُوِّض عنها بتاء التأنيث المكسورة.' },
      { text: 'منادى مفرد علم مبني على الضم في محل نصب', isCorrect: false, feedback: '«أب» ليس علماً بل اسم مضاف تقديراً لياء المتكلم.' },
      { text: 'منادى نكرة مقصودة مبني على الكسر', isCorrect: false, feedback: 'الكسرة هنا ليست علامة بناء بل حركة دالة على ياء المتكلم المعوض عنها.' },
      { text: 'منادى شبيه بالمضاف منصوب', isCorrect: false, feedback: 'ليس شبيهاً بالمضاف لعدم اتصاله بشيء يتمم معناه غير الإضافة المقدرة.' },
    ],
  },
  {
    id: 'irab-6',
    sentence: '«اشْتَرَى الأَدِيبُ عِشْرِينَ كِتَابًا نَادِرًا»',
    targetWord: 'كِتَابًا',
    question: 'ما إعراب الاسم الواقع بعد ألفاظ العقود (عشرين)؟',
    points: 30,
    options: [
      { text: 'تمييز ملفوظ منصوب وعلامة نصبه الفتحة الظاهرة (+30 نقطة)', isCorrect: true, feedback: 'صحيح تماماً! مميز العدد من (11 إلى 99) يكون مفرداً منصوباً يعرب تمييزاً.' },
      { text: 'مضاف إليه مجرور بالكسرة', isCorrect: false, feedback: 'ألفاظ العقود لا تُضاف إلى معدودها بل ينصب معدودها على التمييز.' },
      { text: 'مفعول به ثانٍ منصوب', isCorrect: false, feedback: 'المفعول به هو «عشرين»، وكتاباً تمييز يزيل إبهام العدد.' },
      { text: 'بدل منصوب من العدد عشرين', isCorrect: false, feedback: 'البدل يطابق المبدل منه، لكن المعدود بعد العقود تمييز منصوب وجوباً.' },
    ],
  },
];

// ==================== GAME DATA: 2. MORPHOLOGY & WAZN PUZZLE ====================
interface WaznChallenge {
  id: string;
  word: string;
  root: string;
  hint: string;
  correctWazn: string;
  options: string[];
  explanation: string;
}

const WAZN_CHALLENGES: WaznChallenge[] = [
  {
    id: 'wazn-1',
    word: 'اسْتَبْسَلَ',
    root: 'ب-س-ل',
    hint: 'فعل سداسي مبدوء بهمزة وصل وسين وتاء للطلب والمبالغة',
    correctWazn: 'اسْتَفْعَلَ',
    options: ['اسْتَفْعَلَ', 'افْتَعَلَ', 'تَفَاعَلَ', 'افْعَوْعَلَ'],
    explanation: 'الجذر الثلاثي هو (ب س ل) يقابل (ف ع ل)، والهمزة والسين والتاء أحرف زيادة على وزن اسْتَفْعَلَ.'
  },
  {
    id: 'wazn-2',
    word: 'مُتَدَحْرِجٌ',
    root: 'د-ح-ر-ج',
    hint: 'اسم فاعل مشتق من فعل رباعي مزيد بحرف التاء',
    correctWazn: 'مُتَفَعْلِلٌ',
    options: ['مُتَفَعْلِلٌ', 'مُتَفَاعِلٌ', 'مُسْتَفْعِلٌ', 'مُتَفَعِّلٌ'],
    explanation: 'الفعل المجرد رباعي (دَحْرَجَ على وزن فَعْلَلَ)، ومزيده بالتاء (تَدَحْرَجَ = تَفَعْلَلَ)، واسم الفاعل منه: مُتَدَحْرِجٌ = مُتَفَعْلِلٌ.'
  },
  {
    id: 'wazn-3',
    word: 'عَصْفُورٌ',
    root: 'ع-ص-ف-ر',
    hint: 'اسم خماسي مجرد فيه واو زائدة قبل الآخر',
    correctWazn: 'فُعْلُولٌ',
    options: ['فُعْلُولٌ', 'فَعْلُولٌ', 'مَفْعُولٌ', 'فَاعُولٌ'],
    explanation: 'الاسم على وزن فُعْلُولٌ بضم الفاء وسكون العين، مثل: عصفور، برغوث، صندوق.'
  },
  {
    id: 'wazn-4',
    word: 'اطْمَأَنَّ',
    root: 'ط-م-أ-ن',
    hint: 'فعل رباعي مزيد بهمزة الوصل والتضعيف في آخره',
    correctWazn: 'افْعَلَلَّ',
    options: ['افْعَلَلَّ', 'اسْتَفْعَلَ', 'افْعَوْعَلَ', 'تَفَعْلَلَ'],
    explanation: 'طَمْأَنَ رباعي مجرد على وزن فَعْلَلَ. وزيدت فيه الهمزة في الأول وضُعفت لامه الثانية في الآخر فصار اطْمَأَنَّ على وزن افْعَلَلَّ.'
  },
  {
    id: 'wazn-5',
    word: 'مِفْتَاحٌ',
    root: 'ف-ت-ح',
    hint: 'اسم آلة قياسي مشتق من الفعل الثلاثي فتح',
    correctWazn: 'مِفْعَالٌ',
    options: ['مِفْعَالٌ', 'مِفْعَلٌ', 'مِفْعَلَةٌ', 'فَعَّالَةٌ'],
    explanation: 'مِفْتَاحٌ على وزن مِفْعَالٌ، وهو أحد أشهر أوزان اسم الآلة القياسية في النحو العربي (مِفْعَال ومِفْعَل ومِفْعَلَة).'
  },
  {
    id: 'wazn-6',
    word: 'قُشَعْرِيرَةٌ',
    root: 'ق-ش-ع-ر',
    hint: 'مصدر لفعل رباعي مضعف اللام (اقشعرّ)',
    correctWazn: 'فُعَلْلِيلَةٌ',
    options: ['فُعَلْلِيلَةٌ', 'فَعْلَلَةٌ', 'مُفَاعَلَةٌ', 'افْعِلَّالٌ'],
    explanation: 'من بدائع أوزان المصادر الرباعية المزيدة: قشعريرة على وزن فُعَلْلِيلَة.'
  },
];

// ==================== GAME DATA: 3. MEMORY & CARD PAIRS MATCHING ====================
interface MatchPair {
  id: string;
  word1: string;
  word2: string;
  relation: string; // 'مترادف' | 'ضد'
}

const MEMORY_PAIRS: MatchPair[] = [
  { id: 'pair-1', word1: 'غَيْثٌ 🌧️', word2: 'مَطَرٌ هَاطِل', relation: 'مترادف' },
  { id: 'pair-2', word1: 'جَسُورٌ 🦁', word2: 'شُجَاعٌ مِقْدَام', relation: 'مترادف' },
  { id: 'pair-3', word1: 'عَسْجَدٌ 🪙', word2: 'ذَهَبٌ خَالِص', relation: 'مترادف' },
  { id: 'pair-4', word1: 'دَيْجُورٌ 🌑', word2: 'ظَلَامٌ دَامِس', relation: 'مترادف' },
  { id: 'pair-5', word1: 'سَخِيٌّ 🤲', word2: 'بَخِيلٌ شَحِيح 🚫', relation: 'ضد' },
  { id: 'pair-6', word1: 'يَمْحُو 🧹', word2: 'يُثْبِتُ وَيُسَطِّر ✍️', relation: 'ضد' },
];

// ==================== GAME DATA: 4. FAST WORD CLASSIFIER ARCADE ====================
interface SorterWord {
  word: string;
  type: 'verb' | 'noun' | 'particle';
  typeLabel: string;
  reason: string;
}

const SORTER_WORDS: SorterWord[] = [
  { word: 'كَتَبَ', type: 'verb', typeLabel: 'فعل', reason: 'يدل على حدث مقترن بزمن ماضٍ ويقبل تاء الفاعل (كتبتُ).' },
  { word: 'إِلَى', type: 'particle', typeLabel: 'حرف', reason: 'حرف جر لا يظهر معناه كاملاً إلا مقترناً بغيره.' },
  { word: 'القَمَرُ', type: 'noun', typeLabel: 'اسم', reason: 'يقبل دخول أل التعريف والتنوين والجر.' },
  { word: 'اسْتَمِعْ', type: 'verb', typeLabel: 'فعل', reason: 'فعل أمر يدل على طلب في زمن المستقبل ويقبل ياء المخاطبة.' },
  { word: 'لَكِنَّ', type: 'particle', typeLabel: 'حرف', reason: 'حرف ناسخ يفيد الاستدراك من أخوات إنّ.' },
  { word: 'شَجَاعَةٌ', type: 'noun', typeLabel: 'اسم', reason: 'مصدر معنوي يقبل التنوين والتاء المربوطة.' },
  { word: 'يَرْحَمُ', type: 'verb', typeLabel: 'فعل', reason: 'فعل مضارع مبدوء بحرف من أحرف المضارعة (الياء) ويقبل السين وسوف.' },
  { word: 'فِي', type: 'particle', typeLabel: 'حرف', reason: 'حرف جر يفيد الظرفية الزمانية أو المكانية.' },
  { word: 'العَسْجَدُ', type: 'noun', typeLabel: 'اسم', reason: 'اسم جامد مقترن بأل التعريف يدل على الذهب.' },
  { word: 'ثُمَّ', type: 'particle', typeLabel: 'حرف', reason: 'حرف عطف يفيد الترتيب مع التراخي.' },
  { word: 'انْطَلَقُوا', type: 'verb', typeLabel: 'فعل', reason: 'فعل ماضٍ متصل بواو الجماعة.' },
  { word: 'صَبَاحٌ', type: 'noun', typeLabel: 'اسم', reason: 'اسم زمان يقبل التنوين والإضافة.' },
];

// ==================== GAME DATA: 5. POETIC HEMISTICH & RHYME ====================
interface VerseChallenge {
  id: string;
  poet: string;
  meter: string; // البحر
  shatr1: string;
  correctShatr2: string;
  options: string[];
  explanation: string;
}

const VERSE_CHALLENGES: VerseChallenge[] = [
  {
    id: 'v1',
    poet: 'أبو الطيب المتنبي',
    meter: 'بحر الطويل (فَعُولُنْ مَفَاعِيلُنْ فَعُولُنْ مَفَاعِلُنْ)',
    shatr1: '«عَـلَى قَـدْرِ أَهـلِ العَـزمِ تَأتِي العَزائِمُ»',
    correctShatr2: '«وَتَأتِي عَلَى قَدْرِ الكِرَامِ المَكَارِمُ»',
    options: [
      '«وَتَأتِي عَلَى قَدْرِ الكِرَامِ المَكَارِمُ»',
      '«وَتَبْقَى الجِبَالُ الشَّامِخَاتُ عَوَاصِمُ»',
      '«وَتَمْضِي اللَّيَالِي وَالأَمَانِي سَوَالِمُ»',
      '«فَيَبْلُغُ بِالإِقْدَامِ مَا كَانَ حَالِمُ»',
    ],
    explanation: 'بيت المتنبي الخالد في مدح سيف الدولة، على بحر الطويل، وقافيته الميم المضمومة (المكارمُ/العزائمُ).'
  },
  {
    id: 'v2',
    poet: 'الإمام الشافعي',
    meter: 'بحر الوافر (مُفَاعَلَتُنْ مُفَاعَلَتُنْ فَعُولُنْ)',
    shatr1: '«دَعِ الأَيَّامَ تَفْعَلُ مَا تَشَاءُ»',
    correctShatr2: '«وَطِبْ نَفْساً إِذَا حَكَمَ القَضَاءُ»',
    options: [
      '«وَطِبْ نَفْساً إِذَا حَكَمَ القَضَاءُ»',
      '«فَإِنَّ الصَّبْرَ مِفْتَاحُ الرَّجَاءِ»',
      '«وَلا تَحْزَنْ لِعَادِيَةِ البَلاءِ»',
      '«فَمَا لِلْمَرْءِ عَنْ حَتْفٍ وِقَاءُ»',
    ],
    explanation: 'من روائع ديوان الشافعي في الزهد والتوكل على الله، التزم فيه الهمزة الممدودة المضمومة روياً.'
  },
  {
    id: 'v3',
    poet: 'أبو الطيب المتنبي',
    meter: 'بحر البسيط (مُسْتَفْعِلُنْ فَاعِلُنْ مُسْتَفْعِلُنْ فَعِلُنْ)',
    shatr1: '«إِذَا رَأَيْتَ نُيُوبَ اللَّيْثِ بَارِزَةً»',
    correctShatr2: '«فَلا تَظُنَّنَّ أَنَّ اللَّيْثَ يَبْتَسِمُ»',
    options: [
      '«فَلا تَظُنَّنَّ أَنَّ اللَّيْثَ يَبْتَسِمُ»',
      '«فَاعْلَمْ بِأَنَّ الرَّدَى في دَرْبِهِ حَتْمُ»',
      '«فَاحْذَرْ وُثُوبَ الهَصُورِ إِذْ يَصْدِمُ»',
      '«وَارْكَبْ جَنَاحَ السُّرَى فَالصَّمْتُ مُنْهَدِمُ»',
    ],
    explanation: 'حكمة المتنبي الشهيرة في الحذر والشهامة؛ شبه كشرة الليث عند الفتك بالابتسامة تهكماً وتحذيراً.'
  },
  {
    id: 'v4',
    poet: 'أمير الشعراء أحمد شوقي',
    meter: 'بحر الوافر (مُفَاعَلَتُنْ مُفَاعَلَتُنْ فَعُولُنْ)',
    shatr1: '«وَمَا نَيْلُ المَطَالِبِ بِالتَّمَنِّي»',
    correctShatr2: '«وَلَكِنْ تُؤْخَذُ الدُّنْيَا غِلاَبَا»',
    options: [
      '«وَلَكِنْ تُؤْخَذُ الدُّنْيَا غِلاَبَا»',
      '«وَإِنَّ العَزْمَ لِلأَحْرَارِ بَابَا»',
      '«فَجِدَّ إِذَا أَرَدْتَ لَهَا طِلاَبَا»',
      '«وَمَا خَابَ امْرُؤٌ سَمِعَ الصَّوَابَا»',
    ],
    explanation: 'قصيدة شوقي في نهج البردة؛ تؤكد على سنة السعي والكفاح لنيل المعالي والريادة.'
  },
  {
    id: 'v5',
    poet: 'طرفة بن العبد البكري',
    meter: 'بحر الطويل (معلقة طرفة)',
    shatr1: '«سَتُبْدِي لَكَ الأَيَّامُ مَا كُنْتَ جَاهِلاً»',
    correctShatr2: '«وَيَأْتِيكَ بِالأَخْبَارِ مَنْ لَمْ تُزَوِّدِ»',
    options: [
      '«وَيَأْتِيكَ بِالأَخْبَارِ مَنْ لَمْ تُزَوِّدِ»',
      '«وَتَنْجَابُ عَنْ عَيْنَيْكَ حُجُبُ المَوْعِدِ»',
      '«وَتَعْلَمُ أَنَّ الحَقَّ نُورٌ مُخَلَّدِ»',
      '«فَلا تَكُ مَحْزُوناً لِشَيْءٍ مُبَعَّدِ»',
    ],
    explanation: 'من عيون الشعر الجاهلي في معلقة طرفة بن العبد، أصبحت مثلاً سائراً في حتمية ظهور الحقائق عبر الأيام.'
  },
  {
    id: 'v6',
    poet: 'الشاعر شجاع',
    meter: 'بحر الطويل',
    shatr1: '«يا ناشدَ الشِّعرِ في صَمتِ الدُّجى نَغَمَا»',
    correctShatr2: '«أَنصِتْ فَقَدْ جَرَتِ الألحانُ فَيْضَ دِمَا»',
    options: [
      '«أَنصِتْ فَقَدْ جَرَتِ الألحانُ فَيْضَ دِمَا»',
      '«فَالشِّعْرُ نُورٌ يُضِيءُ السَّاحَ وَالقِمَمَا»',
      '«وَاقْطِفْ ثِمَارَ الرُّؤَى مِمَّنْ سَمَا كَرَمَا»',
      '«تَلْقَى القَوَافِيَ حُسْناً سَاطِعاً عَمَمَا»',
    ],
    explanation: 'مطلع ديوان الشاعر شجاع في قصيدة «رشفة من ندى»، يجمع بين عذوبة اللحن وصدق المشاعر الإنسانية.'
  },
];

// ==================== GAME DATA: 6. WHEEL OF ELOQUENCE TRIVIA ====================
interface EloquenceTrivia {
  title: string;
  category: string;
  question: string;
  answer: string;
  funFact: string;
}

const ELOQUENCE_WHEEL_ITEMS: EloquenceTrivia[] = [
  {
    title: 'الفرق بين المطر والغيث في القرآن',
    category: 'دلالات الألفاظ',
    question: 'هل كلمة «المَطَر» وكلمة «الغَيْث» مترادفتان تماماً في القرآن الكريم؟',
    answer: 'لا! الغيث دائماً يأتي في سياق الرحمة والخير وإحياء الأرض بعد القنوط: «وَهُوَ الَّذِي يُنَزِّلُ الْغَيْثَ مِن بَعْدِ مَا قَنَطُوا». أما المطر فغالباً ما يأتي في سياق العذاب والإنذار: «وَأَمْطَرْنَا عَلَيْهِم مَّطَرًا».',
    funFact: 'العرب تخصص ألفاظ الرحمة ولا تخلط بينها وبين ألفاظ النقمة.'
  },
  {
    title: 'الفرق بين السنة والعام',
    category: 'فروق لغوية',
    question: 'متى تستعمل العرب لفظ «السَّنَة» ومتى تستعمل لفظ «العَام»؟',
    answer: '«السَّنَة» تُطلق غالباً على زمن الشدة والقحط والجدب: «وَلَقَدْ أَخَذْنَا آلَ فِرْعَوْنَ بِالسِّنِينَ». أما «العَام» فيُطلق على زمن الرخاء والخصب والراحة: «ثُمَّ يَأْتِي مِن بَعْدِ ذَٰلِكَ عَامٌ فِيهِ يُغَاثُ النَّاسُ».',
    funFact: 'لهذا سمي عام الفيل عاماً، ولم يسموه سنة الفيل!'
  },
  {
    title: 'لغز إعرابي: ما إعراب ضرب زيدٌ عمراً؟',
    category: 'ألغاز نحوية',
    question: 'في جملة «ضَرَبَ زَيْدٌ عَمْراً»: لماذا كُتبت واو في «عَمْرو» وحُذفت عند النصب؟',
    answer: 'الواو في «عَمْرو» وُضعت فارقة للتفريق بينها وبين «عُمَر» الممنوع من الصرف. وعند النصب، يُنوَّن عمرو فيكتب «عَمْراً» بألف التنوين، بينما عمر لا ينون «عُمَرَ»، فزالت الحاجة للواو وحُذفت!',
    funFact: 'تسمى هذه الواو في كتب النحو: (واو عمرو الفارقة).'
  },
  {
    title: 'الفرق بين الحلم والصبر',
    category: 'حكمة وبلاغة',
    question: 'ما الفرق الدقيق بين الإنسان «الصَّبُور» والإنسان «الحَلِيم»؟',
    answer: 'الصبر: هو حبس النفس وتحمل الألم والشدائد مع وجود الغيظ في الباطن. أما الحلم: فهو أرفع منزلة، إذ يعفو ويسكن غضبه دون إحساس بالحقد، مع قدرته على الانتقام!',
    funFact: 'يقال: ليس كل صبور حليماً، ولكن كل حليم صبور.'
  },
  {
    title: 'أطول كلمة في القرآن الكريم',
    category: 'عجائب الرسم القرآني',
    question: 'ما هي أطول كلمة في القرآن الكريم وما هو وزنها وإعرابها؟',
    answer: 'كلمة «فَأَسْقَيْنَاكُمُوهُ» (١١ حرفاً). وهي جملة تامة تتكون من: فاء عاطفة، فعل ماضٍ، فاعل (نا)، مفعول أول (كم)، ومفعول ثانٍ (الهاء).',
    funFact: 'تختزل في كلمة واحدة مركبة فعلاً وفاعلاً ومفعولين مع أحرف الربط.'
  },
];

type GameTab = 'all' | 'irab' | 'wazn' | 'memory' | 'sorter' | 'poetry' | 'rhetoric' | 'rare' | 'wheel';

export const CompetitionsSection: React.FC<CompetitionsSectionProps> = ({
  score,
  setScore,
  onOpenSuggestQuiz,
}) => {
  const [activeTab, setActiveTab] = useState<GameTab>('all');
  
  // Track answers for all game types
  const [answers, setAnswers] = useState<Record<string, { selectedIndex: number; isCorrect: boolean; feedback: string }>>({});
  const [revealedWords, setRevealedWords] = useState<Record<string, boolean>>({});
  const [consecutiveStreak, setConsecutiveStreak] = useState<number>(0);

  // States for Wazn Challenge
  const [waznAnswers, setWaznAnswers] = useState<Record<string, { chosen: string; isCorrect: boolean }>>({});

  // States for Memory Pairs Game
  const [memoryCards, setMemoryCards] = useState<{ id: string; cardId: string; text: string; pairId: string }[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [memoryMoves, setMemoryMoves] = useState<number>(0);

  // States for Fast Sorter Arcade
  const [sorterIndex, setSorterIndex] = useState<number>(0);
  const [sorterStreak, setSorterStreak] = useState<number>(0);
  const [sorterFeedback, setSorterFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);

  // States for Verse Challenge
  const [verseAnswers, setVerseAnswers] = useState<Record<string, { selectedIndex: number; isCorrect: boolean }>>({});

  // States for Wheel of Eloquence
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [currentTrivia, setCurrentTrivia] = useState<EloquenceTrivia>(ELOQUENCE_WHEEL_ITEMS[0]);
  const [spinDegrees, setSpinDegrees] = useState<number>(0);

  // Initialize Memory Pairs cards shuffled
  const initMemoryGame = () => {
    soundFX.playClick();
    const cards: { id: string; cardId: string; text: string; pairId: string }[] = [];
    MEMORY_PAIRS.forEach((pair, idx) => {
      cards.push({ id: `c-${idx}-a`, cardId: `${pair.id}-a`, text: pair.word1, pairId: pair.id });
      cards.push({ id: `c-${idx}-b`, cardId: `${pair.id}-b`, text: pair.word2, pairId: pair.id });
    });
    // Fisher-Yates shuffle
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    setMemoryCards(cards);
    setSelectedCards([]);
    setMatchedPairs([]);
    setMemoryMoves(0);
  };

  useEffect(() => {
    initMemoryGame();
  }, []);

  // Handle Memory Card Click
  const handleMemoryCardClick = (cardIdx: number) => {
    if (selectedCards.length >= 2 || selectedCards.includes(cardIdx)) return;
    const card = memoryCards[cardIdx];
    if (matchedPairs.includes(card.pairId)) return;

    soundFX.playClick();
    const newSelected = [...selectedCards, cardIdx];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      setMemoryMoves((prev) => prev + 1);
      const card1 = memoryCards[newSelected[0]];
      const card2 = memoryCards[newSelected[1]];

      if (card1.pairId === card2.pairId) {
        soundFX.playSuccess();
        setMatchedPairs((prev) => [...prev, card1.pairId]);
        setScore((prev) => prev + 35);
        setConsecutiveStreak((prev) => prev + 1);
        setSelectedCards([]);
      } else {
        soundFX.playIncorrect();
        setTimeout(() => {
          setSelectedCards([]);
        }, 900);
      }
    }
  };

  // General Quiz option click handler
  const handleOptionClick = (qId: string, optIndex: number, isCorrect: boolean, feedback: string, points: number) => {
    const previous = answers[qId];
    if (previous && previous.isCorrect) return;

    if (isCorrect) {
      soundFX.playSuccess();
      setScore((prev) => prev + points);
      setConsecutiveStreak((prev) => prev + 1);
    } else {
      soundFX.playIncorrect();
      setConsecutiveStreak(0);
    }

    setAnswers((prev) => ({
      ...prev,
      [qId]: { selectedIndex: optIndex, isCorrect, feedback },
    }));
  };

  // Wazn Option Click
  const handleWaznClick = (item: WaznChallenge, chosen: string) => {
    if (waznAnswers[item.id]) return;
    const isCorrect = chosen === item.correctWazn;

    if (isCorrect) {
      soundFX.playSuccess();
      setScore((prev) => prev + 25);
      setConsecutiveStreak((prev) => prev + 1);
    } else {
      soundFX.playIncorrect();
      setConsecutiveStreak(0);
    }

    setWaznAnswers((prev) => ({
      ...prev,
      [item.id]: { chosen, isCorrect },
    }));
  };

  // Fast Sorter Action
  const handleSortAction = (chosenType: 'verb' | 'noun' | 'particle') => {
    const current = SORTER_WORDS[sorterIndex];
    const isCorrect = current.type === chosenType;

    if (isCorrect) {
      soundFX.playSuccess();
      setScore((prev) => prev + 20);
      setSorterStreak((prev) => prev + 1);
      setConsecutiveStreak((prev) => prev + 1);
      setSorterFeedback({
        isCorrect: true,
        message: `إجابة صحيحة ومتقنة! «${current.word}» هو (${current.typeLabel}) لأنَّه: ${current.reason}`
      });
    } else {
      soundFX.playIncorrect();
      setSorterStreak(0);
      setConsecutiveStreak(0);
      setSorterFeedback({
        isCorrect: false,
        message: `للأسف خطأ! «${current.word}» ليس (${chosenType === 'verb' ? 'فعلاً' : chosenType === 'noun' ? 'اسماً' : 'حرفاً'}) بل هو (${current.typeLabel}): ${current.reason}`
      });
    }

    setTimeout(() => {
      setSorterFeedback(null);
      setSorterIndex((prev) => (prev + 1) % SORTER_WORDS.length);
    }, 1800);
  };

  // Verse Option Click
  const handleVerseClick = (vId: string, idx: number, isCorrect: boolean) => {
    if (verseAnswers[vId]?.isCorrect) return;

    if (isCorrect) {
      soundFX.playSuccess();
      setScore((prev) => prev + 30);
      setConsecutiveStreak((prev) => prev + 1);
    } else {
      soundFX.playIncorrect();
      setConsecutiveStreak(0);
    }

    setVerseAnswers((prev) => ({
      ...prev,
      [vId]: { selectedIndex: idx, isCorrect },
    }));
  };

  // Wheel Spin Action
  const handleSpinWheel = () => {
    if (isSpinning) return;
    soundFX.playClick();
    setIsSpinning(true);

    const extraSpins = 4 + Math.floor(Math.random() * 4);
    const randomIndex = Math.floor(Math.random() * ELOQUENCE_WHEEL_ITEMS.length);
    const targetDeg = spinDegrees + extraSpins * 360 + randomIndex * (360 / ELOQUENCE_WHEEL_ITEMS.length);

    setSpinDegrees(targetDeg);

    setTimeout(() => {
      setIsSpinning(false);
      setCurrentTrivia(ELOQUENCE_WHEEL_ITEMS[randomIndex]);
      soundFX.playSuccess();
      setScore((prev) => prev + 15);
    }, 2200);
  };

  const toggleWordReveal = (wordId: string) => {
    soundFX.playClick();
    setRevealedWords((prev) => ({
      ...prev,
      [wordId]: !prev[wordId],
    }));
  };

  const resetAllGames = () => {
    soundFX.playClick();
    setAnswers({});
    setRevealedWords({});
    setWaznAnswers({});
    setVerseAnswers({});
    setConsecutiveStreak(0);
    setScore(0);
    initMemoryGame();
  };

  // Rank determination with cute titles
  const getRank = (sc: number) => {
    if (sc >= 250) return { title: '👑 حكيم البلاغة وسلطان الضاد الأكبر', color: 'text-amber-800 dark:text-amber-300', level: 'المستوى الأسطوري' };
    if (sc >= 180) return { title: '🌟 فارس القوافي وحجة البيان العربي', color: 'text-amber-700 dark:text-amber-400', level: 'المستوى المتقدم' };
    if (sc >= 110) return { title: '🥇 متذوق الأدب واللسان الفصيح', color: 'text-emerald-800 dark:text-emerald-400', level: 'المستوى الذهبي' };
    if (sc >= 60) return { title: '🥈 طالب الفصاحة النجيب', color: 'text-stone-800 dark:text-stone-200', level: 'المستوى الفضي' };
    if (sc >= 25) return { title: '🥉 مستكشف روائع لغة الضاد', color: 'text-stone-700 dark:text-stone-300', level: 'المستوى البرونزي' };
    return { title: '📜 ضيف ديوان الأدب والبيان', color: 'text-stone-500', level: 'مبتدئ' };
  };

  const rank = getRank(score);

  return (
    <section id="competitions" className="py-12 sm:py-16 text-right">
      
      {/* Section Introduction: Section Name high and bold */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-200/80 px-4 py-1.5 text-xs font-black text-amber-950 shadow-xs dark:bg-amber-950/70 dark:text-amber-200">
          <span>🏆 اسم القسم: مَيْدَانُ الفَصَاحَةِ وَالأَلْعَابِ اللُّغَوِيَّةِ الكُبْرَى</span>
          <span aria-hidden="true">·</span>
          <span>حَلْبَةُ التَّحَدِّيَاتِ وَالبَيَانِ 🏹</span>
        </div>
        <h2 className="font-serif-arabic mt-3 text-3xl font-black tracking-tight text-stone-950 sm:text-4xl dark:text-stone-50">
          مَيْدَانُ الفَصَاحَةِ: مَلْعَبُ التَّحَدِّيَاتِ وَالأَلْعَابِ الأَدَبِيَّةِ 🎮
        </h2>
        <p className="mt-2 text-sm sm:text-base text-stone-600 dark:text-stone-300 max-w-3xl leading-relaxed font-bold">
          ساحة التحديات الأدبية الفسيحة؛ تضم باقة واسعة من الألعاب التفاعلية: الإعراب المباشر، أوزان الصرف، بطاقات الذاكرة، فرز الكلمات السريع، إكمال عجز الأبيات، وعجلة الحظ البلاغية!
        </p>
      </div>

      {/* Gamified Live Score Board & Streak Ribbon */}
      <div className="score-board mb-10 overflow-hidden rounded-3xl border-2 border-amber-300/80 bg-gradient-to-br from-amber-100/70 via-white to-amber-50/50 p-6 sm:p-8 shadow-md dark:border-amber-500/30 dark:from-stone-900 dark:via-stone-900 dark:to-amber-950/30">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-950 dark:text-amber-300">
              <Sparkles className="h-4 w-4" />
              <span>لوحة تقييم المتسابق المباشرة 🏆</span>
              <span className="rounded-md bg-amber-200 px-2 py-0.5 text-[11px] text-amber-900 font-bold dark:bg-amber-950 dark:text-amber-300">
                {rank.level}
              </span>
            </div>
            
            <div className="score-number font-serif-arabic mt-2 text-3xl sm:text-4xl font-black text-stone-950 dark:text-stone-50 flex items-center gap-3">
              <span>مجموع نقاطك:</span>
              <span id="userTotalScore" className="tabular-nums text-amber-900 dark:text-amber-400 font-black">
                {score}
              </span>
              <span className="text-xl">نقطة ✨</span>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-3">
              <p className={`text-sm sm:text-base font-black ${rank.color}`}>
                المرتبة الأدبية: {rank.title}
              </p>
              {consecutiveStreak > 1 && (
                <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3 py-0.5 text-xs font-black text-rose-900 dark:bg-rose-950 dark:text-rose-300 animate-pulse">
                  <Flame className="h-4 w-4 text-rose-600 fill-rose-600" />
                  <span>سلسلة إجابات صحيحة: {consecutiveStreak} 🔥</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={resetAllGames}
              className="inline-flex items-center gap-2 rounded-2xl border-2 border-stone-300 bg-white px-4 py-2.5 text-xs font-black text-stone-700 shadow-xs transition hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700 cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              <span>إعادة ضبط كافة الألعاب 🔄</span>
            </button>
          </div>
        </div>
      </div>

      {/* GAMES NAVIGATION TABS: Switch between so many games! */}
      <div className="mb-10">
        <div className="flex items-center justify-between text-xs font-black text-stone-600 dark:text-stone-400 mb-3">
          <span className="flex items-center gap-1.5">
            <LayoutGrid className="h-4 w-4 text-amber-700 dark:text-amber-400" />
            <span>اختر اللعبة الأدبية التي تود خوضها (أو تصفحها مجتمعة):</span>
          </span>
          <span className="text-amber-900 dark:text-amber-300 font-bold">8 ألعاب لغوية متنوعة</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: '🎮 كافة الألعاب والتحديات', badge: 'شامل' },
            { id: 'irab', label: '⚡ حلبة الإعراب الفوري', badge: 'نحو' },
            { id: 'wazn', label: '⚖️ لغز الميزان الصرفي', badge: 'صرف' },
            { id: 'memory', label: '🗂️ مطابقة المترادفات والأضداد', badge: 'ذاكرة' },
            { id: 'sorter', label: '⏱️ سباق فرز الكلمات السريع', badge: 'سرعة' },
            { id: 'poetry', label: '📜 إكمال عجز الأبيات والقوافي', badge: 'شعر' },
            { id: 'rhetoric', label: '🎯 مسابقات البلاغة والمواقف', badge: 'بيان' },
            { id: 'rare', label: '💎 كاشف المفردات النادرة', badge: 'معاجم' },
            { id: 'wheel', label: '🎡 عجلة الحظ والتحدي البلاغي', badge: 'مفاجأة' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundFX.playClick();
                  setActiveTab(tab.id as GameTab);
                }}
                className={`rounded-2xl px-4 py-2.5 text-xs font-black transition cursor-pointer whitespace-nowrap shadow-xs flex items-center gap-2 ${
                  isActive
                    ? 'bg-amber-900 text-white shadow-md dark:bg-amber-600 scale-105 ring-2 ring-amber-500'
                    : 'bg-white text-stone-800 border border-stone-200 hover:border-amber-700 hover:bg-amber-50 dark:bg-stone-800 dark:text-stone-200 dark:border-stone-700'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                  isActive ? 'bg-amber-800/80 text-amber-200' : 'bg-stone-100 text-stone-500 dark:bg-stone-700 dark:text-stone-400'
                }`}>
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-14">

        {/* ========================================================
            GAME 1: ⚡ INTERACTIVE I'RAB SYNTACTIC PARSING ARENA
        ======================================================== */}
        {(activeTab === 'all' || activeTab === 'irab') && (
          <div className="rounded-3xl border-2 border-emerald-800/20 bg-white p-6 sm:p-8 shadow-sm dark:border-emerald-500/20 dark:bg-stone-900">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200/80 pb-4 dark:border-stone-800">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-xs">
                  <Zap className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[11px] font-black text-emerald-800 dark:text-emerald-400">
                    ⚡ اللعبة الأولى: قواعد النحو والإعراب
                  </span>
                  <h3 className="font-serif-arabic text-xl sm:text-2xl font-black text-stone-950 dark:text-stone-50">
                    حلبة الإعراب الفوري وسلسلة الانتصارات النحوية
                  </h3>
                </div>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
                +30 نقطة لكل إعراب دقيق
              </span>
            </div>

            <p className="mt-3 text-xs sm:text-sm font-bold text-stone-600 dark:text-stone-400">
              اقرأ الجملة بتمعن، وانظر إلى الكلمة المحددة بالخط العريض، ثم اختر موقعها الإعرابي وحالتها الإعرابية الصحيحة:
            </p>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
              {IRAB_CHALLENGES.map((challenge) => {
                const ans = answers[challenge.id];
                return (
                  <div
                    key={challenge.id}
                    className="rounded-2xl border-2 border-stone-200/80 bg-stone-50/60 p-5 dark:border-stone-800 dark:bg-stone-800/50 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs font-black text-emerald-900 dark:text-emerald-300">
                        <span>سياق الجملة:</span>
                        <span className="bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-md font-mono">
                          المطلوب إعراب: «{challenge.targetWord}»
                        </span>
                      </div>

                      <div className="font-serif-arabic mt-3 rounded-xl bg-white p-4 text-center text-lg sm:text-xl font-black text-stone-900 border border-stone-200 dark:bg-stone-900 dark:border-stone-700 dark:text-stone-100 shadow-2xs">
                        {challenge.sentence}
                      </div>

                      <p className="mt-3 text-xs font-black text-stone-700 dark:text-stone-300">
                        {challenge.question}
                      </p>

                      <div className="mt-3 space-y-2">
                        {challenge.options.map((opt, optIdx) => {
                          const isSelected = ans?.selectedIndex === optIdx;
                          let btnStyle = 'border-stone-200 bg-white text-stone-800 hover:border-emerald-600 hover:bg-emerald-50 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200 dark:hover:border-emerald-500';

                          if (ans) {
                            if (opt.isCorrect) {
                              btnStyle = 'border-emerald-500 bg-emerald-100/80 text-emerald-950 font-bold dark:bg-emerald-950/80 dark:text-emerald-200';
                            } else if (isSelected && !opt.isCorrect) {
                              btnStyle = 'border-rose-400 bg-rose-50 text-rose-900 dark:bg-rose-950/60 dark:text-rose-300';
                            } else {
                              btnStyle = 'opacity-50 border-stone-200 bg-stone-100 text-stone-400 dark:border-stone-800 dark:bg-stone-900';
                            }
                          }

                          return (
                            <button
                              key={optIdx}
                              disabled={ans?.isCorrect}
                              onClick={() => handleOptionClick(challenge.id, optIdx, opt.isCorrect, opt.feedback, challenge.points)}
                              className={`w-full flex items-center justify-between rounded-xl border p-3 text-right text-xs sm:text-sm font-bold transition cursor-pointer ${btnStyle}`}
                            >
                              <span>{opt.text}</span>
                              {ans && opt.isCorrect && <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />}
                              {ans && isSelected && !opt.isCorrect && <XCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {ans && (
                      <div className={`mt-3 rounded-xl p-3 text-xs font-bold leading-relaxed border ${
                        ans.isCorrect
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                          : 'bg-amber-50 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                      }`}>
                        {ans.feedback}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================
            GAME 2: ⚖️ MORPHOLOGY & WAZN PUZZLE
        ======================================================== */}
        {(activeTab === 'all' || activeTab === 'wazn') && (
          <div className="rounded-3xl border-2 border-indigo-800/20 bg-white p-6 sm:p-8 shadow-sm dark:border-indigo-500/20 dark:bg-stone-900">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200/80 pb-4 dark:border-stone-800">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-xs">
                  <Scale className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[11px] font-black text-indigo-800 dark:text-indigo-400">
                    ⚖️ اللعبة الثانية: علم الصرف والميزان
                  </span>
                  <h3 className="font-serif-arabic text-xl sm:text-2xl font-black text-stone-950 dark:text-stone-50">
                    لغز الميزان الصرفي وأوزان الكلمات العربية
                  </h3>
                </div>
              </div>
              <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-black text-indigo-900 dark:bg-indigo-950 dark:text-indigo-300">
                +25 نقطة لكل وزن صحيح
              </span>
            </div>

            <p className="mt-3 text-xs sm:text-sm font-bold text-stone-600 dark:text-stone-400">
              زن الكلمات الصرفية في لسان العرب بمقابلة أصولها بـ (ف - ع - ل) وإضافة أحرف الزيادة بدقة:
            </p>

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {WAZN_CHALLENGES.map((item) => {
                const ans = waznAnswers[item.id];
                return (
                  <div
                    key={item.id}
                    className="rounded-2xl border-2 border-stone-200/80 bg-gradient-to-br from-indigo-50/40 via-white to-stone-50/50 p-5 dark:border-stone-800 dark:from-stone-900 dark:to-stone-850 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs font-black text-indigo-900 dark:text-indigo-300">
                        <span>الجذر: {item.root}</span>
                        <span className="text-[11px] text-stone-500">اختر الوزن الصرفي:</span>
                      </div>

                      <div className="my-3 text-center">
                        <span className="font-serif-arabic text-2xl sm:text-3xl font-black text-indigo-950 dark:text-indigo-300 tracking-wide">
                          «{item.word}»
                        </span>
                        <p className="mt-1 text-[11px] font-bold text-stone-500 dark:text-stone-400">
                          تلميح: {item.hint}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-4">
                        {item.options.map((opt) => {
                          const isChosen = ans?.chosen === opt;
                          const isCorrect = opt === item.correctWazn;
                          let btnStyle = 'border-stone-200 bg-white text-stone-800 hover:border-indigo-600 hover:bg-indigo-50 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200';

                          if (ans) {
                            if (isCorrect) {
                              btnStyle = 'border-emerald-500 bg-emerald-100 text-emerald-950 font-bold dark:bg-emerald-950/80 dark:text-emerald-200';
                            } else if (isChosen && !isCorrect) {
                              btnStyle = 'border-rose-400 bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-300';
                            } else {
                              btnStyle = 'opacity-50 border-stone-200 bg-stone-100 text-stone-400 dark:border-stone-800 dark:bg-stone-900';
                            }
                          }

                          return (
                            <button
                              key={opt}
                              disabled={!!ans}
                              onClick={() => handleWaznClick(item, opt)}
                              className={`rounded-xl border p-2.5 text-center font-serif-arabic text-base font-black transition cursor-pointer shadow-2xs ${btnStyle}`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {ans && (
                      <div className={`mt-3 rounded-xl p-3 text-xs font-bold leading-relaxed border ${
                        ans.isCorrect
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-rose-50 text-rose-900 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300'
                      }`}>
                        {ans.isCorrect ? '✅ أحسنت! ' : '❌ الوزن الصحيح هو: ' + item.correctWazn + '. '}
                        {item.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================
            GAME 3: 🗂️ MEMORY & PAIRS MATCHING GAME
        ======================================================== */}
        {(activeTab === 'all' || activeTab === 'memory') && (
          <div className="rounded-3xl border-2 border-rose-800/20 bg-white p-6 sm:p-8 shadow-sm dark:border-rose-500/20 dark:bg-stone-900">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200/80 pb-4 dark:border-stone-800">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-600 text-white shadow-xs">
                  <LayoutGrid className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[11px] font-black text-rose-800 dark:text-rose-400">
                    🗂️ اللعبة الثالثة: ذاكرة الكلمات والمطابقة
                  </span>
                  <h3 className="font-serif-arabic text-xl sm:text-2xl font-black text-stone-950 dark:text-stone-50">
                    لعبة بطاقات الذاكرة: طابق المترادفات والأضداد
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-stone-600 dark:text-stone-300">
                  المحاولات: <span className="font-mono font-black text-rose-700 dark:text-rose-400">{memoryMoves}</span>
                </span>
                <span className="text-xs font-bold text-stone-600 dark:text-stone-300">
                  المطابقات: <span className="font-mono font-black text-emerald-700 dark:text-emerald-400">{matchedPairs.length} / {MEMORY_PAIRS.length}</span>
                </span>
                <button
                  onClick={initMemoryGame}
                  className="rounded-xl border border-stone-300 px-3 py-1.5 text-xs font-bold hover:bg-stone-100 dark:border-stone-700 dark:text-stone-200 cursor-pointer"
                >
                  خلط جديد 🔀
                </button>
              </div>
            </div>

            <p className="mt-3 text-xs sm:text-sm font-bold text-stone-600 dark:text-stone-400">
              اقلب بطاقتين للبحث عن الكلمتين المترادفتين أو المتضادتين المتطابقتين؛ كل ثنائية صحيحة تمنحك +35 نقطة!
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {memoryCards.map((card, idx) => {
                const isSelected = selectedCards.includes(idx);
                const isMatched = matchedPairs.includes(card.pairId);

                let cardStyle = 'border-stone-300 bg-gradient-to-br from-amber-50 to-stone-100 text-stone-600 dark:border-stone-700 dark:from-stone-800 dark:to-stone-800';

                if (isMatched) {
                  cardStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-black shadow-xs scale-98 dark:bg-emerald-950/60 dark:text-emerald-200';
                } else if (isSelected) {
                  cardStyle = 'border-rose-500 bg-white text-rose-950 font-black ring-2 ring-rose-400 shadow-md scale-102 dark:bg-stone-800 dark:text-rose-200';
                }

                return (
                  <button
                    key={card.id}
                    disabled={isMatched}
                    onClick={() => handleMemoryCardClick(idx)}
                    className={`h-24 sm:h-28 rounded-2xl border-2 p-3 text-center transition-all duration-300 flex flex-col items-center justify-center cursor-pointer select-none ${cardStyle}`}
                  >
                    {isMatched || isSelected ? (
                      <div className="animate-fade-in">
                        <span className="font-serif-arabic text-base sm:text-lg font-black block leading-tight">
                          {card.text}
                        </span>
                        {isMatched && (
                          <span className="mt-1 block text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">
                            ✓ تم التطابق
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-stone-400 dark:text-stone-500">
                        <BookOpen className="h-6 w-6 mb-1 opacity-75" />
                        <span className="text-[11px] font-bold">انقر للقلب</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {matchedPairs.length === MEMORY_PAIRS.length && (
              <div className="mt-6 rounded-2xl bg-emerald-100 p-5 text-center text-emerald-950 dark:bg-emerald-950 dark:text-emerald-200 border-2 border-emerald-400">
                <span className="text-2xl">🎉 ماشاء الله تبارك الله!</span>
                <p className="font-serif-arabic text-lg font-black mt-1">
                  أتممت مطابقة كافة بطاقات المترادفات والأضداد بنجاح باهر!
                </p>
                <button
                  onClick={initMemoryGame}
                  className="mt-3 rounded-xl bg-emerald-800 px-5 py-2 text-xs font-black text-white hover:bg-emerald-700 cursor-pointer"
                >
                  العب جولة أخرى 🚀
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            GAME 4: ⏱️ FAST WORD CLASSIFIER ARCADE
        ======================================================== */}
        {(activeTab === 'all' || activeTab === 'sorter') && (
          <div className="rounded-3xl border-2 border-amber-800/20 bg-gradient-to-br from-amber-50/60 via-white to-stone-50/60 p-6 sm:p-8 shadow-sm dark:border-amber-500/20 dark:from-stone-900 dark:via-stone-900 dark:to-amber-950/20">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200/80 pb-4 dark:border-stone-800">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-600 text-white shadow-xs">
                  <Timer className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[11px] font-black text-amber-800 dark:text-amber-400">
                    ⏱️ اللعبة الرابعة: أركان الكلمة وسرعة البديهة
                  </span>
                  <h3 className="font-serif-arabic text-xl sm:text-2xl font-black text-stone-950 dark:text-stone-50">
                    سباق فرز الكلمات السريع: اسم، فعل، أم حرف؟
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-900 dark:bg-amber-950 dark:text-amber-300">
                  سلسلة السرعة: {sorterStreak} 🔥
                </span>
                <span className="text-xs font-bold text-stone-500">
                  الكلمة: {sorterIndex + 1} / {SORTER_WORDS.length}
                </span>
              </div>
            </div>

            <div className="mt-8 max-w-xl mx-auto text-center">
              <span className="text-xs font-bold text-stone-500 dark:text-stone-400">
                حدد قسم الكلمة العربية المعروضة فوراً:
              </span>

              {/* Main Word Stage */}
              <div className="my-6 rounded-3xl border-2 border-amber-400/80 bg-white p-8 shadow-lg dark:bg-stone-800 dark:border-amber-600/50">
                <span className="font-serif-arabic text-4xl sm:text-5xl font-black text-amber-950 dark:text-amber-300 tracking-wide block">
                  {SORTER_WORDS[sorterIndex].word}
                </span>
              </div>

              {/* Instant Feedback Ribbon */}
              {sorterFeedback && (
                <div className={`mb-4 rounded-xl p-3 text-xs sm:text-sm font-black border transition-all ${
                  sorterFeedback.isCorrect
                    ? 'bg-emerald-100 text-emerald-950 border-emerald-400 dark:bg-emerald-950/80 dark:text-emerald-200'
                    : 'bg-rose-100 text-rose-950 border-rose-400 dark:bg-rose-950/80 dark:text-rose-200'
                }`}>
                  {sorterFeedback.message}
                </div>
              )}

              {/* 3 Sorting Action Buttons */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => handleSortAction('verb')}
                  disabled={!!sorterFeedback}
                  className="rounded-2xl border-2 border-emerald-400 bg-emerald-50 py-4 px-2 text-center text-emerald-950 font-black shadow-xs transition hover:bg-emerald-100 hover:scale-105 active:scale-95 disabled:opacity-50 dark:bg-emerald-950/60 dark:border-emerald-700 dark:text-emerald-200 cursor-pointer"
                >
                  <span className="block text-xl mb-1">⚡</span>
                  <span className="text-sm sm:text-base font-serif-arabic">فِعْل</span>
                </button>

                <button
                  onClick={() => handleSortAction('noun')}
                  disabled={!!sorterFeedback}
                  className="rounded-2xl border-2 border-indigo-400 bg-indigo-50 py-4 px-2 text-center text-indigo-950 font-black shadow-xs transition hover:bg-indigo-100 hover:scale-105 active:scale-95 disabled:opacity-50 dark:bg-indigo-950/60 dark:border-indigo-700 dark:text-indigo-200 cursor-pointer"
                >
                  <span className="block text-xl mb-1">📜</span>
                  <span className="text-sm sm:text-base font-serif-arabic">اسْم</span>
                </button>

                <button
                  onClick={() => handleSortAction('particle')}
                  disabled={!!sorterFeedback}
                  className="rounded-2xl border-2 border-rose-400 bg-rose-50 py-4 px-2 text-center text-rose-950 font-black shadow-xs transition hover:bg-rose-100 hover:scale-105 active:scale-95 disabled:opacity-50 dark:bg-rose-950/60 dark:border-rose-700 dark:text-rose-200 cursor-pointer"
                >
                  <span className="block text-xl mb-1">🔗</span>
                  <span className="text-sm sm:text-base font-serif-arabic">حَرْف</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            GAME 5: 📜 POETIC HEMISTICH & RHYME COMPLETION
        ======================================================== */}
        {(activeTab === 'all' || activeTab === 'poetry') && (
          <div className="rounded-3xl border-2 border-stone-200/90 bg-white p-6 sm:p-8 shadow-sm dark:border-stone-800 dark:bg-stone-900">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200/80 pb-4 dark:border-stone-800">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-stone-800 text-amber-300 shadow-xs dark:bg-amber-700 dark:text-stone-950">
                  <Feather className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[11px] font-black text-amber-800 dark:text-amber-400">
                    📜 اللعبة الخامسة: قوافي وبحور الشعر
                  </span>
                  <h3 className="font-serif-arabic text-xl sm:text-2xl font-black text-stone-950 dark:text-stone-50">
                    تحدي إكمال عجز الأبيات الشعرية الشهيرة
                  </h3>
                </div>
              </div>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-900 dark:bg-amber-950 dark:text-amber-300">
                +30 نقطة لكل شطر موزون
              </span>
            </div>

            <p className="mt-3 text-xs sm:text-sm font-bold text-stone-600 dark:text-stone-400">
              اختر عجز البيت الصحيح الموزون عروضياً ليكتمل شطر البيت الشعري وتتعرف على بحره وقائله:
            </p>

            <div className="mt-6 space-y-6">
              {VERSE_CHALLENGES.map((challenge) => {
                const ans = verseAnswers[challenge.id];
                return (
                  <div
                    key={challenge.id}
                    className="rounded-2xl border-2 border-stone-200/80 bg-stone-50/70 p-5 sm:p-6 dark:border-stone-800 dark:bg-stone-850"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-black text-stone-600 dark:text-stone-400">
                      <span>الشاعر: <strong className="text-amber-950 dark:text-amber-300">{challenge.poet}</strong></span>
                      <span className="rounded-md bg-stone-200 px-2 py-0.5 text-[11px] font-mono dark:bg-stone-700">
                        {challenge.meter}
                      </span>
                    </div>

                    <div className="font-serif-arabic my-4 rounded-xl bg-amber-50/80 p-4 text-center text-lg sm:text-xl font-black text-stone-950 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-900/50 dark:text-stone-100 shadow-2xs">
                      صَدْرُ البَيْتِ: {challenge.shatr1} ... فما هو عَجُزُهُ؟
                    </div>

                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                      {challenge.options.map((opt, optIdx) => {
                        const isSelected = ans?.selectedIndex === optIdx;
                        const isCorrect = opt === challenge.correctShatr2;
                        let btnStyle = 'border-stone-200 bg-white text-stone-800 hover:border-amber-700 hover:bg-amber-50 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200';

                        if (ans) {
                          if (isCorrect) {
                            btnStyle = 'border-emerald-500 bg-emerald-100 text-emerald-950 font-black dark:bg-emerald-950/80 dark:text-emerald-200';
                          } else if (isSelected && !isCorrect) {
                            btnStyle = 'border-rose-400 bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-300';
                          } else {
                            btnStyle = 'opacity-50 border-stone-200 bg-stone-100 text-stone-400 dark:border-stone-800 dark:bg-stone-900';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            disabled={ans?.isCorrect}
                            onClick={() => handleVerseClick(challenge.id, optIdx, isCorrect)}
                            className={`flex items-center justify-between rounded-xl border p-3 text-right font-serif-arabic text-sm sm:text-base font-bold transition cursor-pointer ${btnStyle}`}
                          >
                            <span>{opt}</span>
                            {ans && isCorrect && <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />}
                            {ans && isSelected && !isCorrect && <XCircle className="h-4 w-4 shrink-0 text-rose-600" />}
                          </button>
                        );
                      })}
                    </div>

                    {ans && (
                      <div className={`mt-3 rounded-xl p-3 text-xs font-bold leading-relaxed border ${
                        ans.isCorrect
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-amber-50 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}>
                        {ans.isCorrect ? '✅ روعة عروضية وبلاغية! ' : '💡 العجز الصحيح هو: ' + challenge.correctShatr2 + '. '}
                        {challenge.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================
            GAME 6: 🎯 RHETORIC & CLASSICAL DIALOGUES (QUIZ ITEMS)
        ======================================================== */}
        {(activeTab === 'all' || activeTab === 'rhetoric') && (
          <div className="rounded-3xl border-2 border-stone-200/90 bg-white p-6 sm:p-8 shadow-sm dark:border-stone-800 dark:bg-stone-900">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200/80 pb-4 dark:border-stone-800">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-700 text-white shadow-xs">
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[11px] font-black text-amber-800 dark:text-amber-400">
                    🎯 اللعبة السادسة: البلاغة وسرعة البديهة
                  </span>
                  <h3 className="font-serif-arabic text-xl sm:text-2xl font-black text-stone-950 dark:text-stone-50">
                    مسابقات البلاغة والمواقف الحوارية البليغة
                  </h3>
                </div>
              </div>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-900 dark:bg-amber-950 dark:text-amber-300">
                +25 نقطة لكل اختيار بليغ
              </span>
            </div>

            <div className="mt-6 space-y-6">
              {QUIZ_ITEMS.map((quiz) => {
                const ans = answers[quiz.id];
                return (
                  <div key={quiz.id} className="quiz-card rounded-2xl border border-stone-200 bg-stone-50/60 p-5 sm:p-6 dark:border-stone-800 dark:bg-stone-850">
                    <h4 className="comp-title font-serif-arabic text-lg sm:text-xl font-black text-stone-950 dark:text-stone-50">
                      {quiz.gameTitle}
                    </h4>
                    <p className="mt-0.5 text-xs font-bold text-stone-500 dark:text-stone-400">
                      {quiz.gameSubtitle}
                    </p>

                    <div className="quiz-question font-serif-arabic mt-4 rounded-xl border border-amber-900/10 bg-white p-4 text-base sm:text-lg font-black text-stone-950 dark:border-amber-400/10 dark:bg-stone-900 dark:text-stone-50 shadow-2xs">
                      {quiz.question}
                    </div>

                    <div className="quiz-options mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                      {quiz.options.map((opt, idx) => {
                        const isSelected = ans?.selectedIndex === idx;
                        let btnStyle = 'border-stone-200 bg-white text-stone-800 hover:border-amber-800 hover:bg-amber-50 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200 dark:hover:border-amber-500';

                        if (ans) {
                          if (opt.isCorrect) {
                            btnStyle = 'border-emerald-500 bg-emerald-100 text-emerald-950 font-black dark:bg-emerald-950/80 dark:text-emerald-200';
                          } else if (isSelected && !opt.isCorrect) {
                            btnStyle = 'border-rose-400 bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-300';
                          } else {
                            btnStyle = 'opacity-50 border-stone-200 bg-stone-100 text-stone-400 dark:border-stone-800 dark:bg-stone-900';
                          }
                        }

                        return (
                          <button
                            key={idx}
                            disabled={ans?.isCorrect}
                            onClick={() => handleOptionClick(quiz.id, idx, opt.isCorrect, opt.feedback, quiz.points)}
                            className={`opt-btn flex items-center justify-between rounded-xl border p-3 text-right text-xs sm:text-sm font-bold transition cursor-pointer ${btnStyle}`}
                          >
                            <span>{opt.text}</span>
                            {ans && opt.isCorrect && <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />}
                            {ans && isSelected && !opt.isCorrect && <XCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />}
                          </button>
                        );
                      })}
                    </div>

                    {ans && (
                      <div className={`feedback-msg mt-3 rounded-xl p-3 text-xs font-bold leading-relaxed border transition ${
                        ans.isCorrect
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                          : 'bg-amber-50 text-amber-900 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
                      }`}>
                        {ans.feedback}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================
            GAME 7: 💎 RARE WORDS FLASHCARDS TREASURY
        ======================================================== */}
        {(activeTab === 'all' || activeTab === 'rare') && (
          <div className="rounded-3xl border-2 border-stone-200/90 bg-white p-6 sm:p-8 shadow-sm dark:border-stone-800 dark:bg-stone-900">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200/80 pb-4 dark:border-stone-800">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-800 text-white shadow-xs">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[11px] font-black text-amber-800 dark:text-amber-400">
                    💎 اللعبة السابعة: خزائن المفردات
                  </span>
                  <h3 className="font-serif-arabic text-xl sm:text-2xl font-black text-stone-950 dark:text-stone-50">
                    كاشف المفردات والأضداد النادرة في معاجم العرب
                  </h3>
                </div>
              </div>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-900 dark:bg-amber-950 dark:text-amber-300">
                8 بطاقات كنز معجمية
              </span>
            </div>

            <p className="mt-3 text-xs sm:text-sm font-bold text-stone-600 dark:text-stone-400">
              فكر في المعنى أو الضد أولاً ثم اضغط على الزر لكشف الكنز اللغوي المخبوء في أمهات المعاجم:
            </p>

            <div className="word-game-grid mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {RARE_WORDS.map((w) => {
                const isRevealed = !!revealedWords[w.id];
                return (
                  <div
                    key={w.id}
                    className="word-card flex flex-col justify-between rounded-2xl border-2 border-amber-200/60 bg-gradient-to-br from-amber-50/60 via-white to-stone-50/50 p-5 dark:border-stone-800 dark:from-stone-900 dark:to-stone-850 shadow-2xs"
                  >
                    <div>
                      <span className="text-[11px] font-black text-amber-800 dark:text-amber-400">
                        {w.type === 'meaning' ? '🌸 معنى المفردة' : '⚖️ الأضداد في اللغة'}
                      </span>
                      <h4 className="font-serif-arabic mt-2 text-lg font-black text-stone-950 dark:text-stone-50">
                        {w.question}
                      </h4>

                      {isRevealed && (
                        <p className="mt-3 text-xs sm:text-sm font-bold text-emerald-900 dark:text-emerald-300 leading-relaxed border-t border-amber-200/60 pt-2.5 dark:border-stone-700 font-serif-arabic animate-fade-in">
                          {w.answer}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => toggleWordReveal(w.id)}
                      className="reveal-btn mt-4 inline-flex items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs font-black text-stone-700 transition hover:bg-amber-50 hover:border-amber-600 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700 cursor-pointer shadow-2xs"
                    >
                      {isRevealed ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      <span>{isRevealed ? 'إخفاء الإجابة' : w.type === 'meaning' ? 'كشف المعنى 🔍' : 'كشف الضد ⚖️'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================
            GAME 8: 🎡 SPINNING WHEEL OF ELOQUENCE TRIVIA
        ======================================================== */}
        {(activeTab === 'all' || activeTab === 'wheel') && (
          <div className="rounded-3xl border-2 border-amber-900/20 bg-gradient-to-br from-amber-100/40 via-white to-rose-50/40 p-6 sm:p-8 shadow-sm dark:border-stone-800 dark:from-stone-900 dark:to-stone-850">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200/80 pb-4 dark:border-stone-800">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-700 text-white shadow-xs">
                  <Compass className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[11px] font-black text-amber-800 dark:text-amber-400">
                    🎡 اللعبة الثامنة: العجلة البلاغية اليومية
                  </span>
                  <h3 className="font-serif-arabic text-xl sm:text-2xl font-black text-stone-950 dark:text-stone-50">
                    عجلة الحظ والتحدي البلاغي العشوائي
                  </h3>
                </div>
              </div>

              <button
                disabled={isSpinning}
                onClick={handleSpinWheel}
                className="inline-flex items-center gap-2 rounded-2xl bg-amber-900 px-5 py-2.5 text-xs font-black text-white shadow-md transition hover:bg-amber-800 active:scale-95 disabled:opacity-50 dark:bg-amber-600 dark:hover:bg-amber-500 cursor-pointer"
              >
                <Shuffle className="h-4 w-4" />
                <span>{isSpinning ? 'جاري دوران العجلة...' : '🎡 أَدِرِ العَجَلَةَ الآنَ (+15 نقطة)'}</span>
              </button>
            </div>

            <div className="mt-6 max-w-2xl mx-auto rounded-3xl border-2 border-amber-300/80 bg-white p-6 sm:p-8 shadow-sm dark:border-stone-700 dark:bg-stone-800">
              <div className="flex items-center justify-between text-xs font-black text-amber-900 dark:text-amber-400">
                <span className="bg-amber-100 dark:bg-amber-950 px-2.5 py-1 rounded-md">
                  🏷️ {currentTrivia.category}
                </span>
                <span className="text-stone-500">لغز بلاغي مستنبط</span>
              </div>

              <h4 className="font-serif-arabic mt-3 text-xl sm:text-2xl font-black text-stone-950 dark:text-stone-50">
                {currentTrivia.title}
              </h4>

              <div className="mt-3 rounded-2xl bg-amber-50/70 p-4 border border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/40">
                <span className="text-xs font-black text-amber-900 dark:text-amber-300 block mb-1">
                  ❓ السؤال والتحدي:
                </span>
                <p className="font-serif-arabic text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
                  {currentTrivia.question}
                </p>
              </div>

              <div className="mt-4 rounded-2xl bg-emerald-50/70 p-4 border border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800/40">
                <span className="text-xs font-black text-emerald-900 dark:text-emerald-300 block mb-1">
                  💡 الجواب البلاغي الشافي:
                </span>
                <p className="font-serif-arabic text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 leading-relaxed">
                  {currentTrivia.answer}
                </p>
                <div className="mt-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 border-t border-emerald-200/60 pt-2 dark:border-emerald-800/40">
                  ✨ لطيفة لغوية: {currentTrivia.funFact}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* USER REQUIREMENT: In all of these sections add in every section's last text to write visitors in that link */}
      <SectionVisitorBanner
        badgeEmoji="🏆"
        sectionTitle="هل لديك تحدٍ لغوي أو لغز نحوي تريد مشاركته كزائر في الموسوعة؟"
        sectionSubtitle="اكتب لغزك البلاغي، أو بيتاً أعجزك إعرابه، أو فكرة لعبة ومسابقة جديدة في الموسوعة ليشارك جميع الزوار في خوضها!"
        actionText="✍️ اكتب لغزك أو تحديك كزائر الآن 🚀"
        onActionClick={onOpenSuggestQuiz}
      />

    </section>
  );
};
