import React from 'react';
import { Feather, Sparkles, Send, Heart, Coffee, BookOpen } from 'lucide-react';
import { soundFX } from '../utils/sound';

interface SectionVisitorBannerProps {
  sectionTitle: string;
  sectionSubtitle: string;
  badgeEmoji: string;
  onActionClick: () => void;
  actionText?: string;
}

export const SectionVisitorBanner: React.FC<SectionVisitorBannerProps> = ({
  sectionTitle,
  sectionSubtitle,
  badgeEmoji,
  onActionClick,
  actionText = '✍️ اضغط هنا لتكتب وتشارك كزائر في هذا القسم فوراً 🚀',
}) => {
  return (
    <div className="relative mt-12 overflow-hidden rounded-3xl border border-amber-200/80 bg-gradient-to-r from-amber-50 via-rose-50/40 to-stone-100 p-6 sm:p-8 text-right shadow-sm dark:border-stone-800 dark:from-stone-900 dark:via-amber-950/20 dark:to-stone-900 transition-all hover:shadow-md">
      
      {/* Decorative cute floating elements */}
      <div className="pointer-events-none absolute -left-4 -top-4 text-4xl opacity-20 sm:opacity-30">
        ✨
      </div>
      <div className="pointer-events-none absolute left-12 bottom-2 text-3xl opacity-15">
        ☕
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center sm:text-right">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3.5 py-1 text-xs font-black text-amber-950 shadow-xs dark:bg-stone-800 dark:text-amber-300">
            <span>{badgeEmoji}</span>
            <span>ركن الزوار المفتوح والكتابة المباشرة</span>
          </div>

          <h3 className="font-serif-arabic text-xl sm:text-2xl font-black text-stone-950 dark:text-stone-50">
            {sectionTitle}
          </h3>

          <p className="max-w-2xl text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
            {sectionSubtitle}
          </p>
        </div>

        <button
          onClick={() => {
            soundFX.playClick();
            onActionClick();
          }}
          className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-800 to-amber-900 px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-md transition-all duration-300 hover:scale-105 hover:from-amber-700 hover:to-amber-800 dark:from-amber-700 dark:to-amber-600 cursor-pointer whitespace-nowrap shrink-0"
        >
          <Feather className="h-4 w-4 transition-transform group-hover:rotate-12" />
          <span>{actionText}</span>
        </button>
      </div>
    </div>
  );
};
