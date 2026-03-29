'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

// ── Button ──────────────────────────────────────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'premium';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export function Button({ variant = 'primary', size = 'md', loading, className, children, disabled, ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-150 focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  const variants = {
    primary: 'bg-brand-500 text-white hover:bg-brand-600 focus-visible:ring-brand-500 shadow-sm',
    secondary: 'bg-surface-100 text-brand-900 hover:bg-surface-200 border border-surface-200',
    ghost: 'text-brand-900/70 hover:bg-surface-100 hover:text-brand-900',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500',
    premium: 'bg-gradient-to-r from-gold-500 to-gold-600 text-white hover:from-gold-600 hover:to-gold-700 shadow-sm',
  };
  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3 gap-2.5',
  };

  return (
    <button className={cn(base, variants[variant], sizes[size], className)} disabled={disabled || loading} {...props}>
      {loading && <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
      {children}
    </button>
  );
}

// ── Badge ───────────────────────────────────────────────────────────────────
interface BadgeProps {
  variant?: 'default' | 'premium' | 'success' | 'warning' | 'danger' | 'info';
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  const variants = {
    default: 'bg-surface-100 text-brand-900/70 border-surface-200',
    premium: 'bg-gold-50 text-gold-700 border-gold-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
  };
  return (
    <span className={cn('inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border', variants[variant], className)}>
      {children}
    </span>
  );
}

// ── Card ────────────────────────────────────────────────────────────────────
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ children, className, hover, padding = 'md' }: CardProps) {
  const pads = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-8' };
  return (
    <div className={cn(hover ? 'card-hover' : 'card', pads[padding], className)}>
      {children}
    </div>
  );
}

// ── Tabs ────────────────────────────────────────────────────────────────────
interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div className={cn('flex gap-1 p-1 rounded-xl bg-surface-100', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => !tab.disabled && onChange(tab.id)}
          disabled={tab.disabled}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150',
            activeTab === tab.id
              ? 'bg-white text-brand-900 shadow-sm'
              : 'text-brand-900/50 hover:text-brand-900/70',
            tab.disabled && 'opacity-40 cursor-not-allowed'
          )}
        >
          {tab.icon}
          {tab.label}
          {tab.badge && <Badge variant="info">{tab.badge}</Badge>}
        </button>
      ))}
    </div>
  );
}

// ── Progress Bar ────────────────────────────────────────────────────────────
interface ProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  showLabel?: boolean;
  className?: string;
}

export function Progress({ value, max = 100, size = 'md', color = 'bg-brand-500', showLabel, className }: ProgressProps) {
  const pct = Math.min((value / max) * 100, 100);
  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' };
  return (
    <div className={cn('w-full', className)}>
      <div className={cn('w-full rounded-full bg-surface-100 overflow-hidden', heights[size])}>
        <div className={cn('h-full rounded-full transition-all duration-500 ease-out', color)} style={{ width: `${pct}%` }} />
      </div>
      {showLabel && <span className="text-xs text-brand-900/50 mt-1 block">{Math.round(pct)}%</span>}
    </div>
  );
}

// ── Modal ───────────────────────────────────────────────────────────────────
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-brand-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className={cn('relative bg-white rounded-2xl shadow-elevated max-w-lg w-full mx-4 animate-scale-in', className)}>
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-surface-100 text-brand-900/40 hover:text-brand-900">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ── Premium Gate ────────────────────────────────────────────────────────────
interface PremiumGateProps {
  isPremium: boolean;
  featureName: string;
  children: React.ReactNode;
}

export function PremiumGate({ isPremium, featureName, children }: PremiumGateProps) {
  const [showModal, setShowModal] = useState(false);

  if (isPremium) return <>{children}</>;

  return (
    <>
      <div className="relative">
        <div className="premium-lock pointer-events-none select-none opacity-60">
          {children}
        </div>
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gold-50 border border-gold-200 flex items-center justify-center">
              <svg className="w-8 h-8 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <h3 className="text-lg font-bold text-brand-900 mb-1">{featureName}</h3>
            <p className="text-sm text-brand-900/50 mb-4">Unlock with Premium</p>
            <Button variant="premium" onClick={() => setShowModal(true)}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l3.057-3L12 3.5 15.943 0 19 3l-7 7-7-7z" /></svg>
              Upgrade to Premium
            </Button>
          </div>
        </div>
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Upgrade to Premium">
        <div className="space-y-4">
          <p className="text-brand-900/70">Get full access to {featureName} and all premium features.</p>
          <div className="grid gap-3">
            {[
              { label: 'Monthly', price: '$29/mo', id: 'monthly' },
              { label: 'Quarterly', price: '$69/qtr', id: 'quarterly', popular: true },
              { label: 'Annual', price: '$199/yr', id: 'annual' },
            ].map((plan) => (
              <button key={plan.id} className={cn('card-hover p-4 text-left flex items-center justify-between', plan.popular && 'border-gold-300 bg-gold-50/50')}>
                <div>
                  <span className="font-semibold text-brand-900">{plan.label}</span>
                  {plan.popular && <Badge variant="premium" className="ml-2">Best Value</Badge>}
                </div>
                <span className="font-bold text-lg">{plan.price}</span>
              </button>
            ))}
          </div>
          <Button variant="premium" size="lg" className="w-full">Subscribe with PayPal</Button>
        </div>
      </Modal>
    </>
  );
}

// ── Empty State ─────────────────────────────────────────────────────────────
interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-surface-100 flex items-center justify-center text-brand-900/30 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-brand-900 mb-1">{title}</h3>
      <p className="text-sm text-brand-900/50 max-w-sm mb-6">{description}</p>
      {action}
    </div>
  );
}

// ── Stat Card ───────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  iconBg?: string;
}

export function StatCard({ label, value, change, changeType = 'neutral', icon, iconBg = 'bg-brand-50' }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="flex items-center justify-between mb-3">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', iconBg)}>
          {icon}
        </div>
        {change && (
          <span className={cn(changeType === 'up' ? 'stat-change-up' : changeType === 'down' ? 'stat-change-down' : 'text-brand-900/40 text-xs')}>
            {changeType === 'up' ? '↑' : changeType === 'down' ? '↓' : ''} {change}
          </span>
        )}
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
