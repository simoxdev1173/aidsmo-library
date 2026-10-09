export default function CatalogLoading() {
  return (
    <main dir="rtl" className="min-h-screen bg-[#F8FAFC] pt-32 text-[#082F50]">
      <section role="status" aria-label="جارٍ تحميل الفهرس" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div aria-hidden="true" className="mb-10 border-b border-[#D9E3EE] pb-8">
          <div className="h-4 w-32 rounded bg-[#E5EDF4]" />
          <div className="mt-4 h-10 w-64 max-w-full animate-pulse rounded bg-[#DCE7F0] motion-reduce:animate-none" />
        </div>
        <div aria-hidden="true" className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="flex min-w-0 flex-col gap-2 rounded-lg border border-[#D9E3EE] bg-white p-2 sm:min-h-48 sm:flex-row sm:gap-4 sm:p-4">
              <div className="aspect-[3/4] w-full shrink-0 animate-pulse rounded-md bg-[#E9F2F8] motion-reduce:animate-none sm:h-40 sm:w-[120px]" />
              <div className="flex min-w-0 flex-1 flex-col gap-3 py-2 sm:gap-4">
                <div className="h-4 w-2/3 rounded bg-[#E9F2F8]" />
                <div className="h-6 w-full rounded bg-[#E9F2F8]" />
                <div className="h-4 w-4/5 rounded bg-[#E9F2F8]" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
