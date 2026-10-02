import Hero from "./ebook/components/Hero"
import Benefits from "./ebook/components/TrendingSection"
import Courses from "./ebook/components/Courses"
import LatestPublications from "./ebook/components/LatestPublications"
import LibraryStats from "./ebook/components/LibraryStats"
import ChatbotCTA from "./ebook/components/ChatbotCta"
import VideoCarousel from "@/components/VideoCarousel"
import { getLibraryStats } from "@/lib/library-data"
import { prisma } from "@/lib/prisma"

export default async function Home() {
  const [libraryStats, conformityGuide] = await Promise.all([
    getLibraryStats(),
    prisma.libraryEntry.findFirst({
      where: {
        slug: 'الدليل-الا-رشادي-العربي-لنماذج-تقييم-المطابقة',
      },
      select: { id: true },
    }),
  ])

  return (
    <div className="min-h-dvh w-full min-w-0 overflow-x-clip bg-[#F8FAFC] text-[#0A2540]">
      <main className="min-w-0">
        <section id="home">
          <Hero />
        </section>
        
        <section>
          <LibraryStats stats={libraryStats} />
        </section>
        <Benefits />
        
        <section id="contact">
          <Courses />
        </section>
         <section id="latest-pub">
          <LatestPublications showConformityGuide={Boolean(conformityGuide)} />
        </section>
         <section id="videos">
          <VideoCarousel />
        </section>
         <section id="chatbot">
          <ChatbotCTA />
        </section>
      </main>
    </div>
  )
}
