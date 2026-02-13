'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (user) {
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
            router.push('/login');
        }
      }
    }
  }, [isAuthenticated, user, loading, router]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#fff'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>💊</h1>
        <h2>Pharmacy ERP System</h2>
        <p>Loading...</p>
      </div>
    </div>
  );
}
