'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LuChevronLeft, LuChevronRight, LuPlay } from 'react-icons/lu';

type Video = {
  id: string;
  youtubeId: string;
  title: string;
};

const initialVideos: Video[] = [
  { id: '1', youtubeId: 'Ccjv48W8mLQ', title: '' },
   { id: '2', youtubeId: '4t3-cEkVyqg', title: '' },
  { id: '3', youtubeId: 'RaO0_lbLqLg', title: '' },
  
  { id: '4', youtubeId: '8UMN3Q1waZY', title: '' },
  { id: '5', youtubeId: 'Sd_NYSIrcBg', title: '' },
  { id: '6', youtubeId: '-VhO3fZg-i8', title: '' },
  
];

const CARD_WIDTH = 420;
const GAP = 24;

const VideoCarousel = () => {
  const [videos, setVideos] = useState<Video[]>(initialVideos);
  const [activeIndex, setActiveIndex] = useState(0);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  /* ── fetch titles from YouTube oEmbed ── */
  useEffect(() => {
    const fetchTitles = async () => {
      const updated = await Promise.all(
        initialVideos.map(async (video) => {
          try {
            const res = await fetch(
              `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${video.youtubeId}&format=json`
            );
            if (res.ok) {
              const data = await res.json();
              return { ...video, title: data.title ?? '' };
            }
          } catch {
            // fallback: keep empty title
          }
          return video;
        })
      );
      setVideos(updated);
    };
    fetchTitles();
  }, []);

  /* ── measure container ── */
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const visibleCards = Math.max(1, Math.floor(containerWidth / (CARD_WIDTH + GAP)));
  const maxIndex = Math.max(0, videos.length - visibleCards);

  /* ── looping nav ── */
  const prev = () => {
    setActiveIndex((i) => (i <= 0 ? maxIndex : i - 1));
  };

  const next = () => {
    setActiveIndex((i) => (i >= maxIndex ? 0 : i + 1));
  };

  const translateX = activeIndex * (CARD_WIDTH + GAP);

  return (
    <section dir="rtl" className="relative bg-white py-20 md:py-28 overflow-hidden">
      {/* Section header */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 mb-14">
        <div className="flex flex-col text-center sm:flex-row items-start sm:items-end justify-between gap-6">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#0a2540] leading-snug"
            >
              الفيديوهات
            </motion.h2>
          </div>

          {/* Nav arrows — visible on white */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center gap-3"
          >
            <button
              onClick={prev}
              className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#0a2540]/15 bg-[#fafaf8] text-[#0a2540] shadow-sm transition-all duration-300 hover:border-[#C29C41] hover:bg-[#C29C41] hover:text-white hover:shadow-md hover:shadow-[#C29C41]/20"
            >
              <LuChevronRight size={18} />
            </button>
            <button
              onClick={next}
              className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#0a2540]/15 bg-[#fafaf8] text-[#0a2540] shadow-sm transition-all duration-300 hover:border-[#C29C41] hover:bg-[#C29C41] hover:text-white hover:shadow-md hover:shadow-[#C29C41]/20"
            >
              <LuChevronLeft size={18} />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Carousel track */}
      <div ref={containerRef} className="mx-auto max-w-7xl px-6 lg:px-8 overflow-hidden">
        <motion.div
          className="flex"
          style={{ gap: GAP }}
          animate={{ x: translateX }}
          transition={{ type: 'spring', stiffness: 260, damping: 30 }}
        >
          {videos.map((video, idx) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="flex-shrink-0"
              style={{ width: CARD_WIDTH }}
            >
              <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-400 hover:shadow-xl hover:border-[#C29C41]/20 hover:-translate-y-1">
                {/* Gold top strip */}
                <div
                  className="h-[3px] opacity-0 transition-opacity duration-400 group-hover:opacity-100"
                  style={{ background: 'linear-gradient(to left, #C29C41, #e8c96a, #C29C41)' }}
                />

                {/* Video / Thumbnail area */}
                <div className="relative aspect-video bg-[#0a2540] overflow-hidden">
                  <AnimatePresence mode="wait">
                    {playingId === video.id ? (
                      <motion.iframe
                        key="iframe"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
                        title={video.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                      />
                    ) : (
                      <motion.div
                        key="thumb"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 cursor-pointer"
                        onClick={() => setPlayingId(video.id)}
                      >
                        {/* YouTube thumbnail */}
                        <img
                          src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                          alt={video.title}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;
                          }}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        {/* Dark overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a2540]/70 via-[#0a2540]/15 to-transparent" />

                        {/* Play button */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#C29C41] text-white shadow-lg shadow-[#C29C41]/30 transition-all duration-400 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-[#C29C41]/40">
                            <LuPlay size={22} className="mr-[-2px]" fill="white" />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Title */}
                <div className="px-5 py-4">
                  {video.title ? (
                    <h3 className="text-sm font-bold text-[#0a2540] leading-relaxed line-clamp-2 transition-colors duration-300 group-hover:text-[#0C5B99]">
                      {video.title}
                    </h3>
                  ) : (
                    <div className="h-4 w-3/4 rounded bg-slate-100 animate-pulse" />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2 mt-10">
        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className="relative h-2 rounded-full transition-all duration-400"
            style={{
              width: activeIndex === i ? 28 : 8,
              backgroundColor: activeIndex === i ? '#C29C41' : 'rgba(194,156,65,0.2)',
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default VideoCarousel;