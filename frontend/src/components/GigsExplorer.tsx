import React, { useState, useEffect } from 'react';
import { apiClient } from '../services/api';
import { Star, Clock, ShieldCheck, X, MessageSquare, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';

interface GigReview {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  client: {
    fullName: string;
  };
}

interface BackendGig {
  id: string;
  title: string;
  description: string;
  price: number;
  deliveryTime: number;
  status: string;
  createdAt: string;
  tasker: {
    id: string;
    fullName: string;
    email: string;
  };
  reviews?: GigReview[];
  averageRating?: number;
  totalReviews?: number;
}

interface GigsExplorerProps {
  searchQuery: string;
  refreshTrigger?: number;
}

export const GigsExplorer: React.FC<GigsExplorerProps> = ({ searchQuery, refreshTrigger }) => {
  const { walletBalance, refreshWallet } = useAuth();
  const [gigs, setGigs] = useState<BackendGig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedGig, setSelectedGig] = useState<BackendGig | null>(null);
  const [selectedGigReviews, setSelectedGigReviews] = useState<GigReview[]>([]);
  const [orderRequirements, setOrderRequirements] = useState('');
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);

  const categories = ['All', 'Development', 'Design', 'AI & Data', 'Tutoring', 'Writing'];

  // 1. Fetch real Gigs from backend API
  const fetchAllGigs = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get<BackendGig[]>('/gigs/client/all');
      const gigsData = res.data || [];

      // Fetch real reviews for each gig
      const enrichedGigs = await Promise.all(
        gigsData.map(async (gig) => {
          try {
            const revRes = await apiClient.get(`/reviews/gig/${gig.id}`);
            return {
              ...gig,
              reviews: revRes.data.reviews || [],
              averageRating: revRes.data.averageRating || 5.0,
              totalReviews: revRes.data.totalReviews || (revRes.data.reviews ? revRes.data.reviews.length : 0),
            };
          } catch {
            return { ...gig, reviews: [], averageRating: 5.0, totalReviews: 0 };
          }
        })
      );

      setGigs(enrichedGigs);
    } catch (err) {
      console.error('Failed to load gigs from backend:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllGigs();
  }, [refreshTrigger]);

  // When a gig is selected, load its real reviews
  const handleSelectGig = async (gig: BackendGig) => {
    setSelectedGig(gig);
    setOrderError(null);
    setOrderSuccess(null);
    try {
      const revRes = await apiClient.get(`/reviews/gig/${gig.id}`);
      setSelectedGigReviews(revRes.data.reviews || []);
    } catch {
      setSelectedGigReviews([]);
    }
  };

  // 2. Real Order Creation via POST /orders/client/create
  const handleCreateOrder = async () => {
    if (!selectedGig) return;

    if (walletBalance < selectedGig.price) {
      setOrderError(
        `Insufficient wallet balance (PKR ${walletBalance.toLocaleString()}). You need PKR ${selectedGig.price.toLocaleString()} to lock in Escrow. Please top up your wallet first!`
      );
      return;
    }

    setIsOrdering(true);
    setOrderError(null);

    try {
      const res = await apiClient.post('/orders/client/create', {
        gigId: selectedGig.id,
        requirements: orderRequirements.trim() || 'Standard project specifications.',
      });

      setOrderSuccess(res.data.message || 'Order placed successfully! Funds locked in Escrow.');

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      // Refresh real wallet balance from backend
      await refreshWallet();

      setTimeout(() => {
        setSelectedGig(null);
        setOrderSuccess(null);
        setOrderRequirements('');
      }, 2500);
    } catch (err: any) {
      const errMsg =
        err.response?.data?.message || 'Failed to place order. Please check wallet funds.';
      setOrderError(errMsg);
    } finally {
      setIsOrdering(false);
    }
  };

  const filteredGigs = gigs.filter((gig) => {
    const matchesSearch =
      !searchQuery ||
      gig.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gig.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <section id="marketplace" style={{ padding: '80px 0', position: 'relative', zIndex: 2 }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <span className="badge badge-emerald" style={{ marginBottom: 12 }}>
            Real-Time Marketplace
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 800, marginBottom: 14 }}>
            Explore Verified <span className="gradient-text-emerald">Campus Gigs.</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: 620, margin: '0 auto', fontSize: '1rem' }}>
            Live database records uploaded by student taskers across UCP departments. Secured by decentralized Escrow.
          </p>
        </div>

        {/* Category Pills */}
        <div
          className="category-pills-container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            marginBottom: 44,
            flexWrap: 'wrap',
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '8px 18px',
                borderRadius: 'var(--radius-full)',
                background: selectedCategory === cat ? '#10b981' : '#101522',
                border: `1px solid ${selectedCategory === cat ? '#10b981' : '#232d3f'}`,
                color: selectedCategory === cat ? '#ffffff' : 'var(--text-body)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gigs Grid */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#ffffff', marginBottom: 8 }}>
              Fetching verified gigs from database...
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Connecting to PostgreSQL cluster</p>
          </div>
        ) : (
          <div
            className="gigs-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 26,
            }}
          >
            {filteredGigs.map((gig) => (
              <div
                key={gig.id}
                style={{
                  background: '#0d121d',
                  border: '1px solid #1e293b',
                  borderRadius: 'var(--radius-lg)',
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-card)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-indigo)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#1e293b';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-card)';
                }}
                onClick={() => handleSelectGig(gig)}
              >
                {/* Tasker & Category */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #6366f1 0%, #10b981 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          color: '#ffffff',
                          fontSize: '0.9rem',
                        }}
                      >
                        {gig.tasker.fullName ? gig.tasker.fullName[0].toUpperCase() : 'U'}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#ffffff' }}>
                          {gig.tasker.fullName}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                          {gig.tasker.email}
                        </div>
                      </div>
                    </div>
                    <span className="badge badge-indigo" style={{ fontSize: '0.7rem' }}>
                      {gig.status}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontSize: '1.15rem',
                      fontWeight: 700,
                      color: '#ffffff',
                      lineHeight: 1.4,
                      marginBottom: 10,
                    }}
                  >
                    {gig.title}
                  </h3>

                  {/* Description Snippet */}
                  <p
                    style={{
                      fontSize: '0.88rem',
                      color: 'var(--text-body)',
                      lineHeight: 1.6,
                      marginBottom: 20,
                    }}
                  >
                    {gig.description}
                  </p>
                </div>

                {/* Footer Metadata */}
                <div
                  style={{
                    borderTop: '1px solid #1a2333',
                    paddingTop: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#fbbf24', fontSize: '0.88rem' }}>
                      <Star size={15} fill="#fbbf24" />
                      <span style={{ fontWeight: 700 }}>
                        {gig.averageRating ? gig.averageRating.toFixed(1) : '5.0'}
                      </span>
                      <span style={{ color: 'var(--text-dim)', fontSize: '0.78rem' }}>
                        ({gig.totalReviews || 0})
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                      <Clock size={14} color="var(--text-dim)" />
                      <span>{gig.deliveryTime} Days</span>
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block', textAlign: 'right' }}>
                      Fixed Escrow Price
                    </span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-emerald-light)' }}>
                      PKR {gig.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && filteredGigs.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              background: '#0d121d',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid #1e293b',
              maxWidth: 500,
              margin: '0 auto',
            }}
          >
            <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>No gigs match your search query.</p>
            <button onClick={fetchAllGigs} className="btn btn-secondary btn-sm">
              Reload Gigs
            </button>
          </div>
        )}
      </div>

      {/* Gig Details & Real Escrow Order Modal */}
      {selectedGig && (
        <div className="modal-overlay" onClick={() => setSelectedGig(null)}>
          <div
            className="modal-responsive-card"
            style={{
              maxWidth: 620,
              width: '100%',
              padding: 32,
              background: '#0d121d',
              border: '1px solid #2e384d',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-modal)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <span className="badge badge-emerald" style={{ marginBottom: 8 }}>
                  Verified by University Moderation
                </span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff' }}>
                  {selectedGig.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedGig(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: 4 }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Tasker Details Banner */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                background: '#131926',
                border: '1px solid #1e293b',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #10b981 0%, #6366f1 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  color: '#ffffff',
                }}
              >
                {selectedGig.tasker.fullName[0].toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: '#ffffff' }}>{selectedGig.tasker.fullName}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {selectedGig.tasker.email}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Turnaround</div>
                <div style={{ fontWeight: 700, color: 'var(--accent-indigo-light)' }}>
                  {selectedGig.deliveryTime} Days
                </div>
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontSize: '0.92rem', color: '#ffffff', marginBottom: 6 }}>About this Gig:</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-body)', lineHeight: 1.6 }}>
                {selectedGig.description}
              </p>
            </div>

            {/* Real Reviews Section */}
            <div style={{ marginBottom: 24, borderTop: '1px solid #1a2333', paddingTop: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <h4 style={{ fontSize: '0.95rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <MessageSquare size={16} color="var(--accent-indigo)" />
                  <span>Verified Client Reviews ({selectedGigReviews.length})</span>
                </h4>
              </div>

              {selectedGigReviews.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 180, overflowY: 'auto' }}>
                  {selectedGigReviews.map((rev) => (
                    <div
                      key={rev.id}
                      style={{
                        background: '#090d15',
                        border: '1px solid #1a2333',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-sm)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ffffff' }}>
                          {rev.client.fullName}
                        </span>
                        <div style={{ display: 'flex', gap: 2, color: '#fbbf24' }}>
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} size={12} fill="#fbbf24" />
                          ))}
                        </div>
                      </div>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-body)', margin: 0 }}>
                        "{rev.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
                  No reviews submitted yet for this gig. Be the first verified buyer!
                </div>
              )}
            </div>

            {/* Project Instructions Input */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', marginBottom: 8 }}>
                Your Project Instructions & Requirements:
              </label>
              <textarea
                rows={3}
                value={orderRequirements}
                onChange={(e) => setOrderRequirements(e.target.value)}
                placeholder="Specify your requirements (e.g. deadline, repository link, design guidelines)..."
                className="input-field"
              />
            </div>

            {/* Escrow Fee Breakdown */}
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: 16,
                marginBottom: 20,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem', marginBottom: 6 }}>
                <span style={{ color: 'var(--text-muted)' }}>Order Total (Locked in Escrow):</span>
                <span style={{ fontWeight: 800, color: 'var(--accent-emerald-light)' }}>
                  PKR {selectedGig.price.toLocaleString()}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-dim)' }}>
                <span>Buyer Processing Fee:</span>
                <span>PKR 0 (Free for Buyers)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-dim)', marginTop: 4 }}>
                <span>Your Live Wallet Balance:</span>
                <span style={{ color: walletBalance >= selectedGig.price ? 'var(--accent-emerald)' : 'var(--accent-rose)', fontWeight: 700 }}>
                  PKR {walletBalance.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Error Message */}
            {orderError && (
              <div
                style={{
                  background: 'rgba(244, 63, 94, 0.15)',
                  border: '1px solid var(--accent-rose)',
                  borderRadius: 'var(--radius-md)',
                  padding: 12,
                  color: '#fda4af',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 16,
                }}
              >
                <AlertCircle size={16} />
                <span>{orderError}</span>
              </div>
            )}

            {/* Success Message */}
            {orderSuccess ? (
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.2)',
                  border: '1px solid var(--accent-emerald)',
                  borderRadius: 'var(--radius-md)',
                  padding: 16,
                  color: '#ffffff',
                  textAlign: 'center',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                }}
              >
                🎉 {orderSuccess}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setSelectedGig(null)} className="btn btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button
                  onClick={handleCreateOrder}
                  disabled={isOrdering}
                  className="btn btn-emerald"
                  style={{ flex: 2 }}
                >
                  <ShieldCheck size={18} />
                  <span>{isOrdering ? 'Locking in Escrow...' : `Lock PKR ${selectedGig.price.toLocaleString()} in Escrow`}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
