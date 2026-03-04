import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import Stats from './components/Stats'
import HowItWorks from './components/HowItWorks'
import CTABanner from './components/CTABanner'
import Footer from './components/Footer'

const trustLogos = ['Acme Corp', 'Vercel', 'Linear', 'Stripe', 'Notion', 'Loom']

export default function App() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />

        {/* Trust bar */}
        <div className="trust-bar">
          <div className="container">
            <p>Trusted by teams at</p>
            <div className="trust-logos">
              {trustLogos.map((name) => (
                <span key={name} className="trust-logo">{name}</span>
              ))}
            </div>
          </div>
        </div>

        <Features />
        <Stats />
        <HowItWorks />
        <CTABanner />
      </main>

      <Footer />
    </>
  )
}
