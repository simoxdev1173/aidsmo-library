import TopNavBar from "@/components/TopNavBar"
import Hero from "./ebook/components/Hero"
import About from "./ebook/components/About"
import Benefits from "./ebook/components/Benefits"
import Courses from "./ebook/components/Courses"
import TestimonialSlider from "./ebook/components/TestimonialSlider"
import SubscribeToMail from "./ebook/components/SubscribeToMail"

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
          <About />
        </section>
        
        <section id="contact">
          <Courses />
        </section>
        
        <section id="newsletter">
          <SubscribeToMail />
        </section>
      </main>
    </div>
  )
}