'use client';

import { useEffect, useState } from 'react';
import { Settings, Save, RefreshCw, Key, Edit2, Check, X, Shield, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { adminApi } from '@/lib/api';
import { toast } from 'sonner';

interface SystemSetting {
  key: string;
  value: string;
  description?: string;
  updated_at?: string;
  updated_by_user_id?: string;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getSettings();
      if (res.success && res.data) {
        setSettings(res.data || []);
      } else {
        toast.error('Failed to load settings');
      }
    } catch (error: any) {
      toast.error('Failed to load settings: ' + (error.message || 'Unknown error'));
      console.error('Load settings error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (setting: SystemSetting) => {
    setEditingKey(setting.key);
    setEditValue(setting.value);
  };

  const handleCancel = () => {
    setEditingKey(null);
    setEditValue('');
  };

  const handleSave = async (key: string) => {
    setSaving(true);
    try {
      const res = await adminApi.updateSetting(key, editValue);
      if (res.success) {
        toast.success('Setting updated successfully');
        setEditingKey(null);
        loadSettings(); // Refresh settings
      } else {
        toast.error('Failed to update setting');
      }
    } catch (error: any) {
      toast.error('Failed to update setting: ' + (error.message || 'Unknown error'));
      console.error('Update setting error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleQuickToggle = async (key: string, checked: boolean) => {
    setSaving(true);
    try {
      const res = await adminApi.updateSetting(key, checked.toString());
      if (res.success) {
        toast.success(`${formatKey(key)} ${checked ? 'enabled' : 'disabled'}`);
        loadSettings(); // Refresh settings
      } else {
        toast.error('Failed to update setting');
      }
    } catch (error: any) {
      toast.error('Failed to update setting: ' + (error.message || 'Unknown error'));
      console.error('Update setting error:', error);
    } finally {
      setSaving(false);
    }
  };

  const formatKey = (key: string) => {
    return key
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald/20">
              <Settings className="text-emerald" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-display text-white">System Settings</h1>
              <p className="text-text text-sm">Configure platform-wide settings</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={loadSettings}
            disabled={loading}
            className="border-border"
          >
            <RefreshCw size={18} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Admin Approval Toggle */}
        <Card className="glass border-emerald/20">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-emerald/10">
                  <Shield className="text-emerald" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg">Require Admin Approval</h3>
                  <p className="text-text text-sm mt-1 max-w-xl">
                    When enabled, new users must be approved by an admin before they can log in.
                    Users will see a &quot;waitlist&quot; message after signup and cannot access the platform until approved.
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={settings.find(s => s.key === 'require_admin_approval')?.value === 'true'}
                  onChange={(e) => {
                    const setting = settings.find(s => s.key === 'require_admin_approval');
                    if (setting) {
                      handleQuickToggle('require_admin_approval', e.target.checked);
                    }
                  }}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-midnight-light peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald"></div>
                <span className="ml-3 text-sm font-medium text-text">
                  {settings.find(s => s.key === 'require_admin_approval')?.value === 'true' ? 'Enabled' : 'Disabled'}
                </span>
              </label>
            </div>
            
            {settings.find(s => s.key === 'require_admin_approval')?.value === 'true' && (
              <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-start gap-2">
                <UserCheck className="text-amber-500 shrink-0" size={18} />
                <p className="text-sm text-amber-200/80">
                  <span className="font-medium">Pending approvals:</span> New users will be added to the 
                  <a href="/dashboard/admin/pending-users" className="text-emerald hover:underline ml-1">pending users</a> queue.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Settings Table */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Key className="text-cyan" size={20} />
              All Settings ({settings.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-text">Loading settings...</div>
            ) : settings.length === 0 ? (
              <div className="text-center py-8 text-text">
                <Settings className="mx-auto mb-4 text-text/50" size={48} />
                <p>No settings found</p>
                <p className="text-sm mt-1">Settings will appear here once added to the database</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-text text-sm font-medium">Setting Key</th>
                      <th className="text-left py-3 px-4 text-text text-sm font-medium">Value</th>
                      <th className="text-left py-3 px-4 text-text text-sm font-medium">Last Updated</th>
                      <th className="text-right py-3 px-4 text-text text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {settings.map((setting) => (
                      <tr key={setting.key} className="border-b border-border/50 hover:bg-midnight-light/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-cyan border-cyan/30 font-mono text-xs">
                              {setting.key}
                            </Badge>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {editingKey === setting.key ? (
                            <Input
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="bg-midnight-light border-border w-full max-w-xs"
                              autoFocus
                            />
                          ) : (
                            <span className="text-white font-mono text-sm">{setting.value}</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-text text-sm">
                          {formatDate(setting.updated_at)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {editingKey === setting.key ? (
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                size="sm"
                                className="bg-emerald hover:bg-emerald/80 h-8 px-2"
                                onClick={() => handleSave(setting.key)}
                                disabled={saving}
                              >
                                <Check size={16} />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-border h-8 px-2"
                                onClick={handleCancel}
                                disabled={saving}
                              >
                                <X size={16} />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-border h-8"
                              onClick={() => handleEdit(setting)}
                            >
                              <Edit2 size={14} className="mr-1" />
                              Edit
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="glass border-cyan/20">
          <CardContent className="p-4">
            <p className="text-text text-sm">
              <span className="text-cyan font-medium">Note:</span> Changes to system settings take effect immediately. 
              Be careful when modifying critical settings like payment amounts or feature flags.
            </p>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
