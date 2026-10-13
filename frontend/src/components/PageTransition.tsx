import React, { useEffect, useState } from 'react';

interface PageTransitionProps {
  isLoading?: boolean;
  message?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  isLoading = false,
  message = 'Synchronizing Campus Node...',
}) => {
  const [visible, setVisible] = useState(isLoading);

  useEffect(() => {
    if (isLoading) {
      setVisible(true);
    } else {
      const timer = setTimeout(() => setVisible(false), 400);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at center, #0b101c 0%, #05070a 100%)',
        backdropFilter: 'blur(20px)',
        opacity: isLoading ? 1 : 0,
        pointerEvents: isLoading ? 'all' : 'none',
        transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Background GLSL-styled Cyber Scan Grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(99, 102, 241, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(16, 185, 129, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          opacity: 0.6,
          pointerEvents: 'none',
        }}
      />

      {/* Futuristic Orbit Core */}
      <div style={{ position: 'relative', width: 90, height: 90, marginBottom: 28 }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '2px solid transparent',
            borderTopColor: 'var(--accent-emerald)',
            borderRightColor: 'var(--accent-indigo)',
            animation: 'spin 1.2s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 12,
            borderRadius: '50%',
            border: '2px dashed rgba(99, 102, 241, 0.6)',
            animation: 'spin-reverse 2s linear infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 28,
            borderRadius: '50%',
            background: 'radial-gradient(circle, var(--accent-emerald) 0%, transparent 80%)',
            boxShadow: '0 0 20px var(--accent-emerald)',
            animation: 'pulse-slow 2s infinite ease-in-out',
          }}
        />
      </div>

      {/* Transition Message */}
      <div
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.1rem',
          fontWeight: 600,
          letterSpacing: '0.05em',
          color: '#ffffff',
          textShadow: '0 0 15px rgba(255, 255, 255, 0.3)',
          marginBottom: 8,
        }}
      >
        {message}
      </div>

      <div
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}
      >
        CAMPUS GIG ESCROW PROTOCOL
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
      `}</style>
    </div>
  );
};
