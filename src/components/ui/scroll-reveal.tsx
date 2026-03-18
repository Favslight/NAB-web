'use client';

import { motion, type HTMLMotionProps, type Target } from 'framer-motion';

const defaultTransition = { duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] };

export type RevealVariant = 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade';

const variantInitial = (variant: RevealVariant, y = 48, x = 48): Target => {
  switch (variant) {
    case 'up':
      return { opacity: 0, y };
    case 'down':
      return { opacity: 0, y: -y };
    case 'left':
      return { opacity: 0, x };
    case 'right':
      return { opacity: 0, x: -x };
    case 'scale':
      return { opacity: 0, scale: 0.88 };
    case 'fade':
    default:
      return { opacity: 0 };
  }
};

const variantAnimate = (variant: RevealVariant): Target => {
  switch (variant) {
    case 'up':
    case 'down':
      return { opacity: 1, y: 0 };
    case 'left':
    case 'right':
      return { opacity: 1, x: 0 };
    case 'scale':
      return { opacity: 1, scale: 1 };
    case 'fade':
    default:
      return { opacity: 1 };
  }
};

interface ScrollRevealProps extends Omit<HTMLMotionProps<'section'>, 'initial' | 'whileInView'> {
  /** Entrance direction/effect */
  variant?: RevealVariant;
  /** Delay before animation starts (seconds) */
  delay?: number;
  /** Offset for entrance (px) - used for up/down/left/right */
  y?: number;
  x?: number;
  /** Fade only (legacy, prefer variant="fade") */
  fadeOnly?: boolean;
  /** Amount of element visible to trigger (0-1) */
  amount?: number;
  /** Viewport margin so trigger happens when section is slightly in view (e.g. "0px 0px -80px 0px") */
  margin?: string;
  /** If true, animate on mount (for hero/first section so fade-in is visible on load) */
  animateOnMount?: boolean;
  /** If false, animation runs every time section enters viewport (scroll down and scroll up). Default false. */
  once?: boolean;
}

export function ScrollReveal({
  children,
  className,
  variant: variantProp,
  delay = 0,
  y = 48,
  x = 48,
  fadeOnly = false,
  amount = 0.08,
  margin = '0px 0px -60px 0px',
  animateOnMount = false,
  once = false,
  transition,
  ...rest
}: ScrollRevealProps) {
  const variant = fadeOnly ? 'fade' : (variantProp ?? 'up');
  const initial = variantInitial(variant, y, x);
  const animate = variantAnimate(variant);

  return (
    <motion.section
      initial={initial}
      {...(animateOnMount
        ? { animate }
        : { whileInView: animate, viewport: { once, amount, margin } })}
      transition={{
        ...defaultTransition,
        delay,
        ...transition,
      }}
      className={className}
      {...rest}
    >
      {children}
    </motion.section>
  );
}
