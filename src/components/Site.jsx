import Nav from './Nav'
import Hero from './Hero'
import Stats from './Stats'
import About from './About'
import Skills from './Skills'
import Projects from './Projects'
import Experience from './Experience'
import Contact from './Contact'
import Footer from './Footer'
import ScrollProgress from './ScrollProgress'
import BackToTop from './BackToTop'

export default function Site() {
  return (
    <>
      <ScrollProgress />
      <Nav />
      <Hero />
      <Stats />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Contact />
      <Footer />
      <BackToTop />
    </>
  )
}
