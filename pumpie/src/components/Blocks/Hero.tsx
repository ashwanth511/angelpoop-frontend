import { Button } from "@/components/ui/button"
import { SpaceParticles } from "./SpaceParticles"
import { FloatingElements } from "@/components/Blocks/Floating-elements"
import { FallingComets } from "./FallingComets"
import './Features.css'
import HeroImg from '../../assets/hero-1.webp'
import { Link } from "react-router-dom"
import { ArrowRight } from 'lucide-react'
import bgWalking from '../../assets/bg_walking.gif?url'
import dam from '../../assets/dam.jpg'
export default function Hero() {
  return (
    <div className="bg-white">
      <FloatingElements />
      <FallingComets />
      {/* Grid Background */}
      <div className="absolute inset-0 grid-background opacity-10"></div>
      <SpaceParticles />
      
      <div className="relative">
       
        
        <main 
          className="max-w-7xl mx-auto px-6 py-8 rounded-3xl"
          style={{
            backgroundImage: `url(${bgWalking})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
    
          }}
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-6xl font-bold leading-tight text-white">
                <span className="text-[#964B00] text-7xl">AngelPoop</span>{" "}
                <span className="courier-font text-black">Ai Agent Launchpad</span>
              </h1>
              
              <p className="text-xl text-black/80">
                Launch your next viral coin with confidence. Simple, secure, and community-driven 
                platform for creating and managing AI tokens on the blockchain.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/dashboard"
                  className="bg-[#4A90E2] hover:bg-[#6BB9F0] text-white px-8 py-4 rounded-lg font-medium inline-flex items-center"
                >
                  Launch Token
                  <ArrowRight className="ml-2" />
                </Link>
                <Link
                  to="/explore"
                  className="bg-[#4A90E2] hover:bg-white/20 text-white px-8 py-4 rounded-lg font-medium inline-flex items-center backdrop-blur-sm"
                >
                  Explore Tokens
                </Link>
              </div>
            </div>
            
          


            
          </div>
         
        </main>

        {/* GIF Section */}
      
      </div>

   
    </div>
  )
}
