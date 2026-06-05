'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle, MessageCircle, Mail, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/layout/Navbar';

export default function WaitlistPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex flex-1 items-center justify-center overflow-x-hidden px-3 pb-8 pt-20 sm:px-6 sm:pb-12 sm:pt-24">
        <div className="absolute inset-0 pattern-overlay opacity-30 pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-emerald/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-cyan/5 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.08 }}
          className="relative mx-auto w-full max-w-md"
        >
          <Card className="glass-strong rounded-2xl sm:rounded-3xl glow-edge border border-border/50">
            <CardContent className="p-4 text-center sm:p-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald/20 flex items-center justify-center mb-5 sm:mb-6"
              >
                <CheckCircle className="text-emerald" size={32} />
              </motion.div>

              <h1 className="text-xl sm:text-2xl font-bold font-display text-white mb-3">
                Welcome to NAB!
              </h1>

              <p className="text-text text-sm sm:text-base mb-6">
                Your application has been received and is being reviewed.
                We&apos;ll notify you via email once approved.
              </p>

              {/* WhatsApp Community Link */}
              <a
                href="https://chat.whatsapp.com/JNTQ9U1ixDZ2xL8tG1a3ED"
                target="_blank"
                rel="noopener noreferrer"
                className="mb-6 block w-full rounded-xl border border-emerald/30 bg-emerald/10 p-3 transition-colors hover:bg-emerald/20 sm:p-4"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="p-2 rounded-full bg-emerald/20 shrink-0">
                    <MessageCircle className="text-emerald" size={20} />
                  </div>
                  <div className="min-w-0 text-left">
                    <p className="text-emerald font-medium text-sm sm:text-base">Join our WhatsApp Community</p>
                    <p className="text-text/60 text-xs sm:text-sm">Stay updated while you wait</p>
                  </div>
                </div>
              </a>

              <div className="border-t border-border pt-5">
                <p className="text-text/50 text-xs sm:text-sm mb-2">Questions?</p>
                <a
                  href="mailto:support@aibuilders.ng"
                  className="inline-flex items-center gap-1.5 text-emerald text-sm hover:text-emerald/80 transition-colors"
                >
                  <Mail size={14} />
                  <span>support@aibuilders.ng</span>
                </a>
              </div>

              <div className="mt-6">
                <Link href="/">
                  <Button variant="outline" className="w-full border-border text-sm sm:w-auto">
                    <ArrowLeft size={16} className="mr-2" />
                    Back to Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}
