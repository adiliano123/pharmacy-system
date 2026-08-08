'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';

export default function Providers({ children }: { children: React.ReactNode }) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim();

  if (!googleClientId) {
    return <>{children}</>;
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      {children}
    </GoogleOAuthProvider>
  );
}
