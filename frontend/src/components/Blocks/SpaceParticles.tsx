import React from 'react';
import './Features.css';

export const SpaceParticles = () => {
  return (
    <div className="space-particles">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className={`particle particle-${i % 4}`}
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${5 + Math.random() * 10}s`
          }}
        />
      ))}
      {/* Comets */}
      {[...Array(3)].map((_, i) => (
        <div
          key={`comet-${i}`}
          className={`comet comet-${i}`}
          style={{
            animationDelay: `${i * 3}s`,
            top: `${Math.random() * 50}%`
          }}
        />
      ))}
      {/* Decorative elements */}
      <div className="leaves-container">
        {[...Array(5)].map((_, i) => (
          <div
            key={`leaf-${i}`}
            className="leaf"
            style={{
              left: `${i * 20}%`,
              animationDelay: `${i * 0.5}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};
