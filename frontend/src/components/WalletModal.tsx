import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../services/api';
import { Wallet, ArrowDownLeft, ArrowUpRight, X, Shield, CheckCircle2, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TransactionItem {
  id: string;
  type: string;
  amount: number;
  description: string;
  date: string;
}

export const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
  const { role, walletBalance, refreshWallet } = useAuth();
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');

  // Deposit state
  const [depositAmount, setDepositAmount] = useState<number>(2000);
  const [depositMethod, setDepositMethod] = useState<'JazzCash' | 'EasyPaisa' | 'Bank'>('JazzCash');
  const [isProcessing, setIsProcessing] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Withdraw state
  const [withdrawAmount, setWithdrawAmount] = useState<number>(1000);
  const [withdrawMethod, setWithdrawMethod] = useState<'JazzCash' | 'EasyPaisa' | 'Bank'>('JazzCash');
  const [accountNumber, setAccountNumber] = useState('03001234567');
  const [accountTitle, setAccountTitle] = useState('Muhammad Junaid');

  // Real backend transactions
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [isLoadingWallet, setIsLoadingWallet] = useState(false);

  const fetchWalletData = async () => {
    setIsLoadingWallet(true);
    try {
      if (role === 'CLIENT') {
        const res = await apiClient.get('/wallet/client/my-wallet');
        if (res.data) {
          const txs = (res.data.transactions || []).map((t: any) => ({
            id: t.id,
            type: t.type,
            amount: t.amount,
            description: t.description || `${t.type} transaction`,
            date: t.createdAt
              ? new Date(t.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Recent',
          }));
          setTransactions(txs);
        }
      } else {
        const res = await apiClient.get('/wallet/tasker/my-wallet');
        if (res.data && res.data.wallet) {
          const txs = (res.data.wallet.transactions || []).map((t: any) => ({
            id: t.id,
            type: t.type,
            amount: t.amount,
            description: t.description || `${t.type} transaction`,
            date: t.createdAt
              ? new Date(t.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Recent',
          }));
          setTransactions(txs);
        }
      }
    } catch {
      // Keep existing transactions
    } finally {
      setIsLoadingWallet(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchWalletData();
    }
  }, [isOpen, role]);

  if (!isOpen) return null;

  const handleDeposit = async () => {
    if (depositAmount < 100) {
      alert('Minimum deposit amount is 100 PKR');
      return;
    }

    setIsProcessing(true);
    try {
      await apiClient.post('/wallet/client/deposit', { amount: Number(depositAmount) });
      await refreshWallet();
      await fetchWalletData();

      setNotificationMsg(`Successfully deposited PKR ${depositAmount.toLocaleString()} via ${depositMethod}!`);

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });

      setTimeout(() => {
        setNotificationMsg(null);
      }, 3500);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Deposit failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWithdraw = async () => {
    if (withdrawAmount > walletBalance) {
      alert(`Insufficient balance! Your current balance is PKR ${walletBalance.toLocaleString()}`);
      return;
    }
    if (withdrawAmount < 500) {
      alert('Minimum withdrawal amount is 500 PKR');
      return;
    }

    setIsProcessing(true);
    try {
      await apiClient.post('/wallet/tasker/withdraw', {
        amount: Number(withdrawAmount),
        paymentMethod: withdrawMethod,
        accountNumber,
        accountTitle,
      });

      await refreshWallet();
      await fetchWalletData();

      setNotificationMsg(
        `Withdrawal request for PKR ${withdrawAmount.toLocaleString()} submitted to Admin for payout!`
      );

      setTimeout(() => {
        setNotificationMsg(null);
      }, 3500);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Withdrawal request failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass-panel modal-responsive-card"
        style={{
          maxWidth: 640,
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
                background: 'rgba(16, 185, 129, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Wallet size={22} color="var(--accent-emerald)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff' }}>Campus Wallet Hub</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', margin: 0 }}>
                Escrow Protected Balance & Dynamic Ledger
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

        {/* Balance Card Banner */}
        <div
          className="wallet-balance-banner"
          style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px 28px',
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div>
            <span style={{ fontSize: '0.82rem', color: '#cbd5e1', display: 'block', marginBottom: 4 }}>
              Available Balance
            </span>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#ffffff' }}>
              PKR {walletBalance.toLocaleString()}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span className="badge badge-emerald" style={{ marginBottom: 6 }}>
              <Shield size={12} />
              100% Secure
            </span>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Zero Platform Fees on Deposits</div>
          </div>
        </div>

        {/* Action Tabs */}
        <div
          style={{
            display: 'flex',
            gap: 12,
            background: '#131b2c',
            padding: 4,
            borderRadius: 'var(--radius-md)',
            marginBottom: 24,
            border: '1px solid #1e293b',
          }}
        >
          <button
            onClick={() => setActiveTab('deposit')}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: activeTab === 'deposit' ? 'var(--accent-emerald)' : 'transparent',
              color: activeTab === 'deposit' ? '#ffffff' : '#94a3b8',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'all var(--transition-fast)',
            }}
          >
            <ArrowDownLeft size={16} />
            <span>Deposit (Top-Up)</span>
          </button>
          <button
            onClick={() => setActiveTab('withdraw')}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: activeTab === 'withdraw' ? 'var(--accent-indigo)' : 'transparent',
              color: activeTab === 'withdraw' ? '#ffffff' : '#94a3b8',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'all var(--transition-fast)',
            }}
          >
            <ArrowUpRight size={16} />
            <span>Withdraw Earnings</span>
          </button>
        </div>

        {/* Success Alert */}
        {notificationMsg && (
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid var(--accent-emerald)',
              borderRadius: 'var(--radius-md)',
              padding: 14,
              color: '#ffffff',
              fontSize: '0.9rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 20,
            }}
          >
            <CheckCircle2 size={18} color="var(--accent-emerald)" />
            <span>{notificationMsg}</span>
          </div>
        )}

        {/* Tab Content: Deposit */}
        {activeTab === 'deposit' ? (
          <div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', marginBottom: 8 }}>
                Select Payment Channel:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {(['JazzCash', 'EasyPaisa', 'Bank'] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setDepositMethod(method)}
                    style={{
                      padding: '12px 10px',
                      borderRadius: 'var(--radius-md)',
                      background: depositMethod === method ? 'rgba(16, 185, 129, 0.2)' : '#131b2c',
                      border: `1px solid ${depositMethod === method ? 'var(--accent-emerald)' : '#1e293b'}`,
                      color: depositMethod === method ? '#ffffff' : '#94a3b8',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      textAlign: 'center',
                    }}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', marginBottom: 8 }}>
                Deposit Amount (PKR):
              </label>
              <input
                type="number"
                min="100"
                step="500"
                value={depositAmount}
                onChange={(e) => setDepositAmount(Number(e.target.value))}
                className="input-field"
                placeholder="Enter deposit amount"
              />
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                {[1000, 2500, 5000, 10000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setDepositAmount(amt)}
                    style={{
                      padding: '5px 12px',
                      background: '#131b2c',
                      border: '1px solid #1e293b',
                      borderRadius: 'var(--radius-sm)',
                      color: '#cbd5e1',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                    }}
                  >
                    + PKR {amt.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleDeposit}
              disabled={isProcessing}
              className="btn btn-emerald"
              style={{ width: '100%', padding: '14px', borderRadius: 'var(--radius-md)' }}
            >
              {isProcessing ? 'Processing Transaction...' : `Deposit PKR ${depositAmount.toLocaleString()}`}
            </button>
          </div>
        ) : (
          /* Tab Content: Withdraw */
          <div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', marginBottom: 8 }}>
                Withdrawal Destination:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {(['JazzCash', 'EasyPaisa', 'Bank'] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setWithdrawMethod(method)}
                    style={{
                      padding: '12px 10px',
                      borderRadius: 'var(--radius-md)',
                      background: withdrawMethod === method ? 'rgba(99, 102, 241, 0.2)' : '#131b2c',
                      border: `1px solid ${withdrawMethod === method ? 'var(--accent-indigo)' : '#1e293b'}`,
                      color: withdrawMethod === method ? '#ffffff' : '#94a3b8',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      textAlign: 'center',
                    }}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#ffffff', marginBottom: 6 }}>
                  Account Title:
                </label>
                <input
                  type="text"
                  value={accountTitle}
                  onChange={(e) => setAccountTitle(e.target.value)}
                  className="input-field"
                  placeholder="e.g. Muhammad Junaid"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#ffffff', marginBottom: 6 }}>
                  Account / Mobile Number:
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="input-field"
                  placeholder="03001234567"
                />
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', marginBottom: 8 }}>
                Withdrawal Amount (PKR):
              </label>
              <input
                type="number"
                min="500"
                max={walletBalance}
                step="500"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                className="input-field"
                placeholder="Minimum 500 PKR"
              />
            </div>

            <button
              onClick={handleWithdraw}
              disabled={isProcessing}
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', borderRadius: 'var(--radius-md)' }}
            >
              {isProcessing ? 'Submitting Request...' : `Withdraw PKR ${withdrawAmount.toLocaleString()}`}
            </button>
          </div>
        )}

        {/* Transaction History Section */}
        <div style={{ marginTop: 32, borderTop: '1px solid #1e293b', paddingTop: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
              Recent Activity Ledger
            </h4>
            {isLoadingWallet && <Loader2 size={16} className="spinning" color="var(--accent-indigo)" />}
          </div>

          {transactions.length === 0 && !isLoadingWallet ? (
            <div style={{ textAlign: 'center', padding: '24px 0', color: '#64748b', fontSize: '0.85rem' }}>
              No transactions recorded yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {transactions.map((tx) => {
                const isPositive = tx.type === 'DEPOSIT' || tx.type === 'ORDER_PAYOUT';
                return (
                  <div
                    key={tx.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      background: '#131b2c',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid #1e293b',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#ffffff' }}>
                        {tx.description}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                        {tx.date} • {tx.type}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: '0.98rem',
                        fontWeight: 800,
                        color: isPositive ? 'var(--accent-emerald-light)' : '#f87171',
                      }}
                    >
                      {isPositive ? `+PKR ${Math.abs(tx.amount).toLocaleString()}` : `-PKR ${Math.abs(tx.amount).toLocaleString()}`}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
