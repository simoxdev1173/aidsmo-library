import Hero from "./ebook/components/Hero"
import Benefits from "./ebook/components/TrendingSection"
import Courses from "./ebook/components/Courses"
import SubscribeToMail from "./ebook/components/SubscribeToMail"
import BrowseBySubject from "./ebook/components/BrowseCategory"
import LatestPublications from "./ebook/components/LatestPublications"
import LibraryStats from "./ebook/components/LibraryStats"
import ChatbotCTA from "./ebook/components/ChatbotCta"
import VideoCarousel from "@/components/VideoCarousel"

export default function Home() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#F8FAFC] text-[#0A2540]">
      <main>
        <section id="home">
          <Hero />
        </section>
        
        <section className="border-y border-[#C29C41]/20 bg-white">
          <LibraryStats />
        </section>
        <Benefits />
        
        <section id="about">
          <BrowseBySubject />
        </section>
        
        <section id="contact">
          <Courses />
        </section>
         <section id="latest-pub">
          <LatestPublications />
        </section>
         <section id="videos">
          <VideoCarousel />
        </section>
         <section id="chatbot">
          <ChatbotCTA />
        </section>
        
        <section id="newsletter">
          <SubscribeToMail />
        </section>
      </main>
    </div>
  )
}
