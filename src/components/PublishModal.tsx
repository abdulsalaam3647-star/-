import React, { useState } from 'react';
import { WorkCategory, LiteraryWork } from '../types';
import { X, Feather, Upload, AlertCircle } from 'lucide-react';
import { soundFX } from '../utils/sound';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (work: Omit<LiteraryWork, 'id' | 'date' | 'likes'>) => void;
  defaultCategory?: WorkCategory;
}

export const PublishModal: React.FC<PublishModalProps> = ({
  isOpen,
  onClose,
  onPublish,
  defaultCategory = 'poetry',
}) => {
  const [entryTitle, setEntryTitle] = useState('');
  const [entryCategory, setEntryCategory] = useState<WorkCategory>(defaultCategory);
  const [entryTag, setEntryTag] = useState('شعر حكمة وتأمل');
  const [entryAuthor, setEntryAuthor] = useState('الشاعر شجاع');
  const [entryContent, setEntryContent] = useState('');
  const [embedUrl, setEmbedUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCategoryChange = (cat: WorkCategory) => {
    setEntryCategory(cat);
    if (cat === 'poetry') {
      setEntryTag('شعر حكمة وتأمل');
      setEntryAuthor('الشاعر شجاع');
    } else if (cat === 'article') {
      setEntryTag('فلسفة وبناء الوعي');
      setEntryAuthor('المفكر شجاع');
    } else if (cat === 'story') {
      setEntryTag('حكمة وعبرة');
      setEntryAuthor('قصة بقلم: شجاع');
    } else if (cat === 'media') {
      setEntryTag('إلقاء فصيح');
      setEntryAuthor('إلقاء وأداء صوتي: شجاع');
    }
  };

  // Sync category if defaultCategory changes
  React.useEffect(() => {
    if (defaultCategory) {
      handleCategoryChange(defaultCategory);
    }
  }, [defaultCategory, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!entryTitle.trim()) {
      setErrorMessage('يرجى إدخال عنوان العمل الأدبي.');
      return;
    }
    if (!entryContent.trim() && !embedUrl.trim()) {
      setErrorMessage('يرجى كتابة نص العمل أو إدخال رابط التضمين.');
      return;
    }

    soundFX.playSuccess();
    onPublish({
      title: entryTitle.trim(),
      category: entryCategory,
      tag: entryTag.trim() || 'أدب عام',
      author: entryAuthor.trim() || 'الشاعر شجاع',
      content: entryContent.trim(),
      embedUrl: embedUrl.trim() || undefined,
    });

    setEntryTitle('');
    setEntryContent('');
    setEmbedUrl('');
    setErrorMessage(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-2xl rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-2xl dark:border-stone-800 dark:bg-stone-900"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-4 dark:border-stone-800">
          <div className="flex items-center gap-3">
            <img
              src="/assets/aistudio/image_b18908c0.png"
              alt="شعار سحر البيان"
              className="h-10 w-10 rounded-xl object-cover shadow-xs ring-1 ring-amber-500/40 bg-stone-900"
            />
            <div>
              <h2 className="font-serif-arabic text-2xl sm:text-3xl font-black text-stone-950 dark:text-stone-50">
                توثيق ونشر عمل في موسوعة سحر البيان 🚀
              </h2>
              <p className="text-xs font-bold text-stone-500 dark:text-stone-400">
                يُحفظ العمل مباشرة في ديوان الموسوعة ويبقى متاحاً لجميع الزوار
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="إغلاق النافذة"
            className="rounded-lg p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-700 dark:hover:bg-stone-800 dark:hover:text-stone-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          
          {/* Category selection */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
              قسم العمل في الموسوعة:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'poetry', label: 'ديوان الشعر' },
                { id: 'article', label: 'الفكر والمقالات' },
                { id: 'story', label: 'القصص والحكم' },
                { id: 'media', label: 'إلقاء ومرئيات' },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleCategoryChange(c.id as WorkCategory)}
                  className={`rounded-xl border py-2 px-3 text-xs font-bold transition text-center cursor-pointer ${
                    entryCategory === c.id
                      ? 'border-amber-800 bg-amber-50 text-amber-900 dark:border-amber-500 dark:bg-amber-950/40 dark:text-amber-300'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50 dark:border-stone-700 dark:text-stone-400 dark:hover:bg-stone-800'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="entryTitle" className="block text-sm font-bold text-stone-800 dark:text-stone-200">
              عنوان العمل:
            </label>
            <input
              type="text"
              id="entryTitle"
              value={entryTitle}
              onChange={(e) => setEntryTitle(e.target.value)}
              placeholder="اكتب عنوان العمل الأدبي..."
              className="mt-1.5 w-full rounded-xl border border-stone-300 bg-stone-50/50 p-3 text-sm text-stone-900 placeholder-stone-400 transition focus:border-amber-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-800/20 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-stone-800 dark:text-stone-200">
                التصنيف أو الغرض البلاغي:
              </label>
              <input
                type="text"
                value={entryTag}
                onChange={(e) => setEntryTag(e.target.value)}
                placeholder="مثال: شعر حكمة، فلسفة وبناء الوعي..."
                className="mt-1.5 w-full rounded-xl border border-stone-300 bg-stone-50/50 p-3 text-sm text-stone-900 transition focus:border-amber-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-800/20 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-stone-800 dark:text-stone-200">
                الكاتب أو الشاعر:
              </label>
              <input
                type="text"
                value={entryAuthor}
                onChange={(e) => setEntryAuthor(e.target.value)}
                placeholder="بقلم: الشاعر شجاع / المفكر شجاع..."
                className="mt-1.5 w-full rounded-xl border border-stone-300 bg-stone-50/50 p-3 text-sm text-stone-900 transition focus:border-amber-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-800/20 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
              />
            </div>
          </div>

          {/* Embed link for video/audio */}
          {entryCategory === 'media' && (
            <div>
              <label className="block text-sm font-bold text-stone-800 dark:text-stone-200">
                رابط تضمين المادة (YouTube Embed URL):
              </label>
              <input
                type="text"
                value={embedUrl}
                onChange={(e) => setEmbedUrl(e.target.value)}
                placeholder="https://www.youtube.com/embed/..."
                className="mt-1.5 w-full rounded-xl border border-stone-300 bg-stone-50/50 p-3 text-sm text-stone-900 transition focus:border-amber-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-800/20 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
              />
            </div>
          )}

          {/* Content */}
          <div>
            <label htmlFor="entryContent" className="block text-sm font-bold text-stone-800 dark:text-stone-200">
              المحتوى أو رابط التضمين:
            </label>
            <textarea
              id="entryContent"
              value={entryContent}
              onChange={(e) => setEntryContent(e.target.value)}
              placeholder="اكتب النص الشعري أو النثري هنا..."
              rows={5}
              className="mt-1.5 w-full rounded-xl border border-stone-300 bg-stone-50/50 p-3 text-sm text-stone-900 placeholder-stone-400 transition focus:border-amber-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-800/20 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-500 font-serif-arabic text-base"
            />
          </div>

          {errorMessage && (
            <div className="flex items-center gap-2 rounded-lg bg-rose-50 p-3 text-xs font-semibold text-rose-800 dark:bg-rose-950/50 dark:text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Action Button */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100 dark:border-stone-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-stone-300 px-4 py-2.5 text-xs font-bold text-stone-700 transition hover:bg-stone-100 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="publish-btn flex items-center gap-2 rounded-xl bg-amber-900 px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm transition hover:bg-amber-800 dark:bg-amber-700 dark:hover:bg-amber-600 cursor-pointer"
            >
              <Upload className="h-4 w-4" />
              <span>نشر وحفظ العمل في الموسوعة 🚀</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
