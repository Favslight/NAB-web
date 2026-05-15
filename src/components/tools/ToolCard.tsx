'use client';

import { motion } from 'framer-motion';
import {
  ImageIcon, Video, Mic2, Music, BookOpen, Megaphone, MessageSquare,
  Headphones, Star, PenTool, ScanLine, GraduationCap, Radio, AppWindow,
  Search, UserCheck, Wand2, Bot, MessagesSquare, FileText, Scissors,
  ClipboardList, Database, Library, PenLine, Film, Zap, LayoutGrid,
} from 'lucide-react';
import { AiTool, PlanTier } from '@/types';
import PlanBadge from './PlanBadge';
import LockedOverlay from './LockedOverlay';
import LaunchButton from './LaunchButton';

// Icon map keyed by tool slug
const ICON_MAP: Record<string, React.ElementType> = {
  'hyperrealistic-ai-images': ImageIcon,
  'ai-spokesperson':          UserCheck,
  'ai-videos':                Video,
  'ai-movies':                Film,
  'ai-voice-over':            Mic2,
  'aeo-funnels':              Zap,
  'conversational-images':    MessageSquare,
  'ai-music-generator':       Music,
  'audiobook-maker':          Headphones,
  'scroll-stopping-ads':      Megaphone,
  'hero-images':              Star,
  'logo-maker':               PenTool,
  'precision-image-model':    ScanLine,
  'academy-app-wizard':       GraduationCap,
  'live-training-wizard':     Radio,
  'external-app-wizard':      AppWindow,
  'deep-research':            Search,
  'humanizer':                BookOpen,
  'ai-image-editor':          Wand2,
  'super-agent':              Bot,
  'chatwizard':               MessagesSquare,
  'aeo-blogs':                FileText,
  'movie-editor':             Scissors,
  'ai-forms':                 ClipboardList,
  'easy-crm':                 Database,
  'academies':                Library,
  'copywriters':              PenLine,
};

// Glow map per plan
const PLAN_GLOW: Record<PlanTier, string> = {
  ai_explorer: 'group-hover:shadow-[0_0_28px_rgba(0,209,255,0.18)] group-hover:border-cyan/30',
  ai_builder:  'group-hover:shadow-[0_0_28px_rgba(29,184,122,0.18)] group-hover:border-emerald/30',
  ai_product_founder:  'group-hover:shadow-[0_0_28px_rgba(251,191,36,0.18)] group-hover:border-gold/30',
  standard_member: 'group-hover:shadow-[0_0_28px_rgba(59,130,246,0.18)] group-hover:border-blue/30',
};

const PLAN_ICON_BG: Record<PlanTier, string> = {
  ai_explorer: 'bg-cyan/10 border-cyan/20 text-cyan',
  ai_builder:  'bg-emerald/10 border-emerald/20 text-emerald',
  ai_product_founder:  'bg-gold/10 border-gold/20 text-gold',
  standard_member: 'bg-blue/10 border-blue/20 text-blue',
};

const CATEGORY_COLOR: Record<string, string> = {
  'Image Generation': 'text-cyan',
  'Video & Film':     'text-purple-400',
  'Audio':            'text-pink-400',
  'Content & Copy':   'text-blue',
  'Builders':         'text-emerald',
  'Business Tools':   'text-gold',
};

interface ToolCardProps {
  tool: AiTool;
  index: number;
  onUpgrade: (plan: PlanTier) => void;
}

export default function ToolCard({ tool, index, onUpgrade }: ToolCardProps) {
  const Icon = ICON_MAP[tool.slug] ?? LayoutGrid;
  const plan = tool.required_plan as PlanTier;
  const planGlow = PLAN_GLOW[plan] ?? PLAN_GLOW.ai_product_founder;
  const iconBg   = PLAN_ICON_BG[plan] ?? PLAN_ICON_BG.ai_product_founder;
  const catColor = CATEGORY_COLOR[tool.category] ?? 'text-muted-foreground';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, delay: index * 0.04, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`group relative rounded-xl border border-border bg-card/70 backdrop-blur-sm
                  transition-all duration-300 overflow-hidden flex flex-col ${planGlow}`}
    >
      {/* Ambient top glow strip */}
      <div className={`absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500
        ${plan === 'ai_explorer' ? 'bg-gradient-to-r from-transparent via-cyan/60 to-transparent' :
          plan === 'ai_builder'  ? 'bg-gradient-to-r from-transparent via-emerald/60 to-transparent' :
          plan === 'standard_member' ? 'bg-gradient-to-r from-transparent via-blue/60 to-transparent' :
                                'bg-gradient-to-r from-transparent via-gold/60 to-transparent'}`}
      />

      {/* Card body */}
      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${iconBg}
                          group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-5 h-5" />
          </div>
          <PlanBadge plan={plan} size="sm" />
        </div>

        {/* Name & category */}
        <div className="flex-1">
          <h3 className="font-semibold text-white text-sm leading-snug mb-1 group-hover:text-gradient transition-all duration-300">
            {tool.name}
          </h3>
          <span className={`text-[11px] font-medium uppercase tracking-wider ${catColor}`}>
            {tool.category}
          </span>
          {tool.description && (
            <p className="text-[12px] text-muted-foreground mt-2 leading-relaxed line-clamp-2">
              {tool.description}
            </p>
          )}
        </div>

        {/* Launch button */}
        {tool.launchable && !tool.locked && (
          <LaunchButton slug={tool.slug} label="Launch" className="w-full justify-center mt-auto" />
        )}
      </div>

      {/* Locked overlay */}
      {tool.locked && (
        <LockedOverlay requiredPlan={plan} onUpgrade={() => onUpgrade(plan)} />
      )}
    </motion.div>
  );
}
