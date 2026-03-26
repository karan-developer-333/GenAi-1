'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ScrollReveal, StaggerReveal, StaggerItem } from '@/components/animations/ScrollReveal';
import { cn } from '@/lib/utils';

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: { monthly: 0, annual: 0 },
    description: 'Perfect to get started and explore.',
    color: '#6b7280',
    features: [
      '100 saves / month',
      'Basic AI tagging',
      'Semantic search',
      'Browser extension',
      '7-day history',
    ],
    cta: 'Start free',
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: { monthly: 12, annual: 9 },
    description: 'For serious knowledge workers.',
    color: '#b8860b',
    features: [
      'Unlimited saves',
      'Advanced AI tagging + clusters',
      'Knowledge graph',
      'Memory resurfacing',
      'Highlights & summaries',
      'Collections',
      'API access',
    ],
    cta: 'Get Pro',
    popular: true,
  },
  {
    id: 'team',
    name: 'Team',
    price: { monthly: 29, annual: 22 },
    description: 'Shared knowledge for your whole team.',
    color: '#7d9a78',
    features: [
      'Everything in Pro',
      'Shared team library',
      'Collaborative graph',
      'Admin dashboard',
      'SSO / SAML',
      'Priority support',
    ],
    cta: 'Contact sales',
    popular: false,
  },
];

export default function PricingSection() {
  const [annual, setAnnual] = useState(true);

  return (
    <section
      id="pricing"
      aria-label="Pricing"
      className="relative section-padding bg-[var(--bg-base)] overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(212,168,83,0.08) 0%, transparent 65%)',
          filter: 'blur(40px)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <ScrollReveal>
            <h2 className="section-title">
              Simple, transparent{' '}
              <span className="text-gradient-gold">pricing</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <p className="section-subtitle mt-6 mx-auto">
              Start free, upgrade when you need more.
            </p>
          </ScrollReveal>

          {/* Toggle */}
          <ScrollReveal delay={0.15}>
            <div className="inline-flex items-center gap-2 mt-10 p-1.5 rounded-full bg-white border border-[var(--border-light)] shadow-sm">
              <button
                id="pricing-monthly"
                onClick={() => setAnnual(false)}
                className={cn(
                  'px-5 py-2 rounded-full text-sm font-medium transition-all duration-200',
                  !annual ? 'bg-[var(--amber-primary)] text-white shadow-md' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                )}
              >
                Monthly
              </button>
              <button
                id="pricing-annual"
                onClick={() => setAnnual(true)}
                className={cn(
                  'flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200',
                  annual ? 'bg-[var(--amber-primary)] text-white shadow-md' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                )}
              >
                Annual
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  -25%
                </span>
              </button>
            </div>
          </ScrollReveal>
        </div>

        {/* Cards */}
        <StaggerReveal stagger={0.1} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {PLANS.map((plan) => (
            <StaggerItem key={plan.id}>
              <motion.div
                className={cn(
                  'relative rounded-2xl p-7 overflow-hidden transition-all duration-300',
                  plan.popular
                    ? 'pricing-card-popular'
                    : 'pricing-card'
                )}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
              >
                {plan.popular && (
                  <div 
                    className="absolute top-0 left-0 right-0 h-px"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(184,134,11,0.6), rgba(212,168,83,0.6), transparent)',
                    }}
                  />
                )}

                {plan.popular && (
                  <div className="absolute top-5 right-5">
                    <span className="px-3 py-1.5 rounded-full text-[10px] font-semibold bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Plan name */}
                <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: plan.color }}>
                  {plan.name}
                </p>

                {/* Price */}
                <div className="mt-4 flex items-end gap-1">
                  <span className="text-5xl font-bold text-[var(--text-primary)]">
                    ${annual ? plan.price.annual : plan.price.monthly}
                  </span>
                  {plan.price.monthly > 0 && (
                    <span className="text-sm text-[var(--text-muted)] mb-2">/mo</span>
                  )}
                </div>
                <p className="text-sm text-[var(--text-muted)] mt-2">{plan.description}</p>

                {/* CTA */}
                <a
                  href="#"
                  id={`pricing-cta-${plan.id}`}
                  className={cn(
                    'mt-7 block w-full py-3 text-center text-sm font-semibold rounded-xl transition-all duration-200',
                    plan.popular
                      ? 'btn-primary'
                      : 'bg-white border border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--border-warm)] hover:shadow-sm'
                  )}
                >
                  {plan.cta}
                </a>

                {/* Divider */}
                <div className="border-t border-[var(--border-light)] mt-7 pt-6">
                  <ul className="space-y-3">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                        <div 
                          className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                          style={{ background: `${plan.color}15` }}
                        >
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5l2.5 2.5 3.5-4" stroke={plan.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
