'use client';

import { useEffect, useRef, useState } from 'react';

export default function OptimizedHeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const visibleRef = useRef(false);
  const [canPlay, setCanPlay] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
    if (reducedMotion.matches || saveData) return;

    const observer = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting;
      if (entry.isIntersecting) {
        setCanPlay(true);
        if (video.currentSrc) void video.play().catch(() => {});
      } else {
        video.pause();
      }
    }, { threshold: 0.05 });

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!canPlay || !visibleRef.current) return;
    videoRef.current?.load();
    void videoRef.current?.play().catch(() => {});
  }, [canPlay]);

  return (
    <video
      ref={videoRef}
      loop
      muted
      playsInline
      preload="none"
      poster="/hero0cover-4.webp"
      className="absolute inset-0 h-full w-full object-cover"
    >
      {canPlay && <source src="/hero-video-3.mp4" type="video/mp4" />}
    </video>
  );
}
