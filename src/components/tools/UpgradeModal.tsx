'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowUpRight, Zap, Crown, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { PlanTier } from '@/types';

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  targetPlan?: PlanTier;
}

const plans = [
  {
    id: 'ai_explorer',
    name: 'AI Explorer',
    icon: Star,
    color: 'cyan',
    borderColor: 'border-cyan/40',
    bgColor: 'bg-cyan/10',
    glowColor: 'shadow-[0_0_30px_rgba(0,209,255,0.2)]',
    textColor: 'text-cyan',
    features: ['Hyperrealistic AI Images', 'Community access', 'Basic training'],
  },
  {
    id: 'ai_builder',
    name: 'AI Builder',
    icon: Zap,
    color: 'emerald',
    borderColor: 'border-emerald/40',
    bgColor: 'bg-emerald/10',
    glowColor: 'shadow-[0_0_30px_rgba(29,184,122,0.2)]',
    textColor: 'text-emerald',
    features: ['Everything in Explorer', 'AI Videos', 'AI Voice Over', 'Priority support'],
    popular: true,
  },
  {
    id: 'ai_product_founder',
    name: 'AI Product Founder',
    icon: Crown,
    color: 'gold',
    borderColor: 'border-gold/40',
    bgColor: 'bg-gold/10',
    glowColor: 'shadow-[0_0_30px_rgba(251,191,36,0.2)]',
    textColor: 'text-gold',
    features: ['All 27 AI tools unlocked', 'Deep Research', 'Super Agent', 'Academies & CRM'],
  },
];

export default function UpgradeModal({ open, onClose, targetPlan }: UpgradeModalProps) {
  const router = useRouter();

  const handleUpgrade = () => {
    onClose();
    router.push('/dashboard/membership');
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-x-3 top-1/2 z-50 mx-auto max-h-[calc(100vh-1.5rem)] max-w-2xl -translate-y-1/2 overflow-y-auto
                       rounded-2xl border border-border bg-card p-4 sm:inset-x-4 sm:p-8
                       shadow-[0_0_80px_rgba(0,0,0,0.5)]"
          >
            {/* Header */}
            <div className="mb-6 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-xl font-bold font-display text-white mb-1 sm:text-2xl">
                  Unlock the{' '}
                  <span className="text-gradient">AI Launchpad</span>
                </h2>
                <p className="text-muted-foreground text-sm">
                  Upgrade your plan to access more powerful AI tools.
                </p>
              </div>
              <button
                onClick={onClose}
                className="shrink-0 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Plans */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {plans.map((plan) => {
                const Icon = plan.icon;
                const isHighlighted = targetPlan === plan.id;
                return (
                  <motion.div
                    key={plan.id}
                    whileHover={{ scale: 1.02 }}
                    className={`relative min-w-0 cursor-pointer rounded-xl border p-4 transition-all duration-300
                      ${isHighlighted ? `${plan.borderColor} ${plan.bgColor} ${plan.glowColor}` : 'border-border bg-muted/20 hover:border-border/70'}`}
                    onClick={handleUpgrade}
                  >
                    {plan.popular && (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] font-bold px-2.5 py-0.5
                                       rounded-full bg-emerald text-primary-foreground whitespace-nowrap">
                        Most Popular
                      </span>
                    )}
                    <div className={`w-9 h-9 rounded-xl ${plan.bgColor} border ${plan.borderColor} flex items-center justify-center mb-3`}>
                      <Icon className={`w-5 h-5 ${plan.textColor}`} />
                    </div>
                    <div className={`text-sm font-semibold mb-2 ${plan.textColor}`}>{plan.name}</div>
                    <ul className="space-y-1">
                      {plan.features.map((f) => (
                        <li key={f} className="text-[11px] text-muted-foreground flex items-start gap-1.5">
                          <span className={`mt-1 w-1 h-1 rounded-full ${plan.bgColor.replace('/10', '')} shrink-0`} />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                className="btn-neon flex-1 h-11 text-sm font-semibold"
                onClick={handleUpgrade}
              >
                <ArrowUpRight className="w-4 h-4 mr-2" />
                View Membership Plans
              </Button>
              <Button
                variant="ghost"
                className="sm:w-auto text-muted-foreground hover:text-white"
                onClick={onClose}
              >
                Maybe later
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
