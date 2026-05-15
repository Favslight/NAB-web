'use client';

import { Search, SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';

export const CATEGORIES = [
  'All',
  'Image Generation',
  'Video & Film',
  'Audio',
  'Content & Copy',
  'Builders',
  'Business Tools',
] as const;

export type ToolCategory = (typeof CATEGORIES)[number];

export interface FilterState {
  search: string;
  category: ToolCategory;
  accessibleOnly: boolean;
  featuredOnly: boolean;
}

interface ToolFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  totalCount: number;
  filteredCount: number;
}

export default function ToolFilters({ filters, onChange, totalCount, filteredCount }: ToolFiltersProps) {
  const update = (patch: Partial<FilterState>) => onChange({ ...filters, ...patch });
  const hasActiveFilters = filters.search || filters.category !== 'All' || filters.accessibleOnly || filters.featuredOnly;

  return (
    <div className="space-y-4">
      {/* Search + toggle row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search AI tools…"
            value={filters.search}
            onChange={(e) => update({ search: e.target.value })}
            className="pl-9 bg-card border-border rounded-xl focus-visible:ring-primary/30 h-10"
          />
          <AnimatePresence>
            {filters.search && (
              <motion.button
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                onClick={() => update({ search: '' })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Toggle chips */}
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => update({ accessibleOnly: !filters.accessibleOnly })}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-all duration-200
              ${filters.accessibleOnly
                ? 'border-emerald/50 bg-emerald/10 text-emerald shadow-[0_0_14px_rgba(29,184,122,0.2)]'
                : 'border-border bg-card text-muted-foreground hover:text-white hover:border-border/70'}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${filters.accessibleOnly ? 'bg-emerald' : 'bg-muted-foreground'}`} />
            Accessible
          </button>

          <button
            onClick={() => update({ featuredOnly: !filters.featuredOnly })}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-all duration-200
              ${filters.featuredOnly
                ? 'border-gold/50 bg-gold/10 text-gold shadow-[0_0_14px_rgba(251,191,36,0.2)]'
                : 'border-border bg-card text-muted-foreground hover:text-white hover:border-border/70'}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${filters.featuredOnly ? 'bg-gold' : 'bg-muted-foreground'}`} />
            Featured
          </button>
        </div>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => update({ category: cat })}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200
              ${filters.category === cat
                ? 'border-primary/50 bg-primary/10 text-primary shadow-[0_0_12px_rgba(29,184,122,0.2)]'
                : 'border-border bg-card/50 text-muted-foreground hover:text-white hover:border-border/70'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Result count + clear */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Showing <span className="text-white font-medium">{filteredCount}</span> of{' '}
          <span className="text-white font-medium">{totalCount}</span> tools
        </span>
        {hasActiveFilters && (
          <button
            onClick={() => onChange({ search: '', category: 'All', accessibleOnly: false, featuredOnly: false })}
            className="flex items-center gap-1 text-muted-foreground hover:text-white transition-colors"
          >
            <X className="w-3 h-3" />
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
