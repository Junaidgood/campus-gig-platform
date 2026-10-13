import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ThreeCanvas } from './components/ThreeCanvas';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { StoryParallaxSection } from './components/StoryParallaxSection';
import { GigsExplorer } from './components/GigsExplorer';
import { WalletModal } from './components/WalletModal';
import { OrdersHubModal } from './components/OrdersHubModal';
import { ChatModal } from './components/ChatModal';
import { CreateGigModal } from './components/CreateGigModal';
import { AuthModal } from './components/AuthModal';
import { CampusLogo } from './components/CampusLogo';
import { ShieldCheck, Heart, Sparkles, ExternalLink } from 'lucide-react';

const AppContent: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCreateGigOpen, setIsCreateGigOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [gigsRefreshKey, setGigsRefreshKey] = useState(0);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const marketplaceEl = document.getElementById('marketplace');
    if (marketplaceEl) {
      marketplaceEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToMarketplace = () => {
    const marketplaceEl = document.getElementById('marketplace');
    if (marketplaceEl) {
      marketplaceEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="app-container">
      {/* 3D WebGL Three.js Background Canvas */}
      <ThreeCanvas />

      {/* Floating Navbar */}
      <Navbar
        onOpenWallet={() => setIsWalletOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
        onOpenCreateGig={() => setIsCreateGigOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      <main style={{ position: 'relative', zIndex: 1 }}>
        {/* Hero Section with Search & 3D Badges */}
        <HeroSection
          onSearch={handleSearch}
          onExploreGigs={scrollToMarketplace}
          onPostGig={() => setIsCreateGigOpen(true)}
        />

        {/* 3D Interactive Storytelling Parallax Section */}
        <StoryParallaxSection />

        {/* Trust & Guarantee Banner */}
        <section id="trust" style={{ padding: '60px 0', position: 'relative', zIndex: 2 }}>
          <div className="container">
            <div
              className="glass-panel trust-banner-card"
              style={{
                padding: '36px 40px',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(99, 102, 241, 0.08) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 24,
              }}
            >
              <div className="trust-banner-info" style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(16, 185, 129, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <ShieldCheck size={28} color="var(--accent-emerald)" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: 4 }}>
                    100% Escrow Protection Protocol
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0, maxWidth: 640 }}>
                    Never worry about non-delivery or payment fraud. The client inspects the deliverable before
                    releasing payout. If an issue occurs, the funds are instantly refunded.
                  </p>
                </div>
              </div>
              <button
                onClick={scrollToMarketplace}
                className="btn btn-emerald"
                style={{ padding: '12px 28px', flexShrink: 0 }}
              >
                <Sparkles size={16} />
                <span>Browse Marketplace</span>
              </button>
            </div>
          </div>
        </section>

        {/* Marketplace Explorer */}
        <GigsExplorer searchQuery={searchQuery} refreshTrigger={gigsRefreshKey} />
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid #1e293b',
          background: '#070a11',
          padding: '60px 0 32px 0',
          position: 'relative',
          zIndex: 2,
          marginTop: 60,
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 24,
              marginBottom: 40,
            }}
          >
            <div>
              <div style={{ marginBottom: 12 }}>
                <CampusLogo size="md" />
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0, maxWidth: 440, lineHeight: 1.5 }}>
                Empowering university students with real-world freelancing opportunities, escrow balance locking, and verified peer feedback.
              </p>
            </div>

            <div className="footer-nav-links" style={{ display: 'flex', gap: 32, fontSize: '0.88rem', color: '#cbd5e1', flexWrap: 'wrap' }}>
              <a href="#marketplace" style={{ color: '#cbd5e1', transition: 'color var(--transition-fast)' }}>
                Explore Gigs
              </a>
              <a href="#story" style={{ color: '#cbd5e1', transition: 'color var(--transition-fast)' }}>
                How Escrow Works
              </a>
              <a href="#trust" style={{ color: '#cbd5e1', transition: 'color var(--transition-fast)' }}>
                Buyer Guarantee
              </a>
              <a
                href="https://ucp.edu.pk"
                target="_blank"
                rel="noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#cbd5e1' }}
              >
                <span>UCP Portal</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>

          <div
            style={{
              borderTop: '1px solid #1e293b',
              paddingTop: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12,
              fontSize: '0.8rem',
              color: '#64748b',
            }}
          >
            <div>© 2026 CampusGig • University of Central Punjab, Lahore. All rights reserved.</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>Built for campus talent with</span>
              <Heart size={14} color="var(--accent-rose)" fill="var(--accent-rose)" />
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <WalletModal isOpen={isWalletOpen} onClose={() => setIsWalletOpen(false)} />
      <OrdersHubModal isOpen={isOrdersOpen} onClose={() => setIsOrdersOpen(false)} />
      <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <CreateGigModal
        isOpen={isCreateGigOpen}
        onClose={() => setIsCreateGigOpen(false)}
        onGigCreated={() => setGigsRefreshKey((k) => k + 1)}
      />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
