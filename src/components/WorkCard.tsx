import React, { useState } from 'react';
import { LiteraryWork } from '../types';
import { Heart, Copy, Check, Volume2, VolumeX, MessageSquarePlus, MessageCircle, Sparkles } from 'lucide-react';
import { soundFX } from '../utils/sound';

interface WorkCardProps {
  work: LiteraryWork;
  onLike: (id: string) => void;
  onOpenVisitorComment: (work: LiteraryWork) => void;
}

export const WorkCard: React.FC<WorkCardProps> = ({ work, onLike, onOpenVisitorComment }) => {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');

  const handleCopy = () => {
    soundFX.playClick();
    const fullText = `${work.title}\n${work.tag} - ${work.author}\n\n${work.content}`;
    navigator.clipboard.writeText(fullText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  };

  const handleSpeak = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(work.content);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.88;

    const voices = window.speechSynthesis.getVoices();
    const arabicVoice = voices.find((v) => v.lang.startsWith('ar'));
    if (arabicVoice) {
      utterance.voice = arabicVoice;
    }

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const isPoetry = work.category === 'poetry';

  // Cute icons according to category
  const getCuteEmoji = (cat: string) => {
    switch (cat) {
      case 'poetry': return '🌸';
      case 'article': return '🕯️';
      case 'story': return '📜';
      case 'media': return '🎙️';
      default: return '✨';
    }
  };

  const commentCount = work.visitorComments ? work.visitorComments.length : 0;

  return (
    <article className="group relative flex flex-col justify-between rounded-3xl border border-stone-200/90 bg-white p-6 sm:p-7 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-amber-700/30 hover:shadow-lg dark:border-stone-800 dark:bg-stone-900/90 dark:hover:border-amber-500/30">
      
      {/* Card Top: Cute metadata & tags */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3 text-xs text-stone-500 dark:border-stone-800 dark:text-stone-400">
          <div className="flex items-center gap-2">
            <span className="text-base">{getCuteEmoji(work.category)}</span>
            <span className="font-black text-amber-950 dark:text-amber-300">{work.tag}</span>
            <span aria-hidden="true">·</span>
            <span className="font-bold text-stone-700 dark:text-stone-300">{work.author}</span>
            {work.date && (
              <>
                <span aria-hidden="true">·</span>
                <span>{work.date}</span>
              </>
            )}
          </div>

          {/* Quick utility controls */}
          <div className="flex items-center gap-1">
            {isPoetry && (
              <button
                onClick={() => setFontSize(fontSize === 'normal' ? 'large' : 'normal')}
                title="تكبير / تصغير حجم الخط"
                className="rounded-lg bg-stone-50 px-2 py-0.5 text-xs font-bold text-stone-600 hover:text-amber-900 dark:bg-stone-800 dark:text-stone-400 dark:hover:text-amber-300 transition"
              >
                {fontSize === 'normal' ? 'خط كبير 🔍' : 'خط عادي'}
              </button>
            )}
          </div>
        </div>

        {/* Title: Bold Heading */}
        <h3 className="font-serif-arabic mt-4 text-xl sm:text-2xl font-black tracking-tight text-stone-950 dark:text-stone-50 group-hover:text-amber-900 dark:group-hover:text-amber-300 transition-colors">
          {work.title}
        </h3>

        {/* Media Description if available */}
        {work.mediaDesc && (
          <p className="mt-2 text-xs sm:text-sm text-stone-600 dark:text-stone-400">
            {work.mediaDesc}
          </p>
        )}

        {/* Video Embed if available */}
        {work.embedUrl && (
          <div className="mt-4 overflow-hidden rounded-2xl border border-stone-200 bg-black shadow-inner dark:border-stone-700">
            <div className="relative aspect-video w-full">
              <iframe
                src={work.embedUrl}
                title={work.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />
            </div>
          </div>
        )}

        {/* Body Content */}
        <div className="mt-4 text-right">
          {isPoetry ? (
            <div
              className={`font-serif-arabic whitespace-pre-line text-stone-800 dark:text-stone-200 poetry-verse leading-loose ${
                fontSize === 'large' ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl'
              }`}
            >
              {work.content.split('\n').map((line, idx) => (
                <p key={idx} className="my-1.5 transition-colors hover:text-amber-900 dark:hover:text-amber-300">
                  {line}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-sm sm:text-base leading-relaxed text-stone-700 dark:text-stone-300 font-normal">
              {work.content}
            </p>
          )}
        </div>
      </div>

      {/* Card Bottom Area: Likes, Audio, Copy AND the dedicated Visitor participation link */}
      <div className="mt-6 space-y-3 pt-4 border-t border-stone-100 dark:border-stone-800">
        
        {/* Interaction controls row */}
        <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
          
          {/* Like Button with cute bounce */}
          <button
            onClick={() => {
              soundFX.playClick();
              onLike(work.id);
            }}
            className="group/btn flex items-center gap-1.5 rounded-xl bg-rose-50/70 px-3 py-1.5 font-bold text-rose-700 transition hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-950/70 cursor-pointer"
          >
            <Heart className="h-4 w-4 transition-transform group-hover/btn:scale-125 text-rose-500 fill-rose-500/20" />
            <span className="tabular-nums font-bold">{work.likes}</span>
            <span className="hidden sm:inline">أعجبني</span>
          </button>

          {/* Action icons: Audio & Copy */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSpeak}
              title={isSpeaking ? 'إيقاف الإلقاء' : 'الاستماع للإلقاء الصوتي'}
              className={`flex items-center gap-1 rounded-xl px-2.5 py-1.5 font-medium transition cursor-pointer ${
                isSpeaking
                  ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300'
                  : 'bg-stone-50 text-stone-600 hover:bg-stone-100 dark:bg-stone-800 dark:text-stone-300'
              }`}
            >
              {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              <span className="hidden sm:inline">{isSpeaking ? 'إيقاف' : 'استماع 🎙️'}</span>
            </button>

            <button
              onClick={handleCopy}
              title="نسخ النص كاملاً"
              className="flex items-center gap-1 rounded-xl bg-stone-50 px-2.5 py-1.5 font-medium text-stone-600 transition hover:bg-stone-100 dark:bg-stone-800 dark:text-stone-300 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-700 dark:text-emerald-400">تم النسخ</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span className="hidden sm:inline">نسخ</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* USER REQUIREMENT: In every text/card add in the last text a link for visitors to write in that link! */}
        <div className="rounded-2xl bg-amber-50/60 p-3 text-right border border-amber-200/50 dark:bg-stone-800/60 dark:border-stone-700/60">
          <button
            onClick={() => {
              soundFX.playClick();
              onOpenVisitorComment(work);
            }}
            className="flex w-full items-center justify-between text-xs font-bold text-amber-900 hover:text-amber-700 dark:text-amber-300 dark:hover:text-amber-200 transition cursor-pointer"
          >
            <div className="flex items-center gap-1.5">
              <MessageSquarePlus className="h-3.5 w-3.5 text-amber-700 dark:text-amber-400" />
              <span>✍️ شارك برأيك كزائر في هذا العمل أو اكتب نصاً مجاوراً</span>
            </div>
            <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-bold text-stone-600 shadow-xs dark:bg-stone-700 dark:text-stone-300">
              {commentCount > 0 ? `${commentCount} مشاركات 💬` : 'اكتب تعليقك 🌸'}
            </span>
          </button>
        </div>

      </div>
    </article>
  );
};
