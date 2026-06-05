'use client';

import { useEffect, useState } from 'react';
import { FileText, ChevronLeft, ChevronRight, User, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { adminApi } from '@/lib/api';
import { toast } from 'sonner';

interface AuditLog {
  id: string;
  admin_name: string;
  action: string;
  entity_type: string;
  entity_id: string;
  new_values_json?: string;
  created_at: string;
}

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadLogs();
  }, [page]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getAuditLogs({ page, limit });
      if (res.success && res.data) {
        setLogs(res.data || []);
        setTotal(res.meta?.total || res.data?.length || 0);
      }
    } catch (error: any) {
      toast.error('Failed to load audit logs: ' + (error.message || 'Unknown error'));
      console.error('Load audit logs error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action: string) => {
    if (action.includes('create')) return 'bg-emerald/20 text-emerald border-emerald/30';
    if (action.includes('update')) return 'bg-cyan/20 text-cyan border-cyan/30';
    if (action.includes('delete')) return 'bg-rose/20 text-rose border-rose/30';
    return 'bg-gold/20 text-gold border-gold/30';
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <ProtectedRoute>
      <div className="responsive-page">
        {/* Header */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="p-2 rounded-lg bg-rose/20">
            <FileText className="text-rose" size={24} />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold font-display text-white">Audit Logs</h1>
            <p className="text-text text-sm">Track all administrative actions</p>
          </div>
        </div>

        {/* Audit Logs Table */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity ({total})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-text">Loading audit logs...</div>
            ) : logs.length === 0 ? (
              <div className="text-center py-8 text-text">
                <FileText className="mx-auto mb-4 text-text/50" size={48} />
                <p>No audit logs found</p>
              </div>
            ) : (
              <div className="responsive-table">
                <table className="w-full min-w-[760px]">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-text text-sm font-medium">Admin</th>
                      <th className="text-left py-3 px-4 text-text text-sm font-medium">Action</th>
                      <th className="text-left py-3 px-4 text-text text-sm font-medium">Entity</th>
                      <th className="text-left py-3 px-4 text-text text-sm font-medium">Details</th>
                      <th className="text-left py-3 px-4 text-text text-sm font-medium">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => (
                      <tr key={log.id} className="border-b border-border/50 hover:bg-midnight-light/50">
                        <td className="py-3 px-4">
                          <div className="flex min-w-0 items-center gap-2">
                            <Shield className="text-purple" size={14} />
                            <span className="text-white safe-text">{log.admin_name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className={getActionColor(log.action)}>
                            {log.action}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-text">
                            {log.entity_type} #{log.entity_id.slice(0, 8)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {log.new_values_json && (
                            <span className="block max-w-xs truncate text-xs text-text">
                              {log.new_values_json.slice(0, 50)}...
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-text text-sm">
                          {new Date(log.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-text text-sm">
                      Showing {(page - 1) * limit + 1} - {Math.min(page * limit, total)} of {total}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                        className="border-border"
                      >
                        <ChevronLeft size={16} />
                      </Button>
                      <span className="text-text text-sm px-2">
                        Page {page} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page + 1)}
                        disabled={page === totalPages}
                        className="border-border"
                      >
                        <ChevronRight size={16} />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
