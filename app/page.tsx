import { Suspense } from 'react'
import Hero from "./ebook/components/Hero"
import Benefits from "./ebook/components/TrendingSection"
import Courses from "./ebook/components/Courses"
import LatestPublications from "./ebook/components/LatestPublications"
import LibraryStats from "./ebook/components/LibraryStats"
import ChatbotCTA from "./ebook/components/ChatbotCta"
import VideoCarousel from "@/components/VideoCarousel"
import { getLibraryStats } from "@/lib/library-data"
import { prisma } from "@/lib/prisma"

async function LibraryStatsSection() {
  const stats = await getLibraryStats()
  return <LibraryStats stats={stats} />
}

async function LatestPublicationsSection() {
  const conformityGuide = await prisma.libraryEntry.findFirst({
      where: {
        slug: 'الدليل-الا-رشادي-العربي-لنماذج-تقييم-المطابقة',
      },
      select: { id: true },
    })
  return <LatestPublications showConformityGuide={Boolean(conformityGuide)} />
}

export default function Home() {
  return (
    <div className="min-h-dvh w-full min-w-0 overflow-x-clip bg-[#F8FAFC] text-[#0A2540]">
      <main className="min-w-0">
        <section id="home">
          <Hero />
        </section>
        
        <section>
          <Suspense fallback={<div aria-hidden="true" className="h-[28rem] animate-pulse bg-[#f1f1f1] motion-reduce:animate-none" />}>
            <LibraryStatsSection />
          </Suspense>
        </section>
        <Suspense fallback={<div aria-hidden="true" className="min-h-[32rem] bg-[#F8FAFC]" />}>
          <Benefits />
        </Suspense>
        
        <section id="contact">
          <Courses />
        </section>
         <section id="latest-pub">
          <Suspense fallback={<div aria-hidden="true" className="min-h-[28rem] bg-[#F8FAFC]" />}>
            <LatestPublicationsSection />
          </Suspense>
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
