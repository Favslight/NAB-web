'use client';

import Link from 'next/link';

import { Users, Copy, Check, ArrowUpRight, Award, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const leaderboard = [
  { rank: 1, name: 'Ahmed Musa', referrals: 45, earnings: 225000 },
  { rank: 2, name: 'Chioma Okafor', referrals: 38, earnings: 190000 },
  { rank: 3, name: 'Emmanuel Nwosu', referrals: 32, earnings: 160000 },
  { rank: 4, name: 'Fatima Bello', referrals: 28, earnings: 140000 },
  { rank: 5, name: 'Oluwaseun Adeyemi', referrals: 24, earnings: 120000 },
];

export default function ReferralsPage() {
  const { user } = useAuth();
  const referralCode = user?.referral_code || 'NAB0000';
  const referralLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/signup?ref=${referralCode}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <ProtectedRoute>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-display text-white mb-2">
            Referral Center
          </h1>
          <p className="text-text">
            Earn ₦5,000 for every new member you refer
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Referral Stats */}
          <div
            
            
            className="lg:col-span-2 space-y-6"
          >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Card className="glass">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-emerald">12</div>
                  <div className="text-sm text-text">Total Referrals</div>
                </CardContent>
              </Card>
              <Card className="glass">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-cyan">₦60,000</div>
                  <div className="text-sm text-text">Total Earnings</div>
                </CardContent>
              </Card>
              <Card className="glass">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-gold">8</div>
                  <div className="text-sm text-text">This Month</div>
                </CardContent>
              </Card>
            </div>

            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Share2 className="text-emerald" size={20} />
                  Share Your Referral Link
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="glass rounded-lg p-4 flex items-center justify-between">
                  <code className="text-emerald text-sm">{referralLink}</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(referralLink)}
                    className="text-emerald"
                  >
                    <Copy size={16} />
                  </Button>
                </div>
                <div className="glass rounded-lg p-4 flex items-center justify-between">
                  <code className="text-cyan text-sm font-mono">{referralCode}</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(referralCode)}
                    className="text-cyan"
                  >
                    <Copy size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-white">Referral History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'John Doe', date: 'Jan 10, 2025', status: 'paid', amount: 5000 },
                    { name: 'Jane Smith', date: 'Jan 8, 2025', status: 'paid', amount: 5000 },
                    { name: 'Mike Johnson', date: 'Jan 5, 2025', status: 'pending', amount: 5000 },
                  ].map((ref, i) => (
                    <div key={i} className="flex items-center justify-between p-3 glass rounded-lg">
                      <div>
                        <div className="font-medium text-white">{ref.name}</div>
                        <div className="text-sm text-text">{ref.date}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-white">₦{ref.amount.toLocaleString()}</div>
                        <Badge
                          variant={ref.status === 'paid' ? 'default' : 'outline'}
                          className={ref.status === 'paid' ? 'bg-emerald/20 text-emerald' : 'text-gold'}
                        >
                          {ref.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Leaderboard */}
          <div
            
            
            
          >
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Award className="text-gold" size={20} />
                  Top Referrers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboard.map((referrer) => (
                    <div
                      key={referrer.rank}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        referrer.rank <= 3 ? 'glass-strong border border-gold/30' : ''
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          referrer.rank === 1
                            ? 'bg-gold text-midnight'
                            : referrer.rank === 2
                            ? 'bg-slate-300 text-midnight'
                            : referrer.rank === 3
                            ? 'bg-amber-600 text-midnight'
                            : 'bg-midnight-light text-text'
                        }`}
                      >
                        {referrer.rank}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-white text-sm">{referrer.name}</div>
                        <div className="text-xs text-text">{referrer.referrals} referrals</div>
                      </div>
                      <div className="text-emerald font-medium text-sm">
                        ₦{referrer.earnings.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
