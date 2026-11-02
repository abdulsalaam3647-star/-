import React, { useState } from 'react';
import { LiteraryWork, CommunityPost, VisitorComment } from '../types';
import { X, Send, MessageCircle, Heart, Sparkles, Coffee, Feather } from 'lucide-react';
import { soundFX } from '../utils/sound';

interface VisitorInteractionModalProps {
  item: LiteraryWork | CommunityPost | null;
  isOpen: boolean;
  onClose: () => void;
  onAddComment: (itemId: string, comment: VisitorComment, isCommunity: boolean) => void;
}

export const VisitorInteractionModal: React.FC<VisitorInteractionModalProps> = ({
  item,
  isOpen,
  onClose,
  onAddComment,
}) => {
  const [visitorName, setVisitorName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen || !item) return null;

  const isCommunity = 'category' in item && typeof item.category === 'string' && ['قصيدة شعرية', 'مقال فكري', 'قصة أدبية', 'خاطرة وجدانية'].includes(item.category);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim() || !commentText.trim()) {
      setFeedback('يرجى كتابة اسمك والتعليق أو النص الأدبي للمشاركة.');
      return;
    }

    soundFX.playSuccess();
    const newComment: VisitorComment = {
      id: `vc-${Date.now()}`,
      visitorName: visitorName.trim(),
      comment: commentText.trim(),
      date: 'الآن',
    };

    onAddComment(item.id, newComment, isCommunity);
    setVisitorName('');
    setCommentText('');
    setFeedback('🌸 شكراً لمشاركتك اللطيفة! أُضيفت مشاركتك فوراً للعمل.');
    setTimeout(() => {
      setFeedback(null);
      onClose();
    }, 1500);
  };

  const existingComments = item.visitorComments || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-lg rounded-3xl border border-amber-200/80 bg-white p-6 sm:p-8 shadow-2xl dark:border-stone-800 dark:bg-stone-900 text-right"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-100 pb-4 dark:border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif-arabic text-xl sm:text-2xl font-black text-stone-950 dark:text-stone-50">
                مساحة مشاركة الزائر الأدبية ✍️
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                تعقيب وإضافة نص حول: «<span className="font-semibold text-amber-900 dark:text-amber-400">{item.title}</span>»
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="إغلاق النافذة"
            className="rounded-xl p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700 dark:hover:bg-stone-800 dark:hover:text-stone-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Previous comments list if any */}
        {existingComments.length > 0 && (
          <div className="mt-4 max-h-40 overflow-y-auto rounded-2xl bg-amber-50/40 p-3.5 space-y-2 border border-amber-100 dark:bg-stone-800/40 dark:border-stone-800">
            <p className="text-xs font-bold text-amber-900 dark:text-amber-300">
              مشاركات الزوار السابقة ({existingComments.length}):
            </p>
            {existingComments.map((c) => (
              <div key={c.id} className="rounded-xl bg-white p-2.5 shadow-xs dark:bg-stone-800 border border-stone-100 dark:border-stone-700">
                <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                  <span className="font-bold text-stone-800 dark:text-stone-200">🪶 {c.visitorName}</span>
                  <span>{c.date}</span>
                </div>
                <p className="mt-1 text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-serif-arabic">
                  {c.comment}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
              اسمك الأدبي / الكريم:
            </label>
            <input
              type="text"
              value={visitorName}
              onChange={(e) => setVisitorName(e.target.value)}
              placeholder="مثال: قارئ من بغداد، أو متذوق للشعر..."
              className="mt-1 w-full rounded-xl border border-stone-300 bg-stone-50/60 p-2.5 text-sm text-stone-900 placeholder-stone-400 transition focus:border-amber-700 focus:bg-white focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
              نص تعقيبك أو بيتك الشعري المشارك:
            </label>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="اكتب انطباعك، أو بيتاً مجارياً لهذه القصيدة، أو فكرة ملهمة..."
              rows={3}
              className="mt-1 w-full rounded-xl border border-stone-300 bg-stone-50/60 p-2.5 text-sm text-stone-900 placeholder-stone-400 transition focus:border-amber-700 focus:bg-white focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 font-serif-arabic"
            />
          </div>

          {feedback && (
            <p className="rounded-xl bg-emerald-50 p-2.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
              {feedback}
            </p>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-stone-100 dark:border-stone-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-stone-200 px-4 py-2 text-xs font-bold text-stone-600 transition hover:bg-stone-100 dark:border-stone-700 dark:text-stone-300"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-5 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-600 cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              <span>نشر مشاركة الزائر فوراً ✨</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
