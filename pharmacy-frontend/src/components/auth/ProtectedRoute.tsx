"use client";

import { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { RolePermissions } from "@/types";

interface ProtectedRouteProps {
  children: ReactNode;
  permission?: keyof RolePermissions;
  fallback?: ReactNode;
}

export default function ProtectedRoute({
  children,
  permission,
  fallback,
}: ProtectedRouteProps) {
  const { hasPermission } = useAuth();

  if (permission && !hasPermission(permission)) {
    return (
      fallback || (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-red-800 font-semibold mb-2">Access Denied</h3>
          <p className="text-red-600">
            You don't have permission to access this feature.
          </p>
        </div>
      )
    );
  }

  return <>{children}</>;
}
