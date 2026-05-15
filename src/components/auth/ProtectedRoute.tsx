'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireSuperAdmin?: boolean;
}

export default function ProtectedRoute({
  children,
  requireSuperAdmin = false,
}: ProtectedRouteProps): any {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (requireSuperAdmin && user?.role !== 'super_admin') {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, isLoading, user, router, requireSuperAdmin]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-midnight">
        <div className="animate-pulse-glow flex flex-col items-center gap-4">
          <div className="text-4xl font-bold text-emerald">AIBUILDERS.NG</div>
          <div className="text-text">Loading...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || (requireSuperAdmin && user?.role !== 'super_admin')) {
    return null;
  }

  return <>{children}</>;
}
