"use client";

import { User, Bell, Lock, Database } from "lucide-react";

export default function SettingsPage() {
  const settingsSections = [
    {
      icon: User,
      title: "Profile Settings",
      description: "Update your personal information and preferences",
      color: "bg-blue-500",
    },
    {
      icon: Bell,
      title: "Notifications",
      description: "Manage email and system notifications",
      color: "bg-green-500",
    },
    {
      icon: Lock,
      title: "Security",
      description: "Change password and security settings",
      color: "bg-red-500",
    },
    {
      icon: Database,
      title: "System Settings",
      description: "Configure system preferences and defaults",
      color: "bg-purple-500",
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Settings</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settingsSections.map((section, index) => {
          const Icon = section.icon;
          return (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-md border hover:shadow-lg transition cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className={`${section.color} p-3 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {section.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {section.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-white p-6 rounded-2xl shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">System Information</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-600">Version</span>
            <span className="text-gray-800 font-medium">1.0.0</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-600">Last Backup</span>
            <span className="text-gray-800 font-medium">2 hours ago</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">Database Status</span>
            <span className="text-green-600 font-medium">Connected</span>
          </div>
        </div>
      </div>
    </div>
  );
}
