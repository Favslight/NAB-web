'use client';

import { useState } from 'react';
import { Rocket, ExternalLink, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toolsApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface LaunchButtonProps {
  slug: string;
  label?: string;
  className?: string;
}

export default function LaunchButton({ slug, label = 'Launch Tool', className }: LaunchButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleLaunch = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoading(true);
    try {
      const res = await toolsApi.launchTool(slug);
      if (res.success && res.data?.launchUrl) {
        window.open(res.data.launchUrl, '_blank', 'noopener,noreferrer');
      } else {
        throw new Error(res.error || 'Could not get launch URL');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Launch failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={handleLaunch}
      disabled={loading}
      className={`
        relative overflow-hidden flex items-center gap-2 px-4 py-2 rounded-lg
        text-sm font-semibold text-primary-foreground
        bg-primary hover:shadow-[0_0_24px_rgba(29,184,122,0.45)]
        disabled:opacity-60 disabled:cursor-not-allowed
        transition-all duration-300
        ${className ?? ''}
      `}
    >
      {/* Shimmer */}
      <span className="absolute inset-0 translate-x-[-110%] hover:translate-x-[110%] transition-transform duration-700
                       bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Rocket className="w-4 h-4" />
      )}
      {loading ? 'Launching…' : label}
      {!loading && <ExternalLink className="w-3 h-3 opacity-70" />}
    </motion.button>
  );
}
