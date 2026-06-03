'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

import {
  CreditCard,
  Users,
  MapPin,
  BookOpen,
  Bell,
  ArrowUpRight,
  Sparkles,
  MessageSquare,
  Shield,
  Settings,
  CheckCircle,
  Package,
  DollarSign,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { referralApi, trainingApi, notificationApi, adminApi } from '@/lib/api';
import type { Training } from '@/types';

interface ReferralDashboard {
  stats?: {
    clicked: number;
    signed_up: number;
    paid: number;
    rewarded: number;
    total_rewards: number;
  };
}

interface DashboardNotification {
  id: string | number;
  title: string;
  message: string;
  created_at?: string;
}

interface AdminDashboardData {
  users: { total: number; members: number; pending_approval?: number };
  pending: { products: number; applications: number; users?: number };
  content: { posts: number };
  revenue: { total: number; recent_transactions: number };
  isStateAdmin: boolean;
  stateId: string;
}

const PLAN_LABELS: Record<string, string> = {
  ai_explorer: 'AI Explorer',
  ai_builder: 'AI Builder',
  ai_product_founder: 'AI Product Founder',
};

export default function DashboardPage() {
  const { user } = useAuth();

  const [referralData, setReferralData] = useState<ReferralDashboard | null>(null);
  const [trainings, setTrainings] = useState<Training[] | null>(null);
  const [notifications, setNotifications] = useState<DashboardNotification[]>([]);
  const [adminData, setAdminData] = useState<AdminDashboardData | null>(null);

  // Check if user is admin
  const isAdmin = user?.role === 'super_admin' || user?.role === 'state_admin';
  const isSuperAdmin = user?.role === 'super_admin';

  useEffect(() => {
    // Load referrals
    const loadReferrals = async () => {
      try {
        const res = await referralApi.getMe();
        if (res.success && res.data) {
          setReferralData({
            stats: res.data.stats as ReferralDashboard['stats'],
          });
        }
      } catch {
        // soft-fail: keep dashboard usable
      }
    };

    // Load trainings with progress
    const loadTrainings = async () => {
      try {
        const res = await trainingApi.getAll({ page: 1, limit: 2 });
        if (res.success && res.data) {
          setTrainings(res.data as unknown as Training[]);
        }
      } catch {
        // ignore
      }
    };

    // Load recent notifications
    const loadNotifications = async () => {
      try {
        const res = await notificationApi.getAll({ page: 1, limit: 4 });
        if (res.success && res.data) {
          const items = (res.data.items || res.data.notifications || []) as any[];
          setNotifications(
            items.map((n) => ({
              id: n.id,
              title: n.title ?? 'Notification',
              message: n.message ?? n.body ?? '',
              created_at: n.created_at,
            }))
          );
        }
      } catch {
        // ignore
      }
    };

    // Load admin dashboard data (for admins only)
    const loadAdminData = async () => {
      if (!isAdmin) return;
      try {
        const res = await adminApi.getDashboard();
        if (res.success && res.data) {
          setAdminData(res.data);
        }
      } catch {
        // ignore
      }
    };

    loadReferrals();
    loadTrainings();
    loadNotifications();
    loadAdminData();
  }, [isAdmin]);

  const membershipStatusLabel =
    user?.membership_status === 'active'
      ? 'Active Member'
      : user?.membership_status === 'pending'
      ? 'Pending Activation'
      : 'Membership Inactive';
  const currentPlan = user?.membership_plan_type || 'ai_explorer';
  const currentPlanLabel = PLAN_LABELS[currentPlan] || PLAN_LABELS.ai_explorer;

  const primaryTraining = useMemo(() => trainings?.[0], [trainings]);
  const secondaryTraining = useMemo(() => trainings?.[1], [trainings]);

  const stats = useMemo(
    () => [
      {
        label: 'Current Plan',
        value: currentPlanLabel,
        icon: CreditCard,
        color: 'text-emerald',
      },
      {
        label: 'Referrals',
        value: referralData?.stats?.signed_up?.toString() ?? '0',
        icon: Users,
        color: 'text-cyan',
      },
      {
        label: 'State Hub',
        value:
          (user as any)?.state_name ??
          user?.state ??
          'Not Assigned',
        icon: MapPin,
        color: 'text-gold',
      },
      {
        label: 'Training Progress',
        value:
          primaryTraining && (primaryTraining as any).progress
            ? `${(primaryTraining as any).progress.progress_percent ?? 0}%`
            : '0%',
        icon: BookOpen,
        color: 'text-emerald',
      },
    ],
    [user, referralData, primaryTraining]
  );

  const primaryProgress =
    primaryTraining && (primaryTraining as any).progress
      ? (primaryTraining as any).progress.progress_percent ?? 0
      : 0;

  return (
    <ProtectedRoute>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-display text-white">
              Welcome back, {user?.full_name?.split(' ')[0] || 'Builder'}!
              {isAdmin && (
                <Badge className="ml-3 bg-purple/20 text-purple border-purple/30">
                  <Shield className="mr-1" size={14} />
                  {isSuperAdmin ? 'Super Admin' : 'State Admin'}
                </Badge>
              )}
            </h1>
            <p className="text-text mt-1">
              {isAdmin
                ? adminData?.isStateAdmin
                  ? `Managing ${adminData?.stateId ? 'State Hub' : 'your state'}`
                  : 'Managing the entire NAB platform'
                : "Here's what's happening in your NAB journey"}
            </p>
          </div>
          {!isSuperAdmin && (
            <Link href="/dashboard/referrals">
              <Button className="btn-neon">
                <Sparkles className="mr-2" size={18} />
                Refer &amp; Earn ₦
                {(referralData?.stats?.total_rewards ?? 5000).toLocaleString()}
              </Button>
            </Link>
          )}
        </div>

        {/* Regular User Stats - Hidden for Super Admin */}
        {!isSuperAdmin && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label} className="glass card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 rounded-lg bg-midnight-light ${stat.color}`}>
                        <Icon size={20} />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-text">{stat.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Admin Dashboard Section */}
        {isAdmin && adminData && (
          <>
            <div className="flex items-center gap-2">
              <Shield className="text-purple" size={24} />
              <h2 className="text-xl font-bold text-white">Admin Dashboard</h2>
            </div>

            {/* Admin Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="glass card-hover border-purple/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-purple/20 text-purple">
                      <Users size={20} />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {adminData.users?.total?.toLocaleString() ?? 0}
                  </div>
                  <div className="text-sm text-text">Total Users</div>
                  <div className="text-xs text-emerald mt-1">
                    {adminData.users?.members?.toLocaleString() ?? 0} members
                  </div>
                </CardContent>
              </Card>

              {/* Pending Users Card */}
              <Link href="/dashboard/admin/pending-users">
                <Card className="glass card-hover border-amber/20 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-amber/20 text-amber">
                        <Clock size={20} />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {adminData.users?.pending_approval ?? adminData.pending?.users ?? 0}
                    </div>
                    <div className="text-sm text-text">Pending Approvals</div>
                    {(adminData.users?.pending_approval ?? 0) > 0 && (
                      <div className="text-xs text-amber mt-1">
                        Click to review
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>

              <Card className="glass card-hover border-rose/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-rose/20 text-rose">
                      <Package size={20} />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {adminData.pending?.products ?? 0}
                  </div>
                  <div className="text-sm text-text">Pending Products</div>
                </CardContent>
              </Card>

              <Card className="glass card-hover border-gold/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-gold/20 text-gold">
                      <CheckCircle size={20} />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {adminData.pending?.applications ?? 0}
                  </div>
                  <div className="text-sm text-text">Pending Applications</div>
                </CardContent>
              </Card>

              <Card className="glass card-hover border-emerald/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-emerald/20 text-emerald">
                      <DollarSign size={20} />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    ₦{(adminData.revenue?.total ?? 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-text">Total Revenue</div>
                  <div className="text-xs text-text mt-1">
                    {adminData.revenue?.recent_transactions ?? 0} recent transactions
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Admin Quick Actions */}
            <Card className="glass border-purple/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="text-purple" size={20} />
                  Admin Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Link href="/dashboard/admin/users">
                    <Button variant="outline" className="w-full justify-start border-border hover:bg-midnight-light">
                      <Users className="mr-2" size={18} />
                      Manage Users
                    </Button>
                  </Link>
                  <Link href="/dashboard/admin/applications">
                    <Button variant="outline" className="w-full justify-start border-border hover:bg-midnight-light">
                      <CheckCircle className="mr-2" size={18} />
                      Review Applications
                    </Button>
                  </Link>
                  {isSuperAdmin && (
                    <>
                      <Link href="/dashboard/admin/products">
                        <Button variant="outline" className="w-full justify-start border-border hover:bg-midnight-light">
                          <Package className="mr-2" size={18} />
                          Review Products
                        </Button>
                      </Link>
                      <Link href="/dashboard/admin/settings">
                        <Button variant="outline" className="w-full justify-start border-border hover:bg-midnight-light">
                          <Settings className="mr-2" size={18} />
                          System Settings
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Membership Card - Hidden for Super Admin */}
            {!isSuperAdmin && (
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <CreditCard className="text-emerald" size={20} />
                    Membership Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-lg font-semibold text-white">
                        {membershipStatusLabel}
                      </div>
                      <div className="text-sm text-text">
                        ID: {user?.id_no || 'NAB-XXX-0000'}
                      </div>
                    </div>
                    <Badge className="bg-emerald/20 text-emerald border-emerald/30">
                      {user?.membership_status || 'inactive'}
                    </Badge>
                  </div>
                  {user?.membership_status !== 'active' && (
                    <Link href="/dashboard/membership">
                      <Button className="w-full btn-neon">
                        Complete Payment
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Continue Learning - Hidden for Super Admin */}
            {!isSuperAdmin && (
              <Card className="glass">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <BookOpen className="text-cyan" size={20} />
                    Continue Learning
                  </CardTitle>
                  <Link href="/dashboard/learning">
                    <Button variant="ghost" size="sm" className="text-emerald">
                      View All
                      <ArrowUpRight className="ml-1" size={16} />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="glass rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-white">
                        {primaryTraining?.title ?? 'Your next training will appear here'}
                      </div>
                      <Badge variant="outline" className="text-cyan border-cyan/30">
                        {primaryProgress > 0 ? 'In Progress' : 'Not Started'}
                      </Badge>
                    </div>
                    <Progress value={primaryProgress} className="mb-2" />
                    <div className="text-sm text-text">
                      {primaryProgress > 0
                        ? `${primaryProgress.toFixed(0)}% complete`
                        : 'Start a training from the Learning Center'}
                    </div>
                  </div>
                  {secondaryTraining && (
                    <div className="glass rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-white">
                          {secondaryTraining.title}
                        </div>
                        <Badge variant="outline" className="text-text border-text/30">
                          Not Started
                        </Badge>
                      </div>
                      <Progress value={0} className="mb-2" />
                      <div className="text-sm text-text">
                        0% complete
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <Card className="glass">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <Bell className="text-gold" size={20} />
                  Recent Activity
                </CardTitle>
                <Link href="/dashboard/notifications">
                  <Button variant="ghost" size="sm" className="text-emerald">
                    View All
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.length === 0 ? (
                    <p className="text-sm text-text">
                      You have no recent notifications yet.
                    </p>
                  ) : (
                    notifications.map((activity) => (
                      <div key={activity.id} className="flex gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald mt-2 shrink-0" />
                        <div>
                          <div className="font-medium text-white text-sm">
                            {activity.title}
                          </div>
                          <div className="text-sm text-text">
                            {activity.message}
                          </div>
                          {activity.created_at && (
                            <div className="text-xs text-text/60 mt-1">
                              {new Date(activity.created_at).toLocaleString()}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-white">
                  {isSuperAdmin ? 'Admin Actions' : 'Quick Actions'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {isSuperAdmin ? (
                  <>
                    <Link href="/dashboard/admin/users">
                      <Button variant="outline" className="w-full justify-start border-border hover:bg-midnight-light">
                        <Users className="mr-2" size={18} />
                        Manage Users
                      </Button>
                    </Link>
                    <Link href="/dashboard/admin/applications">
                      <Button variant="outline" className="w-full justify-start border-border hover:bg-midnight-light">
                        <CheckCircle className="mr-2" size={18} />
                        Review Applications
                      </Button>
                    </Link>
                    <Link href="/dashboard/admin/products">
                      <Button variant="outline" className="w-full justify-start border-border hover:bg-midnight-light">
                        <Package className="mr-2" size={18} />
                        Review Products
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/dashboard/community">
                      <Button variant="outline" className="w-full justify-start border-border hover:bg-midnight-light">
                        <MessageSquare className="mr-2" size={18} />
                        Post in Community
                      </Button>
                    </Link>
                    <Link href="/dashboard/products">
                      <Button variant="outline" className="w-full justify-start border-border hover:bg-midnight-light">
                        <Sparkles className="mr-2" size={18} />
                        Submit Product
                      </Button>
                    </Link>
                    <Link href="/dashboard/program">
                      <Button variant="outline" className="w-full justify-start border-border hover:bg-midnight-light">
                        <BookOpen className="mr-2" size={18} />
                        Apply for AI Program
                      </Button>
                    </Link>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
