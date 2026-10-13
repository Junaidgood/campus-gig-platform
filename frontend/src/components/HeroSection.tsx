import React, { useState } from 'react';
import { Search, Shield, Zap, TrendingUp, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

interface HeroSectionProps {
  onSearch: (query: string) => void;
  onExploreGigs: () => void;
  onPostGig: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSearch,
  onExploreGigs,
  onPostGig,
}) => {
  const [searchInput, setSearchInput] = useState('');

  const popularTags = [
    'Next.js 14',
    'Figma UI/UX',
    'Python & AI',
    'Thesis & Formatting',
    'C++ DSA',
    'Video Editing',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchInput);
  };

  const handleTagClick = (tag: string) => {
    setSearchInput(tag);
    onSearch(tag);
  };

  return (
    <section
      style={{
        paddingTop: '64px',
        paddingBottom: '80px',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div className="container" style={{ textAlign: 'center' }}>
        {/* Top Floating Badge */}
        <div
          className="hero-top-badge"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '6px 18px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(99, 102, 241, 0.12)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.2)',
            marginBottom: 24,
            maxWidth: '100%',
          }}
        >
          <Sparkles size={15} color="var(--accent-indigo-light)" style={{ flexShrink: 0 }} />
          <span
            className="badge-text"
            style={{
              fontSize: '0.82rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: '#ffffff',
            }}
          >
            Exclusive for Verified UCP Students & Alumni
          </span>
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'var(--accent-emerald)',
              boxShadow: '0 0 8px var(--accent-emerald)',
              flexShrink: 0,
            }}
          />
        </div>

        {/* Hero Title */}
        <h1
          className="hero-main-title"
          style={{
            fontSize: 'clamp(2.3rem, 4.8vw, 3.8rem)',
            fontWeight: 800,
            lineHeight: 1.16,
            letterSpacing: '-0.025em',
            marginBottom: 20,
            maxWidth: 900,
            margin: '0 auto 20px auto',
            color: '#ffffff',
          }}
        >
          Turn Your Campus Hustle Into{' '}
          <span className="gradient-text-emerald">High-Value Earnings.</span>
        </h1>

        {/* Hero Subtitle */}
        <p
          className="hero-subtitle"
          style={{
            fontSize: 'clamp(0.98rem, 1.8vw, 1.18rem)',
            color: '#cbd5e1',
            maxWidth: 680,
            margin: '0 auto 36px auto',
            lineHeight: 1.6,
          }}
        >
          The official freelancing & project marketplace built exclusively for University of Central Punjab.
          Guaranteed <strong style={{ color: '#ffffff' }}>Escrow Payment Protection</strong>, zero scam risk, and instant{' '}
          <strong style={{ color: 'var(--accent-emerald-light)' }}>JazzCash & EasyPaisa</strong> payouts.
        </p>

        {/* Modern Search Bar */}
        <div
          className="hero-search-container"
          style={{
            maxWidth: 640,
            margin: '0 auto 24px auto',
          }}
        >
          <form
            onSubmit={handleSubmit}
            className="hero-search-form"
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '6px 8px 6px 18px',
              borderRadius: 'var(--radius-xl)',
              background: '#0d121d',
              border: '1px solid #1e293b',
              boxShadow: '0 12px 35px -8px rgba(0, 0, 0, 0.7)',
            }}
          >
            <Search size={20} color="#94a3b8" style={{ marginRight: 12, flexShrink: 0 }} />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="What talent are you looking for? (e.g. Next.js, Python, Figma, Assignment)"
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#ffffff',
                fontSize: '0.95rem',
                fontFamily: 'var(--font-body)',
              }}
            />
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                borderRadius: 'var(--radius-lg)',
                padding: '10px 20px',
                flexShrink: 0,
                fontSize: '0.88rem',
              }}
            >
              <span>Search Gigs</span>
              <ArrowRight size={15} />
            </button>
          </form>

          {/* Quick Tag Pills */}
          <div
            className="hero-trending-tags"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: 8,
              marginTop: 14,
            }}
          >
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Trending:</span>
            {popularTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                style={{
                  background: '#131b2c',
                  border: '1px solid #1e293b',
                  borderRadius: 'var(--radius-full)',
                  padding: '4px 12px',
                  color: '#94a3b8',
                  fontSize: '0.78rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-indigo)';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#1e293b';
                  e.currentTarget.style.color = '#94a3b8';
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Primary Call to Actions */}
        <div
          className="hero-cta-buttons"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 14,
            marginBottom: 56,
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={onExploreGigs}
            className="btn btn-emerald"
            style={{ padding: '12px 28px', fontSize: '0.95rem' }}
          >
            <Zap size={17} />
            <span>Explore All Gigs</span>
          </button>
          <button
            onClick={onPostGig}
            className="btn btn-secondary"
            style={{ padding: '12px 26px', fontSize: '0.95rem', background: '#131b2c', border: '1px solid #1e293b' }}
          >
            <span>Offer Your Skills</span>
            <ArrowRight size={15} />
          </button>
        </div>

        {/* 3 Executive Stat Cards */}
        <div
          className="hero-stats-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 18,
            maxWidth: 1040,
            margin: '0 auto',
          }}
        >
          <div
            style={{
              padding: '24px 22px',
              textAlign: 'left',
              background: '#0d121d',
              border: '1px solid #1e293b',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 'var(--radius-md)',
                background: 'rgba(16, 185, 129, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 14,
              }}
            >
              <Shield size={22} color="var(--accent-emerald)" />
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', marginBottom: 4 }}>
              100% Escrow
            </div>
            <div style={{ fontSize: '0.86rem', color: '#94a3b8', lineHeight: 1.5 }}>
              Funds held securely in decentralized lock until client inspects work. Zero scam risk.
            </div>
          </div>

          <div
            style={{
              padding: '24px 22px',
              textAlign: 'left',
              background: '#0d121d',
              border: '1px solid #1e293b',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 'var(--radius-md)',
                background: 'rgba(99, 102, 241, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 14,
              }}
            >
              <TrendingUp size={22} color="var(--accent-indigo-light)" />
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', marginBottom: 4 }}>
              90% Payout Rate
            </div>
            <div style={{ fontSize: '0.86rem', color: '#94a3b8', lineHeight: 1.5 }}>
              Industry lowest 10% platform fee. Student taskers take home 90% of every order.
            </div>
          </div>

          <div
            style={{
              padding: '24px 22px',
              textAlign: 'left',
              background: '#0d121d',
              border: '1px solid #1e293b',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 'var(--radius-md)',
                background: 'rgba(6, 182, 212, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 14,
              }}
            >
              <CheckCircle2 size={22} color="var(--accent-cyan)" />
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', marginBottom: 4 }}>
              @ucp.edu.pk Only
            </div>
            <div style={{ fontSize: '0.86rem', color: '#94a3b8', lineHeight: 1.5 }}>
              Authentic community where every freelancer is a verified student or alumni.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
