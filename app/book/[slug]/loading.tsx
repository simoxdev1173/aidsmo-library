export default function BookLoading() {
  return (
    <main dir="rtl" className="min-h-screen bg-[#F8FAFC] px-4 pb-20 pt-32 text-[#0A2540] sm:px-6">
      <div role="status" aria-label="جارٍ تحميل تفاصيل الإصدار" className="mx-auto max-w-7xl">
        <div aria-hidden="true" className="mb-10 h-5 w-64 max-w-full rounded bg-[#E5EDF4]" />
        <div aria-hidden="true" className="grid gap-8 rounded-2xl border border-[#D9E3EE] bg-white p-5 sm:p-8 lg:grid-cols-[minmax(220px,320px)_1fr]">
          <div className="aspect-[3/4] w-full animate-pulse rounded-xl bg-[#EAF2F8] motion-reduce:animate-none" />
          <div className="space-y-5 py-3">
            <div className="h-4 w-32 rounded bg-[#EAF2F8]" />
            <div className="h-10 w-4/5 max-w-full rounded bg-[#DCE7F0]" />
            <div className="h-5 w-1/2 rounded bg-[#EAF2F8]" />
            <div className="mt-8 h-24 w-full rounded bg-[#EAF2F8]" />
            <div className="h-12 w-40 rounded-full bg-[#EAF2F8]" />
          </div>
        </div>
      </div>
    </main>
  );
}
