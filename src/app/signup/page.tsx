'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Eye, EyeOff, User, Mail, Phone, MapPin, Briefcase, Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await register(formData);
      toast.success('Welcome to NAB!');
      router.push('/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-midnight py-20">
      <div className="absolute inset-0 pattern-overlay opacity-30" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan/5 rounded-full blur-3xl" />
      
      <div
        
        
        className="relative w-full max-w-lg mx-auto px-4"
      >
        <div className="glass-strong rounded-2xl p-8">
          <div className="text-center mb-8">
            <Link href="/" className="text-2xl font-bold font-display text-gradient">
              AIBUILDERS.NG
            </Link>
            <h1 className="text-2xl font-bold text-white mt-6 mb-2">
              Join NAB
            </h1>
            <p className="text-text">
              Become part of Nigeria&apos;s AI builder community
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="full_name" className="text-text">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-text/50" size={18} />
                <Input
                  id="full_name"
                  placeholder="John Doe"
                  className="pl-10 bg-midnight-light/50 border-border"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-text">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text/50" size={18} />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10 bg-midnight-light/50 border-border"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-text">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-text/50" size={18} />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+234 800 000 0000"
                  className="pl-10 bg-midnight-light/50 border-border"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="state" className="text-text">State</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-text/50" size={18} />
                  <select
                    id="state"
                    className="w-full pl-10 pr-3 py-2 bg-midnight-light/50 border border-border rounded-md text-white text-sm"
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

              <div className="space-y-2">
                <Label htmlFor="profession" className="text-text">Profession</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-text/50" size={18} />
                  <select
                    id="profession"
                    className="w-full pl-10 pr-3 py-2 bg-midnight-light/50 border border-border rounded-md text-white text-sm"
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

            <div className="space-y-2">
              <Label htmlFor="password" className="text-text">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text/50" size={18} />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  className="pl-10 pr-10 bg-midnight-light/50 border-border"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text/50 hover:text-text"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="referral_code" className="text-text">
                Referral Code <span className="text-text/50">(Optional)</span>
              </Label>
              <Input
                id="referral_code"
                placeholder="Enter referral code if you have one"
                className="bg-midnight-light/50 border-border"
                value={formData.referral_code}
                onChange={(e) => setFormData({ ...formData, referral_code: e.target.value })}
              />
            </div>

            <Button
              type="submit"
              className="w-full btn-neon py-6"
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Join NAB - ₦25,000'}
              <ArrowRight className="ml-2" size={18} />
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
            <Link href="/" className="text-sm text-text/60 hover:text-text">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
