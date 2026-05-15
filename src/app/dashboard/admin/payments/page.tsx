'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, CheckCircle, XCircle, Search } from 'lucide-react';

interface PaymentItem {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  amount: number;
  status: string;
  reference: string;
  created_at: string;
  notes?: string;
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchPayments = async (status: string) => {
    setLoading(true);
    try {
      const res = await adminApi.getPayments({ status });
      if (res.success && res.data) {
        // Handle paginated response or flat array
        const list = Array.isArray(res.data) ? res.data : res.data.data || [];
        setPayments(list);
      } else {
        setPayments([]);
      }
    } catch (e) {
      toast.error('Failed to load payments');
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments(activeTab);
  }, [activeTab]);

  const handleReview = async (id: string, action: 'approve' | 'reject') => {
    if (action === 'reject') {
      const confirmReject = window.confirm('Are you sure you want to reject this payment?');
      if (!confirmReject) return;
    }

    setActionLoading(id);
    try {
      const notes = action === 'approve' ? 'Verified by Admin' : 'Rejected by Admin';
      const res = await adminApi.reviewPayment(id, { action, notes });
      if (res.success) {
        toast.success(`Payment ${action}d successfully`);
        // Remove from the current list if it's pending
        if (activeTab === 'pending') {
          setPayments(payments.filter(p => p.id !== id));
        } else {
          // Refresh list if not in pending tab
          fetchPayments(activeTab);
        }
      } else {
        throw new Error(res.error || `Failed to ${action} payment`);
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : `Failed to ${action} payment`);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-emerald/20 text-emerald">Approved</Badge>;
      case 'failed':
        return <Badge className="bg-red-500/20 text-red-500">Rejected</Badge>;
      case 'pending':
      default:
        return <Badge className="bg-gold/20 text-gold">Pending</Badge>;
    }
  };

  return (
    <ProtectedRoute requireSuperAdmin>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold font-display text-white">Manual Payments</h1>
            <p className="text-text text-sm mt-1">Review and manage manual bank transfers.</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => fetchPayments(activeTab)}
            disabled={loading}
            className="border-border text-text hover:text-white"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <Card className="glass border-border">
          <CardHeader className="pb-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-midnight-light border border-border">
                <TabsTrigger value="pending" className="data-[state=active]:bg-emerald/20 data-[state=active]:text-emerald">
                  Pending Review
                </TabsTrigger>
                <TabsTrigger value="success" className="data-[state=active]:bg-emerald/20 data-[state=active]:text-emerald">
                  Approved
                </TabsTrigger>
                <TabsTrigger value="failed" className="data-[state=active]:bg-emerald/20 data-[state=active]:text-emerald">
                  Rejected
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <RefreshCw className="w-8 h-8 animate-spin text-emerald/50" />
              </div>
            ) : payments.length === 0 ? (
              <div className="text-center py-12 text-text">
                <Search className="w-12 h-12 text-text/30 mx-auto mb-3" />
                <p>No payments found in this category.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-text/70 uppercase bg-midnight-light/50 border-b border-border">
                    <tr>
                      <th className="px-4 py-3 font-medium">User</th>
                      <th className="px-4 py-3 font-medium">Invoice No.</th>
                      <th className="px-4 py-3 font-medium">Amount</th>
                      <th className="px-4 py-3 font-medium">Date</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      {activeTab === 'pending' && <th className="px-4 py-3 font-medium text-right">Actions</th>}
                      {activeTab !== 'pending' && <th className="px-4 py-3 font-medium">Notes</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {payments.map(payment => (
                      <tr key={payment.id} className="hover:bg-midnight-light/30 transition-colors">
                        <td className="px-4 py-4">
                          <div className="font-medium text-white">{payment.user_name}</div>
                          <div className="text-text/70 text-xs">{payment.user_email}</div>
                        </td>
                        <td className="px-4 py-4 font-mono text-xs text-white">
                          {payment.reference}
                        </td>
                        <td className="px-4 py-4 font-medium text-emerald">
                          ₦{payment.amount?.toLocaleString()}
                        </td>
                        <td className="px-4 py-4 text-text/80">
                          {new Date(payment.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-4">
                          {getStatusBadge(payment.status)}
                        </td>
                        
                        {activeTab === 'pending' ? (
                          <td className="px-4 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="border-emerald/30 text-emerald hover:bg-emerald/10 hover:text-emerald"
                                onClick={() => handleReview(payment.id, 'approve')}
                                disabled={actionLoading === payment.id}
                              >
                                {actionLoading === payment.id ? (
                                  <RefreshCw className="w-4 h-4 animate-spin" />
                                ) : (
                                  <>
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Approve
                                  </>
                                )}
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="border-red-500/30 text-red-500 hover:bg-red-500/10 hover:text-red-500"
                                onClick={() => handleReview(payment.id, 'reject')}
                                disabled={actionLoading === payment.id}
                              >
                                {actionLoading === payment.id ? (
                                  <RefreshCw className="w-4 h-4 animate-spin" />
                                ) : (
                                  <>
                                    <XCircle className="w-4 h-4 mr-1" />
                                    Reject
                                  </>
                                )}
                              </Button>
                            </div>
                          </td>
                        ) : (
                          <td className="px-4 py-4 text-text/80 text-xs max-w-[200px] truncate">
                            {payment.notes || '-'}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
