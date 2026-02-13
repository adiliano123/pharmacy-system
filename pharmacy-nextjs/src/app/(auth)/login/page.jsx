'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import LoginForm from '@/components/Auth/LoginForm';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      switch (user.role) {
        case 'admin':
          router.push('/admin');
          break;
        case 'pharmacist':
          router.push('/pharmacist');
          break;
        case 'cashier':
          router.push('/cashier');
          break;
        default:
          router.push('/');
      }
    }
  }, [isAuthenticated, user, router]);

  if (isAuthenticated) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}>
        <p>Redirecting...</p>
      </div>
    );
  }

  return <LoginForm />;
}
