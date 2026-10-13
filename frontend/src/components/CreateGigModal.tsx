import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../services/api';
import { PlusCircle, Sparkles, X, CheckCircle2, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CreateGigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGigCreated?: (gig: any) => void;
}

export const CreateGigModal: React.FC<CreateGigModalProps> = ({
  isOpen,
  onClose,
  onGigCreated,
}) => {
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Development');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(3000);
  const [deliveryTime, setDeliveryTime] = useState<number>(2);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const platformFee = Math.round(price * 0.1);
  const taskerEarnings = price - platformFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Please fill all required gig fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiClient.post('/gigs/tasker/create', {
        title,
        description,
        price: Number(price),
        deliveryTime: Number(deliveryTime),
      });

      const createdGig = res.data?.gig || {
        id: `gig-${Date.now()}`,
        title,
        description,
        price: Number(price),
        deliveryTime: Number(deliveryTime),
        status: 'APPROVED',
        tasker: {
          id: user?.id || 'demo-tasker',
          fullName: user?.fullName || 'Campus Tasker',
          email: user?.email || 'tasker@ucp.edu.pk',
        },
      };

      if (onGigCreated) {
        onGigCreated(createdGig);
      }

      setSuccessMsg('Your Gig has been published live to the Campus Marketplace!');

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      setTimeout(() => {
        setSuccessMsg(null);
        setTitle('');
        setDescription('');
        onClose();
      }, 2000);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create gig. Make sure you are logged in as a Tasker.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass-panel modal-responsive-card"
        style={{
          maxWidth: 620,
          width: '100%',
          padding: 32,
          background: '#0d121d',
          border: '1px solid #1e293b',
          boxShadow: 'var(--shadow-modal)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 'var(--radius-md)',
                background: 'rgba(16, 185, 129, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PlusCircle size={22} color="var(--accent-emerald)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff' }}>Create New Campus Gig</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', margin: 0 }}>
                Offer your skills to fellow students & earn 90% net payouts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: 4 }}
          >
            <X size={20} />
          </button>
        </div>

        {successMsg ? (
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid var(--accent-emerald)',
              borderRadius: 'var(--radius-md)',
              padding: 24,
              textAlign: 'center',
            }}
          >
            <CheckCircle2 size={36} color="var(--accent-emerald)" style={{ margin: '0 auto 12px' }} />
            <h4 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: 6 }}>{successMsg}</h4>
            <p style={{ fontSize: '0.86rem', color: '#cbd5e1' }}>
              Your gig is stored in the database and visible immediately to all students on campus!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', marginBottom: 6 }}>
                Gig Title:
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Full-Stack Next.js 14 Web Development or Figma UI Prototype"
                className="input-field"
              />
            </div>

            {/* Category & Delivery Time */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', marginBottom: 6 }}>
                  Category:
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="input-field"
                  style={{ cursor: 'pointer' }}
                >
                  <option value="Development">Development</option>
                  <option value="Design">Design</option>
                  <option value="AI & Data">AI & Data</option>
                  <option value="Writing">Writing</option>
                  <option value="Tutoring">Tutoring</option>
                  <option value="Video & Media">Video & Media</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', marginBottom: 6 }}>
                  Delivery Turnaround (Days):
                </label>
                <input
                  type="number"
                  min="1"
                  max="14"
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(Number(e.target.value))}
                  className="input-field"
                />
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', marginBottom: 6 }}>
                Detailed Description & Deliverables:
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your tech stack, tools used, deliverables, and turnaround time..."
                className="input-field"
              />
            </div>

            {/* Price & Real-time Earnings Calculator */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', marginBottom: 6 }}>
                Price in PKR:
              </label>
              <input
                type="number"
                min="100"
                step="500"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="input-field"
              />
            </div>

            {/* Financial Preview Box */}
            <div
              style={{
                background: '#131b2c',
                border: '1px solid #1e293b',
                borderRadius: 'var(--radius-md)',
                padding: 16,
                marginBottom: 24,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: 6 }}>
                <span style={{ color: '#cbd5e1' }}>You Will Receive (90% Payout):</span>
                <span style={{ fontWeight: 800, color: 'var(--accent-emerald-light)', fontSize: '1.05rem' }}>
                  PKR {taskerEarnings.toLocaleString()}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94a3b8' }}>
                <span>Campus Platform Escrow Fee (10%):</span>
                <span>PKR {platformFee.toLocaleString()}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-emerald"
                style={{ flex: 2 }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="spinning" />
                    <span>Publishing to Backend...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>Publish Gig to Marketplace</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
