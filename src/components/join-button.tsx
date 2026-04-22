'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface JoinButtonProps {
  className?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children: React.ReactNode;
}

export function JoinButton({ className, size = 'lg', children }: JoinButtonProps) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleClick = () => {
    if (isAuthenticated && user) {
      // User is logged in, go to dashboard to process payment
      router.push('/dashboard');
    } else {
      // Not logged in, redirect to login
      router.push('/login');
    }
  };

  return (
    <Button 
      size={size} 
      className={className}
      onClick={handleClick}
    >
      {children}
    </Button>
  );
}
