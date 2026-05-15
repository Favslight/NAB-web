'use client';

import { useEffect, useState } from 'react';
import { Users, Search, ChevronLeft, ChevronRight, Shield, User, Loader2, ArrowUpCircle, ArrowDownCircle, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { adminApi } from '@/lib/api';
import { toast } from 'sonner';

interface UserData {
  id: string;
  full_name: string;
  email: string;
  id_no: string;
  state_id?: string;
  state_name?: string;
  membership_status?: string;
  role: string;
  created_at: string;
}

export default function AdminUsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [stateAdmins, setStateAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('all');
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const isSuperAdmin = user?.role === 'super_admin';

  useEffect(() => {
    if (view === 'all') {
      loadUsers();
    } else {
      loadStateAdmins();
    }
  }, [page, view]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getUsers({ page, limit });
      if (res.success && res.data) {
        setUsers(res.data || []);
        setTotal(res.meta?.total || res.data?.length || 0);
      }
    } catch (error: any) {
      toast.error('Failed to load users: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const loadStateAdmins = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getStateAdmins();
      if (res.success) {
        setStateAdmins(res.data || []);
        setTotal(res.data?.length || 0);
      }
    } catch (error: any) {
      toast.error('Failed to load state admins');
    } finally {
      setLoading(false);
    }
  };

  const handlePromote = async (userId: string) => {
    if (!confirm('Are you sure you want to promote this user to State Admin? This will demote any existing admin for their state.')) return;
    
    setActionLoading(userId);
    try {
      const res = await adminApi.assignStateAdmin(userId);
      if (res.success) {
        toast.success('User promoted to State Admin successfully');
        if (view === 'all') loadUsers(); else loadStateAdmins();
      } else {
        toast.error(res.error || 'Failed to promote user');
      }
    } catch (error: any) {
      toast.error('Error promoting user: ' + (error.message || 'Unknown error'));
    } finally {
      setActionLoading(null);
    }
  };

  const handleDemote = async (userId: string) => {
    if (!confirm('Are you sure you want to demote this State Admin to a regular member?')) return;

    setActionLoading(userId);
    try {
      const res = await adminApi.removeStateAdmin(userId);
      if (res.success) {
        toast.success('State Admin demoted successfully');
        if (view === 'all') loadUsers(); else loadStateAdmins();
      } else {
        toast.error(res.error || 'Failed to demote user');
      }
    } catch (error: any) {
      toast.error('Error demoting user: ' + (error.message || 'Unknown error'));
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.id_no?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredStateAdmins = stateAdmins.filter(
    (u) =>
      u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.state_name?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(total / limit);

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple/20">
              <Users className="text-purple" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-display text-white">User Management</h1>
              <p className="text-text text-sm">
                {isSuperAdmin ? 'Manage platform users and state representatives' : 'Manage users in your state'}
              </p>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text" size={18} />
            <Input
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 w-full md:w-64 bg-midnight-light border-border"
            />
          </div>
        </div>

        {/* Tabs */}
        {isSuperAdmin && (
          <Tabs value={view} onValueChange={setView} className="w-full">
            <TabsList className="bg-midnight-light border border-border">
              <TabsTrigger value="all" className="flex items-center gap-2">
                <Users size={16} /> All Users
              </TabsTrigger>
              <TabsTrigger value="state_admins" className="flex items-center gap-2">
                <MapPin size={16} /> State Admins
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}

        {/* Users Table */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between text-lg">
              <span>{view === 'all' ? 'All Users' : 'State Representatives'} ({total.toLocaleString()})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <Loader2 className="animate-spin text-emerald mx-auto mb-2" size={32} />
                <p className="text-text">Fetching data...</p>
              </div>
            ) : (view === 'all' ? filteredUsers : filteredStateAdmins).length === 0 ? (
              <div className="text-center py-12 text-text">No users found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-text text-sm font-medium">User</th>
                      {view === 'all' && <th className="text-left py-3 px-4 text-text text-sm font-medium">ID Number</th>}
                      <th className="text-left py-3 px-4 text-text text-sm font-medium">State</th>
                      {view === 'all' && <th className="text-left py-3 px-4 text-text text-sm font-medium">Role</th>}
                      <th className="text-left py-3 px-4 text-text text-sm font-medium">Status</th>
                      <th className="text-left py-3 px-4 text-text text-sm font-medium">Joined</th>
                      {isSuperAdmin && <th className="text-right py-3 px-4 text-text text-sm font-medium">Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {(view === 'all' ? filteredUsers : filteredStateAdmins).map((u) => (
                      <tr key={u.id} className="border-b border-border/50 hover:bg-midnight-light/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald/20 flex items-center justify-center">
                              <User className="text-emerald" size={14} />
                            </div>
                            <div>
                              <p className="text-white font-medium">{u.full_name}</p>
                              <p className="text-text text-sm">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        {view === 'all' && <td className="py-3 px-4 text-text">{u.id_no}</td>}
                        <td className="py-3 px-4 text-text">
                          <div className="flex items-center gap-1.5">
                            <MapPin size={12} className="text-text/60" />
                            {u.state_name || '-'}
                          </div>
                        </td>
                        {view === 'all' && (
                          <td className="py-3 px-4">
                            <Badge
                              className={
                                u.role === 'super_admin'
                                  ? 'bg-purple/20 text-purple border-purple/30'
                                  : u.role === 'state_admin'
                                  ? 'bg-cyan/20 text-cyan border-cyan/30'
                                  : 'bg-emerald/20 text-emerald border-emerald/30'
                              }
                            >
                              {u.role}
                            </Badge>
                          </td>
                        )}
                        <td className="py-3 px-4">
                          <Badge
                            className={
                              u.membership_status === 'active'
                                ? 'bg-emerald/20 text-emerald border-emerald/30'
                                : u.membership_status === 'pending'
                                ? 'bg-gold/20 text-gold border-gold/30'
                                : 'bg-rose/20 text-rose border-rose/30'
                            }
                          >
                            {u.membership_status || 'inactive'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-text text-sm">
                          {new Date(u.created_at).toLocaleDateString()}
                        </td>
                        {isSuperAdmin && (
                          <td className="py-3 px-4 text-right">
                            {u.role === 'super_admin' ? (
                              <span className="text-text/30 text-xs italic">System Admin</span>
                            ) : u.role === 'state_admin' ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDemote(u.id)}
                                disabled={!!actionLoading}
                                className="border-rose/30 text-rose hover:bg-rose/10 h-8"
                              >
                                {actionLoading === u.id ? (
                                  <Loader2 className="animate-spin" size={14} />
                                ) : (
                                  <>
                                    <ArrowDownCircle size={14} className="mr-1" />
                                    Demote
                                  </>
                                )}
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePromote(u.id)}
                                disabled={!!actionLoading || !u.state_id}
                                className="border-cyan/30 text-cyan hover:bg-cyan/10 h-8"
                                title={!u.state_id ? "User must be assigned to a state to be promoted" : ""}
                              >
                                {actionLoading === u.id ? (
                                  <Loader2 className="animate-spin" size={14} />
                                ) : (
                                  <>
                                    <ArrowUpCircle size={14} className="mr-1" />
                                    Promote
                                  </>
                                )}
                              </Button>
                            )}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination - only for all users view */}
            {view === 'all' && totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <p className="text-text text-sm">
                  Showing {(page - 1) * limit + 1} - {Math.min(page * limit, total)} of {total}
                </p>
                <div className="flex items-center gap-2">
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
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
