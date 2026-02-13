'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AdminDashboard from '@/components/Admin/AdminDashboard';

export default function AdminPage() {
  const router = useRouter();
  const { isAuthenticated, user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (user && user.role !== 'admin') {
        router.push(`/${user.role}`);
      }
    }
  }, [isAuthenticated, user, loading, router]);

  if (loading || !isAuthenticated || !user || user.role !== 'admin') {
    return null;
  }

  return <AdminDashboard />;
}
