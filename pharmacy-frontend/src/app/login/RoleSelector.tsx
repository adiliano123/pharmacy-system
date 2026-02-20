"use client";

import { UserRole } from "@/types";

interface RoleSelectorProps {
  onSelectRole: (email: string) => void;
}

export default function RoleSelector({ onSelectRole }: RoleSelectorProps) {
  const roles: { role: UserRole; email: string; description: string }[] = [
    { role: "admin", email: "admin@pharmacy.com", description: "Full system access" },
    { role: "pharmacist", email: "pharmacist@pharmacy.com", description: "Manage inventory & sales" },
    { role: "cashier", email: "cashier@pharmacy.com", description: "Process sales only" },
  ];

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <p className="text-sm text-gray-600 mb-3 font-medium">Quick Login (Demo):</p>
      <div className="space-y-2">
        {roles.map(({ role, email, description }) => (
          <button
            key={role}
            onClick={() => onSelectRole(email)}
            className="w-full text-left p-2 bg-white hover:bg-blue-50 border rounded-lg transition text-sm"
          >
            <div className="font-medium text-gray-800 capitalize">
              {role.replace("_", " ")}
            </div>
            <div className="text-xs text-gray-500">{description}</div>
            <div className="text-xs text-gray-400 mt-1">Password: password</div>
          </button>
        ))}
      </div>
    </div>
  );
}
