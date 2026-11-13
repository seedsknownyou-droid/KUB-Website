import React, { useState } from 'react';
import { YouTubeVideo } from '../constants/productData';
import { VideoThumbnailGraphic } from '../assets/YouTubeThumbnails';
import avatar from '../assets/images/known-you-avatar.png';

interface ProductVideoCardProps {
  video: YouTubeVideo;
}

// Card shape taken from the real app: about 345 px wide x 141 px tall on a phone (725 x 297 in the screenshot).
// The height follows the width, so the cards keep the same proportions on every screen size.
const CARD_ASPECT = '725 / 297';
const FONT = 'Roboto, "Noto Sans Devanagari", sans-serif';
const SHADOW = '0 0 6px rgba(0,0,0,0.55), 0 1px 2px rgba(0,0,0,0.6)';

/** Real YouTube thumbnail for a video id (no API key needed). */
const thumbUrls = (id: string) => [
  `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
  `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
];

const ShareIcon = () => (
  <svg width="19" height="17" viewBox="0 0 24 20" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2l8 7-8 7V12C7 12 3 14 1 19c.7-6.500 4-11 13-12z" />
  </svg>
);

const ClockIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="9.500" />
    <path d="M12 6.500V12l3.500 2" />
  </svg>
);

export const ProductVideoCard: React.FC<ProductVideoCardProps> = ({ video }) => {
  const [playing, setPlaying] = useState(false);
  const [thumbIndex, setThumbIndex] = useState(0);

  const watchUrl = video.youtubeId ? `https://www.youtube.com/watch?v=${video.youtubeId}` : video.youtubeUrl;
  const urls = video.youtubeId ? thumbUrls(video.youtubeId) : [];
  const thumbSrc = thumbIndex < urls.length ? urls[thumbIndex] : null;

  /* ---------- Playing: real YouTube player in the same box ---------- */
  if (playing && video.youtubeId) {
    return (
      <iframe
        title={video.title}
        src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0&playsinline=1`}
        className="block w-full border-0 bg-black rounded-[6px]"
        style={{ aspectRatio: CARD_ASPECT }}
        referrerPolicy="strict-origin-when-cross-origin"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    );
  }

  const play = () => {
    if (video.youtubeId) setPlaying(true);
    else window.open(watchUrl, '_blank', 'noopener,noreferrer');
  };

  const openYouTube = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(watchUrl, '_blank', 'noopener,noreferrer');
  };

  const share = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({ title: video.title, url: watchUrl }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(watchUrl);
    }
  };

  return (
    <div
      onClick={play}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && play()}
      aria-label={`Play ${video.title}`}
      className="relative w-full overflow-hidden rounded-[6px] bg-[#1b1b1b] cursor-pointer select-none"
      style={{ aspectRatio: CARD_ASPECT, fontFamily: FONT }}
    >
      {/* Thumbnail */}
      {thumbSrc ? (
        <img
          key={thumbSrc}
          src={thumbSrc}
          alt=""
          draggable={false}
          referrerPolicy="no-referrer"
          onError={() => setThumbIndex((i) => i + 1)}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <VideoThumbnailGraphic type={video.videoType} className="absolute inset-0 w-full h-full object-cover" />
      )}

      {/* Dark gradients behind the title and the bottom controls */}
      <div className="absolute inset-x-0 top-0 h-[64px] bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-[56px] bg-gradient-to-t from-black/35 to-transparent pointer-events-none" />

      {/* Channel avatar + title + channel name */}
      <div className="absolute top-[7px] left-[15px] right-[8px] flex items-start gap-[13px] pointer-events-none">
        <img
          src={avatar}
          alt=""
          draggable={false}
          className="w-[32px] h-[32px] rounded-full bg-white shrink-0 mt-[1px]"
        />
        <div className="min-w-0 pt-[2px]">
          <h3
            className="text-white text-[14px] font-bold leading-[20px] whitespace-nowrap overflow-hidden"
            style={{ textShadow: SHADOW }}
          >
            {video.title}
          </h3>
          <p
            className="text-white/80 text-[10.5px] leading-[14px] mt-[1px] whitespace-nowrap overflow-hidden"
            style={{ textShadow: SHADOW }}
          >
            {video.channel}
          </p>
        </div>
      </div>

      {/* Red play button */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[62px] h-[42px] bg-[#FF0000] rounded-[12px] flex items-center justify-center">
          <div className="w-0 h-0 border-y-[9px] border-y-transparent border-l-[16px] border-l-white ml-[4px]" />
        </div>
      </div>

      {/* Bottom controls */}
      <div className="absolute bottom-[6px] left-[18px] right-[11px] flex items-center justify-between">
        <div className="flex items-center gap-[8px]">
          <button
            type="button"
            onClick={share}
            className="w-[36px] h-[36px] rounded-full bg-black/40 flex items-center justify-center active:bg-black/60"
            aria-label="Share video"
          >
            <ShareIcon />
          </button>
          <button
            type="button"
            onClick={openYouTube}
            className="w-[36px] h-[36px] rounded-full bg-black/40 flex items-center justify-center active:bg-black/60"
            aria-label="Watch later on YouTube"
          >
            <ClockIcon />
          </button>
        </div>

        <button
          type="button"
          onClick={openYouTube}
          className="h-[34px] pl-[12px] pr-[9px] rounded-full bg-black/45 flex items-center gap-[5px] text-white text-[15px] font-normal active:bg-black/65"
          aria-label="Watch on YouTube"
        >
          <span>Watch on</span>
          <span className="flex items-center gap-[1px]">
            <span className="w-[25px] h-[17px] bg-[#FF0000] rounded-[5px] inline-flex items-center justify-center">
              <span className="w-0 h-0 border-y-[3.500px] border-y-transparent border-l-[6px] border-l-white ml-[1px]" />
            </span>
            <span className="font-bold tracking-[-0.03em] text-[16px]">YouTube</span>
          </span>
        </button>
      </div>
    </div>
  );
};