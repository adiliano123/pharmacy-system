'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import CashierDashboard from '@/components/Cashier/CashierDashboard';

export default function CashierPage() {
  const router = useRouter();
  const { isAuthenticated, user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (user && user.role !== 'cashier') {
        router.push(`/${user.role}`);
      }
    }
  }, [isAuthenticated, user, loading, router]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user || user.role !== 'cashier') {
    return null;
  }

  return <CashierDashboard />;
}
