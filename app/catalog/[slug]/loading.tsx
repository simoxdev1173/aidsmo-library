export default function CatalogLoading() {
  return (
    <main dir="rtl" className="min-h-screen bg-[#F8FAFC] pt-32 text-[#0A2540]">
      <section role="status" aria-label="جارٍ تحميل الفهرس" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div aria-hidden="true" className="mb-10 border-b border-[#D9E3EE] pb-8">
          <div className="h-4 w-32 rounded bg-[#E5EDF4]" />
          <div className="mt-4 h-10 w-64 max-w-full animate-pulse rounded bg-[#DCE7F0] motion-reduce:animate-none" />
        </div>
        <div aria-hidden="true" className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="flex min-h-48 gap-4 rounded-lg border border-[#D9E3EE] bg-white p-4">
              <div className="h-40 w-[120px] shrink-0 animate-pulse rounded-md bg-[#EAF2F8] motion-reduce:animate-none" />
              <div className="flex flex-1 flex-col gap-4 py-2">
                <div className="h-4 w-2/3 rounded bg-[#EAF2F8]" />
                <div className="h-6 w-full rounded bg-[#EAF2F8]" />
                <div className="h-4 w-4/5 rounded bg-[#EAF2F8]" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
