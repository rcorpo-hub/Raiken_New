'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, CheckCircle2, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';

export default function VendorFormPage() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [reference, setReference] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    propertyAddress: '',
    sellingPriceEstimate: '',
    mortgageBank: '',
    settlementPreference: '',
    declarationAgreed: false,
    signatureName: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.declarationAgreed || !formData.signatureName) {
      setErrorMessage('Please accept the declaration and provide your signature.');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      const res = await fetch('/api/forms/i-am-vendor/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branch_code: 'ADE',
          applicant: {
            name: `${formData.firstName} ${formData.lastName}`.trim(),
            email: formData.email,
            phone: formData.phone,
          },
          answers: formData,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatus('success');
        setReference(data.reference);
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Submission failed.');
      }
    } catch {
      setStatus('error');
      setErrorMessage('Network connection error. Please try again.');
    }
  }

  return (
    <div className="w-full bg-slate-50 min-h-screen py-14">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
            Official Form 5121 · Property Vendor Intake
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            New Client Vendor (Sales) Form
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            For property owners and vendors selling real estate in South Australia, Queensland, or Western Australia.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 shadow-xs">
          {status === 'success' ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Vendor File Created</h2>
              <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
                Thank you, <strong className="text-slate-900">{formData.firstName} {formData.lastName}</strong>. Your vendor sale file has been registered.
              </p>
              <div className="inline-block bg-slate-100 border border-slate-200 rounded-lg px-6 py-3 text-sm font-mono text-slate-800 mb-8">
                Reference: <strong className="text-cyan-700">{reference}</strong>
              </div>
              <div>
                <Link
                  href="/"
                  className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-700 transition-colors"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 flex items-center gap-3 text-rose-800 text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    First Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:border-cyan-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Last Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:border-cyan-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:border-cyan-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Mobile Phone <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:border-cyan-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Selling Property Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.propertyAddress}
                  onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })}
                  placeholder="e.g. 10 Park Terrace, Gilberton SA 5081"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:border-cyan-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Estimated Selling Price ($ AUD)
                  </label>
                  <input
                    type="text"
                    value={formData.sellingPriceEstimate}
                    onChange={(e) => setFormData({ ...formData, sellingPriceEstimate: e.target.value })}
                    placeholder="e.g. 850,000"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:border-cyan-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Current Mortgage Bank (to discharge)
                  </label>
                  <input
                    type="text"
                    value={formData.mortgageBank}
                    onChange={(e) => setFormData({ ...formData, mortgageBank: e.target.value })}
                    placeholder="e.g. Westpac, ANZ, or None (Unencumbered)"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:border-cyan-600"
                  />
                </div>
              </div>

              <div className="pt-2">
                <div className="flex items-start gap-3 mb-4">
                  <input
                    type="checkbox"
                    id="declaration"
                    checked={formData.declarationAgreed}
                    onChange={(e) => setFormData({ ...formData, declarationAgreed: e.target.checked })}
                    className="mt-1 w-4 h-4 text-cyan-600 border-slate-300 rounded-sm focus:ring-cyan-500"
                  />
                  <label htmlFor="declaration" className="text-xs text-slate-800 font-medium">
                    I retain Raiken Corporation to act as my conveyancers and prepare the vendor statements and settlement documents. <span className="text-rose-500">*</span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Electronic Signature <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.signatureName}
                    onChange={(e) => setFormData({ ...formData, signatureName: e.target.value })}
                    placeholder="Type legal name"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm font-serif italic focus:bg-white focus:outline-none focus:border-cyan-600"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full sm:w-auto px-8 py-3 rounded-lg text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-700 transition-colors shadow-md"
                >
                  {status === 'submitting' ? 'Submitting...' : 'Submit Vendor Form (5121)'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
