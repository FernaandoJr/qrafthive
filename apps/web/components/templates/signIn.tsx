'use client';
import { RiGithubFill, RiGoogleFill } from '@remixicon/react';
import { Eye, EyeOff, QrCode, TriangleAlert } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { Fragment, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Spinner } from '../ui/spinner';

export default function SigninForm({ handleSignUp }: { handleSignUp: () => void }) {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const toggleVisibility = () => setIsVisible((prevState) => !prevState);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
  };

  const handleProvider = async (
    event: React.MouseEvent<HTMLButtonElement>,
    value: 'github' | 'google',
  ) => {
    event.preventDefault();
  };

  return (
    <Fragment>
      <div className='flex flex-col items-center justify-center w-full'>
        <QrCode className='mb-2 h-8 w-8' />
        <h4 className='scroll-m-20 text-xl font-semibold tracking-tight'>Welcome back!</h4>
        <p className='text-sm text-muted-foreground'>
          Enter your credentials to login to your account.
        </p>
      </div>
      <form onSubmit={handleSubmit} className='flex flex-col w-full gap-4' autoComplete='off'>
        <div className='flex flex-col w-full gap-4'>
          <div className='grid w-full items-center gap-3'>
            <Label htmlFor='email'>Email</Label>
            <Input
              type='email'
              id='email'
              placeholder='email@example.com'
              disabled={pending}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete='off'
              required
            />
          </div>
          <div className='relative w-full items-center gap-3'>
            <Label htmlFor='email'>Password</Label>
            <Input
              id='email'
              placeholder='Password'
              type={isVisible ? 'text' : 'password'}
              disabled={pending}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete='new-password'
              required
            />
            <Button
              type='button'
              variant='ghost'
              size='icon'
              className='absolute top-6 right-0'
              onClick={toggleVisibility}
            >
              {isVisible ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
            </Button>
          </div>
          {/* REMEMBER ME */}
          <div className='flex flex-row gap-2'>
            <div className='flex justify-between w-full'>
              <Link
                href={'#'}
                className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 underline'
              >
                Forgot password?
              </Link>
            </div>
          </div>
          {!!error && (
            <div className='flex items-center gap-1 bg-destructive/15 p-2 rounded-md'>
              <TriangleAlert className='text-red-700 h-4 w-4' />
              <p className='text-sm text-red-700'>{error}</p>
            </div>
          )}
          {/* SIGN IN BUTTON */}
          <div className='flex flex-col gap-4'>
            <Button type='submit' variant='default' className='w-full' disabled={pending}>
              {pending ? 'Signing in...' : 'Sign in'}
              {pending ? <Spinner className='h-5 w-5 ml-2 text-white dark:text-black' /> : null}
            </Button>
            <div className='flex items-center gap-3 before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border'>
              <span className='text-xs text-muted-foreground'>Or</span>
            </div>
            <div className='flex flex-col gap-2'>
              <Button
                onClick={(e) => handleProvider(e, 'google')}
                className='bg-[#DB4437] text-white after:flex-1 hover:bg-[#DB4437]/90'
              >
                <span className='pointer-events-none me-2 flex-1'>
                  <RiGoogleFill className='opacity-60' size={16} aria-hidden='true' />
                </span>
                Login with Google
              </Button>

              <Button
                onClick={(e) => handleProvider(e, 'github')}
                className='bg-[#333333] text-white after:flex-1 hover:bg-[#333333]/90'
              >
                <span className='pointer-events-none me-2 flex-1'>
                  <RiGithubFill className='opacity-60' size={16} aria-hidden='true' />
                </span>
                Login with GitHub
              </Button>
            </div>
          </div>
        </div>
      </form>
      <div className='flex justify-center gap-2 md:justify-start w-full mt-4'>
        <p className='text-muted-foreground text-sm max-w-sm'>
          Don&apos;t have an account?{' '}
          <a onClick={handleSignUp} className='text-blue-400'>
            Create an account
          </a>
        </p>
      </div>
    </Fragment>
  );
}
