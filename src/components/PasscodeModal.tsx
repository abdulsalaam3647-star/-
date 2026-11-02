import React, { useState } from 'react';
import { CommunityPost } from '../types';
import { Lock, X, AlertTriangle, Check, Key } from 'lucide-react';
import { soundFX } from '../utils/sound';

interface PasscodeModalProps {
  post: CommunityPost | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: (postId: string) => void;
}

export const PasscodeModal: React.FC<PasscodeModalProps> = ({
  post,
  isOpen,
  onClose,
  onConfirmDelete,
}) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);
  const [showHint, setShowHint] = useState(false);

  if (!isOpen || !post) return null;

  const validPasscodes = ['شجاع', '1234', 'shujaa', '2026'];

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = passcode.trim().toLowerCase();

    if (validPasscodes.includes(cleanCode)) {
      soundFX.playSuccess();
      onConfirmDelete(post.id);
      setPasscode('');
      setError(false);
      setShowHint(false);
      onClose();
    } else {
      soundFX.playIncorrect();
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl dark:border-stone-800 dark:bg-stone-900 text-right"
      >
        <div className="flex items-center justify-between border-b border-stone-100 pb-3 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400">
              <Lock className="h-4 w-4" />
            </div>
            <h3 className="font-serif-arabic text-lg sm:text-xl font-black text-stone-950 dark:text-stone-50">
              تأكيد حذف الموضوع (محمي برمز شجاع) 🔒
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="إغلاق"
            className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700 dark:hover:bg-stone-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-4 text-xs sm:text-sm text-stone-600 dark:text-stone-300">
          هل أنت متأكد من رغبتك في حذف عمل «<span className="font-bold text-stone-900 dark:text-stone-100">{post.title}</span>» للكاتب «<span className="font-semibold">{post.author}</span>»؟
        </p>

        <form onSubmit={handleVerify} className="mt-4 space-y-3">
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
              أدخل رمز الحماية (رمز شجاع):
            </label>
            <input
              type="text"
              autoFocus
              value={passcode}
              onChange={(e) => {
                setPasscode(e.target.value);
                if (error) setError(false);
              }}
              placeholder="اكتب رمز الحماية هنا..."
              className="mt-1.5 w-full rounded-xl border border-stone-300 bg-stone-50 p-2.5 text-sm text-stone-900 text-center tracking-widest placeholder-stone-400 transition focus:border-rose-600 focus:bg-white focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
            />
          </div>

          {error && (
            <p className="text-xs font-bold text-rose-600 dark:text-rose-400">
              ⚠️ الرمز المدخل غير صحيح! يرجى التحقق من رمز شجاع.
            </p>
          )}

          <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              className="inline-flex items-center gap-1 text-amber-800 hover:underline dark:text-amber-400"
            >
              <Key className="h-3 w-3" />
              <span>{showHint ? 'إخفاء التلميح' : 'تلميح الرمز للمعاينة'}</span>
            </button>
            {showHint && <span className="font-mono font-bold text-stone-700 dark:text-stone-300">رمز المرور: شجاع أو 1234</span>}
          </div>

          <div className="mt-5 flex items-center justify-end gap-2.5 pt-3 border-t border-stone-100 dark:border-stone-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-stone-300 px-4 py-2 text-xs font-bold text-stone-700 transition hover:bg-stone-100 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="rounded-xl bg-rose-600 px-5 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-600 cursor-pointer"
            >
              حذف نهائي
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
