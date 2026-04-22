'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface ApplyButtonProps {
  className?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children: React.ReactNode;
  showArrow?: boolean;
}

export function ApplyButton({ className, size = 'lg', children, showArrow = true }: ApplyButtonProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleClick = () => {
    if (isAuthenticated) {
      // User is logged in, go to dashboard program page
      router.push('/dashboard/program');
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
      {showArrow && <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" size={20} />}
    </Button>
  );
}
