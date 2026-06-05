'use client';

import { useEffect, useState } from 'react';

import { Bell, Check, Trash2, Megaphone, User, BookOpen, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { notificationApi } from '@/lib/api';
import toast from 'react-hot-toast';

type NotificationItem = {
  id: string;
  title?: string;
  message?: string;
  body?: string;
  type?: string;
  is_read?: boolean;
  created_at?: string;
};

const getIcon = (type: string) => {
  switch (type) {
    case 'announcement':
      return <Megaphone className="text-cyan" size={20} />;
    case 'referral':
      return <User className="text-emerald" size={20} />;
    case 'training':
      return <BookOpen className="text-gold" size={20} />;
    case 'payment':
    case 'membership':
      return <CreditCard className="text-red-400" size={20} />;
    default:
      return <Bell className="text-text" size={20} />;
  }
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const loadNotifications = async () => {
    try {
      const res = await notificationApi.getAll({ page: 1, limit: 50 });
      if (res.success && res.data) {
        const items = (res.data as any)?.items ?? (res.data as any)?.notifications ?? res.data;
        setNotifications(
          Array.isArray(items)
            ? items.map((n: any) => ({
                id: n.id,
                title: n.title,
                message: n.message ?? n.body,
                type: n.type,
                is_read: n.is_read,
                created_at: n.created_at,
              }))
            : []
        );
      }
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    setActionLoading(true);
    try {
      await notificationApi.markAllAsRead();
      toast.success('All marked as read');
      await loadNotifications();
    } catch {
      toast.error('Failed to mark all as read');
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch {
      // ignore
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await notificationApi.delete(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      toast.success('Notification removed');
    } catch {
      toast.error('Failed to remove');
    }
  };

  return (
    <ProtectedRoute>
      <div className="responsive-page">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-display text-white mb-2">
              Notifications
            </h1>
            <p className="text-text">
              Stay updated with your NAB activities
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-border"
              onClick={handleMarkAllRead}
              disabled={actionLoading || notifications.length === 0}
            >
              <Check className="mr-2" size={18} />
              Mark All Read
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {loading ? (
            <p className="text-sm text-text">Loading notifications...</p>
          ) : notifications.length === 0 ? (
            <p className="text-sm text-text">You have no notifications yet.</p>
          ) : (
            notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`glass card-hover ${!notification.is_read ? 'border-emerald/30' : ''}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-midnight-light">
                      {getIcon(notification.type ?? '')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-white flex items-center gap-2">
                            {notification.title ?? 'Notification'}
                            {!notification.is_read && (
                              <span className="w-2 h-2 rounded-full bg-emerald shrink-0" />
                            )}
                          </h3>
                          <p className="text-text mt-1">{notification.message ?? notification.body ?? ''}</p>
                          {notification.created_at && (
                            <div className="text-sm text-text/60 mt-2">
                              {new Date(notification.created_at).toLocaleString()}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {notification.type && (
                            <Badge variant="outline" className="text-text/60 border-text/20">
                              {notification.type}
                            </Badge>
                          )}
                          {!notification.is_read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-emerald"
                              onClick={() => handleMarkRead(notification.id)}
                            >
                              Mark read
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300"
                            onClick={() => handleDelete(notification.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
