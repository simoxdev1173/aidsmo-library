import TopNavBar from "@/components/TopNavBar"
import Hero from "./ebook/components/Hero"
import Benefits from "./ebook/components/TrendingSection"
import Courses from "./ebook/components/Courses"
import TestimonialSlider from "./ebook/components/TestimonialSlider"
import SubscribeToMail from "./ebook/components/SubscribeToMail"
import BrowseBySubject from "./ebook/components/BrowseCategory"
import LatestPublications from "./ebook/components/LatestPublications"

export default function Home() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <TopNavBar position="fixed" />
      
      <main className="pt-20">
        <section id="home">
          <Hero />
        </section>
        
        <section id="projects">
          <Benefits />
        </section>
        
        <section id="about">
          <BrowseBySubject />
        </section>
        
        <section id="contact">
          <Courses />
        </section>
         <section id="latest-pub">
          <LatestPublications />
        </section>
        
        <section id="newsletter">
          <SubscribeToMail />
        </section>
      </main>
    </div>
  )
}