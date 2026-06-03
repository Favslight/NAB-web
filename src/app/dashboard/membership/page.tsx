'use client';

import { useEffect, useState } from 'react';

import { CreditCard, Check, Calendar, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { membershipApi } from '@/lib/api';
import toast from 'react-hot-toast';

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

const MEMBERSHIP_FEE_BY_PLAN: Record<string, number> = {
  ai_explorer: 0,
  ai_builder: 30000,
  ai_product_founder: 250000,
};

type TransactionItem = {
  id?: string;
  reference?: string;
  amount?: number;
  type?: string;
  membership_type?: string;
  plan_type?: string;
  status?: string;
  created_at?: string;
  transaction_type?: string;
  metadata?: Record<string, unknown>;
};

export default function MembershipPage() {
  const { user } = useAuth();
  const isActive = user?.membership_status === 'active';

  const [history, setHistory] = useState<TransactionItem[]>([]);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await membershipApi.getHistory();
        if (res.success && res.data) {
          const list = Array.isArray(res.data) ? res.data : [];
          setHistory(list);
        }
      } catch {
        setHistory([]);
      }
    };
    load();
  }, []);

  const handleCompletePayment = () => {
    window.location.href = '/dashboard/payment';
  };

  const memberSince =
    user?.created_at &&
    new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  
  const expiresAt =
    user?.membership_expires_at &&
    new Date(user.membership_expires_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  const rawMembershipPlan = user?.membership?.plan_type ?? user?.membership_plan_type ?? 'ai_builder';
  const membershipPlan = isActive && rawMembershipPlan === 'ai_explorer' ? 'ai_builder' : rawMembershipPlan;
  const latestPaymentAmount = history.reduce<number | undefined>(
    (highest, tx) =>
      typeof tx.amount === 'number' && tx.amount > (highest ?? 0) ? tx.amount : highest,
    undefined
  );
  const isMembershipTransaction = (tx: TransactionItem) => {
    const kind = `${tx.type ?? tx.transaction_type ?? ''}`.toLowerCase();
    return !kind || kind.includes('membership') || kind === 'payment';
  };
  const getTransactionPlan = (tx: TransactionItem) => {
    const metadataPlan =
      typeof tx.metadata?.membership_type === 'string'
        ? tx.metadata.membership_type
        : typeof tx.metadata?.plan_type === 'string'
        ? tx.metadata.plan_type
        : undefined;

    return tx.membership_type ?? tx.plan_type ?? metadataPlan ?? (isMembershipTransaction(tx) ? membershipPlan : undefined);
  };
  const getPlanFee = (plan?: string) =>
    MEMBERSHIP_FEE_BY_PLAN[plan ?? ''] ?? MEMBERSHIP_FEE_BY_PLAN.ai_builder;
  const planMembershipFee = getPlanFee(membershipPlan);
  const membershipAmount =
    planMembershipFee > 0
      ? planMembershipFee
      : latestPaymentAmount ?? user?.membership?.amount_paid ?? MEMBERSHIP_FEE_BY_PLAN.ai_builder;
  const getTransactionAmount = (tx: TransactionItem) => {
    const transactionPlanFee = getPlanFee(getTransactionPlan(tx));

    if (isMembershipTransaction(tx) && transactionPlanFee > 0) {
      return transactionPlanFee;
    }

    return tx.amount ?? 0;
  };

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

        <div>
          <Card className={`glass ${isActive ? 'border-emerald/30' : 'border-gold/30'}`}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`p-3 rounded-full ${isActive ? 'bg-emerald/20' : 'bg-gold/20'}`}>
                    <CreditCard className={isActive ? 'text-emerald' : 'text-gold'} size={24} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-lg font-semibold text-white">
                      {isActive ? 'Active Membership' : 'Membership Pending'}
                    </div>
                    <div className="text-text break-all">ID: {user?.id_no || 'NAB-XXX-0000'}</div>
                  </div>
                </div>
                <Badge className={isActive ? 'bg-emerald/20 text-emerald' : 'bg-gold/20 text-gold'}>
                  {isActive ? 'Active' : 'Pending Payment'}
                </Badge>
              </div>

              {isActive ? (
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="glass rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-emerald">{memberSince ?? '—'}</div>
                    <div className="text-sm text-text">Member Since</div>
                  </div>
                  <div className="glass rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-cyan">{expiresAt ?? '—'}</div>
                    <div className="text-sm text-text">Renewal Date</div>
                  </div>
                  <div className="glass rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-gold">
                      ₦{membershipAmount.toLocaleString()}
                    </div>
                    <div className="text-sm text-text">Amount Paid</div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-text mb-4">
                    Complete your payment to activate your membership
                  </p>
                  <Button
                    className="btn-neon w-full sm:w-auto"
                    onClick={handleCompletePayment}
                    disabled={paymentLoading}
                  >
                    <Sparkles className="mr-2" size={18} />
                    {paymentLoading ? 'Starting...' : 'Complete Payment'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

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
              {history.length === 0 ? (
                <div className="text-center py-8 text-text">
                  <Calendar className="mx-auto mb-3" size={32} />
                  <p>No payment history yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((rawTx, i) => {
                    const tx = { ...rawTx, amount: getTransactionAmount(rawTx) };

                    return (
                      <div key={tx.id ?? i} className="p-3 glass rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-medium text-white">
                          {tx.transaction_type ?? 'Payment'}
                        </div>
                        {tx.created_at && (
                          <div className="text-sm text-text">
                            {new Date(tx.created_at).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                      <div className="text-left sm:text-right">
                        <div className="font-medium text-white">
                          ₦{(tx.amount ?? 0).toLocaleString()}
                        </div>
                        <Badge
                          className={
                            tx.status === 'success' ? 'bg-emerald/20 text-emerald' : 'bg-gold/20 text-gold'
                          }
                        >
                          {tx.status ?? '—'}
                        </Badge>
                      </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
