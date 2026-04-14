'use client';

import { useEffect, useState } from 'react';

import { Copy, Award, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { referralApi } from '@/lib/api';
import toast from 'react-hot-toast';

type ReferralMe = {
  referral_code: string;
  referral_link: string;
  stats?: {
    clicked: number;
    signed_up: number;
    paid: number;
    rewarded: number;
    total_rewards: number;
  };
  referrals?: Array<{
    referred_name?: string;
    signup_date?: string;
    status?: string;
    reward_amount?: number;
  }>;
};

type LeaderEntry = {
  full_name?: string;
  successful_referrals?: number;
  total_rewards?: number;
};

export default function ReferralsPage() {
  const { user } = useAuth();
  const [referralData, setReferralData] = useState<ReferralMe | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderEntry[]>([]);

  const referralCode = referralData?.referral_code ?? user?.referral_code ?? '—';
  const referralLink =
    referralData?.referral_link ??
    (typeof window !== 'undefined' ? `${window.location.origin}/signup?ref=${referralCode}` : '');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await referralApi.getMe();
        if (res.success && res.data) setReferralData(res.data as ReferralMe);
      } catch {
        // keep user.referral_code fallback
      }
    };
    load();
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await referralApi.getLeaderboard(10);
        if (res.success && res.data) setLeaderboard((res.data as LeaderEntry[]) ?? []);
      } catch {
        // ignore
      }
    };
    load();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const stats = referralData?.stats;
  const referrals = referralData?.referrals ?? [];

  return (
    <ProtectedRoute>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-display text-white mb-2">
            Referral Center
          </h1>
          <p className="text-text">
            Earn rewards for every new member you refer
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Card className="glass">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-emerald">
                    {stats?.signed_up ?? 0}
                  </div>
                  <div className="text-sm text-text">Total Referrals</div>
                </CardContent>
              </Card>
              <Card className="glass">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-cyan">
                    ₦{(stats?.total_rewards ?? 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-text">Total Earnings</div>
                </CardContent>
              </Card>
              <Card className="glass">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-gold">
                    {stats?.rewarded ?? 0}
                  </div>
                  <div className="text-sm text-text">Rewarded</div>
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
                <div className="glass rounded-lg p-4 flex items-center justify-between gap-2">
                  <code className="text-emerald text-sm truncate flex-1">{referralLink}</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(referralLink)}
                    className="text-emerald shrink-0"
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
                  {referrals.length === 0 ? (
                    <p className="text-sm text-text">No referrals yet. Share your link to get started.</p>
                  ) : (
                    referrals.map((ref, i) => (
                      <div key={i} className="flex items-center justify-between p-3 glass rounded-lg">
                        <div>
                          <div className="font-medium text-white">{ref.referred_name ?? '—'}</div>
                          {ref.signup_date && (
                            <div className="text-sm text-text">
                              {new Date(ref.signup_date).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          {typeof ref.reward_amount === 'number' && (
                            <div className="font-medium text-white">₦{ref.reward_amount.toLocaleString()}</div>
                          )}
                          <Badge
                            variant={ref.status === 'rewarded' ? 'default' : 'outline'}
                            className={ref.status === 'rewarded' ? 'bg-emerald/20 text-emerald' : 'text-gold'}
                          >
                            {ref.status ?? '—'}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Award className="text-gold" size={20} />
                  Top Referrers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboard.length === 0 ? (
                    <p className="text-sm text-text">Leaderboard will appear once referrals are rewarded.</p>
                  ) : (
                    leaderboard.map((referrer, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center gap-3 p-3 rounded-lg ${
                          idx < 3 ? 'glass-strong border border-gold/30' : ''
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            idx === 0
                              ? 'bg-gold text-midnight'
                              : idx === 1
                              ? 'bg-slate-300 text-midnight'
                              : idx === 2
                              ? 'bg-amber-600 text-midnight'
                              : 'bg-midnight-light text-text'
                          }`}
                        >
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-white text-sm truncate">
                            {referrer.full_name ?? '—'}
                          </div>
                          <div className="text-xs text-text">
                            {(referrer.successful_referrals ?? 0)} referrals
                          </div>
                        </div>
                        <div className="text-emerald font-medium text-sm shrink-0">
                          ₦{(referrer.total_rewards ?? 0).toLocaleString()}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
