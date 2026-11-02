import React from 'react';
import { Search, BookOpen, Sparkles, Trophy, Users, BookA } from 'lucide-react';

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onExplorePoetry: () => void;
  onExploreCommunity: () => void;
  onExploreCompetitions: () => void;
  onExploreDictionary: () => void;
  worksCount: number;
  communityCount: number;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  setSearchQuery,
  onExplorePoetry,
  onExploreCommunity,
  onExploreCompetitions,
  onExploreDictionary,
  worksCount,
  communityCount,
}) => {
  return (
    <section className="relative overflow-hidden border-b border-stone-200/80 bg-stone-100/60 dark:border-stone-800 dark:bg-stone-900/40">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12">
          
          {/* Text & Search Column (7 cols) */}
          <div className="flex flex-col justify-center lg:col-span-7">
            <div className="mb-4 inline-flex items-center gap-3 rounded-2xl bg-amber-100/90 p-2 pr-2.5 pl-4 border border-amber-300/80 shadow-xs dark:bg-amber-950/60 dark:border-amber-800/60 self-start">
              <img
                src="/assets/aistudio/image_b18908c0.png"
                alt="شعار سحر البيان"
                className="h-9 w-9 rounded-xl object-cover shadow-xs ring-1 ring-amber-500/50 bg-stone-900"
              />
              <div className="flex items-center gap-2 text-xs font-black text-amber-950 dark:text-amber-200">
                <span>سحر البيان</span>
                <span aria-hidden="true">·</span>
                <span>صَرْحُ الفَصَاحَةِ والبلاغة ولغة الضاد</span>
              </div>
            </div>

            <h1 className="font-serif-arabic text-3xl font-black tracking-tight text-stone-950 sm:text-4xl lg:text-5xl dark:text-stone-50 leading-tight lg:leading-tight">
              سحر البيان: موسوعة الأدب والشعر وميدان الفصاحة ✨
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-relaxed text-stone-600 sm:text-lg dark:text-stone-300 font-medium">
              ديوانٌ جامع لعذب القوافي، وواحةٌ فكرية دافئة تسبر أغوار الحكمة وبناء الوعي، ومنصة تفاعلية لأقلام الأدباء وميدان مسابقات الفصاحة والنحو والبلاغة.
            </p>

            {/* Interactive Arabic-aware search input */}
            <div className="mt-8 max-w-xl">
              <div className="relative flex items-center rounded-xl border border-stone-300 bg-white shadow-sm transition-all focus-within:border-amber-800 focus-within:ring-2 focus-within:ring-amber-800/20 dark:border-stone-700 dark:bg-stone-800">
                <div className="pointer-events-none pr-4 text-stone-400">
                  <Search className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث في القصائد، مقالات الفكر، القصص، أو مساهمات القراء..."
                  className="w-full bg-transparent py-3.5 pr-3 pl-4 text-sm text-stone-900 placeholder-stone-400 focus:outline-none dark:text-stone-100 dark:placeholder-stone-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="pl-4 text-xs font-semibold text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                  >
                    مسح
                  </button>
                )}
              </div>
            </div>

            {/* Quick Navigation Quick-buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={onExplorePoetry}
                className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-3.5 py-2 text-xs font-semibold text-stone-700 transition hover:border-amber-700 hover:text-amber-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200 dark:hover:border-amber-500 dark:hover:text-amber-400"
              >
                <BookOpen className="h-4 w-4" />
                <span>قصائد الشاعر شجاع</span>
              </button>

              <button
                onClick={onExploreCommunity}
                className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-3.5 py-2 text-xs font-semibold text-stone-700 transition hover:border-amber-700 hover:text-amber-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200 dark:hover:border-amber-500 dark:hover:text-amber-400"
              >
                <Users className="h-4 w-4" />
                <span>ركن المبدعين ({communityCount})</span>
              </button>

              <button
                onClick={onExploreCompetitions}
                className="inline-flex items-center gap-2 rounded-lg border border-amber-900/20 bg-amber-50 px-3.5 py-2 text-xs font-black text-amber-900 transition hover:bg-amber-100 dark:border-amber-400/20 dark:bg-amber-950/40 dark:text-amber-300 dark:hover:bg-amber-900/60"
              >
                <Trophy className="h-4 w-4" />
                <span>مَيْدَانُ الفَصَاحَةِ وَالأَلْعَابِ 🎮</span>
              </button>

              <button
                onClick={onExploreDictionary}
                className="inline-flex items-center gap-2 rounded-lg border border-emerald-900/20 bg-emerald-50 px-3.5 py-2 text-xs font-black text-emerald-900 transition hover:bg-emerald-100 dark:border-emerald-400/20 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-900/60"
              >
                <BookA className="h-4 w-4" />
                <span>معجم الأفعال والأسماء والنحو والترجمة 🌐</span>
              </button>
            </div>
          </div>

          {/* Archival Visual Anchor: Official Emblem (5 cols) */}
          <div className="relative flex items-center lg:col-span-5">
            <div className="relative w-full overflow-hidden rounded-3xl border-2 border-amber-900/30 bg-stone-950 shadow-2xl dark:border-amber-500/30">
              <img
                src="/assets/aistudio/image_b18908c0.png"
                alt="شعار سحر البيان الذهبي"
                className="h-72 w-full object-contain sm:h-84 lg:h-96 p-4 sm:p-6 transition-transform duration-700 hover:scale-105 bg-stone-950"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 right-4 left-4 text-white text-right">
                <p className="font-serif-arabic text-xl font-black text-amber-300">«سَحَرُ البَيَانِ»</p>
                <div className="mt-1 flex items-center gap-2 text-xs text-stone-300">
                  <span>ديوان الأدب والقصائد والمقالات</span>
                  <span aria-hidden="true">·</span>
                  <span>أصالة الحرف ورفعة الفصاحة</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Operational Proof Metric Ribbon */}
        <div className="mt-12 grid grid-cols-2 gap-4 border-t border-stone-200/80 pt-6 sm:grid-cols-4 dark:border-stone-800">
          <div className="text-right">
            <p className="text-xs font-medium text-stone-500 dark:text-stone-400">مجموع الأعمال الموثقة</p>
            <p className="font-serif-arabic text-2xl font-bold tabular-nums text-stone-900 dark:text-stone-100 mt-1">
              {worksCount} <span className="text-xs font-normal text-stone-500">مخطوطة وعمل</span>
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs font-medium text-stone-500 dark:text-stone-400">مشاركات أقلام القراء</p>
            <p className="font-serif-arabic text-2xl font-bold tabular-nums text-stone-900 dark:text-stone-100 mt-1">
              {communityCount} <span className="text-xs font-normal text-stone-500">نص إبداعي</span>
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs font-medium text-stone-500 dark:text-stone-400">مسابقات لغوية وبلاغية</p>
            <p className="font-serif-arabic text-2xl font-bold tabular-nums text-stone-900 dark:text-stone-100 mt-1">
              ٥ <span className="text-xs font-normal text-stone-500">ألعاب تفاعلية</span>
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs font-medium text-stone-500 dark:text-stone-400">التوثيق والحفظ</p>
            <p className="font-serif-arabic text-base font-semibold text-amber-900 dark:text-amber-400 mt-2">
              محفوظ وفوري 🚀
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
