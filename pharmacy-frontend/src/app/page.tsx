'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const features = [
    {
      icon: '💊',
      title: 'Inventory Management',
      description: 'Track medicines, stock levels, expiry dates, and automate reordering'
    },
    {
      icon: '💰',
      title: 'Sales & POS',
      description: 'Fast checkout, receipt printing, and real-time sales tracking'
    },
    {
      icon: '📊',
      title: 'Reports & Analytics',
      description: 'Comprehensive reports on sales, inventory, and business performance'
    },
    {
      icon: '👥',
      title: 'Customer Management',
      description: 'Maintain customer records, purchase history, and loyalty programs'
    },
    {
      icon: '⚕️',
      title: 'Compliance & Safety',
      description: 'Drug interaction checks, expiry alerts, and regulatory compliance'
    },
    {
      icon: '🔐',
      title: 'Role-Based Access',
      description: 'Secure access control for Admin, Pharmacist, and Cashier roles'
    }
  ];

  const roles = [
    {
      icon: '👑',
      title: 'Administrator',
      description: 'Full system access, user management, reports, and settings',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: '💊',
      title: 'Pharmacist',
      description: 'Inventory management, prescriptions, drug interactions, compliance',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: '💰',
      title: 'Cashier',
      description: 'Point of sale, customer service, sales processing, receipts',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">💊</span>
              <span className="text-xl font-bold text-gray-800">Pharmacy ERP System</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/login"
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition"
              >
                Sign In
              </Link>
              <Link 
                href="/register"
                className="px-6 py-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-semibold transition shadow-md"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-6xl mb-6 animate-bounce">💊</div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Modern Pharmacy Management
            <span className="block text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">
              Made Simple
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Complete ERP solution for pharmacies. Manage inventory, process sales, 
            track compliance, and grow your business with powerful analytics.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => router.push('/register')}
              className="px-8 py-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-semibold text-lg transition shadow-lg"
            >
              Start Free Trial
            </button>
            <button
              onClick={() => router.push('/login')}
              className="px-8 py-4 bg-white text-gray-700 rounded-lg hover:bg-gray-50 font-semibold text-lg transition shadow-lg border border-gray-200"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Run Your Pharmacy
            </h2>
            <p className="text-xl text-gray-600">
              Powerful features designed for modern pharmacy operations
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="p-6 bg-gray-50 rounded-xl hover:shadow-lg transition border border-gray-100"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Built for Your Team
            </h2>
            <p className="text-xl text-gray-600">
              Role-based access control for secure and efficient operations
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {roles.map((role, index) => (
              <div 
                key={index}
                className="relative overflow-hidden rounded-2xl shadow-xl"
              >
                <div className={`absolute inset-0 bg-linear-to-br ${role.color} opacity-90`}></div>
                <div className="relative p-8 text-white">
                  <div className="text-5xl mb-4">{role.icon}</div>
                  <h3 className="text-2xl font-bold mb-3">
                    {role.title}
                  </h3>
                  <p className="text-white/90">
                    {role.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-blue-100">Uptime</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Support</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-blue-100">Secure</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">Fast</div>
              <div className="text-blue-100">Performance</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Pharmacy?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join hundreds of pharmacies already using our system
          </p>
          <button
            onClick={() => router.push('/register')}
            className="px-10 py-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-semibold text-lg transition shadow-lg"
          >
            Get Started Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <span className="text-3xl">💊</span>
            <span className="text-xl font-bold">Pharmacy ERP System</span>
          </div>
          <p className="text-gray-400 mb-4">
            Complete pharmacy management solution
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
            <a href="#" className="hover:text-white transition">Contact</a>
          </div>
          <p className="text-gray-500 text-sm mt-6">
            © 2026 Pharmacy ERP System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

