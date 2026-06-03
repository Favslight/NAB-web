'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

import { Eye, EyeOff, User, Mail, Phone, MapPin, Briefcase, Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/layout/Navbar';
import { useAuth } from '@/context/AuthContext';
import { nigerianStates, professions } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    state: '',
    profession: '',
    password: '',
    referral_code: '',
  });
  
  const { register } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const referralCode = params.get('ref') || '';
    if (referralCode) {
      setFormData((current) => ({ ...current, referral_code: referralCode }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await register({
        ...formData,
        referral_code: formData.referral_code.trim() || undefined,
      });
      
      // Show backend message
      if (result?.message) {
        toast.success(result.message);
      }
      
      // Handle different user scenarios
      if (result?.pendingApproval) {
        // Admin approval required - redirect to waitlist page
        router.push('/signup/waitlist');
      } else if (result?.userRole === 'state_admin') {
        // First user in state - auto state_admin, no payment needed
        toast.success('You are now the State Admin for your region!');
        router.push('/dashboard');
      } else if (result?.requiresPayment) {
        // Regular user with membership fee enabled - redirect to payment
        toast.success('Please complete payment to activate your membership');
        router.push('/dashboard/payment');
      } else {
        // Free membership or already member - go to dashboard
        toast.success('Welcome to NAB!');
        router.push('/dashboard');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background flex flex-col overflow-x-hidden">
      <Navbar />
      <div className="flex-1 flex items-center justify-center pt-16 sm:pt-20 md:pt-24 pb-6 sm:pb-8 md:pb-12 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 pattern-overlay opacity-30 pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-emerald/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-cyan/5 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.08 }}
          className="relative w-full max-w-lg mx-auto"
        >
          <div className="glass-strong rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10 glow-edge border border-border/50 transition-shadow duration-300 hover:shadow-[0_0_40px_rgba(0,255,166,0.06)]">
            <div className="text-center mb-6 sm:mb-8">
              <Link href="/" className="text-xl sm:text-2xl font-bold font-display text-gradient inline-block">
                AIBUILDERS.NG
              </Link>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mt-4 sm:mt-6 mb-2">
                Join NAB
              </h1>
              <p className="text-text text-sm sm:text-base">
                Become part of Nigeria&apos;s AI builder community
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="full_name" className="text-text text-sm sm:text-base">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text/50" size={18} />
                  <Input
                    id="full_name"
                    placeholder="John Doe"
                    className="pl-10 rounded-xl bg-midnight-light/50 border-border focus-visible:ring-emerald/30"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="email" className="text-text text-sm sm:text-base">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text/50" size={18} />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10 rounded-xl bg-midnight-light/50 border-border focus-visible:ring-emerald/30"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="phone" className="text-text text-sm sm:text-base">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text/50" size={18} />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+234 800 000 0000"
                    className="pl-10 rounded-xl bg-midnight-light/50 border-border focus-visible:ring-emerald/30"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="state" className="text-text text-xs sm:text-sm">State</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text/50 pointer-events-none" size={18} />
                    <select
                      id="state"
                      className="w-full pl-10 pr-3 py-2.5 bg-midnight-light/50 border border-border rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald/30"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      required
                    >
                      <option value="">Select</option>
                      {nigerianStates.map((state) => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="profession" className="text-text text-xs sm:text-sm">Profession</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text/50 pointer-events-none" size={18} />
                    <select
                      id="profession"
                      className="w-full pl-10 pr-3 py-2.5 bg-midnight-light/50 border border-border rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald/30"
                      value={formData.profession}
                      onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                      required
                    >
                      <option value="">Select</option>
                      {professions.map((prof) => (
                        <option key={prof} value={prof}>{prof}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="password" className="text-text text-sm sm:text-base">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text/50" size={18} />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    className="pl-10 pr-10 rounded-xl bg-midnight-light/50 border-border focus-visible:ring-emerald/30"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text/50 hover:text-text transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="referral_code" className="text-text text-xs sm:text-sm">
                  Referral Code <span className="text-text/50">(Optional)</span>
                </Label>
                <Input
                  id="referral_code"
                  placeholder="Enter referral code if you have one"
                  className="rounded-xl bg-midnight-light/50 border-border focus-visible:ring-emerald/30"
                  value={formData.referral_code}
                  onChange={(e) => setFormData({ ...formData, referral_code: e.target.value })}
                />
              </div>

              <Button
                type="submit"
                className="w-full btn-neon py-4 sm:py-5 rounded-xl min-h-[44px] text-sm sm:text-base mt-2"
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
                <ArrowRight className="ml-2 w-4 h-4" size={18} />
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-text">
                Already a member?{' '}
                <Link href="/login" className="text-emerald hover:underline">
                  Sign in
                </Link>
              </p>
            </div>

            <div className="mt-4 text-center">
              <Link href="/" className="text-sm text-text/60 hover:text-text transition-colors">
                ← Back to home
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
