'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Phone, Mail, MapPin, ExternalLink, Calendar, FileText } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs">
      {/* Top bar with Australian Branch details */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-1">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
            <span className="flex items-center gap-1.5 font-medium text-cyan-400">
              <MapPin className="w-3.5 h-3.5" /> Australian Offices:
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-white font-semibold">Adelaide (HQ):</span>
              <a href="tel:+61881234567" className="hover:text-cyan-400 transition-colors">(08) 8123 4567</a>
            </span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:flex items-center gap-1.5">
              <span className="text-white font-semibold">Brisbane:</span>
              <a href="tel:+61731234567" className="hover:text-cyan-400 transition-colors">(07) 3123 4567</a>
            </span>
            <span className="hidden lg:inline text-slate-600">|</span>
            <span className="hidden lg:flex items-center gap-1.5">
              <span className="text-white font-semibold">Perth:</span>
              <a href="tel:+61891234567" className="hover:text-cyan-400 transition-colors">(08) 9123 4567</a>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="mailto:info@rcorpo.com" className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors">
              <Mail className="w-3.5 h-3.5" /> info@rcorpo.com
            </a>
            <span className="text-slate-600">|</span>
            <a 
              href="https://accounts.rcorpo.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-medium"
            >
              Client Portal <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-600 to-indigo-700 flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
              R
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-cyan-600 transition-colors">
                RAIKEN CORP
              </span>
              <span className="block text-[10px] tracking-widest text-slate-500 uppercase font-semibold">
                Financial, Legal & Tech Solutions
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7">
            <Link href="/" className="text-sm font-semibold text-slate-700 hover:text-cyan-600 transition-colors">
              Home
            </Link>
            <Link href="/#services" className="text-sm font-semibold text-slate-700 hover:text-cyan-600 transition-colors">
              Services
            </Link>
            <Link href="/forms" className="text-sm font-semibold text-slate-700 hover:text-cyan-600 transition-colors flex items-center gap-1">
              <FileText className="w-4 h-4 text-cyan-600" /> Forms Directory
            </Link>
            <div className="relative group">
              <button className="text-sm font-semibold text-slate-700 hover:text-cyan-600 transition-colors flex items-center gap-1">
                Conveyancing <span className="text-xs">▾</span>
              </button>
              <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 p-2 z-50">
                <Link href="/nc/i-am-purchaser" className="block px-4 py-2 text-sm text-slate-700 hover:bg-cyan-50 hover:text-cyan-700 rounded-sm">
                  I am Purchaser (Form 5116)
                </Link>
                <Link href="/nc/i-am-vendor" className="block px-4 py-2 text-sm text-slate-700 hover:bg-cyan-50 hover:text-cyan-700 rounded-sm">
                  I am Vendor (Form 5121)
                </Link>
              </div>
            </div>
            <Link href="/contact-us" className="text-sm font-semibold text-slate-700 hover:text-cyan-600 transition-colors">
              Contact Us
            </Link>
          </nav>

          {/* Right action button */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/appointment-booking-form"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-700 hover:to-indigo-700 shadow-sm transition-all shadow-cyan-600/20 hover:shadow-md"
            >
              <Calendar className="w-4 h-4" /> Book Consultation
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-700 hover:text-cyan-600 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-900 hover:bg-slate-50"
          >
            Home
          </Link>
          <Link
            href="/#services"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-900 hover:bg-slate-50"
          >
            Services
          </Link>
          <Link
            href="/forms"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-900 hover:bg-slate-50"
          >
            Forms Directory
          </Link>
          <Link
            href="/nc/i-am-purchaser"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-900 hover:bg-slate-50"
          >
            Purchaser Form (5116)
          </Link>
          <Link
            href="/nc/i-am-vendor"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-900 hover:bg-slate-50"
          >
            Vendor Form (5121)
          </Link>
          <Link
            href="/contact-us"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-900 hover:bg-slate-50"
          >
            Contact Us
          </Link>
          <div className="pt-3">
            <Link
              href="/appointment-booking-form"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center px-4 py-2.5 rounded-lg text-base font-semibold text-white bg-cyan-600 hover:bg-cyan-700"
            >
              Book Consultation
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
