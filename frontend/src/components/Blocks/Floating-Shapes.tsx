'use client'

import { useEffect, useRef } from 'react'

export function FloatingShapes() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const shapes = containerRef.current?.children
    if (!shapes) return

    Array.from(shapes).forEach((shape, i) => {
      const delay = i * 0.2
      const duration = 3 + Math.random() * 2
      ;(shape as HTMLElement).style.animation = `float ${duration}s ease-in-out ${delay}s infinite`
    })
  }, [])

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none">
      {/* Yellow cube - top right */}
      <div className="absolute top-[10%] right-[15%]">
        <div className="w-12 h-12 transform rotate-12" style={{ perspective: '1000px' }}>
          <div className="relative w-full h-full transform-style-preserve-3d animate-spin-slow">
            <div className="absolute w-full h-full bg-yellow-400 transform rotate-y-0"></div>
            <div className="absolute w-full h-full bg-yellow-500 transform rotate-y-90 translate-z-6"></div>
            <div className="absolute w-full h-full bg-yellow-300 transform -rotate-x-90 translate-z-6"></div>
          </div>
        </div>
      </div>

      {/* Pink circle - left side */}
      <div className="absolute top-[30%] left-[10%]">
        <div className="w-8 h-8 rounded-full bg-pink-400"></div>
      </div>

      {/* Blue/green geometric shape - bottom left */}
      <div className="absolute bottom-[20%] left-[20%]">
        <div className="w-16 h-16 transform rotate-45">
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-green-400 rounded-lg"></div>
        </div>
      </div>

      {/* Cyan geometric shape - right side */}
      <div className="absolute top-[60%] right-[20%]">
        <div className="w-12 h-12 transform -rotate-12">
          <div className="w-full h-full bg-cyan-400 rounded-lg"></div>
        </div>
      </div>

      {/* Small purple dot - scattered */}
      <div className="absolute top-[40%] right-[30%]">
        <div className="w-3 h-3 rounded-full bg-purple-400"></div>
      </div>
    </div>
  )
}

