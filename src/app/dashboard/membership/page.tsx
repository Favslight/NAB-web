'use client';


import { CreditCard, Check, Calendar, ArrowRight, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const benefits = [
  'Access to exclusive training content',
  'Community forum participation',
  'State hub events and meetups',
  'Referral earning opportunities',
  'AI Builders Program discounts',
  'Investor network access',
  'Product showcase listing',
  'Mentorship matching',
];

export default function MembershipPage() {
  const { user } = useAuth();
  const isActive = user?.membership_status === 'active';

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-display text-white mb-2">
            Membership
          </h1>
          <p className="text-text">
            Manage your NAB membership status and benefits
          </p>
        </div>

        {/* Status Card */}
        <div
          
          
        >
          <Card className={`glass ${isActive ? 'border-emerald/30' : 'border-gold/30'}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${isActive ? 'bg-emerald/20' : 'bg-gold/20'}`}>
                    <CreditCard className={isActive ? 'text-emerald' : 'text-gold'} size={24} />
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-white">
                      {isActive ? 'Active Membership' : 'Membership Pending'}
                    </div>
                    <div className="text-text">ID: {user?.id_no || 'NAB-XXX-0000'}</div>
                  </div>
                </div>
                <Badge className={isActive ? 'bg-emerald/20 text-emerald' : 'bg-gold/20 text-gold'}>
                  {isActive ? 'Active' : 'Pending Payment'}
                </Badge>
              </div>

              {isActive ? (
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="glass rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-emerald">Jan 2025</div>
                    <div className="text-sm text-text">Member Since</div>
                  </div>
                  <div className="glass rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-cyan">Dec 2025</div>
                    <div className="text-sm text-text">Renewal Date</div>
                  </div>
                  <div className="glass rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-gold">₦25,000</div>
                    <div className="text-sm text-text">Annual Fee</div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-text mb-4">
                    Complete your payment of ₦25,000 to activate your membership
                  </p>
                  <Button className="btn-neon">
                    <Sparkles className="mr-2" size={18} />
                    Complete Payment
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="text-emerald" size={20} />
                Membership Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald/20 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-emerald" />
                    </div>
                    <span className="text-text">{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-white">Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              {isActive ? (
                <div className="space-y-3">
                  <div className="p-3 glass rounded-lg flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white">Annual Membership</div>
                      <div className="text-sm text-text">Jan 15, 2025</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-white">₦25,000</div>
                      <Badge className="bg-emerald/20 text-emerald">Paid</Badge>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-text">
                  <Calendar className="mx-auto mb-3" size={32} />
                  <p>No payment history yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
