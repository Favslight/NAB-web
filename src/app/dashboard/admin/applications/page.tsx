'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { adminApi } from '@/lib/api';
import { toast } from 'sonner';

interface Application {
  id: string;
  applicant_name: string;
  applicant_email: string;
  applicant_avatar?: string;
  cohort_name: string;
  start_date: string;
  status: string;
  created_at: string;
}

export default function AdminApplicationsPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);

  const isSuperAdmin = user?.role === 'super_admin';

  useEffect(() => {
    loadApplications();
  }, [page]);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getApplications({ page, limit });
      if (res.success && res.data) {
        setApplications(res.data || []);
        setTotal(res.meta?.total || res.data?.length || 0);
      }
    } catch (error: any) {
      toast.error('Failed to load applications: ' + (error.message || 'Unknown error'));
      console.error('Load applications error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (id: string, status: 'accepted' | 'rejected' | 'waitlisted') => {
    try {
      const res = await adminApi.reviewApplication(id, { status });
      if (res.success) {
        toast.success(`Application ${status}`);
        loadApplications();
      }
    } catch {
      toast.error('Failed to review application');
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <ProtectedRoute>
      <div className="responsive-page">
        {/* Header */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="p-2 rounded-lg bg-gold/20">
            <CheckCircle className="text-gold" size={24} />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold font-display text-white">Program Applications</h1>
            <p className="text-text text-sm">
              {isSuperAdmin ? 'Review all program applications' : 'Review applications for your state'}
            </p>
          </div>
        </div>

        {/* Applications Table */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-white">Pending Applications ({total})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-text">Loading applications...</div>
            ) : applications.length === 0 ? (
              <div className="text-center py-8 text-text">No pending applications</div>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="flex min-w-0 flex-col justify-between gap-4 rounded-lg border border-border bg-midnight-light/50 p-3 sm:p-4 md:flex-row md:items-center"
                  >
                    <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                      <div className="w-10 h-10 rounded-full bg-emerald/20 flex items-center justify-center">
                        <Clock className="text-emerald" size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-medium">{app.applicant_name}</p>
                        <p className="text-text text-sm">{app.applicant_email}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <Badge variant="outline" className="text-gold border-gold/30">
                            {app.cohort_name}
                          </Badge>
                          <span className="text-text text-xs">
                            Applied {new Date(app.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-3 md:flex md:items-center">
                      <Button
                        size="sm"
                        className="bg-emerald hover:bg-emerald/80"
                        onClick={() => handleReview(app.id, 'accepted')}
                      >
                        <CheckCircle size={16} className="mr-1" />
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-rose text-rose hover:bg-rose/10"
                        onClick={() => handleReview(app.id, 'rejected')}
                      >
                        <XCircle size={16} className="mr-1" />
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gold text-gold hover:bg-gold/10"
                        onClick={() => handleReview(app.id, 'waitlisted')}
                      >
                        <Clock size={16} className="mr-1" />
                        Waitlist
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
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
