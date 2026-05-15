'use client';

import { Lock, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { PlanTier } from '@/types';
import PlanBadge from './PlanBadge';

interface LockedOverlayProps {
  requiredPlan: PlanTier;
  onUpgrade: () => void;
}

export default function LockedOverlay({ requiredPlan, onUpgrade }: LockedOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl
                 bg-background/70 backdrop-blur-[3px] cursor-pointer group"
      onClick={onUpgrade}
    >
      {/* Lock icon */}
      <motion.div
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center mb-3
                   shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover:border-gold/40 transition-colors"
      >
        <Lock className="w-5 h-5 text-muted-foreground group-hover:text-gold transition-colors" />
      </motion.div>

      {/* Required plan */}
      <PlanBadge plan={requiredPlan} size="sm" className="mb-3" />

      {/* Upgrade button */}
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full
                   border border-gold/40 text-gold bg-gold/10 hover:bg-gold/20
                   shadow-[0_0_14px_rgba(251,191,36,0.2)] hover:shadow-[0_0_22px_rgba(251,191,36,0.35)]
                   transition-all duration-300"
        onClick={(e) => { e.stopPropagation(); onUpgrade(); }}
      >
        Upgrade to unlock
        <ArrowUpRight className="w-3 h-3" />
      </motion.button>
    </motion.div>
  );
}
