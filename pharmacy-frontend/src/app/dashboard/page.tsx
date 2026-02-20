'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const redirectToDashboard = async () => {
      const user = await auth.getCurrentUser();
      
      if (!user) {
        router.push('/login');
        return;
      }

      // Redirect based on role
      switch (user.role) {
        case 'admin':
          router.push('/dashboard/admin');
          break;
        case 'pharmacist':
          router.push('/dashboard/pharmacist');
          break;
        case 'cashier':
          router.push('/dashboard/cashier');
          break;
        default:
          router.push('/login');
      }
    };

    redirectToDashboard();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="text-4xl mb-4 animate-bounce">💊</div>
        <p>Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
