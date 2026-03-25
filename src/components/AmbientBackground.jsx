// src/components/AmbientBackground.jsx
// Magical space-themed ambient background — only renders in dark mode

import React, { useMemo } from 'react';
import { useTheme } from './ThemeProvider';

const AmbientBackground = () => {
  const { theme } = useTheme();

  // Stars
  const stars = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 2.5 + 0.5,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2,
      opacity: Math.random() * 0.6 + 0.2,
    }));
  }, []);

  // Fireflies / embers
  const fireflies = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 8,
      duration: Math.random() * 6 + 8,
      color: ['#f59e0b', '#f97316', '#ef4444', '#fbbf24', '#fb923c', '#a78bfa'][Math.floor(Math.random() * 6)],
    }));
  }, []);

  // Shooting stars
  const shootingStars = useMemo(() => {
    return Array.from({ length: 3 }, (_, i) => ({
      id: i,
      top: Math.random() * 40,
      left: Math.random() * 60 + 20,
      delay: Math.random() * 15 + i * 8,
      duration: Math.random() * 1.5 + 1,
    }));
  }, []);

  // Planets
  const planets = useMemo(() => [
    { id: 0, size: 40, top: 12, left: 85, color1: '#f97316', color2: '#ea580c', ring: false, duration: 80, delay: 0 },
    { id: 1, size: 24, top: 70, left: 8, color1: '#818cf8', color2: '#6366f1', ring: true, duration: 100, delay: 5 },
    { id: 2, size: 16, top: 35, left: 60, color1: '#34d399', color2: '#059669', ring: false, duration: 120, delay: 10 },
  ], []);

  // Asteroids
  const asteroids = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      size: Math.random() * 6 + 3,
      startTop: Math.random() * 80 + 10,
      delay: Math.random() * 20 + i * 3,
      duration: Math.random() * 15 + 20,
      rotation: Math.random() * 360,
    }));
  }, []);

  // Spaceships
  const spaceships = useMemo(() => [
    { id: 0, top: 25, delay: 0, duration: 18, size: 14 },
    { id: 1, top: 55, delay: 12, duration: 22, size: 10 },
    { id: 2, top: 80, delay: 6, duration: 15, size: 12 },
  ], []);

  if (theme !== 'dark') return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    >
      {/* Aurora glow */}
      <div className="ambient-aurora" />

      {/* Stars */}
      {stars.map((star) => (
        <div
          key={`star-${star.id}`}
          className="ambient-star"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}

      {/* Fireflies / embers */}
      {fireflies.map((ff) => (
        <div
          key={`firefly-${ff.id}`}
          className="ambient-firefly"
          style={{
            left: `${ff.left}%`,
            top: `${ff.top}%`,
            width: `${ff.size}px`,
            height: `${ff.size}px`,
            backgroundColor: ff.color,
            boxShadow: `0 0 ${ff.size * 3}px ${ff.size}px ${ff.color}40, 0 0 ${ff.size * 6}px ${ff.size * 2}px ${ff.color}20`,
            animationDelay: `${ff.delay}s`,
            animationDuration: `${ff.duration}s`,
          }}
        />
      ))}

      {/* Shooting stars */}
      {shootingStars.map((ss) => (
        <div
          key={`shoot-${ss.id}`}
          className="ambient-shooting-star"
          style={{
            top: `${ss.top}%`,
            left: `${ss.left}%`,
            animationDelay: `${ss.delay}s`,
            animationDuration: `${ss.duration}s`,
          }}
        />
      ))}

      {/* Planets */}
      {planets.map((p) => (
        <div
          key={`planet-${p.id}`}
          className="ambient-planet"
          style={{
            top: `${p.top}%`,
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: `radial-gradient(circle at 35% 35%, ${p.color1}, ${p.color2}, #000)`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        >
          {p.ring && (
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border"
              style={{
                width: `${p.size * 1.8}px`,
                height: `${p.size * 0.5}px`,
                borderColor: `${p.color1}50`,
                transform: 'translate(-50%, -50%) rotate(-20deg)',
              }}
            />
          )}
        </div>
      ))}

      {/* Asteroids */}
      {asteroids.map((a) => (
        <div
          key={`asteroid-${a.id}`}
          className="ambient-asteroid"
          style={{
            top: `${a.startTop}%`,
            width: `${a.size}px`,
            height: `${a.size * 0.75}px`,
            animationDelay: `${a.delay}s`,
            animationDuration: `${a.duration}s`,
            transform: `rotate(${a.rotation}deg)`,
          }}
        />
      ))}

      {/* Spaceships */}
      {spaceships.map((s) => (
        <div
          key={`ship-${s.id}`}
          className="ambient-spaceship"
          style={{
            top: `${s.top}%`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        >
          {/* Spaceship shape using CSS */}
          <svg width={s.size * 2} height={s.size} viewBox="0 0 28 14" fill="none">
            {/* Body */}
            <ellipse cx="14" cy="7" rx="12" ry="5" fill="#9ca3af" opacity="0.7" />
            {/* Cockpit */}
            <ellipse cx="20" cy="7" rx="4" ry="3" fill="#60a5fa" opacity="0.5" />
            {/* Engine glow */}
            <circle cx="2" cy="7" r="2.5" fill="#f59e0b" opacity="0.8">
              <animate attributeName="opacity" values="0.5;1;0.5" dur="0.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="-1" cy="7" r="1.5" fill="#f97316" opacity="0.6">
              <animate attributeName="opacity" values="0.3;0.8;0.3" dur="0.3s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>
      ))}
    </div>
  );
};

export default AmbientBackground;
