import React from 'react';
import './comets.css';

export const FallingComets = () => {
  return (
    <div className="comets-container">
      {[...Array(5)].map((_, i) => (
        <div key={i} className={`comet comet-${i + 1}`}>
          <div className="comet-head"></div>
          <div className="comet-tail"></div>
        </div>
      ))}
    </div>
  );
};
