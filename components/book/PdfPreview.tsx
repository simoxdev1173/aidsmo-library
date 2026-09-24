import { HiOutlineArrowTopRightOnSquare, HiOutlineDocumentText } from 'react-icons/hi2';

// Let the browser render the original document, preserving its font handling
// and built-in zoom/search instead of redrawing pages onto application canvases.
export default function PdfPreview({ src, title }: { src: string; title: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#C29C41]/30 bg-[#f5efdf]">
      <object
        key={src}
        data={src}
        type="application/pdf"
        aria-label={`معاينة: ${title}`}
        className="block h-[65vh] min-h-[420px] w-full sm:h-[75vh] sm:min-h-[600px]"
      >
        <div className="flex min-h-[420px] flex-col items-center justify-center gap-4 px-6 text-center">
          <HiOutlineDocumentText className="h-10 w-10 text-[#9a7421]" aria-hidden="true" />
          <p className="text-base text-[#0a2540]">افتح الوثيقة لقراءتها في عارض جهازك.</p>
          <a href={src} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#0a2540] px-6 py-3 text-sm text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9a7421]">
            فتح الوثيقة
          </a>
        </div>
      </object>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#C29C41]/20 px-4 py-3 text-xs text-[#59616a]">
        <span>إذا لم تظهر المعاينة بشكل صحيح، افتح الوثيقة مباشرة.</span>
        <a href={src} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 font-medium text-[#0a2540] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9a7421]">
          فتح الوثيقة<HiOutlineArrowTopRightOnSquare className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
