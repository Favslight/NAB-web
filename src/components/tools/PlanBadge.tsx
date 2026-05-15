'use client';

import { cn } from '@/lib/utils';
import { PlanTier } from '@/types';

const PLAN_CONFIG: Record<PlanTier, { label: string; color: string; glow: string; dot: string }> = {
  standard_member: {
    label: 'Standard Member',
    color: 'border-blue/40 text-blue bg-blue/10',
    glow: 'shadow-[0_0_12px_rgba(59,130,246,0.2)]',
    dot: 'bg-blue',
  },
  ai_explorer: {
    label: 'AI Explorer',
    color: 'border-cyan/40 text-cyan bg-cyan/10',
    glow: 'shadow-[0_0_12px_rgba(0,209,255,0.25)]',
    dot: 'bg-cyan',
  },
  ai_builder: {
    label: 'AI Builder',
    color: 'border-emerald/40 text-emerald bg-emerald/10',
    glow: 'shadow-[0_0_12px_rgba(29,184,122,0.25)]',
    dot: 'bg-emerald',
  },
  ai_product_founder: {
    label: 'AI Product Founder',
    color: 'border-gold/40 text-gold bg-gold/10',
    glow: 'shadow-[0_0_12px_rgba(251,191,36,0.25)]',
    dot: 'bg-gold',
  },
};

interface PlanBadgeProps {
  plan: PlanTier;
  size?: 'sm' | 'md';
  showDot?: boolean;
  className?: string;
}

export default function PlanBadge({ plan, size = 'sm', showDot = true, className }: PlanBadgeProps) {
  const config = PLAN_CONFIG[plan] ?? PLAN_CONFIG['ai_product_founder'];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium tracking-wide whitespace-nowrap',
        config.color,
        config.glow,
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs',
        className
      )}
    >
      {showDot && (
        <span className={cn('rounded-full shrink-0', config.dot, size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2')} />
      )}
      {config.label}
    </span>
  );
}

export { PLAN_CONFIG };
