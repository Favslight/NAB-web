'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Switch } from '@radix-ui/react-switch';
import { adminApi } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

type Setting = {
  id: string;
  key: string;
  value: string;
  value_type: 'boolean' | 'number' | 'string';
  description?: string | null;
  updated_at?: string;
};

export default function SettingsPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const [settings, setSettings] = useState<Setting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const role = (user as any)?.role as string | undefined;
  const isAdmin = role === 'super_admin' || role === 'state_admin';

  useEffect(() => {
    if (!isAuthLoading && user && !isAdmin) {
      router.replace('/dashboard');
    }
  }, [isAdmin, isAuthLoading, router, user]);

  // Avoid flashing settings UI to non-admin users during redirect
  if (!isAuthLoading && user && !isAdmin) {
    return (
      <ProtectedRoute>
        <div className="p-6 text-text">Redirecting...</div>
      </ProtectedRoute>
    );
  }

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await adminApi.getSettings();
        if (!res.success || !res.data) {
          throw new Error(res.error || 'Failed to load settings');
        }
        setSettings(res.data as Setting[]);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to load settings');
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleChange = (key: string, rawValue: string | boolean) => {
    setSettings((prev) =>
      prev.map((s) =>
        s.key === key
          ? {
              ...s,
              value:
                typeof rawValue === 'boolean'
                  ? rawValue ? 'true' : 'false'
                  : rawValue,
            }
          : s
      )
    );
  };

  const handleSave = async (setting: Setting) => {
    setIsSaving(true);
    try {
      const res = await adminApi.updateSetting(setting.key, setting.value);
      if (!res.success) {
        throw new Error(res.error || 'Failed to update setting');
      }
      toast.success('Setting updated');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update setting');
    } finally {
      setIsSaving(false);
    }
  };

  const renderControl = (setting: Setting) => {
    if (setting.value_type === 'boolean') {
      const checked = setting.value === 'true';
      return (
        <div className="flex items-center gap-3">
          <Label htmlFor={setting.key} className="text-sm text-text">
            {checked ? 'Enabled' : 'Disabled'}
          </Label>
          <Switch
            id={setting.key}
            checked={checked}
            onCheckedChange={(v) => handleChange(setting.key, v)}
          />
        </div>
      );
    }

    if (setting.value_type === 'number') {
      return (
        <Input
          id={setting.key}
          type="number"
          className="max-w-xs"
          value={setting.value}
          onChange={(e) => handleChange(setting.key, e.target.value)}
        />
      );
    }

    return (
      <Input
        id={setting.key}
        className="max-w-md"
        value={setting.value}
        onChange={(e) => handleChange(setting.key, e.target.value)}
      />
    );
  };

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-display text-white mb-2">
            System Settings
          </h1>
          <p className="text-text">
            Manage global NAB configuration such as guest access, membership pricing, and referral rewards.
          </p>
        </div>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-white">Configuration</CardTitle>
            <CardDescription>
              Changes apply instantly across the platform. Use with care.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <p className="text-text">Loading settings...</p>
            ) : (
              <div className="space-y-4">
                {settings.map((setting) => (
                  <div
                    key={setting.id}
                    className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border border-border/60 rounded-lg px-4 py-3 bg-midnight-light/40"
                  >
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white">
                          {setting.key}
                        </span>
                        <span className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-white/5 text-text/70">
                          {setting.value_type}
                        </span>
                      </div>
                      {setting.description && (
                        <p className="text-xs text-text/70">
                          {setting.description}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-start gap-2 md:items-end">
                      {renderControl(setting)}
                      <Button
                        size="sm"
                        className="mt-1"
                        disabled={isSaving}
                        onClick={() => handleSave(setting)}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}

