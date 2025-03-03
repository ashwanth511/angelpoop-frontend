import { FloatingShapes } from "./Floating-Shapes"
import { ScrollReveal } from "./ScrollReveal"
import './Features.css'
import './animations.css'

export default function About() {
  return (
    <div className="bg-white h-full pt-16 flex items-center justify-center overflow-hidden">
      <main className="relative container mx-auto px-4 py-8">
        <FloatingShapes />
        
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-4">
          <ScrollReveal>
            <h1 className="text-[2.5rem] md:text-6xl lg:text-7xl leading-tight tracking-tight">
              <span className="text-[#14002A] font-bold">Launch your </span>
              <span className="text-[#7C3AED]">meme coin</span>
              <br />
              <span className="text-[#14002A]">with complete</span>
              <span className="text-[#7C3AED]"> control</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal>
            <h1 className="text-[2.5rem] md:text-6xl lg:text-7xl leading-tight tracking-tight">
              <span className="text-gray-400">Built on secure blockchain</span>
              <br />
              <span className="text-gray-400">technology with</span>
              <br />
              <span className="text-[#22C55E]">automated</span>
              <span className="text-gray-400"> liquidity</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal>
            <h1 className="text-[2.5rem] md:text-6xl lg:text-7xl leading-tight tracking-tight">
              <span className="text-gray-400">management and built-in</span>
              <br />
              <span className="text-gray-400">tools for </span>
              <span className="text-[#06B6D4]">community</span>
              <br />
              <span className="text-gray-400">engagement and token</span>
              <br />
              <span className="text-gray-400">growth</span>
            </h1>
          </ScrollReveal>
        </div>
      </main>
    </div>
  )
}
