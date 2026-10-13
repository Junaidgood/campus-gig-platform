import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../services/api';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  Send,
  Star,
  X,
  FileCheck,
  Loader2,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface OrdersHubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface OrderItem {
  id: string;
  gigTitle: string;
  price: number;
  status: 'IN_PROGRESS' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED';
  clientName: string;
  taskerName: string;
  requirements: string;
  deliveryNote?: string;
  deliveryDate: string;
  review?: {
    id: string;
    rating: number;
    comment: string;
  };
}

export const OrdersHubModal: React.FC<OrdersHubModalProps> = ({ isOpen, onClose }) => {
  const { role, refreshWallet } = useAuth();

  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deliveryNoteInput, setDeliveryNoteInput] = useState('');
  const [deliveringOrderId, setDeliveringOrderId] = useState<string | null>(null);

  // Review modal state
  const [reviewingOrder, setReviewingOrder] = useState<OrderItem | null>(null);
  const [ratingStars, setRatingStars] = useState(5);
  const [reviewComment, setReviewComment] = useState('Excellent work, prompt delivery and clear communication!');
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const endpoint = role === 'TASKER' ? '/orders/tasker/my-orders' : '/orders/client/my-orders';
      const res = await apiClient.get(endpoint);
      const data = Array.isArray(res.data) ? res.data : [];

      const mapped: OrderItem[] = data.map((o: any) => ({
        id: o.id,
        gigTitle: o.gig?.title || 'Campus Gig Service',
        price: o.price,
        status: o.status,
        clientName: o.client?.fullName || 'Client',
        taskerName: o.tasker?.fullName || 'Tasker',
        requirements: o.requirements || 'No specific requirements recorded',
        deliveryNote: o.deliveryNote || undefined,
        deliveryDate: o.deliveryDate
          ? new Date(o.deliveryDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
          : 'Standard',
        review: o.review || undefined,
      }));

      setOrders(mapped);
    } catch {
      // In case of error, orders remains empty
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchOrders();
    }
  }, [isOpen, role]);

  if (!isOpen) return null;

  // Tasker submits deliverable
  const handleDeliverOrder = async (orderId: string) => {
    if (!deliveryNoteInput.trim()) {
      alert('Please enter delivery details or a project link.');
      return;
    }

    try {
      await apiClient.patch(`/orders/tasker/${orderId}/deliver`, {
        deliveryNote: deliveryNoteInput,
      });
      setDeliveringOrderId(null);
      setDeliveryNoteInput('');
      await fetchOrders();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit delivery.');
    }
  };

  // Client completes order and releases Escrow
  const handleCompleteOrder = async (order: OrderItem) => {
    try {
      await apiClient.patch(`/orders/client/${order.id}/complete`);
      await refreshWallet();
      await fetchOrders();

      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
      });

      // Prompt client to review
      setReviewingOrder(order);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to complete order.');
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewingOrder) return;
    setIsSubmittingReview(true);

    try {
      await apiClient.post('/reviews/client/create', {
        orderId: reviewingOrder.id,
        rating: ratingStars,
        comment: reviewComment,
      });

      setReviewSuccess(true);
      await fetchOrders();
      setTimeout(() => {
        setReviewSuccess(false);
        setReviewingOrder(null);
        setIsSubmittingReview(false);
      }, 1600);
    } catch (err: any) {
      setIsSubmittingReview(false);
      alert(err.response?.data?.message || 'Failed to submit review.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass-panel modal-responsive-card"
        style={{
          maxWidth: 760,
          width: '100%',
          padding: 32,
          background: '#0d121d',
          border: '1px solid #1e293b',
          boxShadow: 'var(--shadow-modal)',
          maxHeight: '90vh',
          overflowY: 'auto',
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
                background: 'rgba(99, 102, 241, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShoppingBag size={22} color="var(--accent-indigo-light)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff' }}>Campus Orders Hub</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', margin: 0 }}>
                Escrow Lifecycle & Dynamic Deliverables ({role} View)
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

        {/* Loading Spinner */}
        {isLoading && (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
            <Loader2 size={32} className="spinning" style={{ margin: '0 auto 12px' }} />
            <p style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>Loading your live orders from backend...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && orders.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '48px 24px',
              background: '#131b2c',
              border: '1px dashed #334155',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <ShoppingBag size={40} color="var(--text-dim)" style={{ marginBottom: 12 }} />
            <h4 style={{ fontSize: '1.1rem', color: '#ffffff', fontWeight: 700, marginBottom: 6 }}>
              No Orders Active Yet
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: 400, margin: '0 auto' }}>
              {role === 'CLIENT'
                ? 'Browse available gigs in the marketplace and hire a verified university tasker with Escrow protection!'
                : 'Offer your skills by publishing a gig to receive orders from peers across campus.'}
            </p>
          </div>
        )}

        {/* Orders List */}
        {!isLoading && orders.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {orders.map((order) => {
              const isCompleted = order.status === 'COMPLETED';
              const isDelivered = order.status === 'DELIVERED';
              const isInProgress = order.status === 'IN_PROGRESS';

              return (
                <div
                  key={order.id}
                  style={{
                    background: '#131b2c',
                    border: `1px solid ${
                      isCompleted
                        ? 'rgba(16, 185, 129, 0.4)'
                        : isDelivered
                        ? 'rgba(99, 102, 241, 0.4)'
                        : '#1e293b'
                    }`,
                    borderRadius: 'var(--radius-md)',
                    padding: 22,
                  }}
                >
                  {/* Order Top Meta */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                    <div>
                      <span
                        className={`badge ${
                          isCompleted
                            ? 'badge-emerald'
                            : isDelivered
                            ? 'badge-indigo'
                            : 'badge-amber'
                        }`}
                        style={{ marginBottom: 8 }}
                      >
                        {order.status}
                      </span>
                      <h4 style={{ fontSize: '1.08rem', color: '#ffffff', fontWeight: 700, marginTop: 4 }}>
                        {order.gigTitle}
                      </h4>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-emerald-light)' }}>
                        PKR {order.price.toLocaleString()}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        {isCompleted ? 'Escrow Released' : 'Held in Escrow'}
                      </div>
                    </div>
                  </div>

                  {/* Parties info */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      fontSize: '0.84rem',
                      color: '#cbd5e1',
                      marginBottom: 14,
                      background: '#090d16',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid #1e293b',
                    }}
                  >
                    <div>
                      <strong style={{ color: '#ffffff' }}>Client:</strong> {order.clientName}
                    </div>
                    <div>•</div>
                    <div>
                      <strong style={{ color: '#ffffff' }}>Tasker:</strong> {order.taskerName}
                    </div>
                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Clock size={14} color="var(--text-dim)" />
                      <span>{order.deliveryDate}</span>
                    </div>
                  </div>

                  {/* Requirements note */}
                  <p style={{ fontSize: '0.86rem', color: '#cbd5e1', marginBottom: 14, lineHeight: 1.5 }}>
                    <strong style={{ color: '#ffffff' }}>Requirements:</strong> {order.requirements}
                  </p>

                  {/* Delivery Note if present */}
                  {order.deliveryNote && (
                    <div
                      style={{
                        background: 'rgba(99, 102, 241, 0.12)',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        padding: '12px 16px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.85rem',
                        color: '#f8fafc',
                        marginBottom: 16,
                      }}
                    >
                      📦 <strong style={{ color: 'var(--accent-indigo-light)' }}>Tasker Submission:</strong>{' '}
                      {order.deliveryNote}
                    </div>
                  )}

                  {/* Review given if completed */}
                  {order.review && (
                    <div
                      style={{
                        background: 'rgba(251, 191, 36, 0.08)',
                        border: '1px solid rgba(251, 191, 36, 0.25)',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.82rem',
                        color: '#fbbf24',
                        marginBottom: 16,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <Star size={16} fill="#fbbf24" />
                      <div>
                        <strong>{order.review.rating}.0 / 5 Star Client Review:</strong> "{order.review.comment}"
                      </div>
                    </div>
                  )}

                  {/* Action Buttons based on Role & Status */}
                  <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                    {/* Tasker action: Deliver */}
                    {role === 'TASKER' && isInProgress && (
                      <div style={{ width: '100%', marginTop: 8 }}>
                        {deliveringOrderId === order.id ? (
                          <div>
                            <textarea
                              rows={2}
                              value={deliveryNoteInput}
                              onChange={(e) => setDeliveryNoteInput(e.target.value)}
                              placeholder="Enter deliverable links (GitHub, Figma, Google Drive) and submission note..."
                              className="input-field"
                              style={{ marginBottom: 8 }}
                            />
                            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                              <button
                                onClick={() => setDeliveringOrderId(null)}
                                className="btn btn-secondary btn-sm"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleDeliverOrder(order.id)}
                                className="btn btn-emerald btn-sm"
                              >
                                <Send size={14} />
                                <span>Submit Delivery</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeliveringOrderId(order.id)}
                            className="btn btn-primary btn-sm"
                            style={{ float: 'right' }}
                          >
                            <FileCheck size={16} />
                            <span>Deliver Work Now</span>
                          </button>
                        )}
                      </div>
                    )}

                    {/* Client action: Accept & Complete */}
                    {role === 'CLIENT' && isDelivered && (
                      <button
                        onClick={() => handleCompleteOrder(order)}
                        className="btn btn-emerald btn-sm"
                      >
                        <CheckCircle2 size={16} />
                        <span>Accept & Release 90% Payout</span>
                      </button>
                    )}

                    {/* Client action: Leave review if completed and not reviewed yet */}
                    {role === 'CLIENT' && isCompleted && !order.review && (
                      <button
                        onClick={() => setReviewingOrder(order)}
                        className="btn btn-secondary btn-sm"
                        style={{ color: '#fbbf24', borderColor: 'rgba(251, 191, 36, 0.4)' }}
                      >
                        <Star size={14} fill="#fbbf24" />
                        <span>Leave Review</span>
                      </button>
                    )}

                    {isCompleted && order.review && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.84rem', color: '#fbbf24' }}>
                        <Star size={15} fill="#fbbf24" />
                        <span style={{ fontWeight: 700 }}>Verified Review Completed</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Review Submission Popup Modal */}
      {reviewingOrder && (
        <div className="modal-overlay" style={{ zIndex: 100000 }}>
          <div
            className="glass-panel"
            style={{
              maxWidth: 480,
              width: '100%',
              padding: 28,
              background: '#0d121d',
              border: '1px solid #1e293b',
              boxShadow: 'var(--shadow-modal)',
              textAlign: 'center',
            }}
          >
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: 8 }}>
              Leave a Campus Peer Review
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: 20 }}>
              How was your experience working with {reviewingOrder.taskerName}?
            </p>

            {/* Interactive Stars */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 20 }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRatingStars(star)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 4,
                  }}
                >
                  <Star
                    size={32}
                    color="#fbbf24"
                    fill={star <= ratingStars ? '#fbbf24' : 'transparent'}
                  />
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              className="input-field"
              placeholder="Write your feedback..."
              style={{ marginBottom: 20 }}
            />

            {reviewSuccess ? (
              <div style={{ color: 'var(--accent-emerald-light)', fontWeight: 700, padding: 12 }}>
                ⭐ Review published to marketplace!
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => setReviewingOrder(null)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  disabled={isSubmittingReview}
                >
                  Skip
                </button>
                <button
                  onClick={handleSubmitReview}
                  className="btn btn-primary"
                  style={{ flex: 2 }}
                  disabled={isSubmittingReview}
                >
                  <Sparkles size={16} />
                  <span>{isSubmittingReview ? 'Submitting...' : 'Submit Rating'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
