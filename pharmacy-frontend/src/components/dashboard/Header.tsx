"use client";

import { Bell, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/auth";

export default function Header() {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await auth.logout();
    router.push("/login");
  };

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: "bg-purple-500",
      pharmacist: "bg-blue-500",
      cashier: "bg-green-500",
      store_manager: "bg-orange-500",
      auditor: "bg-gray-500",
    };
    return colors[role] || "bg-gray-500";
  };

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      
      {/* Left Side */}
      <h1 className="text-xl font-semibold text-gray-800">
        Dashboard
      </h1>

      {/* Right Side */}
      <div className="flex items-center gap-6">
        
        {/* Notification Icon */}
        <button className="relative">
          <Bell className="text-gray-600" size={20} />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
            3
          </span>
        </button>

        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-800">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {user?.role.replace("_", " ") || "Role"}
            </p>
          </div>

          <div className={`w-9 h-9 rounded-full ${getRoleBadgeColor(user?.role || "")} flex items-center justify-center text-white font-bold`}>
            {user?.name.charAt(0).toUpperCase() || "U"}
          </div>

          <button
            onClick={handleLogout}
            className="ml-2 p-2 hover:bg-gray-100 rounded-lg transition"
            title="Logout"
          >
            <LogOut className="text-gray-600" size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
