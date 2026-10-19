'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { usePathname, useSearchParams } from 'next/navigation';
import PageLoading from '@/components/PageLoading';

function routeKey(url: URL) {
  return `${url.pathname}${url.search}`;
}

function copyLiveState(source: Element, copy: Element) {
  const sourceElements = [source, ...source.querySelectorAll('*')];
  const copiedElements = [copy, ...copy.querySelectorAll('*')];
  sourceElements.forEach((original, index) => {
    const duplicate = copiedElements[index];
    if (!duplicate) return;
    if (original.scrollTop) duplicate.scrollTop = original.scrollTop;
    if (original.scrollLeft) duplicate.scrollLeft = original.scrollLeft;
    if (original instanceof HTMLInputElement && duplicate instanceof HTMLInputElement) {
      if (original.type !== 'file') duplicate.value = original.value;
      duplicate.checked = original.checked;
    } else if (original instanceof HTMLTextAreaElement && duplicate instanceof HTMLTextAreaElement) {
      duplicate.value = original.value;
    } else if (original instanceof HTMLSelectElement && duplicate instanceof HTMLSelectElement) {
      duplicate.value = original.value;
    } else if (original instanceof HTMLVideoElement && duplicate instanceof HTMLVideoElement) {
      const still = document.createElement('img');
      still.className = duplicate.className;
      still.style.cssText = duplicate.style.cssText;
      still.alt = '';
      still.setAttribute('aria-hidden', 'true');
      still.dataset.frozenVideoFrame = '';
      still.src = original.poster;
      if (original.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && original.videoWidth && original.videoHeight) {
        try {
          const frame = document.createElement('canvas');
          frame.width = Math.min(original.videoWidth, 1280);
          frame.height = Math.round(frame.width * original.videoHeight / original.videoWidth);
          frame.getContext('2d')?.drawImage(original, 0, 0, frame.width, frame.height);
          still.src = frame.toDataURL('image/jpeg', 0.85);
        } catch {
          // Use the video's poster if its current frame cannot be read.
        }
      }
      duplicate.replaceWith(still);
    } else if (original instanceof HTMLCanvasElement && duplicate instanceof HTMLCanvasElement) {
      try {
        duplicate.getContext('2d')?.drawImage(original, 0, 0);
      } catch {
        // A canvas with restricted content cannot be copied.
      }
    }
  });
}

function captureViewport() {
  const viewport = document.createElement('div');
  viewport.className = 'navigation-snapshot';

  const page = document.createElement('div');
  page.className = document.body.className;
  page.dir = document.body.dir;
  page.style.position = 'absolute';
  page.style.top = `${-window.scrollY}px`;
  page.style.left = `${-window.scrollX}px`;
  page.style.width = `${document.documentElement.clientWidth}px`;
  page.style.minHeight = `${document.body.scrollHeight}px`;

  for (const child of Array.from(document.body.children)) {
    if (child.matches('script, style, link, [data-navigation-loading-overlay]')) continue;
    const copy = child.cloneNode(true) as Element;
    copyLiveState(child, copy);
    copy.querySelectorAll('script').forEach((script) => script.remove());
    page.appendChild(copy);
  }
  viewport.appendChild(page);

  // Sticky navigation needs its original viewport position after the page copy
  // is offset by the scroll position. Its hidden copy keeps the layout intact.
  const header = document.body.querySelector<HTMLElement>('header[data-compact]');
  const copiedHeader = page.querySelector<HTMLElement>('header[data-compact]');
  if (header && copiedHeader) {
    const bounds = header.getBoundingClientRect();
    copiedHeader.style.visibility = 'hidden';
    const floatingHeader = header.cloneNode(true) as HTMLElement;
    floatingHeader.style.position = 'absolute';
    floatingHeader.style.top = `${bounds.top}px`;
    floatingHeader.style.left = `${bounds.left}px`;
    floatingHeader.style.width = `${bounds.width}px`;
    floatingHeader.style.height = `${bounds.height}px`;
    floatingHeader.style.margin = '0';
    viewport.appendChild(floatingHeader);
  }

  return viewport;
}

export default function NavigationLoadingOverlay({ enabled }: { enabled: boolean }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentRoute = `${pathname}?${searchParams.toString()}`;
  const [snapshot, setSnapshot] = useState<HTMLElement | null>(null);
  const pendingRef = useRef<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const observerRef = useRef<MutationObserver | null>(null);

  const clear = useCallback(() => {
    pendingRef.current = null;
    observerRef.current?.disconnect();
    observerRef.current = null;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
    setSnapshot(null);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const onClick = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.defaultPrevented) return;
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest<HTMLAnchorElement>('a[href]');
      if (!link || link.hasAttribute('download') || link.getAttribute('aria-disabled') === 'true') return;
      if (link.target && link.target !== '_self') return;
      const destination = new URL(link.href, window.location.href);
      if (destination.origin !== window.location.origin || !['http:', 'https:'].includes(destination.protocol)) return;
      if (destination.pathname.startsWith('/api/')) return;
      const from = routeKey(new URL(window.location.href));
      if (from === routeKey(destination)) return;

      const captured = captureViewport();
      pendingRef.current = from;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(clear, 30000);
      flushSync(() => setSnapshot(captured));
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [enabled, clear]);

  useEffect(() => {
    if (!pendingRef.current || routeKey(new URL(window.location.href)) === pendingRef.current) return;

    let firstFrame = 0;
    let secondFrame = 0;
    const finishWhenReady = () => {
      if (document.querySelector('[data-route-loading]')) return;
      observerRef.current?.disconnect();
      observerRef.current = null;
      firstFrame = requestAnimationFrame(() => {
        secondFrame = requestAnimationFrame(() => {
          if (!document.querySelector('[data-route-loading]')) clear();
        });
      });
    };

    observerRef.current?.disconnect();
    observerRef.current = new MutationObserver(finishWhenReady);
    observerRef.current.observe(document.body, { childList: true, subtree: true });
    finishWhenReady();
    return () => {
      observerRef.current?.disconnect();
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
    };
  }, [currentRoute, clear]);

  useEffect(() => () => {
    observerRef.current?.disconnect();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  if (!snapshot) return null;
  return (
    <div data-navigation-loading-overlay className="fixed inset-0 z-[300] overflow-hidden" aria-busy="true">
      <div ref={(element) => { if (element && !element.contains(snapshot)) element.appendChild(snapshot); }} className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true" />
      <PageLoading fadedBackground />
    </div>
  );
}
