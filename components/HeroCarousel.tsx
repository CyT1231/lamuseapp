'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

type Slide = { src: string; alt?: string };

export default function HeroCarousel({
  images,
  intervalMs = 5000,
  className,
}: {
  images: Slide[];
  intervalMs?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // 自动轮播
  useEffect(() => {
    if (paused || images.length <= 1) return;
    const id = setInterval(() => gotoSlide((index + 1) % images.length), intervalMs);
    return () => clearInterval(id);
  }, [index, paused, images.length, intervalMs]);

  // 根据滚动位置同步当前 index（支持手势左右滑）
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const i = Math.round(el.scrollLeft / el.clientWidth);
        if (i !== index) setIndex(i);
        ticking = false;
      });
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [index]);

  const gotoSlide = (i: number) => {
    const el = ref.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
    setIndex(i);
  };

  const prev = () => gotoSlide((index - 1 + images.length) % images.length);
  const next = () => gotoSlide((index + 1) % images.length);

  return (
    <div
      className={clsx('relative', className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setTimeout(() => setPaused(false), 1200)}
    >
      {/* 滚动容器：原生 swipe + scroll-snap */}
      <div
        ref={ref}
        className="overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className="flex">
          {images.map((img, i) => (
            <div key={i} className="relative min-w-full snap-center h-48 sm:h-64 md:h-72 rounded-2xl overflow-hidden">
              <Image src={img.src} alt={img.alt ?? `Slide ${i + 1}`} fill className="object-cover" priority={i === 0} />
            </div>
          ))}
        </div>
      </div>

      {/* 左右箭头（桌面显示） */}
      {images.length > 1 && (
        <>
          <button
            aria-label="Previous"
            onClick={prev}
            className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 items-center justify-center w-9 h-9 rounded-full bg-black/40 text-white hover:bg-black/60"
          >
            ‹
          </button>
          <button
            aria-label="Next"
            onClick={next}
            className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 items-center justify-center w-9 h-9 rounded-full bg-black/40 text-white hover:bg-black/60"
          >
            ›
          </button>
        </>
      )}

      {/* 指示点 */}
      {images.length > 1 && (
        <div className="absolute bottom-2 inset-x-0 flex items-center justify-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => gotoSlide(i)}
              className={clsx(
                'h-2 w-2 rounded-full transition-all',
                i === index ? 'w-4 bg-white' : 'bg-white/60 hover:bg-white/80'
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
