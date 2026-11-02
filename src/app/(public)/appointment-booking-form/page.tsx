'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, MapPin, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';

export default function AppointmentBookingPage() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [reference, setReference] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    branch: 'ADE',
    service: 'Conveyancing Consultation',
    format: 'office', // office | phone | online
    preferredDate: '',
    preferredTimeSlot: 'morning', // morning | afternoon
    notes: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const res = await fetch('/api/forms/appointment-booking-form/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branch_code: formData.branch,
          applicant: {
            name: formData.name,
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
        setErrorMessage(data.error || 'Failed to submit appointment request.');
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
            Official Form 5251 · Dedicated Consultation Scheduling
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Schedule an Advisory Consultation
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Book an appointment with our conveyancers, accountants, or business advisors in Adelaide, Brisbane, Perth, or via teleconference.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 shadow-xs">
          {status === 'success' ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Appointment Request Logged</h2>
              <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
                Thank you, <strong className="text-slate-900">{formData.name}</strong>. Our calendar manager will confirm your chosen time slot shortly via email and SMS.
              </p>
              <div className="inline-block bg-slate-100 border border-slate-200 rounded-lg px-6 py-3 text-sm font-mono text-slate-800 mb-8">
                Request Reference: <strong className="text-cyan-700">{reference}</strong>
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
                    Your Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:border-cyan-600"
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
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:border-cyan-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Phone / Mobile <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:border-cyan-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Preferred Branch Office <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:border-cyan-600"
                  >
                    <option value="ADE">Adelaide (Head Office - ACST)</option>
                    <option value="BNE">Brisbane Branch (AEST)</option>
                    <option value="PER">Perth Branch (AWST)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Consultation Topic <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:border-cyan-600"
                  >
                    <option value="Conveyancing Consultation">Property Conveyancing (Buyer / Seller)</option>
                    <option value="Accounting Consultation">Accounting &amp; Tax Planning</option>
                    <option value="Trusts & Company Setup">Trust Setup &amp; Company Incorporation</option>
                    <option value="IT Systems Review">IT Cloud Architecture &amp; Custom Software</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Meeting Format
                  </label>
                  <select
                    value={formData.format}
                    onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:border-cyan-600"
                  >
                    <option value="office">In-Person at Branch Office</option>
                    <option value="online">Online Video Conference (Zoom / Meet)</option>
                    <option value="phone">Direct Telephone Call</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:border-cyan-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Preferred Time of Day
                  </label>
                  <select
                    value={formData.preferredTimeSlot}
                    onChange={(e) => setFormData({ ...formData, preferredTimeSlot: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:border-cyan-600"
                  >
                    <option value="morning">Morning (9:00 AM – 12:00 PM)</option>
                    <option value="afternoon">Afternoon (1:00 PM – 5:00 PM)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Additional Notes or Questions
                </label>
                <textarea
                  rows={4}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Tell us what you would like to discuss..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:border-cyan-600"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-700 hover:to-indigo-700 shadow-md transition-all"
                >
                  {status === 'submitting' ? 'Submitting Request...' : 'Book Advisory Appointment (5251)'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
