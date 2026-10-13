import React, { useState } from 'react';
import { ShieldCheck, Lock, MessageSquare, Award, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const StoryParallaxSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: 0,
      badge: 'Step 01 • Marketplace Discovery',
      title: 'Find The Perfect Campus Talent',
      description:
        'Browse vetted gigs posted by high-performing UCP students in Computer Science, Software Engineering, Business, and Media. Filter by delivery speed, student rating, and budget.',
      icon: <ShieldCheck size={26} color="var(--accent-emerald)" />,
      accentColor: 'var(--accent-emerald)',
      mockup: (
        <div style={{ padding: 24, textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <span className="badge badge-emerald">Gig Verified by Admin</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Turnaround: 2 Days</span>
          </div>
          <h4 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: 8 }}>
            Full-Stack Next.js 14 Web Application Development
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 16 }}>
            Tailored for semester projects, portfolio sites, or startup MVPs.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block' }}>Starting at</span>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-emerald-light)' }}>
                PKR 4,500
              </span>
            </div>
            <button className="btn btn-primary btn-sm">
              <span>Order Gig</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      ),
    },
    {
      id: 1,
      badge: 'Step 02 • Escrow Safety Guarantee',
      title: 'Funds Locked In Escrow (Zero Scam Risk)',
      description:
        'When an order is created, the client’s money is securely locked in Escrow. Neither the student freelancer nor the buyer can be scammed. Freelancer starts coding with guaranteed payment!',
      icon: <Lock size={26} color="var(--accent-indigo)" />,
      accentColor: 'var(--accent-indigo)',
      mockup: (
        <div style={{ padding: 24, textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'rgba(99, 102, 241, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Lock size={20} color="var(--accent-indigo-light)" />
            </div>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
                Escrow Vault #ORD-9842
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--accent-emerald-light)' }}>
                Status: LOCKED & SECURED
              </div>
            </div>
          </div>
          <div
            style={{
              background: 'rgba(10, 14, 23, 0.8)',
              padding: 16,
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              marginBottom: 16,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 6 }}>
              <span style={{ color: 'var(--text-muted)' }}>Locked Order Amount:</span>
              <span style={{ color: '#ffffff', fontWeight: 700 }}>PKR 4,500</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Escrow Release Trigger:</span>
              <span style={{ color: 'var(--accent-indigo-light)', fontWeight: 600 }}>Client Work Acceptance</span>
            </div>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', margin: 0 }}>
            🔒 Funds are held in decentralized vault until work is delivered and verified.
          </p>
        </div>
      ),
    },
    {
      id: 2,
      badge: 'Step 03 • Real-Time Chat & Deliveries',
      title: 'Seamless Collaboration & Delivery',
      description:
        'Communicate directly with your peer freelancer via real-time WebSockets. When the project is ready, tasker submits source code, preview links, and delivery notes directly through the portal.',
      icon: <MessageSquare size={26} color="var(--accent-cyan)" />,
      accentColor: 'var(--accent-cyan)',
      mockup: (
        <div style={{ padding: 24, textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>Live Chat Simulation</span>
            <span className="badge badge-indigo">Socket Connected</span>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              background: 'rgba(10, 14, 23, 0.7)',
              padding: 14,
              borderRadius: 'var(--radius-md)',
              marginBottom: 14,
            }}
          >
            <div
              style={{
                alignSelf: 'flex-start',
                background: 'rgba(255, 255, 255, 0.06)',
                padding: '8px 12px',
                borderRadius: '12px 12px 12px 2px',
                fontSize: '0.82rem',
                maxWidth: '85%',
              }}
            >
              "Hey! I finished the responsive navbar and 3D hero canvas. Can you test it?"
            </div>
            <div
              style={{
                alignSelf: 'flex-end',
                background: 'rgba(99, 102, 241, 0.3)',
                padding: '8px 12px',
                borderRadius: '12px 12px 2px 12px',
                fontSize: '0.82rem',
                maxWidth: '85%',
                color: '#ffffff',
              }}
            >
              "Looks incredible! Please submit delivery so I can release payment."
            </div>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
            📦 Deliverable: github.com/ucp-student/campus-gig.zip
          </div>
        </div>
      ),
    },
    {
      id: 3,
      badge: 'Step 04 • Instant Earnings & Review',
      title: '90% Payout Credited & 5-Star Reviews',
      description:
        'Once client clicks "Approve", the Escrow instantly releases 90% payout to the Tasker’s wallet. Taskers withdraw directly to JazzCash, EasyPaisa, or Pakistani Bank Accounts within minutes!',
      icon: <Award size={26} color="var(--accent-amber)" />,
      accentColor: 'var(--accent-amber)',
      mockup: (
        <div style={{ padding: 24, textAlign: 'left' }}>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.2)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 8,
              }}
            >
              <CheckCircle size={28} color="var(--accent-emerald)" />
            </div>
            <h4 style={{ fontSize: '1.2rem', color: '#ffffff' }}>Order Completed Successfully!</h4>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Payout Released to Tasker Wallet
            </span>
          </div>

          <div
            style={{
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: 'var(--radius-md)',
              padding: 14,
              marginBottom: 16,
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Tasker Net Earning (90%)</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-emerald-light)' }}>
              + PKR 4,050
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
              10% Platform Fee: PKR 450
            </div>
          </div>

          <button
            onClick={() => {
              confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 },
              });
            }}
            className="btn btn-emerald"
            style={{ width: '100%', borderRadius: 'var(--radius-md)' }}
          >
            <Sparkles size={16} />
            <span>Celebrate & Release Payout</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <section
      id="story"
      style={{
        padding: '100px 0',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <span className="badge badge-indigo" style={{ marginBottom: 12 }}>
            Interactive 3D Workflow
          </span>
          <h2
            style={{
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              fontWeight: 800,
              marginBottom: 16,
            }}
          >
            How Campus Freelancing Works in <span className="gradient-text-indigo">4 Simple Steps.</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: 640, margin: '0 auto', fontSize: '1.05rem' }}>
            Experience an intuitive, scam-free ecosystem designed specifically for the university ecosystem.
          </p>
        </div>

        {/* Step Selector Pills */}
        <div
          className="story-step-pills"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            marginBottom: 48,
            flexWrap: 'wrap',
          }}
        >
          {steps.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setActiveStep(idx)}
              style={{
                padding: '10px 20px',
                borderRadius: 'var(--radius-full)',
                background: activeStep === idx ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                border: `1px solid ${
                  activeStep === idx ? 'var(--accent-indigo)' : 'rgba(255, 255, 255, 0.08)'
                }`,
                color: activeStep === idx ? '#ffffff' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'all var(--transition-normal)',
                boxShadow: activeStep === idx ? '0 0 20px rgba(99, 102, 241, 0.3)' : 'none',
              }}
            >
              <span>{`0${idx + 1}`}</span>
              <span>{s.title.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Storytelling Interactive Feature Card */}
        <div
          className="glass-panel story-feature-card"
          style={{
            padding: '48px 40px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 40,
            alignItems: 'center',
            background: 'rgba(12, 16, 26, 0.85)',
            border: `1px solid ${steps[activeStep].accentColor}`,
            boxShadow: `0 20px 60px -20px ${steps[activeStep].accentColor}33`,
            transition: 'all 0.5s ease',
          }}
        >
          {/* Left Text Explanation */}
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {steps[activeStep].icon}
              </div>
              <span
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: steps[activeStep].accentColor,
                  letterSpacing: '0.04em',
                }}
              >
                {steps[activeStep].badge}
              </span>
            </div>

            <h3
              style={{
                fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)',
                fontWeight: 800,
                color: '#ffffff',
                marginBottom: 16,
                lineHeight: 1.25,
              }}
            >
              {steps[activeStep].title}
            </h3>

            <p
              style={{
                fontSize: '1rem',
                color: 'var(--text-muted)',
                lineHeight: 1.7,
                marginBottom: 32,
              }}
            >
              {steps[activeStep].description}
            </p>

            {/* Next Step Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <button
                onClick={() => setActiveStep((prev) => (prev + 1) % steps.length)}
                className="btn btn-primary"
                style={{ borderRadius: 'var(--radius-md)' }}
              >
                <span>{activeStep === steps.length - 1 ? 'Restart Journey' : 'Next Stage'}</span>
                <ArrowRight size={16} />
              </button>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                Stage {activeStep + 1} of 4
              </span>
            </div>
          </div>

          {/* Right Live Interactive Mockup Card */}
          <div
            style={{
              background: 'rgba(6, 9, 15, 0.85)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              overflow: 'hidden',
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.6)',
              position: 'relative',
            }}
          >
            {/* Top Mac/Browser Glass Header */}
            <div
              style={{
                padding: '12px 18px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(255, 255, 255, 0.02)',
              }}
            >
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
              <span
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-dim)',
                  marginLeft: 8,
                  fontFamily: 'monospace',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: 'calc(100% - 70px)',
                  display: 'inline-block',
                }}
              >
                https://campusgig.ucp.edu.pk/escrow-protocol
              </span>
            </div>

            {/* Mockup Dynamic Content */}
            {steps[activeStep].mockup}
          </div>
        </div>
      </div>
    </section>
  );
};
