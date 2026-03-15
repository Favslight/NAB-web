'use client';

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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const stats = [
  { label: 'Membership Status', value: 'Active', icon: CreditCard, color: 'text-emerald' },
  { label: 'Referrals', value: '12', icon: Users, color: 'text-cyan' },
  { label: 'State Hub', value: 'NAB Lagos', icon: MapPin, color: 'text-gold' },
  { label: 'Training Progress', value: '75%', icon: BookOpen, color: 'text-emerald' },
];

const activities = [
  { title: 'Welcome to NAB!', desc: 'Your membership is now active', time: '2 hours ago', type: 'membership' },
  { title: 'New referral joined', desc: 'John D. used your referral code', time: '1 day ago', type: 'referral' },
  { title: 'New training available', desc: 'AI Fundamentals - Week 3', time: '2 days ago', type: 'training' },
  { title: 'State hub announcement', desc: 'NAB Lagos meetup this Saturday', time: '3 days ago', type: 'announcement' },
];

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-display text-white">
              Welcome back, {user?.full_name?.split(' ')[0] || 'Builder'}!
            </h1>
            <p className="text-text mt-1">
              Here&apos;s what&apos;s happening in your NAB journey
            </p>
          </div>
          <Link href="/dashboard/referrals">
            <Button className="btn-neon">
              <Sparkles className="mr-2" size={18} />
              Refer & Earn ₦5,000
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                
                
                
              >
                <Card className="glass card-hover">
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
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Membership Card */}
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
                      {user?.membership_status === 'active' ? 'Active Member' : 'Pending Activation'}
                    </div>
                    <div className="text-sm text-text">
                      ID: {user?.id_no || 'NAB-XXX-0000'}
                    </div>
                  </div>
                  <Badge className="bg-emerald/20 text-emerald border-emerald/30">
                    {user?.membership_status || 'Inactive'}
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

            {/* Upcoming Training */}
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
                    <div className="font-medium text-white">AI Fundamentals</div>
                    <Badge variant="outline" className="text-cyan border-cyan/30">
                      In Progress
                    </Badge>
                  </div>
                  <Progress value={75} className="mb-2" />
                  <div className="text-sm text-text">3 of 4 modules completed</div>
                </div>
                <div className="glass rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-white">Building AI Products</div>
                    <Badge variant="outline" className="text-text border-text/30">
                      Not Started
                    </Badge>
                  </div>
                  <Progress value={0} className="mb-2" />
                  <div className="text-sm text-text">0 of 6 modules completed</div>
                </div>
              </CardContent>
            </Card>
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
                  {activities.map((activity, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald mt-2 shrink-0" />
                      <div>
                        <div className="font-medium text-white text-sm">{activity.title}</div>
                        <div className="text-sm text-text">{activity.desc}</div>
                        <div className="text-xs text-text/60 mt-1">{activity.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
