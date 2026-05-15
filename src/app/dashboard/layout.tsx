'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  GraduationCap,
  Shield,
  CheckCircle,
  FileText,
  Layers,
  Clock,
  Rocket,
  LayoutGridIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/context/AuthContext';
import GuestBanner from '@/components/auth/GuestBanner';
import { getInitials } from '@/lib/utils';
import Logo from '@/components/logo.png';
import { BlockList } from 'net';

// Regular user sidebar items
const userSidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: User, label: 'Profile', href: '/dashboard/profile' },
  { icon: CreditCard, label: 'Membership', href: '/dashboard/membership' },
  { icon: Rocket, label: 'AI Launchpad', href: '/dashboard/tools' },
  { icon: BookOpen, label: 'Learning Center', href: '/dashboard/learning' },
  { icon: MessageSquare, label: 'Community', href: '/dashboard/community' },
  { icon: MapPin, label: 'State Hub', href: '/dashboard/state-hub' },
  { icon: Users, label: 'Referrals', href: '/dashboard/referrals' },
  { icon: Package, label: 'Products', href: '/dashboard/products' },
  { icon: GraduationCap, label: 'AI Program', href: '/dashboard/program' },
  { icon: Bell, label: 'Notifications', href: '/dashboard/notifications' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

// Super admin sidebar items - no State Hub, Membership, etc.
const superAdminSidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Users, label: 'Users', href: '/dashboard/admin/users' },
  { icon: Clock, label: 'Pending Users', href: '/dashboard/admin/pending-users' },
  { icon: CreditCard, label: 'Payments', href: '/dashboard/admin/payments' },
  { icon: Rocket, label: 'AI Launchpad', href: '/dashboard/tools' },
  { icon: LayoutGridIcon, label: 'Manage Tools', href: '/dashboard/admin/tools' },
  { icon: CheckCircle, label: 'Applications', href: '/dashboard/admin/applications' },
  { icon: Package, label: 'Products', href: '/dashboard/admin/products' },
  { icon: Layers, label: 'Cohorts', href: '/dashboard/admin/cohorts' },
  { icon: BookOpen, label: 'Trainings', href: '/dashboard/admin/trainings' },
  { icon: FileText, label: 'Audit Logs', href: '/dashboard/admin/audit-logs' },
  { icon: Settings, label: 'Settings', href: '/dashboard/admin/settings' },
];

// State admin sidebar items - includes user features + admin management
const stateAdminSidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: User, label: 'Profile', href: '/dashboard/profile' },
  { icon: Rocket, label: 'AI Launchpad', href: '/dashboard/tools' },
  { icon: BookOpen, label: 'Learning Center', href: '/dashboard/learning' },
  { icon: MessageSquare, label: 'Community', href: '/dashboard/community' },
  { icon: MapPin, label: 'State Hub', href: '/dashboard/state-hub' },
  { icon: Package, label: 'Products', href: '/dashboard/products' },
  { icon: GraduationCap, label: 'AI Program', href: '/dashboard/program' },
  { icon: Users, label: 'Referrals', href: '/dashboard/referrals' },
  { icon: Bell, label: 'Notifications', href: '/dashboard/notifications' },
  // Admin management section
  { icon: Shield, label: 'Admin Users', href: '/dashboard/admin/users' },
  { icon: Clock, label: 'Pending Users', href: '/dashboard/admin/pending-users' },
  { icon: CheckCircle, label: 'Applications', href: '/dashboard/admin/applications' },
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

  // Determine which sidebar to show based on role
  const isSuperAdmin = user?.role === 'super_admin';
  const isStateAdmin = user?.role === 'state_admin';
  const isAdmin = isSuperAdmin || isStateAdmin;

  const sidebarItems = isSuperAdmin
    ? superAdminSidebarItems
    : isStateAdmin
    ? stateAdminSidebarItems
    : userSidebarItems;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-border">
        <Link href="/" className="text-xl font-bold font-display text-gradient">
          AIBUILDERS.NG
        </Link>
        {isSuperAdmin && (
          <div className="flex items-center gap-1 mt-1">
            <Shield className="text-purple" size={14} />
            <span className="text-xs text-purple font-medium">Super Admin</span>
          </div>
        )}
        {isStateAdmin && (
          <div className="flex items-center gap-1 mt-1">
            <Shield className="text-cyan" size={14} />
            <span className="text-xs text-cyan font-medium">State Admin</span>
          </div>
        )}
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
                  ? isSuperAdmin
                    ? 'bg-purple/10 text-purple border border-purple/30'
                    : isStateAdmin
                    ? 'bg-cyan/10 text-cyan border border-cyan/30'
                    : 'bg-emerald/10 text-emerald border border-emerald/30'
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

      {/* Mobile navbar + sidebar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50">
        <div className="glass border-b border-border">
          <div className="px-4 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 min-w-0">
              <div className="relative w-8 h-8 shrink-0">
                <Image
                  src={Logo}
                  alt="Nigerian AI Builders logo"
                  className="rounded-lg object-contain"
                  fill
                  priority
                  sizes="32px"
                />
              </div>
              <span className="text-base font-bold font-display text-white-gradient-motion truncate">
                AIBUILDERS.NG
              </span>
            </Link>

            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white min-h-[44px] min-w-[44px]"
                  aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                >
                  <Menu size={22} />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                overlayClassName="top-14 z-40 bg-black/60 backdrop-blur-sm data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0"
                className="top-14 h-[calc(100vh-3.5rem)] w-72 max-w-[85vw] p-0 glass border-r border-border rounded-none data-[state=open]:duration-500 data-[state=closed]:duration-300"
              >
                <SidebarContent />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 min-h-screen pt-14 lg:pt-0">
        <GuestBanner />
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
