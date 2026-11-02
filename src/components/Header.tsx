import React from 'react';
import { Feather, Sun, Moon, PlusCircle } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDark: boolean;
  toggleTheme: () => void;
  onOpenPublish: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isDark,
  toggleTheme,
  onOpenPublish,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200/80 bg-stone-50/95 backdrop-blur-md transition-colors dark:border-stone-800 dark:bg-stone-950/95">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        
        {/* Zone 1: Official Logo & Brand Wordmark */}
        <button
          onClick={() => setActiveTab('all')}
          className="group flex items-center gap-3 text-right text-stone-900 transition-transform duration-200 hover:scale-102 dark:text-stone-100 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <img
            src="/assets/aistudio/image_b18908c0.png"
            alt="شعار سحر البيان"
            className="h-11 w-11 rounded-2xl object-cover shadow-sm ring-1 ring-amber-500/40 bg-stone-900"
          />
          <div className="flex flex-col">
            <span className="font-serif-arabic text-xl sm:text-2xl font-black tracking-tight text-amber-950 dark:text-amber-100 leading-tight">
              سحر البيان ✨
            </span>
            <span className="text-[10px] font-bold text-amber-800/80 dark:text-amber-400/80 -mt-0.5">
              موسوعة الأدب واللغة والفصاحة
            </span>
          </div>
        </button>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-stone-600 dark:text-stone-300">
          <button
            onClick={() => setActiveTab('all')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
              activeTab === 'all'
                ? 'border-amber-800 text-amber-900 dark:border-amber-400 dark:text-amber-300 font-bold'
                : 'border-transparent hover:text-stone-950 dark:hover:text-stone-100'
            }`}
          >
            الموسوعة الشاملة
          </button>
          <button
            onClick={() => setActiveTab('poetry')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
              activeTab === 'poetry'
                ? 'border-amber-800 text-amber-900 dark:border-amber-400 dark:text-amber-300 font-bold'
                : 'border-transparent hover:text-stone-950 dark:hover:text-stone-100'
            }`}
          >
            ديوان الشعر
          </button>
          <button
            onClick={() => setActiveTab('article')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
              activeTab === 'article'
                ? 'border-amber-800 text-amber-900 dark:border-amber-400 dark:text-amber-300 font-bold'
                : 'border-transparent hover:text-stone-950 dark:hover:text-stone-100'
            }`}
          >
            الفكر والمقالات
          </button>
          <button
            onClick={() => setActiveTab('story')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
              activeTab === 'story'
                ? 'border-amber-800 text-amber-900 dark:border-amber-400 dark:text-amber-300 font-bold'
                : 'border-transparent hover:text-stone-950 dark:hover:text-stone-100'
            }`}
          >
            القصص والحكم
          </button>
          <button
            onClick={() => setActiveTab('dictionary')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
              activeTab === 'dictionary'
                ? 'border-amber-800 text-amber-900 dark:border-amber-400 dark:text-amber-300 font-bold'
                : 'border-transparent hover:text-stone-950 dark:hover:text-stone-100'
            }`}
          >
            معجم الأفعال والأسماء والنحو 📖
          </button>
          <button
            onClick={() => setActiveTab('community')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
              activeTab === 'community'
                ? 'border-amber-800 text-amber-900 dark:border-amber-400 dark:text-amber-300 font-bold'
                : 'border-transparent hover:text-stone-950 dark:hover:text-stone-100'
            }`}
          >
            ركن المبدعين
          </button>
          <button
            onClick={() => setActiveTab('competitions')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
              activeTab === 'competitions'
                ? 'border-amber-800 text-amber-900 dark:border-amber-400 dark:text-amber-300 font-bold'
                : 'border-transparent hover:text-stone-950 dark:hover:text-stone-100'
            }`}
          >
            مسابقات الفصاحة والألعاب 🎮
          </button>
        </nav>

        {/* Zone 3: 1 Primary action + Theme toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={toggleTheme}
            aria-label="تبديل مظهر الموقع"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-stone-200 text-stone-600 transition-colors hover:bg-stone-100 dark:border-stone-800 dark:text-stone-300 dark:hover:bg-stone-900"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <button
            onClick={onOpenPublish}
            className="flex items-center gap-2 rounded-lg bg-amber-900 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition-all hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-700/40 dark:bg-amber-700 dark:hover:bg-amber-600 whitespace-nowrap shrink-0"
          >
            <PlusCircle className="h-4 w-4" />
            <span>نشر عمل أدبي 🚀</span>
          </button>
        </div>
      </div>

      {/* Mobile navigation row */}
      <div className="flex lg:hidden overflow-x-auto border-t border-stone-200 px-4 py-2 text-xs font-semibold scrollbar-none dark:border-stone-800">
        <div className="flex items-center gap-4 py-1">
          <button
            onClick={() => setActiveTab('all')}
            className={`whitespace-nowrap ${activeTab === 'all' ? 'text-amber-900 font-bold dark:text-amber-400' : 'text-stone-600 dark:text-stone-400'}`}
          >
            الرئيسية
          </button>
          <button
            onClick={() => setActiveTab('poetry')}
            className={`whitespace-nowrap ${activeTab === 'poetry' ? 'text-amber-900 font-bold dark:text-amber-400' : 'text-stone-600 dark:text-stone-400'}`}
          >
            ديوان الشعر
          </button>
          <button
            onClick={() => setActiveTab('article')}
            className={`whitespace-nowrap ${activeTab === 'article' ? 'text-amber-900 font-bold dark:text-amber-400' : 'text-stone-600 dark:text-stone-400'}`}
          >
            الفكر والمقالات
          </button>
          <button
            onClick={() => setActiveTab('story')}
            className={`whitespace-nowrap ${activeTab === 'story' ? 'text-amber-900 font-bold dark:text-amber-400' : 'text-stone-600 dark:text-stone-400'}`}
          >
            القصص والحكم
          </button>
          <button
            onClick={() => setActiveTab('dictionary')}
            className={`whitespace-nowrap ${activeTab === 'dictionary' ? 'text-amber-900 font-bold dark:text-amber-400' : 'text-stone-600 dark:text-stone-400'}`}
          >
            معجم الأفعال والأسماء والنحو 📖
          </button>
          <button
            onClick={() => setActiveTab('community')}
            className={`whitespace-nowrap ${activeTab === 'community' ? 'text-amber-900 font-bold dark:text-amber-400' : 'text-stone-600 dark:text-stone-400'}`}
          >
            ركن المبدعين
          </button>
          <button
            onClick={() => setActiveTab('competitions')}
            className={`whitespace-nowrap ${activeTab === 'competitions' ? 'text-amber-900 font-bold dark:text-amber-400' : 'text-stone-600 dark:text-stone-400'}`}
          >
            مسابقات الفصاحة والألعاب 🎮
          </button>
        </div>
      </div>
    </header>
  );
};
