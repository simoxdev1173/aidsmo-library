import { HiStar } from 'react-icons/hi2';

export default function RatingBadge({ rating }: { rating?: { average: number; count: number } | null }) {
  return (
    <span className="absolute end-2 top-2 z-10 inline-flex items-center gap-1 rounded-full border border-white/20 bg-[#062B46]/85 px-2.5 py-1 text-[0.68rem] font-bold text-white shadow-sm backdrop-blur-sm">
      <HiStar className="h-3.5 w-3.5 text-[#E8C96A]" aria-hidden="true" />
      <span>{rating?.count ? rating.average.toFixed(1) : 'بلا تقييم'}</span>
      <span className="sr-only">{rating?.count ? `من 5 بناء على ${rating.count} تقييم` : 'لم يُقيّم بعد'}</span>
    </span>
  );
}
