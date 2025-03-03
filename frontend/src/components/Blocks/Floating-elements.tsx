'use client'

import { useEffect, useRef } from 'react'

export function FloatingElements() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const elements = containerRef.current?.children
    if (!elements) return

    Array.from(elements).forEach((element, i) => {
      const delay = i * 0.2
      const duration = 3 + Math.random() * 2
      ;(element as HTMLElement).style.animation = `float ${duration}s ease-in-out ${delay}s infinite`
    })
  }, [])

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none">
      {/* Notepad icon */}
      <div className="absolute top-[15%] right-[25%]">
        <div className="w-10 h-12 bg-yellow-300 rounded-sm transform rotate-12">
          <div className="w-full h-2 border-b border-yellow-400 flex space-x-1 p-1">
            <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
            <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Geometric shapes */}
      <div className="absolute top-[30%] right-[10%]">
        <div className="w-12 h-12 bg-cyan-400 rounded-sm transform rotate-45"></div>
      </div>

      <div className="absolute bottom-[40%] right-[20%]">
        <div className="w-10 h-10 bg-yellow-400 transform rotate-12"></div>
      </div>

      {/* Purple dots */}
      <div className="absolute top-[40%] left-[10%]">
        <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
      </div>
    </div>
  )
}

