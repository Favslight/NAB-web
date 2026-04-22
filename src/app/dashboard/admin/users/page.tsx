'use client';

import { useEffect, useState } from 'react';
import { Users, Search, ChevronLeft, ChevronRight, Shield, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { adminApi } from '@/lib/api';
import { toast } from 'sonner';

interface UserData {
  id: string;
  full_name: string;
  email: string;
  id_no: string;
  state_name?: string;
  membership_status?: string;
  role: string;
  created_at: string;
}

export default function AdminUsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');

  const isSuperAdmin = user?.role === 'super_admin';

  useEffect(() => {
    loadUsers();
  }, [page]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getUsers({ page, limit });
      if (res.success && res.data) {
        // Backend returns data as array with meta object
        setUsers(res.data || []);
        setTotal(res.meta?.total || res.data?.length || 0);
      }
    } catch (error: any) {
      toast.error('Failed to load users: ' + (error.message || 'Unknown error'));
      console.error('Load users error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.id_no?.toLowerCase().includes(search.toLowerCase())
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
                {isSuperAdmin ? 'Manage all platform users' : 'Manage users in your state'}
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

        {/* Users Table */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>All Users ({total.toLocaleString()})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-text">Loading users...</div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-text">No users found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-text text-sm font-medium">User</th>
                      <th className="text-left py-3 px-4 text-text text-sm font-medium">ID Number</th>
                      <th className="text-left py-3 px-4 text-text text-sm font-medium">State</th>
                      <th className="text-left py-3 px-4 text-text text-sm font-medium">Role</th>
                      <th className="text-left py-3 px-4 text-text text-sm font-medium">Status</th>
                      <th className="text-left py-3 px-4 text-text text-sm font-medium">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
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
                        <td className="py-3 px-4 text-text">{u.id_no}</td>
                        <td className="py-3 px-4 text-text">{u.state_name || '-'}</td>
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
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
