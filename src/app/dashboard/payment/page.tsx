'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Building, Copy, CheckCircle2, AlertCircle, Banknote, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { membershipApi } from '@/lib/api';
import toast from 'react-hot-toast';
import { StaggerReveal } from '@/components/ui/stagger-reveal';

interface PaymentData {
  reference: string;
  amount: number;
  bank: {
    accountName: string;
    accountNumber: string;
    bankName: string;
  };
}

export default function PaymentScreen() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [invoiceInput, setInvoiceInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedInvoice, setCopiedInvoice] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);
  const { user, refreshUser, updateUser } = useAuth();
  const router = useRouter();

  const initiatePayment = async () => {
    setLoading(true);
    try {
      const res = await membershipApi.initiatePayment({
        membership_type: 'ai_builder',
        referral_code: user?.referral_code,
      });
      if (res.success && res.data) {
        setPaymentData(res.data);
        setStep(2);
      } else {
        throw new Error(res.error || 'Failed to generate invoice');
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to initiate payment');
    } finally {
      setLoading(false);
    }
  };

  const confirmPayment = async () => {
    if (!invoiceInput.trim()) {
      toast.error('Please enter the invoice number');
      return;
    }
    setLoading(true);
    try {
      const res = await membershipApi.confirmPayment({
        invoice_number: invoiceInput.trim(),
      });
      if (res.success) {
        await refreshUser();
        updateUser({
          is_member: true,
          membership_status: 'active',
          membership_plan_type: 'ai_builder',
        });
        setStep(3);
      } else {
        throw new Error(res.error || 'Invalid invoice number');
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to confirm payment');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: 'invoice' | 'account') => {
    navigator.clipboard.writeText(text);
    if (type === 'invoice') {
      setCopiedInvoice(true);
      setTimeout(() => setCopiedInvoice(false), 2000);
      toast.success('Invoice number copied!');
    } else {
      setCopiedAccount(true);
      setTimeout(() => setCopiedAccount(false), 2000);
      toast.success('Account number copied!');
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-3xl mx-auto py-6 sm:py-8 max-w-full overflow-x-hidden">
        <StaggerReveal>
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-white mb-2">
              Membership Payment
            </h1>
            <p className="text-sm sm:text-base text-text">
              Complete your membership payment via secure bank transfer
            </p>
          </div>

          <Card className="glass border-emerald/30">
            <CardContent className="p-4 sm:p-6 md:p-8">
              {step === 1 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-emerald/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Banknote className="w-8 h-8 text-emerald" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Ready to activate your membership?
                  </h3>
                  <p className="text-text mb-8 max-w-md mx-auto">
                    Generate your unique invoice and get our secure bank details for a manual transfer.
                  </p>
                  <Button 
                    onClick={initiatePayment} 
                    disabled={loading}
                    className="btn-neon w-full sm:w-auto sm:min-w-[200px]"
                    size="lg"
                  >
                    {loading ? 'Processing...' : 'Proceed to Payment'}
                    {!loading && <ArrowRight className="ml-2 w-5 h-5" />}
                  </Button>
                </div>
              )}

              {step === 2 && paymentData && (
                <div className="space-y-8">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white mb-2">Manual Bank Transfer</h3>
                    <p className="text-text">
                      Please transfer exactly <strong className="text-emerald text-lg font-bold">₦{paymentData.amount.toLocaleString()}</strong> to the following account:
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="glass-strong rounded-xl p-4 sm:p-5 border border-border">
                      <div className="flex items-center gap-3 mb-4">
                        <Building className="text-cyan w-5 h-5" />
                        <h4 className="font-semibold text-white">Bank Details</h4>
                      </div>
                      <div className="space-y-3 text-sm">
                        <div>
                          <span className="text-text/70 block text-xs">Bank Name</span>
                          <span className="text-white font-medium">{paymentData.bank.bankName}</span>
                        </div>
                        <div>
                          <span className="text-text/70 block text-xs">Account Name</span>
                          <span className="text-white font-medium">{paymentData.bank.accountName}</span>
                        </div>
                        <div>
                          <span className="text-text/70 block text-xs">Account Number</span>
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-white font-medium text-base sm:text-lg tracking-wider break-all">{paymentData.bank.accountNumber}</span>
                            <button 
                              onClick={() => copyToClipboard(paymentData.bank.accountNumber, 'account')}
                              className="text-emerald hover:text-emerald/80 transition-colors"
                              title="Copy Account Number"
                            >
                              {copiedAccount ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="glass-strong rounded-xl p-4 sm:p-5 border border-emerald/30 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-emerald" />
                      <div className="flex items-center gap-3 mb-4">
                        <ShieldCheck className="text-emerald w-5 h-5" />
                        <h4 className="font-semibold text-white">Your Invoice Number</h4>
                      </div>
                      <div className="bg-background/50 rounded-lg p-3 sm:p-4 flex items-center justify-between gap-2 mb-3 border border-border">
                        <span className="text-emerald font-mono font-bold text-sm sm:text-lg break-all">{paymentData.reference}</span>
                        <button 
                          onClick={() => copyToClipboard(paymentData.reference, 'invoice')}
                          className="text-emerald hover:text-emerald/80 transition-colors p-2 rounded-md hover:bg-emerald/10"
                        >
                          {copiedInvoice ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                        </button>
                      </div>
                      <div className="flex gap-2 items-start text-xs text-gold bg-gold/10 p-3 rounded-lg border border-gold/20">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <p>You <strong>MUST</strong> use this invoice number as the narration/remark in your bank app so we can verify your payment.</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border pt-8 mt-8">
                    <h4 className="font-semibold text-white mb-4">Confirm Your Transfer</h4>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Input 
                        value={invoiceInput} 
                        onChange={(e) => setInvoiceInput(e.target.value)}
                        placeholder="Enter your invoice number (e.g. INV-...)"
                        className="flex-1 rounded-xl bg-midnight-light/50 border-border focus-visible:ring-emerald/30 font-mono"
                      />
                      <Button 
                        onClick={confirmPayment} 
                        disabled={loading || !invoiceInput.trim()}
                        className="btn-neon w-full sm:w-auto sm:min-w-[200px]"
                      >
                        {loading ? 'Confirming...' : 'I Have Made The Transfer'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="text-center py-10">
                  <div className="w-20 h-20 bg-emerald/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-emerald" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Payment Pending!</h3>
                  <p className="text-text mb-8 max-w-md mx-auto">
                    Your payment request has been sent to the admin. You will be notified once the funds are verified and your account is activated.
                  </p>
                  <Button 
                    onClick={() => router.push('/dashboard/membership')}
                    className="btn-neon"
                  >
                    Return to Dashboard
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </StaggerReveal>
      </div>
    </ProtectedRoute>
  );
}
