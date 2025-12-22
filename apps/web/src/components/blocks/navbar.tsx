'use client';
import { cn } from '@/lib/utils';
import { Menu, QrCode } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { ModeToggle } from '../ui/darkTheme';
import { Separator } from '../ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';

const links = [
  {
    label: 'QRCode',
    href: '/qrcode',
  },
  {
    label: 'Components',
    href: '#',
  },
  {
    label: 'Templates',
    href: '#',
  },
  {
    label: 'Pricing',
    href: '#',
  },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className='fixed z-50 w-full px-2'>
      <nav
        className={cn(
          'mx-auto mt-2 max-w-5xl px-4 transition-all duration-300 rounded-xl',
          isScrolled && 'bg-background/60 rounded-xl border backdrop-blur-lg shadow-lg',
        )}
      >
        <div className='flex items-center justify-between py-2'>
          <div className='flex items-center space-x-6'>
            <Link
              href='/'
              className={cn(
                'text-base font-semibold flex items-center gap-2 transition-colors',
                isScrolled ? 'text-foreground' : 'text-foreground/90',
              )}
            >
              <QrCode className='w-4 h-4' />
              QRaftHive
            </Link>
            <div className='hidden md:flex items-center space-x-6'>
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'text-sm transition-colors',
                    isScrolled
                      ? 'text-foreground hover:text-foreground'
                      : 'text-muted-foreground/80 hover:text-foreground/80',
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className='flex items-center space-x-3'>
            <ModeToggle rounded variant='link' />
            <Separator orientation='vertical' className='h-6' />
            <Button
              variant='ghost'
              className={cn(
                'hidden md:inline-flex h-7 px-2 text-sm font-normal transition-colors',
                isScrolled
                  ? 'text-foreground/80 hover:text-foreground'
                  : 'text-muted-foreground/80 hover:text-foreground/80',
              )}
            >
              Sign in
            </Button>
            <Button className='hidden md:inline-flex h-7 rounded-full bg-foreground px-3 text-sm font-normal text-background hover:bg-foreground/90'>
              Get access
            </Button>
            <MobileNav />
          </div>
        </div>
      </nav>
    </header>
  );
}

function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant='ghost' size='icon' className='h-7 w-7 md:hidden'>
          <Menu className='h-[15px] w-[15px]' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side='right' className='w-[240px] sm:w-[300px]'>
        <nav className='flex flex-col space-y-4'>
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className='text-sm text-foreground/80 hover:text-foreground transition-colors'
            >
              {link.label}
            </a>
          ))}
          <Button
            variant='ghost'
            className='justify-start h-7 px-2 text-sm font-normal text-foreground/80 hover:text-foreground'
          >
            Sign in
          </Button>
          <Button className='h-7 rounded-full bg-foreground px-3 text-sm font-normal text-background hover:bg-foreground/90'>
            Get access
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
