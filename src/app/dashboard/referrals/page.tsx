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
    total_count?: number;
    signed_up_count?: number;
    paid_count?: number;
    rewarded_count?: number;
    active_count?: number;
    clicked?: number;
    signed_up?: number;
    paid?: number;
    rewarded?: number;
    total_rewards?: number;
  };
  referrals?: Array<{
    referred_name?: string;
    referred_status?: string;
    referred_membership_plan_type?: string;
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

function normalizeReferralLink(referralLink: string | undefined, referralCode: string): string {
  if (!referralLink) return '';

  try {
    const url = new URL(referralLink);
    const code = url.searchParams.get('ref') || referralCode;

    url.pathname = '/signup';
    url.search = '';
    if (code && code !== '—') url.searchParams.set('ref', code);
    url.hash = '';

    return url.toString();
  } catch {
    return referralCode && referralCode !== '—'
      ? `/signup?ref=${encodeURIComponent(referralCode)}`
      : referralLink;
  }
}

export default function ReferralsPage() {
  const { user } = useAuth();
  const [referralData, setReferralData] = useState<ReferralMe | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderEntry[]>([]);

  const referralCode = referralData?.referral_code ?? user?.referral_code ?? '—';
  const referralLink = normalizeReferralLink(referralData?.referral_link, referralCode);

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
  const signedUpCount = stats?.signed_up_count ?? stats?.signed_up ?? 0;
  const activeCount = stats?.active_count ?? 0;
  const rewardedCount = stats?.rewarded_count ?? stats?.rewarded ?? 0;

  return (
    <ProtectedRoute>
      <div className="responsive-page">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white mb-2">
            Referral Center
          </h1>
          <p className="text-sm sm:text-base text-text">
            Earn rewards for every new member you refer
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <Card className="glass">
                <CardContent className="p-4 sm:p-6">
                  <div className="text-2xl sm:text-3xl font-bold text-emerald">
                    {signedUpCount}
                  </div>
                  <div className="text-sm text-text">Signed Up</div>
                </CardContent>
              </Card>
              <Card className="glass">
                <CardContent className="p-4 sm:p-6">
                  <div className="text-2xl sm:text-3xl font-bold text-cyan">
                    {activeCount}
                  </div>
                  <div className="text-sm text-text">Active</div>
                </CardContent>
              </Card>
              <Card className="glass">
                <CardContent className="p-4 sm:p-6">
                  <div className="text-2xl sm:text-3xl font-bold text-gold">
                    {rewardedCount}
                  </div>
                  <div className="text-sm text-text">Rewarded</div>
                </CardContent>
              </Card>
            </div>

            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2 text-base sm:text-lg">
                  <Share2 className="text-emerald" size={20} />
                  Share Your Referral Link
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="glass rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <code className="text-emerald text-xs sm:text-sm break-all flex-1">
                    {referralLink || 'Loading referral link...'}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(referralLink)}
                    disabled={!referralLink}
                    className="text-emerald shrink-0"
                  >
                    <Copy size={16} />
                  </Button>
                </div>
                <div className="glass rounded-lg p-3 sm:p-4 flex items-center justify-between gap-2">
                  <code className="text-cyan text-xs sm:text-sm font-mono break-all">{referralCode}</code>
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
                <CardTitle className="text-white text-base sm:text-lg">Referral History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {referrals.length === 0 ? (
                    <p className="text-sm text-text">No referrals yet. Share your link to get started.</p>
                  ) : (
                    referrals.map((ref, i) => {
                      const status = ref.referred_status ?? ref.status ?? '—';
                      const isActive = status === 'membership_active';
                      return (
                      <div key={i} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 glass rounded-lg">
                        <div className="min-w-0">
                          <div className="font-medium text-white">{ref.referred_name ?? '—'}</div>
                          {ref.signup_date && (
                            <div className="text-sm text-text">
                              {new Date(ref.signup_date).toLocaleDateString()}
                            </div>
                          )}
                          {ref.referred_membership_plan_type && (
                            <div className="text-xs text-text/70 capitalize">
                              {ref.referred_membership_plan_type.replaceAll('_', ' ')}
                            </div>
                          )}
                        </div>
                        <div className="text-left sm:text-right">
                          {typeof ref.reward_amount === 'number' && (
                            <div className="font-medium text-white">₦{ref.reward_amount.toLocaleString()}</div>
                          )}
                          <Badge
                            variant={isActive ? 'default' : 'outline'}
                            className={isActive ? 'bg-emerald/20 text-emerald' : 'text-gold'}
                          >
                            {isActive ? 'Active' : status.replaceAll('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                    );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2 text-base sm:text-lg">
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
