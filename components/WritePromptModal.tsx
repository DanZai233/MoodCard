import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';

interface WritePromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (userHint: string) => void;
  isGenerating: boolean;
}

const PLACEHOLDER = '例如：治愈系、关于春天、下雨天的心情、励志、思念、孤独与自由、午后咖啡… 留空则随机风格';

export const WritePromptModal: React.FC<WritePromptModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
  isGenerating
}) => {
  const [hint, setHint] = useState('');

  const handleSubmit = () => {
    onGenerate(hint.trim());
    setHint('');
  };

  const handleClose = () => {
    if (!isGenerating) {
      setHint('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} aria-hidden />
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <Sparkles size={18} className="text-indigo-500" />
            帮我写一句
          </h3>
          <button
            type="button"
            onClick={handleClose}
            disabled={isGenerating}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition"
            aria-label="关闭"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-5 py-4 space-y-4">
          <p className="text-sm text-slate-500">
            简单描述你想要的文案方向，AI 会生成一句有诗意、文艺的短句。
          </p>
          <textarea
            value={hint}
            onChange={(e) => setHint(e.target.value)}
            placeholder={PLACEHOLDER}
            rows={3}
            className="w-full rounded-xl border border-slate-200 p-3 text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition"
            disabled={isGenerating}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
        </div>
        <div className="flex gap-2 px-5 py-4 bg-slate-50 border-t border-slate-100">
          <button
            type="button"
            onClick={handleClose}
            disabled={isGenerating}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 transition"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isGenerating}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 disabled:opacity-50 transition flex items-center justify-center gap-1.5"
          >
            {isGenerating ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                生成中…
              </>
            ) : (
              <>
                <Sparkles size={14} />
                生成
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
