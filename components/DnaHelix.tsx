
import React from 'react';

const DnaHelix: React.FC = () => {
  return (
    <div className="absolute top-4 right-4 w-24 h-24 opacity-30 pointer-events-none">
      <svg viewBox="-10 -10 120 120" xmlns="http://www.w3.org/2000/svg">
        <style>
          {`
            .strand {
              stroke: #00ddff;
              stroke-width: 2;
              fill: none;
            }
            .base {
              stroke: #00ddff;
              stroke-width: 1;
              animation: color-cycle 10s linear infinite;
            }
            .s1 {
              animation: dna-anim 4s linear infinite;
            }
            .s2 {
              animation: dna-anim 4s linear infinite reverse;
            }
            @keyframes dna-anim {
              from { stroke-dashoffset: 0; }
              to { stroke-dashoffset: 140; }
            }
            @keyframes color-cycle {
              0% { stroke: #00ddff; }
              33% { stroke: #ff00ff; }
              66% { stroke: #00ffaa; }
              100% { stroke: #00ddff; }
            }
          `}
        </style>
        <path
          className="strand s1"
          strokeDasharray="5 10"
          d="M 20,0 C 20,25 80,25 80,50 C 80,75 20,75 20,100"
        />
        <path
          className="strand s2"
          strokeDasharray="5 10"
          d="M 80,0 C 80,25 20,25 20,50 C 20,75 80,75 80,100"
        />
        {Array.from({ length: 10 }).map((_, i) => (
          <line
            key={i}
            className="base"
            x1={50 + 30 * Math.cos((i * Math.PI) / 5)}
            y1={i * 10 + 5}
            x2={50 - 30 * Math.cos((i * Math.PI) / 5)}
            y2={i * 10 + 5}
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </svg>
    </div>
  );
};

export default DnaHelix;
