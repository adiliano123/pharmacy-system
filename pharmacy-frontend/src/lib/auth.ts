// Authentication utility functions
import { User, UserRole, RolePermissions } from "@/types";
import { api } from "./api";

// Role-based permissions configuration
export const rolePermissions: Record<UserRole, RolePermissions> = {
  admin: {
    canViewInventory: true,
    canEditInventory: true,
    canViewSales: true,
    canCreateSales: true,
    canViewCustomers: true,
    canEditCustomers: true,
    canViewReports: true,
    canViewCompliance: true,
    canEditCompliance: true,
    canViewSettings: true,
    canEditSettings: true,
  },
  pharmacist: {
    canViewInventory: true,
    canEditInventory: true,
    canViewSales: true,
    canCreateSales: true,
    canViewCustomers: true,
    canEditCustomers: false,
    canViewReports: true,
    canViewCompliance: true,
    canEditCompliance: false,
    canViewSettings: false,
    canEditSettings: false,
  },
  cashier: {
    canViewInventory: true,
    canEditInventory: false,
    canViewSales: true,
    canCreateSales: true,
    canViewCustomers: true,
    canEditCustomers: false,
    canViewReports: false,
    canViewCompliance: false,
    canEditCompliance: false,
    canViewSettings: false,
    canEditSettings: false,
  },
  store_manager: {
    canViewInventory: true,
    canEditInventory: true,
    canViewSales: true,
    canCreateSales: true,
    canViewCustomers: true,
    canEditCustomers: true,
    canViewReports: true,
    canViewCompliance: true,
    canEditCompliance: false,
    canViewSettings: true,
    canEditSettings: false,
  },
  auditor: {
    canViewInventory: true,
    canEditInventory: false,
    canViewSales: true,
    canCreateSales: false,
    canViewCustomers: true,
    canEditCustomers: false,
    canViewReports: true,
    canViewCompliance: true,
    canEditCompliance: true,
    canViewSettings: false,
    canEditSettings: false,
  },
  storekeeper: {
    canViewInventory: true,
    canEditInventory: true,
    canViewSales: false,
    canCreateSales: false,
    canViewCustomers: false,
    canEditCustomers: false,
    canViewReports: true,
    canViewCompliance: false,
    canEditCompliance: false,
    canViewSettings: false,
    canEditSettings: false,
  },
};

// Real authentication with Laravel backend
export const auth = {
  login: async (email: string, password: string): Promise<User | null> => {
    try {
      const response = await api.auth.login(email, password);
      
      if (response.token && response.user) {
        // Store token and user
        if (typeof window !== "undefined") {
          localStorage.setItem("auth_token", response.token);
          localStorage.setItem("user", JSON.stringify(response.user));
        }
        return response.user;
      }
      return null;
    } catch (error) {
      console.error("Login error:", error);
      return null;
    }
  },

  logout: async (): Promise<void> => {
    try {
      await api.auth.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear session/tokens
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
      }
    }
  },

  getCurrentUser: (): User | null => {
    // Get current user from localStorage
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          return JSON.parse(userStr);
        } catch {
          return null;
        }
      }
    }
    return null;
  },

  setCurrentUser: (user: User): void => {
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user));
    }
  },

  isAuthenticated: (): boolean => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      return !!token;
    }
    return false;
  },

  hasPermission: (permission: keyof RolePermissions): boolean => {
    const user = auth.getCurrentUser();
    if (!user) return false;
    return rolePermissions[user.role][permission];
  },

  getPermissions: (): RolePermissions | null => {
    const user = auth.getCurrentUser();
    if (!user) return null;
    return rolePermissions[user.role];
  },

  // Fetch current user from backend
  fetchCurrentUser: async (): Promise<User | null> => {
    try {
      const user = await api.auth.me();
      if (user) {
        auth.setCurrentUser(user);
        return user;
      }
      return null;
    } catch (error) {
      console.error("Fetch user error:", error);
      return null;
    }
  },
};
