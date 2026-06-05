'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Rocket, Sparkles, ArrowUpRight, Zap, Crown, Star,
  Lock, Unlock, RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { toolsApi } from '@/lib/api';
import { AiTool, PlanTier } from '@/types';
import ToolGrid from '@/components/tools/ToolGrid';
import ToolFilters, { FilterState, ToolCategory } from '@/components/tools/ToolFilters';
import PlanBadge from '@/components/tools/PlanBadge';
import UpgradeModal from '@/components/tools/UpgradeModal';
import toast from 'react-hot-toast';

const PLAN_META: Record<PlanTier, { label: string; icon: typeof Star; color: string }> = {
  ai_explorer: { label: 'AI Explorer',          icon: Star,  color: 'text-cyan' },
  ai_builder:  { label: 'AI Builder',           icon: Zap,   color: 'text-emerald' },
  ai_product_founder:  { label: 'AI Product Founder',   icon: Crown, color: 'text-gold' },
};

const PLAN_ACCESS: Record<PlanTier, PlanTier[]> = {
  ai_explorer: ['ai_explorer'],
  ai_builder: ['ai_explorer', 'ai_builder'],
  ai_product_founder: ['ai_explorer', 'ai_builder', 'ai_product_founder'],
};

function getRequiredPlan(tool: AiTool): PlanTier {
  return (tool.requiredPlan ?? tool.required_plan ?? 'ai_product_founder') as PlanTier;
}

function applyPlanLocks(tools: AiTool[], userPlan: PlanTier): AiTool[] {
  const unlockedPlans = PLAN_ACCESS[userPlan] ?? PLAN_ACCESS.ai_explorer;

  return tools.map((tool) => {
    const requiredPlan = getRequiredPlan(tool);
    const isUnlocked = unlockedPlans.includes(requiredPlan);

    return {
      ...tool,
      locked: !isUnlocked,
      launchable: Boolean(tool.launchable && isUnlocked),
    };
  });
}

// ── Main Page ───────────────────────────────────────────────────────────────
export default function ToolsPage() {
  const { user } = useAuth();
  const [tools, setTools]               = useState<AiTool[]>([]);
  const [loading, setLoading]           = useState(true);
  const [upgradeOpen, setUpgradeOpen]   = useState(false);
  const [upgradePlan, setUpgradePlan]   = useState<PlanTier>('ai_product_founder');
  const [filters, setFilters]           = useState<FilterState>({
    search: '', category: 'All', accessibleOnly: false, featuredOnly: false,
  });

  const userPlan = user?.membership?.plan_type ?? user?.membership_plan_type ?? 'ai_explorer';

  // ── Load tools ──────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const toolsResponse = await toolsApi.getTools();
        if (toolsResponse.success && toolsResponse.data) {
          setTools(applyPlanLocks(toolsResponse.data, userPlan));
        } else {
          setTools([]);
        }
      } catch {
        setTools([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userPlan]);

  // ── Filtering ────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return tools.filter((t) => {
      if (filters.search && !t.name.toLowerCase().includes(filters.search.toLowerCase()) &&
          !t.description?.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.category !== 'All' && t.category !== filters.category) return false;
      if (filters.accessibleOnly && t.locked) return false;
      if (filters.featuredOnly && !t.featured) return false;
      return true;
    });
  }, [tools, filters]);

  const accessibleCount = tools.filter((t) => !t.locked).length;
  const planMeta = PLAN_META[userPlan];

  const handleUpgrade = (plan: PlanTier) => {
    setUpgradePlan(plan);
    setUpgradeOpen(true);
  };

  return (
    <ProtectedRoute>
      <div className="relative min-h-screen">

        {/* ── Ambient background glows ──────────────────────────────────── */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
          <motion.div
            animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full
                       bg-emerald/5 blur-[100px]"
          />
          <div className="absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: 'linear-gradient(rgba(29,184,122,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(29,184,122,0.5) 1px, transparent 1px)', backgroundSize: '48px 48px' }}
          />
        </div>

        <div className="responsive-page max-w-7xl mx-auto">

          {/* ── Hero section ──────────────────────────────────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative rounded-2xl overflow-hidden border border-border bg-card/50
                       backdrop-blur-sm p-4 sm:p-6 lg:p-10"
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald/50 to-transparent" />

            <div className="relative flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10">
              <div className="flex-1 min-w-0">
                <motion.div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald/30 bg-emerald/10">
                    <span className="text-xs font-semibold text-emerald tracking-wider uppercase">
                      Powered by Deal.ai
                    </span>
                  </div>
                </motion.div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-display text-white mb-3 leading-tight">
                  AI <span className="text-gradient">Launchpad</span>
                </h1>
                <p className="text-muted-foreground text-base sm:text-lg max-w-xl leading-relaxed">
                  Access powerful AI tools built for the next generation of <span className="text-white font-medium">African innovators.</span>
                </p>
              </div>

              <div className="grid w-full grid-cols-1 min-[380px]:grid-cols-2 sm:grid-cols-3 lg:min-w-[320px] lg:grid-cols-2 xl:grid-cols-3 gap-3">
                <div className="col-span-2 sm:col-span-1 lg:col-span-2 xl:col-span-1 rounded-xl border border-border bg-background/60 p-4">
                  <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wider font-medium">Your Plan</div>
                  <div className="flex items-center gap-2">
                    <planMeta.icon className={`w-5 h-5 ${planMeta.color}`} />
                    <PlanBadge plan={userPlan} size="md" showDot={false} />
                  </div>
                </div>

                <div className="rounded-xl border border-emerald/20 bg-emerald/5 p-4">
                  <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-medium">Unlocked</div>
                  <div className="flex items-end gap-1">
                    <span className="text-3xl font-bold font-display text-emerald leading-none">{loading ? '—' : accessibleCount}</span>
                    <span className="text-sm text-muted-foreground mb-0.5">/ {tools.length}</span>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-background/60 p-4">
                  <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-medium">Locked</div>
                  <div className="flex items-end gap-1">
                    <span className="text-3xl font-bold font-display text-muted-foreground leading-none">{loading ? '—' : tools.length - accessibleCount}</span>
                    <Lock className="w-4 h-4 text-muted-foreground mb-0.5" />
                  </div>
                </div>

                {userPlan !== 'ai_product_founder' && (
                  <div className="col-span-2 sm:col-span-3 lg:col-span-2 xl:col-span-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleUpgrade('ai_product_founder')}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4
                                 rounded-xl border border-gold/40 bg-gold/10 text-gold font-semibold text-sm
                                 hover:bg-gold/20 hover:shadow-[0_0_28px_rgba(251,191,36,0.25)]
                                 transition-all duration-300"
                    >
                      <Crown className="w-4 h-4" />
                      Unlock All 27 Tools
                      <ArrowUpRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                )}
              </div>
            </div>
          </motion.section>

          <motion.section className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-4 sm:p-6">
            <ToolFilters
              filters={filters}
              onChange={setFilters}
              totalCount={tools.length}
              filteredCount={filtered.length}
            />
          </motion.section>

          <motion.section>
            <ToolGrid tools={filtered} onUpgrade={handleUpgrade} loading={loading} />
          </motion.section>
          <div className="h-20 lg:h-4" />
        </div>

        {userPlan !== 'ai_product_founder' && (
          <motion.div className="fixed bottom-4 left-4 right-4 z-40 lg:hidden">
            <button
              onClick={() => handleUpgrade('ai_product_founder')}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl
                         bg-gradient-to-r from-gold/90 to-amber-400/90 text-background font-bold text-sm
                         shadow-[0_8px_32px_rgba(251,191,36,0.4)] backdrop-blur-sm"
            >
              <Crown className="w-4 h-4" />
              Unlock All 27 AI Tools
            </button>
          </motion.div>
        )}

        <UpgradeModal
          open={upgradeOpen}
          onClose={() => setUpgradeOpen(false)}
          targetPlan={upgradePlan}
        />
      </div>
    </ProtectedRoute>
  );
}
