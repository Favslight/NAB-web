'use client';

import { motion } from 'framer-motion';
import { Children, isValidElement, type ReactNode } from 'react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

interface StaggerRevealProps {
  children: ReactNode;
  className?: string;
  amount?: number;
  once?: boolean;
}

export function StaggerReveal({ children, className = '', amount = 0.08, once = false }: StaggerRevealProps) {
  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ amount, once, margin: '0px 0px -40px 0px' }}
    >
      {Children.map(children, (child, index) =>
        isValidElement(child) ? (
          <motion.div key={index} variants={itemVariants}>
            {child}
          </motion.div>
        ) : (
          child
        )
      )}
    </motion.div>
  );
}
