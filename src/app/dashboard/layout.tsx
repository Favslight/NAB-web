'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  LayoutDashboard,
  User,
  CreditCard,
  BookOpen,
  MessageSquare,
  MapPin,
  Users,
  Package,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  GraduationCap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/context/AuthContext';
import { getInitials } from '@/lib/utils';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: User, label: 'Profile', href: '/dashboard/profile' },
  { icon: CreditCard, label: 'Membership', href: '/dashboard/membership' },
  { icon: BookOpen, label: 'Learning Center', href: '/dashboard/learning' },
  { icon: MessageSquare, label: 'Community', href: '/dashboard/community' },
  { icon: MapPin, label: 'State Hub', href: '/dashboard/state-hub' },
  { icon: Users, label: 'Referrals', href: '/dashboard/referrals' },
  { icon: Package, label: 'Products', href: '/dashboard/products' },
  { icon: GraduationCap, label: 'AI Program', href: '/dashboard/program' },
  { icon: Bell, label: 'Notifications', href: '/dashboard/notifications' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-border">
        <Link href="/" className="text-xl font-bold font-display text-gradient">
          AIBUILDERS.NG
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-emerald/10 text-emerald border border-emerald/30'
                  : 'text-text hover:bg-midnight-light hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <Avatar className="w-10 h-10 border-2 border-emerald/30">
            <AvatarImage src={user?.avatar_url} />
            <AvatarFallback className="bg-emerald/20 text-emerald">
              {user?.full_name ? getInitials(user.full_name) : '??'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.full_name || 'Loading...'}
            </p>
            <p className="text-xs text-text/60 truncate">
              {user?.id_no || ''}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full text-text hover:text-red-400 hover:bg-red-500/10"
          onClick={logout}
        >
          <LogOut size={18} className="mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-midnight flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 glass border-r border-border fixed h-full">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild className="lg:hidden fixed top-4 left-4 z-50">
          <Button variant="ghost" size="icon" className="text-white">
            <Menu size={24} />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 glass border-r border-border">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 min-h-screen">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
