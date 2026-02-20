"use client";

import { useMemo } from "react";
import { User, RolePermissions } from "@/types";
import { auth, rolePermissions } from "@/lib/auth";

export function useAuth() {
  // Get user directly without state to avoid hydration issues
  const user = useMemo<User | null>(() => {
    if (typeof window === "undefined") return null;
    return auth.getCurrentUser();
  }, []);
  
  const permissions = useMemo(() => {
    if (!user) return null;
    return rolePermissions[user.role];
  }, [user]);

  const hasPermission = (permission: keyof RolePermissions): boolean => {
    if (!permissions) return false;
    return permissions[permission];
  };

  return {
    user,
    permissions,
    hasPermission,
    isAdmin: user?.role === "admin",
    isPharmacist: user?.role === "pharmacist",
    isCashier: user?.role === "cashier",
    isStoreManager: user?.role === "store_manager",
    isAuditor: user?.role === "auditor",
  };
}
