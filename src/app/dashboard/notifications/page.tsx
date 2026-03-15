'use client';


import { Bell, Check, Trash2, Megaphone, User, BookOpen, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const notifications = [
  {
    id: 1,
    title: 'Welcome to NAB!',
    message: 'Your membership application has been approved. Welcome to the Nigerian AI Builders community!',
    type: 'announcement',
    read: false,
    time: '2 hours ago',
  },
  {
    id: 2,
    title: 'New referral joined',
    message: 'John Doe used your referral code and completed registration. You earned ₦5,000!',
    type: 'referral',
    read: false,
    time: '1 day ago',
  },
  {
    id: 3,
    title: 'New training module available',
    message: 'AI Fundamentals - Week 3 is now available in your learning center.',
    type: 'training',
    read: true,
    time: '2 days ago',
  },
  {
    id: 4,
    title: 'Payment reminder',
    message: 'Your membership renewal is due in 7 days. Please complete payment to maintain active status.',
    type: 'payment',
    read: true,
    time: '3 days ago',
  },
];

const getIcon = (type: string) => {
  switch (type) {
    case 'announcement':
      return <Megaphone className="text-cyan" size={20} />;
    case 'referral':
      return <User className="text-emerald" size={20} />;
    case 'training':
      return <BookOpen className="text-gold" size={20} />;
    case 'payment':
      return <CreditCard className="text-red-400" size={20} />;
    default:
      return <Bell className="text-text" size={20} />;
  }
};

export default function NotificationsPage() {
  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-display text-white mb-2">
              Notifications
            </h1>
            <p className="text-text">
              Stay updated with your NAB activities
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-border">
              <Check className="mr-2" size={18} />
              Mark All Read
            </Button>
            <Button variant="outline" className="border-border text-red-400">
              <Trash2 className="mr-2" size={18} />
              Clear All
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {notifications.map((notification, index) => (
            <div
              key={notification.id}
              
              
              
            >
              <Card className={`glass card-hover ${!notification.read ? 'border-emerald/30' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-midnight-light">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-white flex items-center gap-2">
                            {notification.title}
                            {!notification.read && (
                              <span className="w-2 h-2 rounded-full bg-emerald" />
                            )}
                          </h3>
                          <p className="text-text mt-1">{notification.message}</p>
                          <div className="text-sm text-text/60 mt-2">{notification.time}</div>
                        </div>
                        <Badge variant="outline" className="text-text/60 border-text/20">
                          {notification.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
}
