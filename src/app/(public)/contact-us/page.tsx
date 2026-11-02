'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  Clock, 
  ShieldCheck 
} from 'lucide-react';

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    branch: 'ADE',
    service: 'Conveyancing',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [reference, setReference] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/forms/contact-us/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branch_code: formData.branch,
          applicant: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
          },
          answers: {
            branch: formData.branch,
            service: formData.service,
            message: formData.message,
          },
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatus('success');
        setReference(data.reference);
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Failed to submit enquiry.');
      }
    } catch {
      setStatus('error');
      setErrorMessage('A network error occurred. Please try again.');
    }
  }

  return (
    <div className="w-full bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
            Official Form 697 · Encrypted Communication Channel
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Contact Raiken Corporation
          </h1>
          <p className="mt-3 text-base text-slate-600">
            Have questions regarding conveyancing, accounting, corporate trust setups, or enterprise IT? Contact our specialists in Adelaide, Brisbane, or Perth.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Form Column */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 shadow-xs">
              {status === 'success' ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Enquiry Received</h3>
                  <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
                    Thank you, <strong className="text-slate-900">{formData.name}</strong>. Your enquiry has been securely logged with our Australian team.
                  </p>
                  <div className="inline-block bg-slate-100 border border-slate-200 rounded-lg px-6 py-3 text-sm font-mono text-slate-800 mb-8">
                    Reference: <strong className="text-cyan-700">{reference}</strong>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        setStatus('idle');
                        setFormData({ name: '', email: '', phone: '', branch: 'ADE', service: 'Conveyancing', message: '' });
                      }}
                      className="px-6 py-2.5 rounded-lg text-sm font-semibold text-cyan-700 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 transition-colors"
                    >
                      Submit Another Enquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {status === 'error' && (
                    <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 flex items-center gap-3 text-rose-800 text-sm">
                      <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. John Smith"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-cyan-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com.au"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-cyan-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="0400 000 000"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-cyan-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                        Preferred Branch <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={formData.branch}
                        onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-cyan-600"
                      >
                        <option value="ADE">Adelaide (Head Office - SA)</option>
                        <option value="BNE">Brisbane Office (QLD)</option>
                        <option value="PER">Perth Office (WA)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Area of Enquiry <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-cyan-600"
                    >
                      <option value="Conveyancing">Property Conveyancing (Purchaser / Vendor)</option>
                      <option value="Taxation">Accounting &amp; Individual/Business Tax</option>
                      <option value="Trusts">Company Registration &amp; Trust Structuring</option>
                      <option value="IT Services">Enterprise IT &amp; Custom Software</option>
                      <option value="General">Other Advisory Enquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Message / Case Details <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please provide details about your property settlement, tax enquiry, or business needs..."
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-cyan-600"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-700 hover:to-indigo-700 shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      {status === 'loading' ? (
                        <>Processing Secure Submission...</>
                      ) : (
                        <>
                          <Send className="w-4 h-4" /> Send Secure Enquiry
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Direct Office Contacts Column */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-cyan-600" /> Adelaide (Head Office)
              </h3>
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                  <span>Level 1, 100 King William St, Adelaide SA 5000</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-cyan-600 shrink-0" />
                  <a href="tel:+61881234567" className="text-slate-900 font-semibold hover:text-cyan-600">(08) 8123 4567</a>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>Mon - Fri: 9:00 AM - 5:30 PM (ACST)</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-600" /> Brisbane Branch
              </h3>
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>Level 5, 200 Queen St, Brisbane QLD 4000</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-indigo-600 shrink-0" />
                  <a href="tel:+61731234567" className="text-slate-900 font-semibold hover:text-indigo-600">(07) 3123 4567</a>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Mon - Fri: 9:00 AM - 5:00 PM (AEST)</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-cyan-600" /> Perth Branch
              </h3>
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                  <span>Level 3, 50 St Georges Tce, Perth WA 6000</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-cyan-600 shrink-0" />
                  <a href="tel:+61891234567" className="text-slate-900 font-semibold hover:text-cyan-600">(08) 9123 4567</a>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>Mon - Fri: 9:00 AM - 5:00 PM (AWST)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
