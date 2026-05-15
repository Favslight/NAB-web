'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid } from 'lucide-react';
import { AiTool, PlanTier } from '@/types';
import ToolCard from './ToolCard';

interface ToolGridProps {
  tools: AiTool[];
  onUpgrade: (plan: PlanTier) => void;
  loading?: boolean;
}

// Skeleton card for loading state
function SkeletonCard() {
  return (
    <div className="rounded-xl border border-border bg-card/50 p-5 animate-pulse">
      <div className="flex justify-between mb-4">
        <div className="w-11 h-11 rounded-xl bg-muted" />
        <div className="w-20 h-5 rounded-full bg-muted" />
      </div>
      <div className="w-3/4 h-4 rounded bg-muted mb-2" />
      <div className="w-1/3 h-3 rounded bg-muted mb-3" />
      <div className="w-full h-3 rounded bg-muted mb-1.5" />
      <div className="w-5/6 h-3 rounded bg-muted mb-4" />
      <div className="w-full h-9 rounded-lg bg-muted" />
    </div>
  );
}

export default function ToolGrid({ tools, onUpgrade, loading }: ToolGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (tools.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-muted/50 border border-border flex items-center justify-center mb-4">
          <LayoutGrid className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-white font-medium mb-1">No tools found</p>
        <p className="text-sm text-muted-foreground">Try adjusting your filters or search query.</p>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        {tools.map((tool, index) => (
          <ToolCard
            key={tool.id}
            tool={tool}
            index={index}
            onUpgrade={onUpgrade}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
