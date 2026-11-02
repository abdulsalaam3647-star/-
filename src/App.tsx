import React, { useState, useEffect, useMemo } from 'react';
import { LiteraryWork, CommunityPost, WorkCategory, VisitorComment } from './types';
import { INITIAL_WORKS, INITIAL_COMMUNITY_POSTS } from './data/initialData';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { WorkCard } from './components/WorkCard';
import { CommunitySection } from './components/CommunitySection';
import { CompetitionsSection } from './components/CompetitionsSection';
import { DictionarySection } from './components/DictionarySection';
import { PublishModal } from './components/PublishModal';
import { PasscodeModal } from './components/PasscodeModal';
import { VisitorInteractionModal } from './components/VisitorInteractionModal';
import { SectionVisitorBanner } from './components/SectionVisitorBanner';
import { BookOpen, Scroll, Feather, Flame, Sparkles, Trophy, Heart, Coffee, Star } from 'lucide-react';
import { soundFX } from './utils/sound';

// Arabic search text normalizer
function normalizeArabic(text: string): string {
  return text
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .replace(/[إأآا]/g, 'ا')
    .replace(/[ى]/g, 'ي')
    .replace(/[ة]/g, 'ه')
    .toLowerCase();
}

export default function App() {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('shujaa_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('shujaa_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('shujaa_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  // Works state with localStorage persistence
  const [works, setWorks] = useState<LiteraryWork[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('shujaa_literary_works');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length >= 10) {
            return parsed;
          }
        } catch {
          // fallback
        }
      }
    }
    return INITIAL_WORKS;
  });

  useEffect(() => {
    localStorage.setItem('shujaa_literary_works', JSON.stringify(works));
  }, [works]);

  // Community posts with localStorage persistence
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('shujaa_community_posts');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length >= 8) {
            return parsed;
          }
        } catch {
          // fallback
        }
      }
    }
    return INITIAL_COMMUNITY_POSTS;
  });

  useEffect(() => {
    localStorage.setItem('shujaa_community_posts', JSON.stringify(communityPosts));
  }, [communityPosts]);

  // Quiz score with localStorage persistence
  const [quizScore, setQuizScore] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('shujaa_quiz_score');
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed)) return parsed;
      }
    }
    return 0;
  });

  useEffect(() => {
    localStorage.setItem('shujaa_quiz_score', quizScore.toString());
  }, [quizScore]);

  // Navigation & Search state
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [publishCategory, setPublishCategory] = useState<WorkCategory>('poetry');
  const [postToDelete, setPostToDelete] = useState<CommunityPost | null>(null);
  
  // Visitor Comment/Interaction Modal State
  const [interactionItem, setInteractionItem] = useState<LiteraryWork | CommunityPost | null>(null);

  // Like a work
  const handleLikeWork = (id: string) => {
    setWorks((prev) =>
      prev.map((w) => (w.id === id ? { ...w, likes: w.likes + 1 } : w))
    );
  };

  // Like a community post
  const handleLikeCommunityPost = (id: string) => {
    setCommunityPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p))
    );
  };

  // Add work to Encyclopedia
  const handlePublishWork = (workData: Omit<LiteraryWork, 'id' | 'date' | 'likes'>) => {
    const newWork: LiteraryWork = {
      ...workData,
      id: `work-custom-${Date.now()}`,
      date: 'اليوم',
      likes: 1,
      visitorComments: [],
    };
    setWorks((prev) => [newWork, ...prev]);
  };

  // Add Community post
  const handleAddCommunityPost = (postData: Omit<CommunityPost, 'id' | 'date' | 'likes'>) => {
    const newPost: CommunityPost = {
      ...postData,
      id: `post-${Date.now()}`,
      date: 'الآن',
      likes: 1,
      visitorComments: [],
    };
    setCommunityPosts((prev) => [newPost, ...prev]);
  };

  // Protected delete
  const handleConfirmDeleteCommunity = (postId: string) => {
    setCommunityPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  // Add visitor comment to a work or community post
  const handleAddVisitorComment = (itemId: string, comment: VisitorComment, isCommunity: boolean) => {
    if (isCommunity) {
      setCommunityPosts((prev) =>
        prev.map((p) => {
          if (p.id === itemId) {
            return {
              ...p,
              visitorComments: [comment, ...(p.visitorComments || [])],
            };
          }
          return p;
        })
      );
    } else {
      setWorks((prev) =>
        prev.map((w) => {
          if (w.id === itemId) {
            return {
              ...w,
              visitorComments: [comment, ...(w.visitorComments || [])],
            };
          }
          return w;
        })
      );
    }
  };

  const openPublishWithCategory = (cat: WorkCategory) => {
    setPublishCategory(cat);
    setIsPublishModalOpen(true);
  };

  // Filtered Encyclopedia works
  const filteredWorks = useMemo(() => {
    let result = works;

    // Filter by tab
    if (activeTab === 'poetry') {
      result = result.filter((w) => w.category === 'poetry');
    } else if (activeTab === 'article') {
      result = result.filter((w) => w.category === 'article');
    } else if (activeTab === 'story') {
      result = result.filter((w) => w.category === 'story');
    } else if (activeTab === 'media') {
      result = result.filter((w) => w.category === 'media');
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = normalizeArabic(searchQuery.trim());
      result = result.filter(
        (w) =>
          normalizeArabic(w.title).includes(q) ||
          normalizeArabic(w.content).includes(q) ||
          normalizeArabic(w.tag).includes(q) ||
          normalizeArabic(w.author).includes(q)
      );
    }

    return result;
  }, [works, activeTab, searchQuery]);

  // High-level section metadata for displaying the section name separately at the top
  const currentSectionInfo = useMemo(() => {
    switch (activeTab) {
      case 'poetry':
        return {
          name: 'قسم ديوان الشعر العربي وقوافي الفصحى',
          badge: '🌸 ديوان الشعر الأصيل',
          desc: 'روائع قصائد الشاعر شجاع في الحكمة، والفخر، والغزل العذري، والفروسية، ومراثي الأندلس الخالدة.',
          tagline: 'أشعار الشاعر شجاع',
          countText: '١٤ قصيدة موزونة',
        };
      case 'article':
        return {
          name: 'قسم الفكر والمقالات الفلسفية واللسانية',
          badge: '🕯️ صرح الفكر والوعي',
          desc: 'رؤى نقدية وبحوث فلسفية في بناء الوعي الإنساني، وفلسفة الصمت، وعبقرية لغة الضاد بقلم المفكر شجاع.',
          tagline: 'مقالات المفكر شجاع',
          countText: '١٢ مقالاً ودراسة',
        };
      case 'story':
        return {
          name: 'قسم القصص والحكم الأدبية والعبر الإنسانية',
          badge: '📜 حكايات الحكمة والتأمل',
          desc: 'حكايات ملهمة تسبر أغوار النفس البشرية وتبعث الأمل من زوايا الحياة العتيقة بقلم الأديب شجاع.',
          tagline: 'قصص بقلم: شجاع',
          countText: '١٣ قصة وحكمة',
        };
      case 'media':
        return {
          name: 'قسم الإلقاء الصوتي والمرئيات والندوات الأدبية',
          badge: '🎙️ إلقاء وبيان مسموع',
          desc: 'تسجيلات صوتية ومرئية لأداء مخارج الحروف العربية وضبط الوقف العروضي وندوات تطوير الاستماع.',
          tagline: 'جلسات صوتية ومرئية',
          countText: '١٠ جلسات ومحاضرات',
        };
      case 'community':
        return {
          name: 'قسم ركن المبدعين ومشاركات القراء',
          badge: '🌸 منبر الأقلام الصاعدة',
          desc: 'منصة تفاعلية مفتوحة لنشر أعمال الزوار والقراء من قصائد شعرية ومقالات وقصص وخواطر وجدانية.',
          tagline: 'أقلام وإبداعات الزوار',
          countText: `${communityPosts.length} مشاركة أدبية`,
        };
      case 'competitions':
        return {
          name: 'قسم مسابقات الفصاحة والتحديات النحوية والبلاغية',
          badge: '🏆 مضمار لسان الضاد',
          desc: 'اختبارات الإعراب، البلاغة والبيان، إكمال عجز البيت الشعري، وكاشف المفردات والأضداد النادرة.',
          tagline: 'تحديات الفصاحة المباشرة',
          countText: '٦ مسابقات و٨ كواشف لغوية',
        };
      case 'dictionary':
        return {
          name: 'قسم معجم الأفعال والأسماء وقواعد النحو والترجمة الرباعية 🌐',
          badge: '📖 الأفعال والأسماء والإعراب',
          desc: 'قاموس نحوي ولغوي شامل يضم الأفعال، والأسماء، والمفردات، مع شرح نحوي وصرفي مفصل لكل كلمة، وإعراب نموذجي، وشريط أسئلة تفاعلي، وترجمة إلى: English و Kannada و Urdu و Malayalam.',
          tagline: 'شريط السؤال النحوي والترجمة',
          countText: '٣٠+ فعلاً واسماً وشرحاً نحوياً',
        };
      default:
        return {
          name: 'قسم الموسوعة الأدبية الشاملة (كافة الأقسام)',
          badge: '✨ ديوان الأدب الجامع',
          desc: 'تصفح كافة المخطوطات الشعرية، والمقالات الفلسفية، والقصص الأدبية، والجلسات المرئية الموثقة.',
          tagline: 'موسوعة شجاع وركن المبدعين',
          countText: `${works.length} عملاً موثقاً`,
        };
    }
  }, [activeTab, works.length, communityPosts.length]);

  return (
    <div className="min-h-screen bg-stone-50/90 font-sans text-stone-900 transition-colors duration-300 dark:bg-stone-950 dark:text-stone-100">
      
      {/* Strict Top Bar Contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDark={isDark}
        toggleTheme={toggleTheme}
        onOpenPublish={() => openPublishWithCategory('poetry')}
      />

      {/* Hero with Search and Visual Focal Anchor */}
      <Hero
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onExplorePoetry={() => setActiveTab('poetry')}
        onExploreCommunity={() => setActiveTab('community')}
        onExploreCompetitions={() => setActiveTab('competitions')}
        onExploreDictionary={() => setActiveTab('dictionary')}
        worksCount={works.length}
        communityCount={communityPosts.length}
      />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* HIGH SECTION HEADER: Write the section's name separately in the high with bold headings */}
        <div className="mt-8 mb-6 overflow-hidden rounded-3xl border-2 border-amber-900/15 bg-gradient-to-r from-amber-100/70 via-rose-50/40 to-stone-100 p-6 sm:p-8 text-right shadow-sm dark:border-amber-500/20 dark:from-stone-900 dark:via-stone-900 dark:to-amber-950/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-1.5 text-xs font-black text-amber-950 shadow-xs dark:bg-stone-800 dark:text-amber-200">
                <span>{currentSectionInfo.badge}</span>
                <span aria-hidden="true">·</span>
                <span className="text-rose-700 dark:text-rose-400 font-bold">{currentSectionInfo.tagline}</span>
              </div>

              {/* Bold High Section Heading */}
              <h2 className="font-serif-arabic mt-3 text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-stone-950 dark:text-stone-50">
                {currentSectionInfo.name}
              </h2>

              <p className="mt-2 text-sm sm:text-base font-bold text-stone-700 dark:text-stone-300 max-w-3xl leading-relaxed">
                {currentSectionInfo.desc}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
              <div className="rounded-2xl border border-amber-300/80 bg-white/90 px-5 py-2.5 text-center shadow-xs dark:border-stone-700 dark:bg-stone-800">
                <span className="block text-[11px] font-black text-stone-500 dark:text-stone-400">إحصائية القسم</span>
                <span className="font-serif-arabic text-lg sm:text-xl font-black text-amber-950 dark:text-amber-300 tabular-nums">
                  {currentSectionInfo.countText}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Category Filter Tabs when in All or Work sub-views */}
        {activeTab !== 'competitions' && activeTab !== 'community' && (
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-stone-200/80 pb-4 dark:border-stone-800">
            <div className="flex flex-wrap items-center gap-2 p-1.5 bg-stone-200/60 rounded-2xl dark:bg-stone-800/80">
              {[
                { id: 'all', label: 'كافة الأعمال ✨' },
                { id: 'poetry', label: '🌸 ديوان الشعر (١٤ قصيدة)' },
                { id: 'article', label: '🕯️ الفكر والمقالات (١٢ مقالاً)' },
                { id: 'story', label: '📜 القصص والحكم (١٣ قصة)' },
                { id: 'media', label: '🎙️ الإلقاء والمرئيات (١٠ جلسات)' },
                { id: 'dictionary', label: '📖 معجم الأفعال والأسماء والنحو والترجمة 🌐' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    soundFX.playClick();
                    setActiveTab(tab.id);
                  }}
                  className={`rounded-xl px-4 py-2 text-xs font-black transition whitespace-nowrap cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-white text-stone-950 shadow-xs dark:bg-stone-700 dark:text-stone-50'
                      : 'text-stone-700 hover:text-stone-950 dark:text-stone-300 dark:hover:text-stone-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="text-xs font-black text-stone-600 dark:text-stone-400">
              {activeTab === 'dictionary'
                ? 'معجم الأفعال والأسماء والشرح النحوي وترجمات English و Kannada و Urdu و Malayalam'
                : `عرض ${filteredWorks.length} من أصل ${works.length} عملاً موثقاً`}
            </div>
          </div>
        )}

        {/* Section: Main Encyclopedia Works Grid */}
        {activeTab !== 'competitions' && activeTab !== 'community' && activeTab !== 'dictionary' && (
          <section className="pb-16">
            {filteredWorks.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-stone-300 p-12 text-center dark:border-stone-800">
                <p className="font-serif-arabic text-lg font-bold text-stone-700 dark:text-stone-300">
                  لم يتم العثور على نتائج تطابق بحثك: «{searchQuery}» 🌸
                </p>
                <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                  جرب البحث بمفردات أخرى، أو تصفح الأقسام الكاملة.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveTab('all');
                  }}
                  className="mt-4 inline-flex items-center gap-1 rounded-xl bg-amber-900 px-4 py-2 text-xs font-bold text-white hover:bg-amber-800 dark:bg-amber-700 cursor-pointer"
                >
                  عرض كافة الأعمال
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredWorks.map((work) => (
                  <WorkCard
                    key={work.id}
                    work={work}
                    onLike={handleLikeWork}
                    onOpenVisitorComment={(item) => setInteractionItem(item)}
                  />
                ))}
              </div>
            )}

            {/* USER REQUIREMENT: In all of these sections add in every section's last text to write visitors in that link */}
            {activeTab === 'poetry' && (
              <SectionVisitorBanner
                badgeEmoji="🌸"
                sectionTitle="✍️ هل نظمت بيتاً أو قصيدة؟ شارك بقصيدتك في ديوان الشعر الآن"
                sectionSubtitle="يسعدنا نشر قصائدك وروائع قوافيك في ديوان الموسوعة ليقرأها محبو الشعر العربي ويتفاعلوا معها."
                actionText="🌸 انشر قصيدتك في ديوان الشعر فوراً 🚀"
                onActionClick={() => openPublishWithCategory('poetry')}
              />
            )}

            {activeTab === 'article' && (
              <SectionVisitorBanner
                badgeEmoji="🕯️"
                sectionTitle="✍️ قلمك منارة للفكر: شارك بمقالك الفكري أو التأملي"
                sectionSubtitle="ساهم في بناء الوعي الإنساني وكتابة مقالات رصينة في الفلسفة والبلاغة والقراءة المعاصرة."
                actionText="🕯️ انشر مقالك الفكري في الموسوعة فوراً 🚀"
                onActionClick={() => openPublishWithCategory('article')}
              />
            )}

            {activeTab === 'story' && (
              <SectionVisitorBanner
                badgeEmoji="📜"
                sectionTitle="✍️ هل لديك حكمة أو قصة ملهمة؟ شاركها مع القراء في الموسوعة"
                sectionSubtitle="دون حكايتك وعبرتك الأدبية لتلهم بها قلوب وعقول عابري السبيل في هذه الواحة الأدبية."
                actionText="📜 انشر قصتك وحكمتك في الموسوعة فوراً 🚀"
                onActionClick={() => openPublishWithCategory('story')}
              />
            )}

            {activeTab === 'media' && (
              <SectionVisitorBanner
                badgeEmoji="🎙️"
                sectionTitle="✍️ هل تسجل إلقاءً صوتياً أو لديك مادة مرئية؟ شارك تسجيلك الأدبي"
                sectionSubtitle="أضف رابط مقطعك الصوتي أو إلقائك الفصيح ليُنشر في قسم المرئيات والإلقاء الأدبي ويستمع له الزوار."
                actionText="🎙️ أضف مادتك الصوتية أو المرئية فوراً 🚀"
                onActionClick={() => openPublishWithCategory('media')}
              />
            )}

            {activeTab === 'all' && (
              <SectionVisitorBanner
                badgeEmoji="✨"
                sectionTitle="✍️ زائرنا الكريم: قلمك مرحب به في كل أقسام الموسوعة"
                sectionSubtitle="سواء كانت قصيدة شعرية، أو مقالاً فكرياً، أو قصة، انشر عملك الأدبي الآن ليحفظ في ديوان الموسوعة."
                actionText="✨ نشر عمل جديد في الموسوعة الشاملة 🚀"
                onActionClick={() => openPublishWithCategory('poetry')}
              />
            )}
          </section>
        )}

        {/* Section: Words and Synonyms Dictionary */}
        {(activeTab === 'dictionary' || activeTab === 'all') && (
          <div className={activeTab === 'all' ? 'border-t border-stone-200/80 pt-8 dark:border-stone-800' : ''}>
            <DictionarySection />
          </div>
        )}

        {/* Section: Community Readers Submissions */}
        {(activeTab === 'community' || activeTab === 'all') && (
          <div className={activeTab === 'all' ? 'border-t border-stone-200/80 pt-8 dark:border-stone-800' : ''}>
            <CommunitySection
              posts={communityPosts}
              onAddPost={handleAddCommunityPost}
              onDeletePost={handleConfirmDeleteCommunity}
              onRequestDeleteWithPasscode={(post) => setPostToDelete(post)}
              onLikePost={handleLikeCommunityPost}
              onOpenVisitorComment={(post) => setInteractionItem(post)}
            />
          </div>
        )}

        {/* Section: Eloquence & Poetry Competitions */}
        {(activeTab === 'competitions' || activeTab === 'all') && (
          <div className={activeTab === 'all' ? 'border-t border-stone-200/80 pt-8 dark:border-stone-800' : ''}>
            <CompetitionsSection
              score={quizScore}
              setScore={setQuizScore}
              onOpenSuggestQuiz={() => {
                setActiveTab('community');
                window.scrollTo({ top: 400, behavior: 'smooth' });
              }}
            />
          </div>
        )}

      </main>

      {/* Institutional Editorial Cute Footer */}
      <footer className="mt-20 border-t border-stone-200 bg-stone-100/70 py-12 text-right transition-colors dark:border-stone-800 dark:bg-stone-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            <div className="flex items-center gap-3 text-center md:text-right">
              <img
                src="/assets/aistudio/image_b18908c0.png"
                alt="شعار سحر البيان"
                className="h-12 w-12 rounded-2xl object-cover shadow-sm ring-1 ring-amber-500/40 bg-stone-900"
              />
              <div>
                <span className="font-serif-arabic text-xl font-black text-amber-950 dark:text-amber-100 flex items-center justify-center md:justify-start gap-2">
                  <span>سحر البيان: موسوعة الأدب والفصاحة</span>
                  <span className="text-rose-500">🌸</span>
                </span>
                <p className="mt-1 text-xs text-stone-500 dark:text-stone-400 max-w-md">
                  صرحٌ للأدب العربي، وحفظ القوافي، ورعاية أقلام المبدعين، وصقل ملكة الفصاحة والبلاغة.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-bold text-stone-600 dark:text-stone-400">
              <button onClick={() => setActiveTab('all')} className="hover:text-amber-900 dark:hover:text-amber-300">
                الرئيسية
              </button>
              <button onClick={() => setActiveTab('poetry')} className="hover:text-amber-900 dark:hover:text-amber-300">
                ديوان الشعر (١٤)
              </button>
              <button onClick={() => setActiveTab('article')} className="hover:text-amber-900 dark:hover:text-amber-300">
                الفكر والمقالات (١٢)
              </button>
              <button onClick={() => setActiveTab('story')} className="hover:text-amber-900 dark:hover:text-amber-300">
                القصص والحكم (١٣)
              </button>
              <button onClick={() => setActiveTab('dictionary')} className="hover:text-amber-900 dark:hover:text-amber-300">
                معجم المترادفات (٢٠+) 📖
              </button>
              <button onClick={() => setActiveTab('community')} className="hover:text-amber-900 dark:hover:text-amber-300">
                ركن المبدعين (١٣)
              </button>
              <button onClick={() => setActiveTab('competitions')} className="hover:text-amber-900 dark:hover:text-amber-300">
                مسابقات الفصاحة 🏆
              </button>
            </div>

            <div className="text-xs text-stone-400 dark:text-stone-500 font-semibold">
              صُنع بحب وعناية للغة الضاد ☕✨
            </div>
          </div>
        </div>
      </footer>

      {/* Master Publish Modal */}
      <PublishModal
        isOpen={isPublishModalOpen}
        defaultCategory={publishCategory}
        onClose={() => setIsPublishModalOpen(false)}
        onPublish={handlePublishWork}
      />

      {/* Passcode Protected Delete Modal */}
      <PasscodeModal
        post={postToDelete}
        isOpen={!!postToDelete}
        onClose={() => setPostToDelete(null)}
        onConfirmDelete={handleConfirmDeleteCommunity}
      />

      {/* Visitor Response / Comment Modal */}
      <VisitorInteractionModal
        item={interactionItem}
        isOpen={!!interactionItem}
        onClose={() => setInteractionItem(null)}
        onAddComment={handleAddVisitorComment}
      />

    </div>
  );
}
