'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import PharmacistDashboard from '@/components/Pharmacist/PharmacistDashboard';

export default function PharmacistPage() {
  const router = useRouter();
  const { isAuthenticated, user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (user && user.role !== 'pharmacist') {
        router.push(`/${user.role}`);
      }
    }
  }, [isAuthenticated, user, loading, router]);

  if (loading || !isAuthenticated || !user || user.role !== 'pharmacist') {
    return null;
  }

  return <PharmacistDashboard />;
}
