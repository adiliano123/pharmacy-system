'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, User, Moon, Sun, Star, Shield, Clock, Truck, HeartPulse, Pill, Stethoscope, FlaskConical, Activity, ChevronDown, Phone, Mail, MapPin, CheckCircle, Zap, Award, Users } from 'lucide-react';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [count, setCount] = useState({ customers: 0, products: 0, years: 0, staff: 0 });

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark';
    if (isDark) document.documentElement.classList.add('dark-mode');
    setTimeout(() => setIsDarkMode(isDark), 0);

    const targets = { customers: 5000, products: 1200, years: 15, staff: 50 };
    const steps = 60;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setCount({
        customers: Math.floor(targets.customers * progress),
        products: Math.floor(targets.products * progress),
        years: Math.floor(targets.years * progress),
        staff: Math.floor(targets.staff * progress),
      });
      if (step >= steps) clearInterval(timer);
    }, 2000 / steps);
    return () => clearInterval(timer);
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  };

  const categories = [
    { name: 'Prescription Drugs', icon: <Pill size={32} />, color: 'from-blue-500 to-blue-700', bg: 'bg-blue-50' },
    { name: 'Medical Devices', icon: <Stethoscope size={32} />, color: 'from-green-500 to-green-700', bg: 'bg-green-50' },
    { name: 'Lab Supplies', icon: <FlaskConical size={32} />, color: 'from-purple-500 to-purple-700', bg: 'bg-purple-50' },
    { name: 'Wellness', icon: <HeartPulse size={32} />, color: 'from-red-500 to-red-700', bg: 'bg-red-50' },
    { name: 'Vitamins', icon: <Activity size={32} />, color: 'from-orange-500 to-orange-700', bg: 'bg-orange-50' },
    { name: 'First Aid', icon: <Shield size={32} />, color: 'from-teal-500 to-teal-700', bg: 'bg-teal-50' },
  ];

  const products = [
    { name: 'Paracetamol 500mg', price: 3500, rating: 4.8, reviews: 234, icon: <Pill size={28} className="text-blue-500" />, tag: 'Best Seller', tagColor: 'bg-green-500' },
    { name: 'Vitamin D3 1000IU', price: 18000, rating: 4.9, reviews: 189, icon: <Activity size={28} className="text-orange-500" />, tag: 'New', tagColor: 'bg-blue-500' },
    { name: 'Blood Glucose Monitor', price: 65000, rating: 4.7, reviews: 98, icon: <Stethoscope size={28} className="text-purple-500" />, tag: 'Popular', tagColor: 'bg-purple-500' },
    { name: 'Omega-3 Fish Oil', price: 22000, rating: 4.6, reviews: 156, icon: <HeartPulse size={28} className="text-red-500" />, tag: 'Sale', tagColor: 'bg-red-500' },
    { name: 'N95 Face Mask (10pk)', price: 12000, rating: 4.5, reviews: 312, icon: <Shield size={28} className="text-teal-500" />, tag: 'Best Seller', tagColor: 'bg-green-500' },
    { name: 'Digital Thermometer', price: 15000, rating: 4.8, reviews: 201, icon: <Activity size={28} className="text-green-500" />, tag: 'Popular', tagColor: 'bg-purple-500' },
  ];

  const testimonials = [
    { name: 'Dr. Amina Hassan', role: 'General Practitioner', text: 'The best pharmacy system I have used. Fast, reliable, and always stocked with quality medicines.', rating: 5 },
    { name: 'John Mwangi', role: 'Regular Customer', text: 'I trust this pharmacy for all my family health needs. Professional staff and genuine products.', rating: 5 },
    { name: 'Sarah Kimani', role: 'Nurse', text: 'Excellent wholesale service for our clinic. Competitive prices and timely delivery every time.', rating: 5 },
  ];

  const faqs = [
    { q: 'Do you offer prescription services?', a: 'Yes, we work with licensed pharmacists to fulfill all valid prescriptions safely and accurately.' },
    { q: 'What are your operating hours?', a: 'We are open Monday to Saturday, 8:00 AM to 8:00 PM, and Sunday 9:00 AM to 5:00 PM.' },
    { q: 'Do you offer wholesale pricing?', a: 'Yes! We have a dedicated wholesale program for clinics, hospitals, and bulk buyers with special pricing.' },
    { q: 'How can I track my order?', a: 'Once your order is placed, you will receive a confirmation and can track it through your account dashboard.' },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* Announcement Bar */}
      <div className="bg-linear-to-r from-green-600 to-teal-600 text-white py-2 text-center text-sm">
        Free delivery on orders over TZS 50,000 &nbsp;|&nbsp; 24/7 Support: +255 745290677
      </div>

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-6">
            <Link href="/" className="flex items-center gap-3 shrink-0">
              <div className="w-12 h-12 bg-linear-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <Pill size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black text-gray-900 leading-none">MediPharm</h1>
                <p className="text-xs text-green-600 font-medium">Your Health Partner</p>
              </div>
            </Link>

            <div className="flex-1 max-w-xl hidden md:block">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                <input
                  type="text"
                  placeholder="Search medicines, vitamins, devices..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:bg-white transition-all text-sm text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={toggleTheme} className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors text-gray-700" title="Toggle theme">
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <Link href="/login" className="hidden md:flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
                <User size={18} /> Login
              </Link>
              <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white text-sm font-medium rounded-xl hover:bg-green-700 transition-colors shadow-sm">
                <ShoppingCart size={18} /> Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-linear-to-br from-green-50 via-teal-50 to-blue-50 py-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-200 rounded-full opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-200 rounded-full opacity-20 translate-y-1/2 -translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Tanzania&apos;s Trusted Pharmacy
              </div>
              <h1 className="text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-6">
                Your Health,<br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-green-500 to-teal-600">
                  Our Priority
                </span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Quality medicines, expert advice, and fast delivery — all in one place. Serving Tanzania with genuine pharmaceutical products since 2010.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/login" className="px-8 py-4 bg-linear-to-r from-green-500 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:-translate-y-0.5">
                  Get Started
                </Link>
                <Link href="/login" className="px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold border-2 border-gray-200 hover:border-green-500 transition-all">
                  Sign In
                </Link>
              </div>
              <div className="flex flex-wrap gap-6 mt-10">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield size={18} className="text-green-500" /> 100% Genuine Products
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock size={18} className="text-green-500" /> Same Day Delivery
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Truck size={18} className="text-green-500" /> Free Delivery 50k+
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative">
              <div className="bg-white rounded-3xl shadow-2xl p-8 relative z-10">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-linear-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Stethoscope size={48} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Expert Pharmacists</h3>
                  <p className="text-gray-500 mt-2">Available 7 days a week</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 rounded-2xl p-4 text-center">
                    <Pill className="mx-auto mb-1 text-green-600" size={28} />
                    <p className="text-xs font-semibold text-gray-700">1,200+ Products</p>
                  </div>
                  <div className="bg-blue-50 rounded-2xl p-4 text-center">
                    <Star className="mx-auto mb-1 text-yellow-500 fill-yellow-400" size={28} />
                    <p className="text-xs font-semibold text-gray-700">4.9 Rating</p>
                  </div>
                  <div className="bg-purple-50 rounded-2xl p-4 text-center">
                    <Truck className="mx-auto mb-1 text-purple-600" size={28} />
                    <p className="text-xs font-semibold text-gray-700">Fast Delivery</p>
                  </div>
                  <div className="bg-orange-50 rounded-2xl p-4 text-center">
                    <Shield className="mx-auto mb-1 text-orange-600" size={28} />
                    <p className="text-xs font-semibold text-gray-700">Secure &amp; Safe</p>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-linear-to-br from-green-200 to-teal-200 rounded-3xl -rotate-3 -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-linear-to-r from-green-600 to-teal-700 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {[
              { value: count.customers.toLocaleString() + '+', label: 'Happy Customers', icon: <HeartPulse size={32} /> },
              { value: count.products.toLocaleString() + '+', label: 'Products Available', icon: <Pill size={32} /> },
              { value: count.years + '+', label: 'Years of Service', icon: <Shield size={32} /> },
              { value: count.staff + '+', label: 'Expert Staff', icon: <Stethoscope size={32} /> },
            ].map((stat, i) => (
              <div key={i}>
                <div className="flex justify-center mb-2 text-green-200">{stat.icon}</div>
                <div className="text-4xl font-black mb-1">{stat.value}</div>
                <div className="text-green-100 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-3">Shop by Category</h2>
            <p className="text-gray-500">Find exactly what you need from our wide range of pharmaceutical products</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, i) => (
              <div key={i} className={`${cat.bg} rounded-2xl p-5 text-center cursor-pointer hover:shadow-md transition-all hover:-translate-y-1 group`}>
                <div className={`w-14 h-14 bg-linear-to-br ${cat.color} rounded-xl flex items-center justify-center mx-auto mb-3 text-white shadow-sm group-hover:scale-110 transition-transform`}>
                  {cat.icon}
                </div>
                <p className="text-sm font-semibold text-gray-800">{cat.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-2">Featured Products</h2>
              <p className="text-gray-500">Top-selling pharmaceutical products trusted by thousands</p>
            </div>
            <Link href="/login" className="hidden md:flex items-center gap-2 text-green-600 font-semibold hover:text-green-700 transition-colors">
              View All <ChevronDown size={18} className="-rotate-90" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-lg transition-all hover:-translate-y-1 group relative">
                <span className={`absolute top-4 right-4 ${product.tagColor} text-white text-xs font-bold px-2 py-1 rounded-full`}>
                  {product.tag}
                </span>
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {product.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{product.name}</h3>
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} size={12} className={j < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'} />
                  ))}
                  <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black text-green-600">TZS {product.price.toLocaleString()}</span>
                  <Link href="/login" className="px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition-colors">
                    Order
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-linear-to-br from-green-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-3">Why Choose MediPharm?</h2>
            <p className="text-gray-500">We go beyond just selling medicines — we care about your health journey</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <CheckCircle size={32} />, color: 'text-green-600', bg: 'bg-green-100', title: 'Verified Quality', desc: 'All products sourced from certified manufacturers and suppliers.' },
              { icon: <Zap size={32} />, color: 'text-blue-600', bg: 'bg-blue-100', title: 'Fast Processing', desc: 'Orders processed within minutes with same-day dispatch available.' },
              { icon: <Award size={32} />, color: 'text-purple-600', bg: 'bg-purple-100', title: 'Licensed Pharmacy', desc: 'Fully licensed and regulated by Tanzania Pharmacy Council.' },
              { icon: <Users size={32} />, color: 'text-orange-600', bg: 'bg-orange-100', title: 'Expert Support', desc: 'Qualified pharmacists available to answer your health questions.' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all text-center">
                <div className={`w-16 h-16 ${item.bg} rounded-2xl flex items-center justify-center mx-auto mb-4 ${item.color}`}>
                  {item.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-12 bg-linear-to-r from-green-600 via-teal-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-white">
            <div>
              <h2 className="text-3xl font-black mb-2">Wholesale Program</h2>
              <p className="text-green-100 text-lg">Special pricing for clinics, hospitals, and bulk buyers. Save up to 30% on orders.</p>
            </div>
            <Link href="/login" className="shrink-0 px-8 py-4 bg-white text-green-700 font-bold rounded-xl hover:bg-green-50 transition-colors shadow-lg">
              Apply for Wholesale
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-3">What Our Customers Say</h2>
            <p className="text-gray-500">Trusted by thousands of patients, doctors, and healthcare professionals</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6 hover:shadow-md transition-all">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={16} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-5 leading-relaxed italic">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-linear-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-3">Frequently Asked Questions</h2>
            <p className="text-gray-500">Quick answers to common questions about our services</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  {faq.q}
                  <ChevronDown size={18} className={`text-gray-400 transition-transform shrink-0 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-linear-to-br from-gray-900 to-gray-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="w-20 h-20 bg-linear-to-br from-green-400 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <HeartPulse size={40} className="text-white" />
          </div>
          <h2 className="text-4xl font-black text-white mb-4">Ready to Get Started?</h2>
          <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
            Join thousands of satisfied customers. Create your account today and experience the best pharmacy service in Tanzania.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/register" className="px-8 py-4 bg-linear-to-r from-green-500 to-teal-600 text-white font-bold rounded-xl hover:shadow-lg transition-all hover:-translate-y-0.5">
              Create Account
            </Link>
            <Link href="/login" className="px-8 py-4 bg-white/10 text-white font-bold rounded-xl border border-white/20 hover:bg-white/20 transition-all">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-linear-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <Pill size={20} className="text-white" />
                </div>
                <span className="text-white font-black text-lg">MediPharm</span>
              </div>
              <p className="text-sm leading-relaxed">Tanzania&apos;s trusted pharmacy system. Quality medicines, expert care, fast delivery.</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/login" className="hover:text-green-400 transition-colors">Login</Link></li>
                <li><Link href="/register" className="hover:text-green-400 transition-colors">Register</Link></li>
                <li><Link href="/dashboard" className="hover:text-green-400 transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Services</h4>
              <ul className="space-y-2 text-sm">
                <li className="hover:text-green-400 transition-colors cursor-default">Prescription Filling</li>
                <li className="hover:text-green-400 transition-colors cursor-default">Wholesale Supply</li>
                <li className="hover:text-green-400 transition-colors cursor-default">Home Delivery</li>
                <li className="hover:text-green-400 transition-colors cursor-default">Health Consultation</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Contact</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2"><Phone size={14} className="text-green-400 shrink-0" /> +255 745290677</li>
                <li className="flex items-center gap-2"><Mail size={14} className="text-green-400 shrink-0" /> info@medipharm.co.tz</li>
                <li className="flex items-center gap-2"><MapPin size={14} className="text-green-400 shrink-0" /> Dar es Salaam, Tanzania</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <p>&copy; 2026 MediPharm. All rights reserved.</p>
            <p>Licensed by Tanzania Pharmacy Council</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
