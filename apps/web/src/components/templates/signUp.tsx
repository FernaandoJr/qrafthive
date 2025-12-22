'use client';
import { Check, Eye, EyeOff, QrCode, TriangleAlert, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
// import { motion } from "framer-motion"
import { RiGoogleFill } from '@remixicon/react';
import { useRouter } from 'next/navigation';
import React, { Fragment, useId, useState } from 'react';
import { Spinner } from '../ui/spinner';

export default function SignupForm({ handleSignIn }: { handleSignIn: () => void }) {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const toggleVisibility = () => setIsVisible((prevState) => !prevState);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);

    if (strengthScore < 4) {
      setError('Password is not strong enough');
      setPending(false);
      return;
    }
  };

  const id = useId();

  const handleProvider = async (
    event: React.MouseEvent<HTMLButtonElement>,
    value: 'github' | 'google',
  ) => {
    event.preventDefault();
  };

  const checkStrength = (pass: string) => {
    const requirements = [
      { regex: /.{8,}/, text: 'At least 8 characters' },
      { regex: /[0-9]/, text: 'At least 1 number' },
      { regex: /[a-z]/, text: 'At least 1 lowercase letter' },
      { regex: /[A-Z]/, text: 'At least 1 uppercase letter' },
    ];

    return requirements.map((req) => ({
      met: req.regex.test(pass),
      text: req.text,
    }));
  };

  const strength = checkStrength(form.password);

  const strengthScore = strength.filter((req) => req.met).length;

  const getStrengthColor = (score: number) => {
    if (score === 0) return 'bg-border';
    if (score <= 1) return 'bg-red-500';
    if (score <= 2) return 'bg-orange-500';
    if (score === 3) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const getStrengthText = (score: number) => {
    if (score === 0) return 'Enter a password';
    if (score <= 2) return 'Weak password';
    if (score === 3) return 'Medium password';
    return 'Strong password';
  };

  return (
    <Fragment>
      <div className='flex flex-col items-center justify-center w-full'>
        <QrCode className='mb-2 h-8 w-8' />
        <h4 className='scroll-m-20 text-xl font-semibold tracking-tight'>Create your Account!</h4>
        <p className='text-sm text-muted-foreground'>
          Welcome! Please fill in the details to get started.
        </p>
      </div>
      <form onSubmit={handleSubmit} className='flex flex-col w-full' autoComplete='off'>
        <div className='flex flex-col w-full gap-3'>
          <Label htmlFor='fullName'>Full name</Label>
          <Input
            id='fullName'
            name='fullName'
            disabled={pending}
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            placeholder='ex: John Doe'
            type='text'
            autoComplete='off'
            required
          />
          <div className='grid w-full items-center gap-4'>
            <Label htmlFor='email'>Email Address</Label>
            <Input
              id='email'
              name='email'
              disabled={pending}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder='example@gmail.com'
              type='email'
              autoComplete='off'
              required
            />
          </div>
          <div className='relative w-full  items-center'>
            <div className=''>
              <div className='flex flex-col w-full gap-3'>
                <Label htmlFor={id}>Password</Label>
                <div className='relative'>
                  <Input
                    id={id}
                    className='pe-9'
                    placeholder='Password'
                    type={isVisible ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    autoComplete='new-password'
                    aria-invalid={strengthScore < 4}
                    aria-describedby={`${id}-description`}
                  />
                  <button
                    className='absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50'
                    type='button'
                    onClick={toggleVisibility}
                    aria-label={isVisible ? 'Hide password' : 'Show password'}
                    aria-pressed={isVisible}
                    aria-controls='password'
                  >
                    {isVisible ? (
                      <EyeOff size={16} strokeWidth={2} aria-hidden='true' />
                    ) : (
                      <Eye size={16} strokeWidth={2} aria-hidden='true' />
                    )}
                  </button>
                </div>
                <div className='flex flex-col w-full gap-3'>
                  <Label>Confirm password</Label>
                  <Input
                    id='confirm'
                    name='password'
                    disabled={pending}
                    value={form.confirmPassword}
                    onChange={(e) => {
                      setForm({ ...form, confirmPassword: e.target.value });
                      if (form.password !== e.target.value) {
                        setError('Passwords do not match');
                      } else {
                        setError(null);
                      }
                    }}
                    placeholder='Confirm your password'
                    type='password'
                    autoComplete='new-password'
                    required
                  />
                </div>
              </div>

              <div
                className='mb-4 mt-3 h-1 w-full overflow-hidden rounded-full bg-border'
                role='progressbar'
                aria-valuenow={strengthScore}
                aria-valuemin={0}
                aria-valuemax={4}
                aria-label='Password strength'
              >
                <div
                  className={`h-full ${getStrengthColor(strengthScore)} transition-all duration-500 ease-out`}
                  style={{ width: `${(strengthScore / 4) * 100}%` }}
                ></div>
              </div>

              <p id={`${id}-description`} className='mb-2 text-sm font-medium text-foreground'>
                {getStrengthText(strengthScore)}. Must contain:
              </p>

              <ul className='space-y-1.5' aria-label='Password requirements'>
                {strength.map((req, index) => (
                  <li key={index} className='flex items-center gap-2'>
                    {req.met ? (
                      <Check size={16} className='text-emerald-500' aria-hidden='true' />
                    ) : (
                      <X size={16} className='text-muted-foreground/80' aria-hidden='true' />
                    )}
                    <span
                      className={`text-xs ${req.met ? 'text-emerald-600' : 'text-muted-foreground'}`}
                    >
                      {req.text}
                      <span className='sr-only'>
                        {req.met ? ' - Requirement met' : ' - Requirement not met'}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
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
              {pending ? 'Signing up...' : 'Sign up'}
              {pending ? <Spinner className='animate-spin h-5 w-5 text-white' /> : null}
            </Button>
            <Button
              onClick={(e) => handleProvider(e, 'google')}
              className='bg-[#DB4437] text-white after:flex-1 hover:bg-[#DB4437]/90'
            >
              <span className='pointer-events-none me-2 flex-1'>
                <RiGoogleFill className='opacity-60' size={16} aria-hidden='true' />
              </span>
              Login with Google
            </Button>
            <div className='flex justify-center gap-2 md:justify-start w-full mt-4'>
              <p className='text-muted-foreground text-sm max-w-sm'>
                Already have an account?{' '}
                <a onClick={handleSignIn} className='text-blue-400'>
                  Log In
                </a>
              </p>
            </div>
          </div>
        </div>
      </form>
    </Fragment>
  );
}
