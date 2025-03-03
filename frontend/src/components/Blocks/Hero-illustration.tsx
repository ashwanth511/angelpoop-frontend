export function HeroIllustration() {
    return (
      <div className="relative w-full max-w-2xl">
        <svg className="w-full h-auto" viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Laptop base */}
          <rect x="50" y="100" width="500" height="300" rx="20" fill="#6D28D9" />
          <rect x="75" y="125" width="450" height="250" rx="10" fill="white" />
          
          {/* Video windows */}
          <rect x="100" y="150" width="150" height="100" rx="8" fill="#7C3AED" />
          <rect x="275" y="150" width="150" height="100" rx="8" fill="#7C3AED" />
          <rect x="100" y="275" width="150" height="100" rx="8" fill="#7C3AED" />
          
          {/* Floating elements */}
          <circle className="floating" cx="500" cy="50" r="10" fill="#F472B6" />
          <rect className="floating" x="450" y="75" width="20" height="20" rx="4" fill="#60A5FA" transform="rotate(45)" />
          <circle className="floating" cx="50" cy="350" r="8" fill="#818CF8" />
        </svg>
        
        {/* Decorative dots */}
        <div className="absolute top-10 right-10 w-2 h-2 bg-primary rounded-full floating" />
        <div className="absolute bottom-10 left-10 w-2 h-2 bg-primary rounded-full floating" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-primary rounded-full floating" style={{ animationDelay: '2s' }} />
      </div>
    )
  }
  
  