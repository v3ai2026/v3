import React, { useState } from 'react';

interface PhotoCaptureProps {
  imageData: string;
  onShare?: (platform: 'wechat' | 'weibo' | 'tiktok' | 'download') => void;
  onClose?: () => void;
  className?: string;
}

export const PhotoCapture: React.FC<PhotoCaptureProps> = ({
  imageData,
  onShare,
  onClose,
  className = ''
}) => {
  const [filter, setFilter] = useState<'none' | 'vintage' | 'vivid' | 'noir'>('none');

  const handleShare = (platform: 'wechat' | 'weibo' | 'tiktok' | 'download') => {
    if (platform === 'download') {
      const link = document.createElement('a');
      link.href = imageData;
      link.download = `ar-tryon-${Date.now()}.png`;
      link.click();
    }
    onShare?.(platform);
  };

  const getFilterStyle = (filterType: typeof filter): React.CSSProperties => {
    switch (filterType) {
      case 'vintage':
        return { filter: 'sepia(50%) contrast(110%) brightness(90%)' };
      case 'vivid':
        return { filter: 'saturate(150%) contrast(120%)' };
      case 'noir':
        return { filter: 'grayscale(100%) contrast(130%)' };
      default:
        return {};
    }
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Image Preview */}
      <div className="flex-1 relative bg-black rounded-2xl overflow-hidden">
        <img
          src={imageData}
          alt="Captured photo"
          className="w-full h-full object-contain"
          style={getFilterStyle(filter)}
        />

        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:bg-red-500/50 transition-all"
          >
            ✕
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="mt-4 space-y-2">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
          Filters
        </span>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {(['none', 'vintage', 'vivid', 'noir'] as const).map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all ${
                filter === filterType
                  ? 'bg-[#00DC82]/10 border-[#00DC82] text-[#00DC82]'
                  : 'bg-black/40 border-white/5 text-slate-400 hover:border-white/20'
              }`}
            >
              {filterType}
            </button>
          ))}
        </div>
      </div>

      {/* Share Options */}
      <div className="mt-4 space-y-2">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
          Share
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleShare('wechat')}
            className="p-4 rounded-xl bg-gradient-to-br from-green-500/20 to-transparent border border-green-500/30 text-white font-bold text-sm hover:from-green-500/30 transition-all flex items-center justify-center gap-2"
          >
            <span className="text-xl">💬</span>
            WeChat
          </button>
          <button
            onClick={() => handleShare('weibo')}
            className="p-4 rounded-xl bg-gradient-to-br from-red-500/20 to-transparent border border-red-500/30 text-white font-bold text-sm hover:from-red-500/30 transition-all flex items-center justify-center gap-2"
          >
            <span className="text-xl">📱</span>
            Weibo
          </button>
          <button
            onClick={() => handleShare('tiktok')}
            className="p-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-transparent border border-purple-500/30 text-white font-bold text-sm hover:from-purple-500/30 transition-all flex items-center justify-center gap-2"
          >
            <span className="text-xl">🎵</span>
            TikTok
          </button>
          <button
            onClick={() => handleShare('download')}
            className="p-4 rounded-xl bg-gradient-to-br from-[#00DC82]/20 to-transparent border border-[#00DC82]/30 text-white font-bold text-sm hover:from-[#00DC82]/30 transition-all flex items-center justify-center gap-2"
          >
            <span className="text-xl">⬇️</span>
            Download
          </button>
        </div>
      </div>
    </div>
  );
};
