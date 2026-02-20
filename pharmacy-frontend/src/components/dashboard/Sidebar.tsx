"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FileText,
  Shield,
  Settings,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Sidebar() {
  const { hasPermission } = useAuth();

  return (
    <aside className="w-64 bg-[#1D234F] text-white flex flex-col">
      <div className="p-6 text-xl font-bold border-b border-[#2A2F6B]">
        Pharmacy System
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <SidebarLink href="/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" />
        
        {hasPermission("canViewInventory") && (
          <SidebarLink href="/dashboard/inventory" icon={<Package size={18} />} label="Inventory" />
        )}
        
        {hasPermission("canViewSales") && (
          <SidebarLink href="/dashboard/sales" icon={<ShoppingCart size={18} />} label="Sales" />
        )}
        
        {hasPermission("canViewCustomers") && (
          <SidebarLink href="/dashboard/customers" icon={<Users size={18} />} label="Customers" />
        )}
        
        {hasPermission("canViewReports") && (
          <SidebarLink href="/dashboard/reports" icon={<FileText size={18} />} label="Reports" />
        )}
        
        {hasPermission("canViewCompliance") && (
          <SidebarLink href="/dashboard/compliance" icon={<Shield size={18} />} label="Compliance" />
        )}
        
        {hasPermission("canViewSettings") && (
          <SidebarLink href="/dashboard/settings" icon={<Settings size={18} />} label="Settings" />
        )}
      </nav>
    </aside>
  );
}

function SidebarLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200
      ${
        isActive
          ? "bg-[#FFD530] text-black font-semibold"
          : "hover:bg-[#2A2F6B] text-gray-200"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
