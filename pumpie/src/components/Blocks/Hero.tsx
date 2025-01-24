import { Button } from "@/components/ui/button"
import { SpaceParticles } from "./SpaceParticles"
import { FloatingElements } from "@/components/Blocks/Floating-elements"
import { FallingComets } from "./FallingComets"
import './features.css'
import HeroImg from '../../assets/hero-1.webp'
import { Link } from "react-router-dom"
import { ArrowRight } from 'lucide-react'

export default function Hero() {
  return (
    <div className="bg-white">
      <FloatingElements />
      <FallingComets />
      {/* Grid Background */}
      <div className="absolute inset-0 grid-background opacity-10"></div>
      <SpaceParticles />
      
      <div className="relative">
       
        
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-6xl font-bold leading-tight">
                <span className="text-primary text-7xl">AngelPoop</span>{" "}
                <span className="courier-font">Ai tOKEN Launchpad</span>
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Launch your next viral coin with confidence. Simple, secure, and community-driven 
                platform for creating and managing meme tokens on the blockchain.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/"
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-lg font-medium inline-flex items-center"
                >
                  Launch Your Token
                  <ArrowRight className="ml-2" />
                </Link>
                <Link
                  to="/explore"
                  className="bg-secondary/10 hover:bg-secondary/20 text-secondary px-8 py-4 rounded-lg font-medium inline-flex items-center"
                >
                  Explore Tokens
                </Link>
              </div>
            </div>
            
            <div className="lg:justify-self-end relative">
              <div className="absolute bg-gradient-to-r from-[#7C3AED]/20 to-transparent rounded-3xl filter blur-xl"></div>
              <div className=" relative overflow-hidden">
                <main className="relative container mx-auto px-4 py-16">
                  
                  
                  <div className="relative z-10 max-w-4xl mx-auto text-center">
                  
                      <img 
                        src={HeroImg} 
                        alt="Pumpie Blockchain Launchpad"
                        className="w-full h-full object-contain"
                      />
                  
                 
                  </div>
                </main>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
