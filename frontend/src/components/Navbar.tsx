import React, { useState } from 'react';
import { useAuth, type UserRole } from '../context/AuthContext';
import { CampusLogo } from './CampusLogo';
import {
  Wallet,
  MessageSquare,
  ShoppingBag,
  PlusCircle,
  ShieldCheck,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';

interface NavbarProps {
  onOpenWallet: () => void;
  onOpenOrders: () => void;
  onOpenChat: () => void;
  onOpenCreateGig: () => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenWallet,
  onOpenOrders,
  onOpenChat,
  onOpenCreateGig,
  onOpenAuth,
}) => {
  const { user, role, walletBalance, switchRole, logout } = useAuth();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleRoleSelect = async (newRole: UserRole) => {
    setShowRoleMenu(false);
    await switchRole(newRole);
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header
      className="navbar-header"
      style={{
        position: 'sticky',
        top: 14,
        zIndex: 1000,
        margin: '0 auto',
        maxWidth: 1280,
        width: 'calc(100% - 24px)',
      }}
    >
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 18px',
          borderRadius: 'var(--radius-lg)',
          background: 'rgba(13, 18, 29, 0.96)',
          backdropFilter: 'blur(16px)',
          border: '1px solid #1e293b',
          boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.6)',
          gap: 12,
          position: 'relative',
        }}
      >
        {/* Brand Logo */}
        <a href="#" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <CampusLogo size="md" />
        </a>

        {/* Desktop Navigation Links */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 24,
          }}
          className="desktop-nav-links"
        >
          <a
            href="#marketplace"
            style={{
              fontSize: '0.88rem',
              fontWeight: 600,
              color: '#cbd5e1',
              textDecoration: 'none',
              transition: 'color var(--transition-fast)',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
          >
            Live Marketplace
          </a>
          <a
            href="#story"
            style={{
              fontSize: '0.88rem',
              fontWeight: 600,
              color: '#cbd5e1',
              textDecoration: 'none',
              transition: 'color var(--transition-fast)',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
          >
            Escrow Workflow
          </a>
          <a
            href="#trust"
            style={{
              fontSize: '0.88rem',
              fontWeight: 600,
              color: '#cbd5e1',
              textDecoration: 'none',
              transition: 'color var(--transition-fast)',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
          >
            Safety Guarantee
          </a>
        </div>

        {/* Desktop Right Controls Dock */}
        <div className="desktop-controls-dock" style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          {/* Quick Role Switcher Pill */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="btn btn-secondary btn-sm"
              style={{
                borderRadius: 'var(--radius-full)',
                padding: '6px 14px',
                border: '1px solid #334155',
                background: '#131b2c',
                whiteSpace: 'nowrap',
              }}
              title="Click to switch role: Client / Tasker / Admin"
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background:
                    role === 'TASKER'
                      ? 'var(--accent-emerald)'
                      : role === 'ADMIN'
                      ? 'var(--accent-rose)'
                      : 'var(--accent-indigo)',
                  boxShadow: `0 0 8px ${
                    role === 'TASKER'
                      ? 'var(--accent-emerald)'
                      : role === 'ADMIN'
                      ? 'var(--accent-rose)'
                      : 'var(--accent-indigo)'
                  }`,
                }}
              />
              <span style={{ fontSize: '0.8rem', color: '#ffffff', fontWeight: 600 }}>Role: {role}</span>
              <ChevronDown size={14} color="#94a3b8" />
            </button>

            {showRoleMenu && (
              <div
                style={{
                  position: 'absolute',
                  top: '115%',
                  right: 0,
                  width: 175,
                  padding: 6,
                  borderRadius: 'var(--radius-md)',
                  background: '#0d121d',
                  border: '1px solid #2e384d',
                  boxShadow: 'var(--shadow-modal)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  zIndex: 2000,
                }}
              >
                {(['CLIENT', 'TASKER', 'ADMIN'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => handleRoleSelect(r)}
                    style={{
                      padding: '8px 12px',
                      background: role === r ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                      border: 'none',
                      borderRadius: 'var(--radius-xs)',
                      color: role === r ? '#ffffff' : '#cbd5e1',
                      textAlign: 'left',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>{r} View</span>
                    {role === r && <ShieldCheck size={14} color="var(--accent-emerald)" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Wallet Balance Badge */}
          <button
            onClick={onOpenWallet}
            className="btn btn-secondary btn-sm"
            style={{
              borderRadius: 'var(--radius-full)',
              padding: '6px 14px',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              background: 'rgba(16, 185, 129, 0.12)',
              color: 'var(--accent-emerald-light)',
              whiteSpace: 'nowrap',
            }}
            title="Open Live Wallet & Transactions"
          >
            <Wallet size={15} />
            <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>PKR {walletBalance.toLocaleString()}</span>
          </button>

          {/* Orders Hub Button */}
          <button
            onClick={onOpenOrders}
            className="btn btn-secondary btn-icon"
            style={{ borderRadius: 'var(--radius-full)', width: 36, height: 36, background: '#131b2c', border: '1px solid #1e293b' }}
            title="My Orders & Deliverables"
          >
            <ShoppingBag size={17} color="#cbd5e1" />
          </button>

          {/* Live Chat Button */}
          <button
            onClick={onOpenChat}
            className="btn btn-secondary btn-icon"
            style={{ borderRadius: 'var(--radius-full)', width: 36, height: 36, background: '#131b2c', border: '1px solid #1e293b' }}
            title="Campus Direct Messaging"
          >
            <MessageSquare size={17} color="#cbd5e1" />
          </button>

          {/* Tasker Gig Creator Button */}
          {role === 'TASKER' && (
            <button
              onClick={onOpenCreateGig}
              className="btn btn-emerald btn-sm"
              style={{ borderRadius: 'var(--radius-full)', padding: '6px 14px', whiteSpace: 'nowrap' }}
            >
              <PlusCircle size={15} />
              <span>Post Gig</span>
            </button>
          )}

          {/* User Profile or Login */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  border: '2px solid var(--accent-indigo)',
                  objectFit: 'cover',
                }}
                title={user.fullName}
              />
              <button
                onClick={logout}
                className="btn btn-secondary btn-icon"
                style={{ borderRadius: 'var(--radius-full)', width: 32, height: 32, background: 'transparent', border: '1px solid #334155' }}
                title="Log Out"
              >
                <LogOut size={14} color="#94a3b8" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="btn btn-primary btn-sm"
              style={{ borderRadius: 'var(--radius-full)', padding: '6px 14px', whiteSpace: 'nowrap' }}
            >
              <UserIcon size={15} />
              <span>Sign In</span>
            </button>
          )}
        </div>

        {/* Mobile Right Bar (Shown ONLY on screens <= 768px) */}
        <div className="mobile-controls-dock" style={{ display: 'none', alignItems: 'center', gap: 8 }}>
          {/* Mobile Compact Wallet Pill */}
          <button
            onClick={onOpenWallet}
            className="btn btn-secondary btn-sm mobile-wallet-pill"
            style={{
              borderRadius: 'var(--radius-full)',
              padding: '6px 10px',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              background: 'rgba(16, 185, 129, 0.12)',
              color: 'var(--accent-emerald-light)',
              whiteSpace: 'nowrap',
              fontSize: '0.78rem',
            }}
          >
            <Wallet size={14} />
            <span style={{ fontWeight: 800 }}>PKR {walletBalance.toLocaleString()}</span>
          </button>

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="btn btn-secondary btn-icon"
            style={{
              borderRadius: 'var(--radius-sm)',
              width: 36,
              height: 36,
              background: '#131b2c',
              border: '1px solid #1e293b',
              color: '#ffffff',
            }}
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Dropdown Menu */}
      {isMobileMenuOpen && (
        <div
          className="mobile-dropdown-menu"
          style={{
            marginTop: 8,
            padding: 18,
            borderRadius: 'var(--radius-lg)',
            background: '#0d121d',
            border: '1px solid #1e293b',
            boxShadow: 'var(--shadow-modal)',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          {/* Role Switcher Section */}
          <div>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 8, fontWeight: 700 }}>
              Switch Perspective:
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {(['CLIENT', 'TASKER', 'ADMIN'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    handleRoleSelect(r);
                    closeMobileMenu();
                  }}
                  style={{
                    padding: '8px 6px',
                    borderRadius: 'var(--radius-sm)',
                    background: role === r ? 'var(--accent-indigo)' : '#131b2c',
                    border: `1px solid ${role === r ? 'var(--accent-indigo)' : '#1e293b'}`,
                    color: '#ffffff',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textAlign: 'center',
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Action Navigation Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <button
              onClick={() => {
                onOpenOrders();
                closeMobileMenu();
              }}
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: 'center', background: '#131b2c', border: '1px solid #1e293b' }}
            >
              <ShoppingBag size={16} color="var(--accent-indigo-light)" />
              <span>My Orders</span>
            </button>
            <button
              onClick={() => {
                onOpenChat();
                closeMobileMenu();
              }}
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: 'center', background: '#131b2c', border: '1px solid #1e293b' }}
            >
              <MessageSquare size={16} color="var(--accent-emerald-light)" />
              <span>Campus Chat</span>
            </button>
          </div>

          {role === 'TASKER' && (
            <button
              onClick={() => {
                onOpenCreateGig();
                closeMobileMenu();
              }}
              className="btn btn-emerald btn-sm"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <PlusCircle size={16} />
              <span>Post New Campus Gig</span>
            </button>
          )}

          {/* User Profile Bar */}
          <div
            style={{
              padding: '12px 14px',
              borderRadius: 'var(--radius-sm)',
              background: '#131b2c',
              border: '1px solid #1e293b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {user ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <img
                    src={user.avatarUrl}
                    alt={user.fullName}
                    style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>
                      {user.fullName}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{user.department || role}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    closeMobileMenu();
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '6px 10px', fontSize: '0.75rem', color: '#f87171' }}
                >
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  onOpenAuth();
                  closeMobileMenu();
                }}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                <UserIcon size={16} />
                <span>Sign In to Campus Account</span>
              </button>
            )}
          </div>

          {/* Informational Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, borderTop: '1px solid #1e293b', paddingTop: 14 }}>
            <a
              href="#marketplace"
              onClick={closeMobileMenu}
              style={{ fontSize: '0.86rem', color: '#cbd5e1', textDecoration: 'none', fontWeight: 600 }}
            >
              → Live Marketplace
            </a>
            <a
              href="#story"
              onClick={closeMobileMenu}
              style={{ fontSize: '0.86rem', color: '#cbd5e1', textDecoration: 'none', fontWeight: 600 }}
            >
              → Escrow Workflow
            </a>
            <a
              href="#trust"
              onClick={closeMobileMenu}
              style={{ fontSize: '0.86rem', color: '#cbd5e1', textDecoration: 'none', fontWeight: 600 }}
            >
              → Safety Guarantee
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
