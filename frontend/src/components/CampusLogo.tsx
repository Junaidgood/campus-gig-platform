import React from 'react';

interface CampusLogoProps {
  size?: 'sm' | 'md' | 'lg';
}

export const CampusLogo: React.FC<CampusLogoProps> = ({ size = 'md' }) => {
  const iconSize = size === 'sm' ? 32 : size === 'lg' ? 48 : 40;
  const fontSize = size === 'sm' ? '1.1rem' : size === 'lg' ? '1.5rem' : '1.3rem';

  return (
    <div className="campus-logo-root" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
      {/* Modern High-End Shield & Spark Icon */}
      <div
        className="campus-logo-icon"
        style={{
          width: iconSize,
          height: iconSize,
          borderRadius: 12,
          background: 'linear-gradient(135deg, #10b981 0%, #4f46e5 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px rgba(16, 185, 129, 0.35)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          flexShrink: 0,
        }}
      >
        <svg
          width={iconSize * 0.6}
          height={iconSize * 0.6}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Stylized Graduation Cap with Lightning Escrow Spark */}
          <path
            d="M12 2L2 7L12 12L22 7L12 2Z"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5 9.5V15.5C5 15.5 8 18.5 12 18.5C16 18.5 19 15.5 19 15.5V9.5"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 12V22"
            stroke="#34d399"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Typography */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            className="campus-logo-title"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize,
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: '#ffffff',
            }}
          >
            CAMPUS<span style={{ color: 'var(--accent-emerald)' }}>GIG</span>
          </span>
          <span
            className="campus-logo-tag"
            style={{
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              padding: '2px 8px',
              borderRadius: 20,
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#34d399',
              border: '1px solid rgba(16, 185, 129, 0.3)',
            }}
          >
            UCP LAHORE
          </span>
        </div>
        <p className="campus-logo-subtitle" style={{ fontSize: '0.72rem', color: '#94a3b8', margin: 0, fontWeight: 500 }}>
          University Freelance & Escrow Network
        </p>
      </div>
    </div>
  );
};
