'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Send, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleNewsletterSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand & Overview */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                R
              </div>
              <span className="text-xl font-bold tracking-tight text-white">RAIKEN CORP</span>
            </div>
            <p className="text-sm text-slate-400 mb-5 leading-relaxed">
              Integrated professional advisory services across Accounting, Conveyancing, Taxation, Business Structuring, and IT Consulting throughout Australia.
            </p>
            <div className="flex items-center gap-2 text-xs text-cyan-400 font-medium">
              <ShieldCheck className="w-4 h-4" /> End-to-end encrypted document handling
            </div>
          </div>

          {/* Col 2: Australian Branch Offices */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">
              National Branch Offices
            </h4>
            <ul className="space-y-4 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-medium">Adelaide (Head Office)</strong>
                  <span className="text-slate-400">Level 1, 100 King William St, Adelaide SA 5000</span>
                  <div className="text-cyan-400 mt-0.5">Tel: (08) 8123 4567</div>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-medium">Brisbane</strong>
                  <span className="text-slate-400">Level 5, 200 Queen St, Brisbane QLD 4000</span>
                  <div className="text-cyan-400 mt-0.5">Tel: (07) 3123 4567</div>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-medium">Perth</strong>
                  <span className="text-slate-400">Level 3, 50 St Georges Tce, Perth WA 6000</span>
                  <div className="text-cyan-400 mt-0.5">Tel: (08) 9123 4567</div>
                </div>
              </li>
            </ul>
          </div>

          {/* Col 3: Key Links */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">
              Quick Portals & Forms
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/forms" className="hover:text-cyan-400 transition-colors">
                  All Forms Directory (31 Forms)
                </Link>
              </li>
              <li>
                <Link href="/nc/i-am-purchaser" className="hover:text-cyan-400 transition-colors">
                  Purchaser Conveyancing Form (5116)
                </Link>
              </li>
              <li>
                <Link href="/nc/i-am-vendor" className="hover:text-cyan-400 transition-colors">
                  Vendor Conveyancing Form (5121)
                </Link>
              </li>
              <li>
                <Link href="/appointment-booking-form" className="hover:text-cyan-400 transition-colors">
                  Book Appointment Consultation
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="hover:text-cyan-400 transition-colors">
                  Contact Customer Support
                </Link>
              </li>
              <li>
                <a 
                  href="https://accounts.rcorpo.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Client Portal Login ↗
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter & Privacy */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">
              Regulatory & Tax Updates
            </h4>
            <p className="text-xs text-slate-400 mb-4">
              Subscribe for periodic Australian tax, compliance, and conveyancing law bulletins.
            </p>
            {status === 'success' ? (
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium bg-emerald-950/50 p-3 rounded-lg border border-emerald-800">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>Thank you for subscribing!</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <div className="flex">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-slate-900 border border-slate-700 rounded-l-lg px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-r-lg text-sm font-medium transition-colors flex items-center justify-center"
                    aria-label="Subscribe"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                {status === 'error' && (
                  <p className="text-rose-400 text-xs">Failed to subscribe. Please try again.</p>
                )}
              </form>
            )}
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-slate-900 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Raiken Corporation Pty Ltd. All rights reserved. Registered Australian Business.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-400 transition-colors">Terms of Service</Link>
            <Link href="/contact-us" className="hover:text-slate-400 transition-colors">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
