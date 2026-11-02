import React, { useState, useRef } from 'react';
import { CommunityPost, CommunityCategory } from '../types';
import { Heart, Trash2, BookOpen, Send, Sparkles, MessageSquarePlus, Coffee, Feather } from 'lucide-react';
import { SectionVisitorBanner } from './SectionVisitorBanner';
import { soundFX } from '../utils/sound';

interface CommunitySectionProps {
  posts: CommunityPost[];
  onAddPost: (post: Omit<CommunityPost, 'id' | 'date' | 'likes'>) => void;
  onDeletePost: (id: string) => void;
  onRequestDeleteWithPasscode: (post: CommunityPost) => void;
  onLikePost: (id: string) => void;
  onOpenVisitorComment: (post: CommunityPost) => void;
}

export const CommunitySection: React.FC<CommunitySectionProps> = ({
  posts,
  onAddPost,
  onRequestDeleteWithPasscode,
  onLikePost,
  onOpenVisitorComment,
}) => {
  const formRef = useRef<HTMLDivElement>(null);

  // Form State
  const [visitorName, setVisitorName] = useState('');
  const [visitorCategory, setVisitorCategory] = useState<CommunityCategory>('قصيدة شعرية');
  const [visitorTitle, setVisitorTitle] = useState('');
  const [visitorContent, setVisitorContent] = useState('');
  const [formFeedback, setFormFeedback] = useState<string | null>(null);

  // Category filter state
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  // Expanded cards set
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({
    post1: true,
    post2: false,
  });

  const toggleReadCard = (postId: string) => {
    soundFX.playClick();
    setExpandedCards((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
    const nameInput = document.getElementById('visitorName');
    nameInput?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim() || !visitorTitle.trim() || !visitorContent.trim()) {
      setFormFeedback('يرجى ملء جميع الحقول (الاسم، العنوان، والنص كاملاً) قبل النشر.');
      return;
    }

    soundFX.playSuccess();
    onAddPost({
      author: visitorName.trim(),
      category: visitorCategory,
      title: visitorTitle.trim(),
      content: visitorContent.trim(),
    });

    setVisitorName('');
    setVisitorTitle('');
    setVisitorContent('');
    setFormFeedback('✨ تم نشر عملك الأدبي بنجاح في ركن المبدعين! بارك الله في قلمك.');
    setTimeout(() => setFormFeedback(null), 4000);
  };

  const filteredPosts = selectedFilter === 'all'
    ? posts
    : posts.filter((p) => p.category === selectedFilter);

  const getCuteTagIcon = (cat: string) => {
    switch (cat) {
      case 'قصيدة شعرية': return '🌸 شعر';
      case 'مقال فكري': return '🕯️ فكر';
      case 'قصة أدبية': return '📜 قصة';
      case 'خاطرة وجدانية': return '☕ خاطرة';
      default: return '✨ إبداع';
    }
  };

  return (
    <section className="py-12 sm:py-16">
      
      {/* Section Header with bold typography and cute styling */}
      <div className="mb-10 text-right">
        <div className="inline-flex items-center gap-2 rounded-full bg-rose-100/80 px-4 py-1.5 text-xs font-black text-rose-900 shadow-xs dark:bg-rose-950/70 dark:text-rose-300">
          <span>🌸 اسم القسم: ركن المبدعين ومشاركات القراء الأدبية</span>
          <span aria-hidden="true">·</span>
          <span>منبر الأقلام الصاعدة</span>
        </div>
        <h2 className="font-serif-arabic mt-3 text-3xl font-black tracking-tight text-stone-950 sm:text-4xl dark:text-stone-50">
          ركن المبدعين ومشاركات القراء
        </h2>
        <p className="mt-2 text-sm sm:text-base text-stone-600 dark:text-stone-400 max-w-3xl leading-relaxed font-medium">
          مساحة أدبية حرة ودافئة مفتوحة لكل كاتب وشاعر لمشاركة إبداعاته، ونصوصه الشعرية والفكرية، ونيل تقدير جمهور لغة الضاد.
        </p>
      </div>

      {/* Visitor Submission Form */}
      <div
        ref={formRef}
        className="mb-12 rounded-3xl border border-rose-200/80 bg-gradient-to-br from-rose-50/50 via-white to-amber-50/40 p-6 sm:p-8 shadow-sm dark:border-stone-800 dark:from-stone-900 dark:via-stone-900 dark:to-stone-900"
      >
        <div className="mb-6 flex items-center justify-between border-b border-rose-100 pb-4 dark:border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif-arabic text-xl sm:text-2xl font-black text-stone-950 dark:text-stone-50">
                انشر عملك الأدبي في ركن المبدعين ✍️
              </h3>
              <p className="text-xs font-bold text-stone-500 dark:text-stone-400">
                مساحتك الخاصة لمشاركة القوافي والأفكار
              </p>
            </div>
          </div>
          <span className="rounded-full bg-rose-100/70 px-3 py-1 text-xs font-bold text-rose-800 dark:bg-rose-950 dark:text-rose-300">
            نشر فوري وتوثيق دائم 🚀
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-bold text-stone-800 dark:text-stone-200">
                اسم الكاتب / الشاعر:
              </label>
              <input
                type="text"
                id="visitorName"
                value={visitorName}
                onChange={(e) => setVisitorName(e.target.value)}
                placeholder="اكتب اسمك الكريم أو لقبك الأدبي..."
                className="mt-1.5 w-full rounded-2xl border border-stone-300 bg-white p-3 text-sm text-stone-900 placeholder-stone-400 transition focus:border-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500/20 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-500"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-stone-800 dark:text-stone-200">
                نوع العمل الأدبي:
              </label>
              <select
                id="visitorCategory"
                value={visitorCategory}
                onChange={(e) => setVisitorCategory(e.target.value as CommunityCategory)}
                className="mt-1.5 w-full rounded-2xl border border-stone-300 bg-white p-3 text-sm text-stone-900 transition focus:border-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500/20 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
              >
                <option value="قصيدة شعرية">🌸 قصيدة شعرية</option>
                <option value="مقال فكري">🕯️ مقال فكري</option>
                <option value="قصة أدبية">📜 قصة أدبية</option>
                <option value="خاطرة وجدانية">☕ خاطرة وجدانية</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-stone-800 dark:text-stone-200">
              عنوان الموضوع:
            </label>
            <input
              type="text"
              id="visitorTitle"
              value={visitorTitle}
              onChange={(e) => setVisitorTitle(e.target.value)}
              placeholder="مثال: ترانيم الفجر، أو أسرار البلاغة في زمن العولمة..."
              className="mt-1.5 w-full rounded-2xl border border-stone-300 bg-white p-3 text-sm text-stone-900 placeholder-stone-400 transition focus:border-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500/20 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-500"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-stone-800 dark:text-stone-200">
              نص العمل الأدبي كاملاً:
            </label>
            <textarea
              id="visitorContent"
              value={visitorContent}
              onChange={(e) => setVisitorContent(e.target.value)}
              placeholder="اكتب النص هنا كاملاً (سواء كان أبياتاً شعرية موزونة أو نثراً بليغاً)..."
              rows={4}
              className="mt-1.5 w-full rounded-2xl border border-stone-300 bg-white p-3 text-sm text-stone-900 placeholder-stone-400 transition focus:border-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500/20 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-500 font-serif-arabic text-base"
            />
          </div>

          {formFeedback && (
            <div className="rounded-2xl bg-rose-50 p-3 text-xs font-bold text-rose-900 dark:bg-rose-950/60 dark:text-rose-200">
              {formFeedback}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-2xl bg-rose-700 px-8 py-3.5 text-sm font-bold text-white shadow-md transition-all duration-200 hover:bg-rose-800 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-rose-600/40 dark:bg-rose-600 dark:hover:bg-rose-500 cursor-pointer"
            >
              <Send className="h-4 w-4" />
              <span>نشر الموضوع في ركن المبدعين فوراً 🚀</span>
            </button>
          </div>
        </form>
      </div>

      {/* Filter Tabs for Community Works */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-4 dark:border-stone-800">
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-stone-200/50 rounded-2xl dark:bg-stone-800/80">
          {[
            { id: 'all', label: 'كافة المشاركات ✨' },
            { id: 'قصيدة شعرية', label: '🌸 قصائد شعرية' },
            { id: 'مقال فكري', label: '🕯️ مقالات فكرية' },
            { id: 'قصة أدبية', label: '📜 قصص أدبية' },
            { id: 'خاطرة وجدانية', label: '☕ خواطر وجدانية' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedFilter === tab.id
                  ? 'bg-white text-stone-900 shadow-xs dark:bg-stone-700 dark:text-stone-100'
                  : 'text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs font-bold text-stone-500 dark:text-stone-400">
          المجموع: {filteredPosts.length} مشاركة أدبية
        </span>
      </div>

      {/* Community Posts Grid */}
      <div className="space-y-6">
        {filteredPosts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-stone-300 p-12 text-center dark:border-stone-800">
            <p className="text-sm text-stone-500 dark:text-stone-400 font-bold">
              لا توجد مشاركات في هذا التصنيف حالياً. كن أول من ينشر إبداعه! 🌸
            </p>
          </div>
        ) : (
          filteredPosts.map((post) => {
            const isExpanded = !!expandedCards[post.id];
            const commentCount = post.visitorComments ? post.visitorComments.length : 0;
            return (
              <article
                key={post.id}
                className="community-card rounded-3xl border border-stone-200/90 bg-white p-6 sm:p-7 shadow-xs transition-all hover:border-rose-300 hover:shadow-md dark:border-stone-800 dark:bg-stone-900"
              >
                {/* Header row */}
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    {/* Cute metadata text */}
                    <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                      <span className="font-bold text-rose-700 dark:text-rose-400">
                        {getCuteTagIcon(post.category)}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{post.date}</span>
                    </div>

                    <h3 className="font-serif-arabic mt-2 text-xl sm:text-2xl font-black text-stone-950 dark:text-stone-50">
                      {post.title}
                    </h3>

                    <p className="mt-1 text-xs sm:text-sm font-bold text-stone-600 dark:text-stone-300">
                      بقلم: {post.author}
                    </p>
                  </div>

                  {/* Toggle Read Button */}
                  <button
                    onClick={() => toggleReadCard(post.id)}
                    className="toggle-read-btn flex items-center gap-2 rounded-2xl border border-stone-300 bg-stone-50 px-4 py-2 text-xs font-bold text-stone-700 transition hover:bg-rose-50 hover:border-rose-300 hover:text-rose-800 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700 dark:hover:text-rose-300 cursor-pointer"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>
                      {isExpanded ? '🔼 إخفاء النص الأدبي' : '📖 اضغط هنا لرؤية ما كتبه الكاتب كاملاً ⬇️'}
                    </span>
                  </button>
                </div>

                {/* Collapsible Written Text Box */}
                {isExpanded && (
                  <div className="written-text-box mt-5 rounded-2xl border border-stone-200/80 bg-rose-50/20 p-5 text-sm sm:text-base leading-relaxed text-stone-800 transition-all dark:border-stone-800 dark:bg-stone-950/60 dark:text-stone-200">
                    <p className="whitespace-pre-line font-serif-arabic text-base sm:text-lg">
                      {post.content}
                    </p>
                  </div>
                )}

                {/* Footer Controls: Likes + Delete + Dedicated Visitor Comment Link */}
                <div className="mt-5 space-y-3 border-t border-stone-100 pt-3 dark:border-stone-800">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => onLikePost(post.id)}
                      className="flex items-center gap-1.5 rounded-xl bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700 transition hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300"
                    >
                      <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500/20" />
                      <span className="tabular-nums">{post.likes}</span>
                      <span>إعجاب ❤️</span>
                    </button>

                    <button
                      onClick={() => onRequestDeleteWithPasscode(post)}
                      className="flex items-center gap-1.5 text-xs font-medium text-stone-400 transition hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>🗑️ حذف الموضوع (محمي برمز شجاع)</span>
                    </button>
                  </div>

                  {/* USER REQUIREMENT: In every text/card add visitor link */}
                  <div className="rounded-2xl bg-stone-50 p-2.5 text-right border border-stone-200/60 dark:bg-stone-800/60 dark:border-stone-700/60">
                    <button
                      onClick={() => onOpenVisitorComment(post)}
                      className="flex w-full items-center justify-between text-xs font-bold text-stone-700 hover:text-rose-700 dark:text-stone-300 dark:hover:text-rose-300 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-1.5">
                        <MessageSquarePlus className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
                        <span>✍️ شارك برأيك كزائر في هذا الموضوع أو اكتب خاطرة مماثلة</span>
                      </div>
                      <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-bold text-stone-600 shadow-xs dark:bg-stone-700 dark:text-stone-300">
                        {commentCount > 0 ? `${commentCount} تعليق 💬` : 'علّق كزائر 🌸'}
                      </span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* USER REQUIREMENT: In all of these sections add in every section's last text to write visitors in that link */}
      <SectionVisitorBanner
        badgeEmoji="🌸"
        sectionTitle="شارك بإبداعك الآن في ركن المبدعين"
        sectionSubtitle="هل لديك قصيدة، مقال فكري، أو قصة أدبية؟ افتح باب المشاركة وسجل اسمك بين كوكبة كتاب ومبدعي الموسوعة."
        actionText="✍️ اكتب مشاركتك في ركن المبدعين الآن 🚀"
        onActionClick={scrollToForm}
      />

    </section>
  );
};
