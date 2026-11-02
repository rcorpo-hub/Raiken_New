import React from 'react';
import Link from 'next/link';
import { 
  Building2, 
  FileText, 
  Calendar, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  FileSpreadsheet, 
  Briefcase, 
  Laptop, 
  Scale 
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 text-white py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#087caa_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-6">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              National Australian Advisory Firm · Adelaide · Brisbane · Perth
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
              Integrated Legal Conveyancing, Accounting &amp; Tech Solutions.
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-300 mb-8 leading-relaxed">
              Empowering Australian businesses, property buyers, and individuals with licensed conveyancing, tax compliance, corporate structuring, and digital systems.
            </p>
            
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/nc/i-am-purchaser"
                className="px-6 py-3.5 rounded-lg text-base font-semibold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-700 hover:to-indigo-700 shadow-lg shadow-cyan-600/30 transition-all flex items-center gap-2"
              >
                I am Purchaser (Form 5116) <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link
                href="/appointment-booking-form"
                className="px-6 py-3.5 rounded-lg text-base font-semibold text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-all flex items-center gap-2"
              >
                <Calendar className="w-4 h-4 text-cyan-400" /> Book Consultation
              </Link>

              <Link
                href="/forms"
                className="px-6 py-3.5 rounded-lg text-base font-semibold text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
              >
                <FileText className="w-4 h-4" /> All 31 Forms Directory
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Offices Banner */}
      <section className="bg-slate-900 border-y border-slate-800 py-6 text-slate-300 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-900/50 flex items-center justify-center text-cyan-400 shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-white">Adelaide (Head Office)</div>
              <div className="text-xs text-slate-400">Level 1, 100 King William St · (08) 8123 4567</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-900/50 flex items-center justify-center text-indigo-400 shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-white">Brisbane Office</div>
              <div className="text-xs text-slate-400">Level 5, 200 Queen St · (07) 3123 4567</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-900/50 flex items-center justify-center text-cyan-400 shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-white">Perth Office</div>
              <div className="text-xs text-slate-400">Level 3, 50 St Georges Tce · (08) 9123 4567</div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-600 mb-3">Our Core Capabilities</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Specialized Solutions for Every Stage
            </h3>
            <p className="mt-4 text-base text-slate-600">
              Whether acquiring real estate, managing complex trust tax returns, or deploying enterprise cloud solutions, our specialists guide you every step of the way.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center mb-6">
                <Scale className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Property Conveyancing</h4>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Complete legal transfer for residential and commercial real estate buyers and vendors across South Australia, Queensland, and Western Australia.
              </p>
              <div className="space-y-2 mb-6 text-xs text-slate-700">
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Contract & Form 1 Review</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Electronic PEXA Settlements</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Purchaser & Vendor Intake</div>
              </div>
              <div className="flex items-center gap-3">
                <Link href="/nc/i-am-purchaser" className="text-xs font-semibold text-cyan-600 hover:text-cyan-700">
                  Purchaser Form 5116 →
                </Link>
                <span className="text-slate-300">|</span>
                <Link href="/nc/i-am-vendor" className="text-xs font-semibold text-cyan-600 hover:text-cyan-700">
                  Vendor Form 5121 →
                </Link>
              </div>
            </div>

            {/* Service 2 */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center mb-6">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Accounting &amp; Taxation</h4>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                ATO-compliant individual and business taxation, ABN/TFN registrations, quarterly BAS, GST, and rental property schedules.
              </p>
              <div className="space-y-2 mb-6 text-xs text-slate-700">
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Individual Tax Returns</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Rental Property Summary (Form 3283)</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Rideshare / Taxi GST (Form 3235)</div>
              </div>
              <Link href="/forms" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
                Explore Tax Forms →
              </Link>
            </div>

            {/* Service 3 */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-6">
                <Briefcase className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Corporate &amp; Trust Structuring</h4>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Establishment, registration, and ongoing compliance for Discretionary Family Trusts, Unit Trusts, and Australian Private Companies (Pty Ltd).
              </p>
              <div className="space-y-2 mb-6 text-xs text-slate-700">
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> New Company Registration (995)</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Family Trust Setup (719)</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Corporate Trustee Compliance</div>
              </div>
              <Link href="/forms" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">
                Company &amp; Trust Applications →
              </Link>
            </div>

            {/* Service 4 */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center mb-6">
                <Laptop className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">IT Services &amp; Cloud Systems</h4>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Enterprise technology services including custom business applications, cloud server infrastructure, cybersecurity, and managed software solutions.
              </p>
              <div className="space-y-2 mb-6 text-xs text-slate-700">
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Custom Web &amp; Mobile Applications</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Cloud Architecture &amp; Database Design</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> IT Services Estimate (Form 1472)</div>
              </div>
              <Link href="/forms" className="text-xs font-semibold text-purple-600 hover:text-purple-700">
                Request IT Estimate →
              </Link>
            </div>

            {/* Service 5 */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-6">
                <Clock className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Appointment Consultations</h4>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Flexible in-person consultations at our Adelaide, Brisbane, and Perth offices, or online teleconference sessions across Australian timezones.
              </p>
              <div className="space-y-2 mb-6 text-xs text-slate-700">
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> 30 &amp; 60 Min Dedicated Sessions</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Preferred Slot Selection</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Instant Confirmation &amp; Reminders</div>
              </div>
              <Link href="/appointment-booking-form" className="text-xs font-semibold text-amber-600 hover:text-amber-700">
                Book An Appointment →
              </Link>
            </div>

            {/* Service 6: Secure Portal */}
            <div className="bg-gradient-to-br from-cyan-900 to-slate-950 text-white rounded-xl p-8 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center mb-6">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold mb-3">Secure Document Handling</h4>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">
                  All applicant identity documents, contracts, and financial statements are quarantined and encrypted with AES-256 envelope security.
                </p>
              </div>
              <a
                href="https://accounts.rcorpo.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Access Client Portal ↗
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Direct Forms Highlight Banner */}
      <section className="py-16 bg-slate-100 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-8 sm:p-12 border border-slate-200 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-600">Fast Online Processing</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 mb-4">
                Purchasing Real Estate in SA, QLD, or WA?
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Submit your conveyancing details using our secure online purchaser form. Our licensed conveyancers immediately review your contracts and initiate settlement coordination.
              </p>
            </div>
            <div className="shrink-0 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link
                href="/nc/i-am-purchaser"
                className="text-center px-6 py-3.5 rounded-lg text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-700 shadow-md transition-all"
              >
                Fill Purchaser Form (5116)
              </Link>
              <Link
                href="/forms"
                className="text-center px-6 py-3.5 rounded-lg text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-all"
              >
                View All Forms Directory
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
