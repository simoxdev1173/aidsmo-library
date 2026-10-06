export default function SearchLoading() {
  return (
    <main dir="rtl" className="min-h-screen bg-[#F8FAFC] pb-20 text-[#0A2540]">
      <section className="border-b border-white/10 bg-gradient-to-br from-[#022A4E] to-[#034582] px-4 pb-10 pt-36 sm:px-6 sm:pb-14 sm:pt-40">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold tracking-[0.18em] text-[#E8C96A]">فهرس المكتبة</p>
          <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">ابحث في المعرفة العربية</h1>
          <div aria-hidden="true" className="mt-7 h-14 max-w-3xl rounded-2xl bg-white/90" />
        </div>
      </section>
      <section role="status" aria-label="جارٍ تحميل نتائج البحث" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        <div aria-hidden="true" className="mb-7 h-6 w-56 animate-pulse rounded bg-[#DCE7F0] motion-reduce:animate-none" />
        <div aria-hidden="true" className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="flex min-h-48 gap-4 rounded-2xl border border-[#D9E3EE] bg-white p-4">
              <div className="h-36 w-24 shrink-0 animate-pulse rounded-xl bg-[#EAF2F8] motion-reduce:animate-none" />
              <div className="flex flex-1 flex-col gap-3 py-2">
                <div className="h-4 w-2/3 rounded bg-[#EAF2F8]" />
                <div className="h-5 w-full rounded bg-[#EAF2F8]" />
                <div className="h-4 w-4/5 rounded bg-[#EAF2F8]" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
