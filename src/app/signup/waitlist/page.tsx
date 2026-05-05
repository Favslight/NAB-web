'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Mail, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/layout/Navbar';

export default function WaitlistPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center pt-20 sm:pt-24 pb-8 sm:pb-12 px-3 sm:px-4">
        <div className="absolute inset-0 pattern-overlay opacity-30 pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan/5 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.08 }}
          className="relative w-full max-w-md mx-auto min-w-0"
        >
          <Card className="glass-strong rounded-2xl sm:rounded-3xl glow-edge border border-border/50">
            <CardContent className="p-6 sm:p-8 md:p-10 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                className="mx-auto w-20 h-20 rounded-full bg-emerald/20 flex items-center justify-center mb-6"
              >
                <CheckCircle className="text-emerald" size={40} />
              </motion.div>

              <h1 className="text-2xl sm:text-3xl font-bold font-display text-white mb-4">
                You&apos;re on the Waitlist!
              </h1>

              <p className="text-text mb-6">
                Thank you for joining our waitlist. Your account is pending admin approval.
                You&apos;ll receive an email notification once approved.
              </p>

              <div className="flex items-center justify-center gap-2 text-sm text-text/60 mb-2">
                <Clock size={16} />
                <span>Expected review within 24-48 hours</span>
              </div>

              <div className="border-t border-border pt-6 mt-6">
                <p className="text-text/60 text-sm mb-2">Need assistance?</p>
                <a
                  href="mailto:support@aibuilders.ng"
                  className="inline-flex items-center gap-2 text-emerald hover:text-emerald/80 transition-colors"
                >
                  <Mail size={16} />
                  <span>support@aibuilders.ng</span>
                </a>
              </div>

              <div className="mt-8">
                <Link href="/">
                  <Button variant="outline" className="border-border">
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
