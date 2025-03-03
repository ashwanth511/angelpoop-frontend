import { Button } from "@/components/ui/button"
import { FloatingElements } from "@/components/Blocks/Floating-elements"
import './Features.css'

export default function Features() {
  return (
    <div className="bg-white relative overflow-hidden">
      <main className="relative container mx-auto px-4 py-16">
        <FloatingElements />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <div className="flex justify-center mb-6">
            <Button 
              variant="outline" 
              className="rounded-full px-6 border-[#7C3AED] text-[#7C3AED] hover:bg-[#7C3AED]/10"
            >
              Key Features
            </Button>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">
            <span className="text-[#14002A]">Intelligent </span>
            <span className="text-[#7C3AED]">Launch Platform</span>
            <span className="text-[#14002A]"> for TON Projects</span>
          </h2>
          
          <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
            Our AI-powered platform streamlines the launch process on TON Chain, providing 
            automated smart contract deployment, market analysis, and optimization tools 
            for maximum project success.
          </p>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="p-6 rounded-2xl bg-gradient-to-b from-white to-gray-50 shadow-lg border border-gray-100">
              <div className="text-[#22C55E] text-2xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold mb-2">AI Analytics</h3>
              <p className="text-gray-600">Real-time market insights and predictive analysis for your TON projects</p>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-b from-white to-gray-50 shadow-lg border border-gray-100">
              <div className="text-[#7C3AED] text-2xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Smart Launch</h3>
              <p className="text-gray-600">Automated smart contract deployment and verification</p>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-b from-white to-gray-50 shadow-lg border border-gray-100">
              <div className="text-[#06B6D4] text-2xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Market Tools</h3>
              <p className="text-gray-600">Comprehensive suite of marketing and growth tools</p>
            </div>
          </div>
        </div>
      </main>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full">
        <div className="relative h-16">
          {[...Array(8)].map((_, i) => (
            <div
              key={`grass-${i}`}
              className="leaf"
              style={{
                left: `${i * 12.5}%`,
                animationDelay: `${i * 0.2}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
