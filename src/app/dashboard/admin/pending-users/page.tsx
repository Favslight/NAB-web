'use client';

import { useEffect, useState } from 'react';
import { UserCheck, UserX, Clock, RefreshCw, MapPin, Briefcase, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { adminApi } from '@/lib/api';
import { toast } from 'sonner';
import { getInitials } from '@/lib/utils';

interface PendingUser {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  profession?: string;
  state_name: string;
  avatar_url?: string;
  referral_code?: string;
  created_at: string;
}

export default function PendingUsersPage() {
  const [users, setUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPendingUsers();
  }, [page]);

  const fetchPendingUsers = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getPendingUsers(page, 20);
      if (res.success && res.data) {
        setUsers(res.data);
        setTotalPages(res.meta?.totalPages || 1);
      } else {
        toast.error('Failed to load pending users');
      }
    } catch (error: any) {
      toast.error('Failed to load pending users: ' + (error.message || 'Unknown error'));
      console.error('Load pending users error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (userId: string, action: 'approve' | 'reject') => {
    if (action === 'reject') {
      if (!confirm('Are you sure? This will permanently delete the user.')) {
        return;
      }
    }

    setProcessing(userId);
    try {
      const res = await adminApi.reviewPendingUser(userId, action);
      if (res.success) {
        toast.success(`User ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
        fetchPendingUsers(); // Refresh list
      } else {
        toast.error('Failed to process');
      }
    } catch (error: any) {
      toast.error('Failed to process: ' + (error.message || 'Unknown error'));
      console.error('Review user error:', error);
    } finally {
      setProcessing(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <ProtectedRoute>
      <div className="responsive-page">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="p-2 rounded-lg bg-amber/20">
              <Clock className="text-amber" size={24} />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold font-display text-white">Pending Approvals</h1>
              <p className="text-text text-sm">Review and approve new user registrations</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={fetchPendingUsers}
            disabled={loading}
            className="w-full border-border sm:w-auto"
          >
            <RefreshCw size={18} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="glass">
            <CardContent className="p-4">
              <div className="text-text text-sm">Pending Users</div>
              <div className="text-2xl font-bold text-white">{users.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Users List */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <UserCheck className="text-emerald" size={20} />
              Users Awaiting Approval
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-text">Loading...</div>
            ) : users.length === 0 ? (
              <div className="text-center py-12 text-text">
                <UserCheck size={48} className="mx-auto mb-4 text-text/30" />
                <p>No pending approvals</p>
                <p className="text-sm mt-1">All users have been reviewed</p>
              </div>
            ) : (
              <div className="space-y-4">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex min-w-0 flex-col justify-between gap-4 rounded-lg border border-border/50 bg-midnight-light/30 p-3 transition-colors hover:border-emerald/30 sm:flex-row sm:items-center sm:p-4"
                  >
                    <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                      <Avatar className="w-12 h-12 border-2 border-emerald/30">
                        <AvatarImage src={user.avatar_url} />
                        <AvatarFallback className="bg-emerald/20 text-emerald">
                          {getInitials(user.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-white">{user.full_name}</h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-text">
                          <span className="flex items-center gap-1">
                            <Mail size={14} />
                            {user.email}
                          </span>
                          {user.profession && (
                            <span className="flex items-center gap-1">
                              <Briefcase size={14} />
                              {user.profession}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <MapPin size={14} />
                            {user.state_name}
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <Badge variant="outline" className="text-amber border-amber/30 text-xs">
                            <Clock size={12} className="mr-1" />
                            {formatDate(user.created_at)}
                          </Badge>
                          {user.referral_code && (
                            <Badge variant="outline" className="text-cyan border-cyan/30 text-xs">
                              Ref: {user.referral_code}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:shrink-0">
                      <Button
                        size="sm"
                        className="bg-emerald hover:bg-emerald/80"
                        onClick={() => handleReview(user.id, 'approve')}
                        disabled={processing === user.id}
                      >
                        <UserCheck size={16} className="mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-400"
                        onClick={() => handleReview(user.id, 'reject')}
                        disabled={processing === user.id}
                      >
                        <UserX size={16} className="mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6 gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <Button
                    key={i + 1}
                    size="sm"
                    variant={page === i + 1 ? 'default' : 'outline'}
                    className={page === i + 1 ? 'bg-emerald' : 'border-border'}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
