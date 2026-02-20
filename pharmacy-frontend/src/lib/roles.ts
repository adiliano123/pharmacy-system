import { UserRole } from "@/types";

// Role descriptions and capabilities
export const roleDescriptions: Record<UserRole, string> = {
  admin: "Full system access with all permissions",
  pharmacist: "Manage inventory, sales, and view compliance",
  cashier: "Process sales and view inventory",
  store_manager: "Manage store operations and view reports",
  auditor: "View and audit compliance records",
};

// Role hierarchy (higher number = more privileges)
export const roleHierarchy: Record<UserRole, number> = {
  admin: 5,
  store_manager: 4,
  pharmacist: 3,
  auditor: 2,
  cashier: 1,
};

export function hasHigherRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}
