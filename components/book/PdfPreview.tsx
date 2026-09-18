'use client';

import { useEffect, useRef, useState } from 'react';
import type { PDFDocumentProxy, RenderTask } from 'pdfjs-dist';
import { HiOutlineDocumentText } from 'react-icons/hi2';

const PDF_WORKER_SRC = '/pdf.worker.min.mjs';
const PDF_ASSET_ROOT = '/pdfjs';

function PdfCanvasPage({
  pdf,
  pageNumber,
  scrollRoot,
}: {
  pdf: PDFDocumentProxy;
  pageNumber: number;
  scrollRoot: HTMLDivElement | null;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [shouldRender, setShouldRender] = useState(false);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldRender(true);
        observer.disconnect();
      },
      { root: scrollRoot, rootMargin: '700px 0px' },
    );

    observer.observe(host);
    return () => observer.disconnect();
  }, [scrollRoot]);

  useEffect(() => {
    if (!shouldRender) return;

    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    let cancelled = false;
    let renderTask: RenderTask | null = null;

    void (async () => {
      try {
        const page = await pdf.getPage(pageNumber);
        if (cancelled) return;

        const baseViewport = page.getViewport({ scale: 1 });
        const cssWidth = Math.max(1, host.clientWidth);
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.75);
        const viewport = page.getViewport({ scale: (cssWidth / baseViewport.width) * pixelRatio });

        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        canvas.style.width = `${cssWidth}px`;
        canvas.style.height = `${Math.ceil(viewport.height / pixelRatio)}px`;

        renderTask = page.render({ canvas, viewport });
        await renderTask.promise;
        if (!cancelled) setStatus('ready');
      } catch (error) {
        if (!cancelled && !(error instanceof Error && error.name === 'RenderingCancelledException')) {
          console.error(`PDF preview page ${pageNumber} failed`, error);
          setStatus('error');
        }
      }
    })();

    return () => {
      cancelled = true;
      renderTask?.cancel();
    };
  }, [pageNumber, pdf, shouldRender]);

  return (
    <div
      ref={hostRef}
      className="relative mx-auto w-[min(100%,52rem)] overflow-hidden rounded-sm bg-white shadow-[0_10px_34px_rgba(10,37,64,0.16)] ring-1 ring-[#0A2540]/10"
    >
      {status !== 'ready' && (
        <div className="flex aspect-[1/1.414] items-center justify-center bg-[linear-gradient(145deg,#ffffff,#f3f7fa)] text-center">
          <div className="flex flex-col items-center gap-3 text-[#64748B]">
            <HiOutlineDocumentText className="h-8 w-8 text-[#C29C41]" />
            <span className="text-xs font-bold">
              {status === 'error' ? 'تعذّر عرض هذه الصفحة' : `جاري تحميل الصفحة ${pageNumber}`}
            </span>
          </div>
        </div>
      )}
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={`الصفحة ${pageNumber}`}
        className={status === 'ready' ? 'block max-w-full' : 'hidden'}
      />
      <span className="absolute bottom-3 end-3 rounded-full border border-[#C29C41]/25 bg-[#0A2540]/85 px-2.5 py-1 text-[0.65rem] font-bold text-white shadow-sm backdrop-blur-sm">
        {pageNumber}
      </span>
    </div>
  );
}

export default function PdfPreview({ src, title }: { src: string; title: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollRoot, setScrollRoot] = useState<HTMLDivElement | null>(null);
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    setScrollRoot(scrollRef.current);
  }, []);

  useEffect(() => {
    let disposed = false;
    let loadingTask: ReturnType<(typeof import('pdfjs-dist/legacy/build/pdf.mjs'))['getDocument']> | null = null;

    setPdf(null);
    setError(false);

    void (async () => {
      try {
        const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
        pdfjs.GlobalWorkerOptions.workerSrc = PDF_WORKER_SRC;
        loadingTask = pdfjs.getDocument({
          url: src,
          cMapUrl: `${PDF_ASSET_ROOT}/cmaps/`,
          cMapPacked: true,
          standardFontDataUrl: `${PDF_ASSET_ROOT}/standard_fonts/`,
          wasmUrl: `${PDF_ASSET_ROOT}/wasm/`,
        });
        const loadedPdf = await loadingTask.promise;
        if (disposed) return;
        setPdf(loadedPdf);
      } catch (loadError) {
        if (!disposed) {
          console.error('PDF preview failed to load', loadError);
          setError(true);
        }
      }
    })();

    return () => {
      disposed = true;
      if (loadingTask) void loadingTask.destroy();
    };
  }, [src]);

  return (
    <div
      ref={scrollRef}
      className="pdf-document-scroll relative h-[420px] overflow-y-auto overscroll-contain rounded-xl border border-[#C29C41]/30 bg-[#DCE6EE] p-3 shadow-[inset_0_1px_8px_rgba(10,37,64,0.12)] sm:h-[600px] sm:p-5"
      aria-label={`معاينة: ${title}`}
    >
      {error ? (
        <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center text-[#64748B]">
          <HiOutlineDocumentText className="h-10 w-10 text-[#C29C41]" />
          <p className="font-academic text-base font-bold text-[#0A2540]">تعذّر تحميل المعاينة داخل الصفحة</p>
          <a href={src} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-[#0369A1] hover:text-[#8A6A1D]">
            فتح الوثيقة كاملة
          </a>
        </div>
      ) : pdf ? (
        <div className="space-y-5">
          {Array.from({ length: pdf.numPages }, (_, index) => (
            <PdfCanvasPage
              key={index + 1}
              pdf={pdf}
              pageNumber={index + 1}
              scrollRoot={scrollRoot}
            />
          ))}
        </div>
      ) : (
        <div className="flex h-full items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-[#64748B]">
            <span className="h-9 w-9 animate-spin rounded-full border-2 border-[#C29C41]/25 border-t-[#C29C41]" aria-hidden />
            <span className="text-sm font-bold">جاري تجهيز الوثيقة...</span>
          </div>
        </div>
      )}
    </div>
  );
}
