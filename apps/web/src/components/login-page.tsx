'use client';
import { GradientMesh } from '@/components/gradient-mesh';
import { useState } from 'react';
import SigninForm from './templates/signIn';
import SignupForm from './templates/signUp';

export function DemoPage() {
  const [isSignup, setIsSignup] = useState(false);

  const handleSignup = () => {
    setIsSignup(!isSignup);
  };

  return (
    <div className='grid min-h-svh lg:grid-cols-2'>
      <div className='flex flex-col gap-4 p-6 md:p-10'>
        <div className='flex justify-center gap-2 md:justify-start'></div>
        <div className='flex flex-1 w-full items-center justify-center'>
          <div className='w-screen flex flex-col items-center'>
            {isSignup ? (
              <SignupForm handleSignIn={handleSignup} />
            ) : (
              <SigninForm handleSignUp={handleSignup} />
            )}
          </div>
        </div>
      </div>
      <div className='bg-muted relative hidden lg:block'>
        <GradientMesh
          colors={['#bcecf6', '#00aaff', '#ffd447']}
          distortion={8}
          swirl={0.2}
          speed={2}
          rotation={90}
          waveAmp={0.2}
          waveFreq={20}
          waveSpeed={0.2}
          grain={0.1}
        />
      </div>
    </div>
  );
}
