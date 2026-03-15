'use client';

import { User, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function GuestBanner() {
  const { isGuest } = useAuth();

  if (!isGuest) return null;

  return (
    <div className="bg-gradient-to-r from-cyan/20 to-emerald/20 border-b border-cyan/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-cyan/20">
              <User className="w-4 h-4 text-cyan" />
            </div>
            <div>
              <p className="text-sm text-white">
                <span className="font-semibold">Guest Mode:</span> You&apos;re previewing the dashboard.
              </p>
              <p className="text-xs text-text">
                Some features are locked. Sign up to unlock full access.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/signup"
              className="inline-flex items-center gap-1 text-sm text-emerald hover:text-emerald-light font-medium transition-colors"
            >
              Join NAB
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
