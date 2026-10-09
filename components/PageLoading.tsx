import Image from 'next/image';

export default function PageLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="جاري تحميل الصفحة"
      className="fixed inset-0 z-[200] flex min-h-dvh items-center justify-center bg-white/85 text-[#082F50] backdrop-blur-sm"
    >
      <div className="flex flex-col items-center gap-5">
        <span className="relative grid size-60 place-items-center rounded-full bg-white/70 shadow-[0_16px_45px_rgba(8,47,80,0.08)]" aria-hidden="true">
          <span className="absolute inset-0 rounded-full border-[3px] border-[#0B5688]/20" />
          <span className="absolute inset-0 animate-spin rounded-full border-[3px] border-transparent border-t-[#0B5688] border-r-[#C29C41] motion-reduce:animate-none" />
          <Image src="/logo-3d-3d.png" alt="" width={192} height={192} priority className="size-48 object-contain" />
        </span>
        <p className="text-sm font-bold text-[#082F50]">جاري تحميل الصفحة...</p>
      </div>
    </div>
  );
}
