'use client';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

interface DarkModeProps {
  readonly rounded?: boolean;
  readonly variant?: 'ghost' | 'outline' | 'default' | 'secondary' | 'link';
}

export function ModeToggle({ rounded = false, variant = 'ghost' }: DarkModeProps) {
  const { setTheme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <Button
      variant={variant}
      size='icon'
      className={cn('cursor-pointer', { 'rounded-full': rounded })}
      onClick={() => {
        setTheme(isDark ? 'light' : 'dark');
      }}
    >
      <motion.div
        className='flex items-center justify-center'
        initial={false}
        animate={{ rotate: isDark ? 0 : 180 }}
        transition={{
          duration: 0.5,
          ease: 'easeOut',
          type: 'spring',
          bounce: 0.1,
        }}
      >
        {isDark ? <Moon className='size-4' /> : <Sun className='size-4' />}
      </motion.div>
      <span className='sr-only'>Toggle theme</span>
    </Button>
  );
}
