import { useState } from 'react';
import { Play, ExternalLink, Video } from 'lucide-react';
import { getVideoGuides } from '@/lib/video-guides';
import clsx from 'clsx';

interface Props {
  tech: string;
}

const TYPE_LABEL = { quick: 'Quick', 'deep-dive': 'Deep Dive', 'full-course': 'Full Course' } as const;
const TYPE_STYLE = {
  quick:        'text-k-accent   bg-k-accent/10   border-k-accent/30',
  'deep-dive':  'text-k-success  bg-k-success/10  border-k-success/30',
  'full-course':'text-k-warning  bg-k-warning/10  border-k-warning/30',
} as const;

export default function VideoGuides({ tech }: Props) {
  const videos = getVideoGuides(tech);
  const [activeId, setActiveId] = useState<string | null>(null);

  if (!videos.length) return null;

  return (
    <section className="mt-10">
      <h2 className="text-base font-bold text-k-text mb-3 flex items-center gap-2">
        <Video size={16} className="text-k-muted" />
        Video Guides
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map(v => (
          <div key={v.videoId} className="rounded-kernal border border-k-border overflow-hidden bg-k-surface flex flex-col">

            {/* Thumbnail / iframe */}
            {activeId === v.videoId ? (
              <div className="aspect-video bg-black">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${v.videoId}?autoplay=1&rel=0`}
                  title={v.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                  loading="lazy"
                />
              </div>
            ) : (
              <button
                onClick={() => setActiveId(v.videoId)}
                className="relative block w-full aspect-video bg-k-bg overflow-hidden group"
                aria-label={`Play ${v.title}`}
              >
                <img
                  src={`https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  onError={e => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                {/* Play overlay */}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/45 transition-colors duration-200">
                  <div className="w-14 h-14 rounded-full bg-white/95 flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg">
                    <Play size={22} className="text-zinc-900 ml-1" fill="currentColor" />
                  </div>
                </div>
                {/* Type badge on thumbnail */}
                <span className={clsx(
                  'absolute top-2 left-2 text-xs font-semibold px-2 py-0.5 rounded border backdrop-blur-sm',
                  TYPE_STYLE[v.type],
                )}>
                  {TYPE_LABEL[v.type]}
                </span>
              </button>
            )}

            {/* Card meta */}
            <div className="p-3 flex flex-col gap-1 flex-1">
              <p className="text-sm font-semibold text-k-text leading-snug line-clamp-2">{v.title}</p>
              <div className="flex items-center justify-between mt-auto pt-1">
                <div>
                  <p className="text-xs font-medium text-k-muted">{v.channel}</p>
                  <p className="text-xs text-k-muted/60">{v.duration}</p>
                </div>
                <a
                  href={`https://www.youtube.com/watch?v=${v.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-k-muted hover:text-k-accent transition-kernal p-1"
                  aria-label="Open on YouTube"
                  onClick={e => e.stopPropagation()}
                  title="Watch on YouTube"
                >
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>

          </div>
        ))}
      </div>
    </section>
  );
}
