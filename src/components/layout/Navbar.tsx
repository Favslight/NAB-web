'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import Logo from '@/components/logo.png';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Membership', href: '/membership' },
  { label: 'Program', href: '/program' },
  { label: 'Products', href: '/products' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const shiftLeftForAuthPages = pathname === '/login' || pathname === '/signup';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full pt-3 sm:pt-4 md:pt-5">
      <motion.nav
        initial={{ opacity: 0, y: -16, x: 0 }}
        animate={{ opacity: 1, y: 0, x: shiftLeftForAuthPages ? -19 : 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`
          layout-shell
          rounded-xl sm:rounded-2xl md:rounded-full
          glass border border-border/50
          transition-all duration-300 ease-out
          ${scrolled ? 'ring-1 ring-emerald/30 shadow-[0_8px_32px_rgba(0,255,166,0.06)]' : ''}
        `}
      >
        <div className="flex items-center justify-between h-12 sm:h-14 md:h-16">
          <Link href="/" className="flex items-center gap-2 shrink-0 min-w-0">
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10">
              <Image
                src={Logo}
                alt="Nigerian AI Builders logo"
                className="rounded-lg object-contain"
                fill
                priority
                sizes="40px"
              />
            </div>
            <span className="text-base sm:text-xl md:text-2xl font-bold font-display text-white-gradient-motion truncate">
              AIBUILDERS.NG
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 rounded-full text-text hover:text-emerald hover:bg-white/5 transition-colors duration-200 text-sm font-medium"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2 shrink-0">
            <Link href="/login">
              <Button variant="ghost" className="rounded-full text-text hover:text-emerald">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="btn-neon rounded-full">
                Join NAB
              </Button>
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2.5 rounded-xl text-text hover:bg-white/5 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="md:hidden overflow-hidden border-t border-border/50"
            >
              <div className="px-4 pt-3 pb-5 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-4 py-3 rounded-xl text-text hover:text-emerald hover:bg-white/5 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="pt-3 mt-3 border-t border-border/50 space-y-2">
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full rounded-xl text-text">
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={() => setIsOpen(false)}>
                    <Button className="w-full btn-neon rounded-xl">
                      Join NAB
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </header>
  );
}
