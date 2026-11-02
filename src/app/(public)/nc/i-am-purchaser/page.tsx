'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  FileText, 
  Building2, 
  DollarSign, 
  PenTool, 
  AlertCircle, 
  Check, 
  Upload 
} from 'lucide-react';

export default function PurchaserFormPage() {
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [reference, setReference] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    // Step 1: Purchaser Info
    purchaserType: 'individual', // individual, couple, company, trust
    firstName: '',
    lastName: '',
    secondPurchaserName: '',
    companyName: '',
    acn: '',
    trustName: '',
    email: '',
    phone: '',
    residentialAddress: '',
    isCitizen: 'yes', // yes, permanent_resident, foreign_buyer

    // Step 2: Property Details
    propertyAddress: '',
    purchasePrice: '',
    depositPaid: '',
    settlementDate: '',
    realEstateAgency: '',
    agentContact: '',

    // Step 3: Finance & Legal
    financeRequired: 'yes',
    lenderName: '',
    brokerName: '',
    loanAmount: '',
    firstHomeBuyer: 'no',

    // Step 4: Verification & Signature
    signatureType: 'typed', // typed | drawn
    signatureName: '',
    declarationAgreed: false,
  });

  function updateField(key: string, value: any) {
    setFormData(prev => ({ ...prev, [key]: value }));
  }

  function validateStep(currentStep: number): boolean {
    if (currentStep === 1) {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
        setErrorMessage('Please provide your name, email, and phone number.');
        return false;
      }
    }
    if (currentStep === 2) {
      if (!formData.propertyAddress || !formData.purchasePrice) {
        setErrorMessage('Please provide the property address and purchase price.');
        return false;
      }
    }
    if (currentStep === 3) {
      if (formData.financeRequired === 'yes' && !formData.lenderName) {
        setErrorMessage('Please state your proposed lending institution or broker.');
        return false;
      }
    }
    if (currentStep === 4) {
      if (!formData.declarationAgreed || !formData.signatureName) {
        setErrorMessage('You must agree to the declaration and sign the form.');
        return false;
      }
    }
    setErrorMessage('');
    return true;
  }

  function handleNext() {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    }
  }

  function handleBack() {
    setErrorMessage('');
    setStep(prev => Math.max(1, prev - 1));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateStep(4)) return;

    setStatus('submitting');
    setErrorMessage('');

    try {
      const res = await fetch('/api/forms/i-am-purchaser/submissions', {
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
        setErrorMessage(data.error || 'Submission failed. Please check your answers.');
      }
    } catch {
      setStatus('error');
      setErrorMessage('Network connection error. Please try again.');
    }
  }

  return (
    <div className="w-full bg-slate-50 min-h-screen py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
            Official Form 5116 · Property Purchaser Intake
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            New Client Purchaser Conveyancing
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            For buyers of residential or commercial property in South Australia, Queensland, or Western Australia.
          </p>
        </div>

        {/* Progress Stepper */}
        {status !== 'success' && (
          <div className="mb-8">
            <div className="grid grid-cols-4 gap-2 sm:gap-4">
              {[
                { s: 1, label: 'Purchaser Info' },
                { s: 2, label: 'Property Details' },
                { s: 3, label: 'Finance & Loan' },
                { s: 4, label: 'Declaration & Sign' },
              ].map(item => (
                <div key={item.s} className="flex flex-col items-center sm:items-start">
                  <div className={`h-1.5 w-full rounded-full mb-2 ${
                    step >= item.s ? 'bg-cyan-600' : 'bg-slate-200'
                  }`} />
                  <span className={`text-[11px] font-semibold uppercase tracking-wider ${
                    step === item.s ? 'text-cyan-700' : step > item.s ? 'text-slate-700' : 'text-slate-400'
                  }`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 shadow-xs">
          {status === 'success' ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Purchaser Application Recorded</h2>
              <p className="text-sm text-slate-600 max-w-lg mx-auto mb-6 leading-relaxed">
                Thank you, <strong className="text-slate-900">{formData.firstName} {formData.lastName}</strong>. Your conveyancing file has been generated and our licensed conveyancing team has been notified.
              </p>
              
              <div className="inline-block bg-slate-50 border border-slate-200 rounded-xl p-6 text-left max-w-md w-full mb-8">
                <div className="text-xs uppercase tracking-wider font-bold text-slate-500 mb-1">Durable File Reference</div>
                <div className="text-xl font-mono font-bold text-cyan-700 mb-4">{reference}</div>
                <div className="text-xs text-slate-600 space-y-1.5 border-t border-slate-200 pt-3">
                  <div><strong>Property:</strong> {formData.propertyAddress}</div>
                  <div><strong>Purchaser:</strong> {formData.firstName} {formData.lastName}</div>
                  <div><strong>Settlement Date:</strong> {formData.settlementDate || 'As per contract'}</div>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/"
                  className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-700 transition-colors"
                >
                  Return to Home
                </Link>
                <Link
                  href="/appointment-booking-form"
                  className="px-6 py-2.5 rounded-lg text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Schedule Conveyancer Call
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {errorMessage && (
                <div className="mb-6 p-4 rounded-lg bg-rose-50 border border-rose-200 flex items-center gap-3 text-rose-800 text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Step 1: Purchaser Details */}
              {step === 1 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                    1. Purchaser Entity &amp; Contact Details
                  </h3>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Who is purchasing the property? <span className="text-rose-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { val: 'individual', label: 'Single Individual' },
                        { val: 'couple', label: 'Couple / Joint' },
                        { val: 'company', label: 'Company (Pty Ltd)' },
                        { val: 'trust', label: 'Trust Structure' },
                      ].map(type => (
                        <button
                          key={type.val}
                          type="button"
                          onClick={() => updateField('purchaserType', type.val)}
                          className={`p-3 rounded-lg border text-xs font-semibold text-center transition-all ${
                            formData.purchaserType === type.val
                              ? 'bg-cyan-50 border-cyan-600 text-cyan-800 shadow-xs'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                        First / Given Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => updateField('firstName', e.target.value)}
                        placeholder="John"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:border-cyan-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                        Last / Surname <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => updateField('lastName', e.target.value)}
                        placeholder="Smith"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:border-cyan-600"
                      />
                    </div>
                  </div>

                  {formData.purchaserType === 'couple' && (
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                        Second Purchaser Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.secondPurchaserName}
                        onChange={(e) => updateField('secondPurchaserName', e.target.value)}
                        placeholder="Jane Smith"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:border-cyan-600"
                      />
                    </div>
                  )}

                  {(formData.purchaserType === 'company' || formData.purchaserType === 'trust') && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                          Company / Corporate Trustee Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.companyName}
                          onChange={(e) => updateField('companyName', e.target.value)}
                          placeholder="ABC Investments Pty Ltd"
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:border-cyan-600"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                          ACN / ABN
                        </label>
                        <input
                          type="text"
                          value={formData.acn}
                          onChange={(e) => updateField('acn', e.target.value)}
                          placeholder="123 456 789"
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:border-cyan-600"
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        placeholder="john.smith@example.com.au"
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
                        onChange={(e) => updateField('phone', e.target.value)}
                        placeholder="0412 345 678"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:border-cyan-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Current Residential Address
                    </label>
                    <input
                      type="text"
                      value={formData.residentialAddress}
                      onChange={(e) => updateField('residentialAddress', e.target.value)}
                      placeholder="12 Example Street, Norwood SA 5067"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:border-cyan-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Residency Status for Stamp Duty Calculation
                    </label>
                    <select
                      value={formData.isCitizen}
                      onChange={(e) => updateField('isCitizen', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:border-cyan-600"
                    >
                      <option value="yes">Australian Citizen / Permanent Resident</option>
                      <option value="foreign_buyer">Foreign Resident (Foreign Buyer Surcharge Applies)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Step 2: Property Details */}
              {step === 2 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                    2. Purchased Property Information
                  </h3>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Property Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.propertyAddress}
                      onChange={(e) => updateField('propertyAddress', e.target.value)}
                      placeholder="e.g. 45 King William Road, Unley SA 5061"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:border-cyan-600"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                        Agreed Purchase Price ($ AUD) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.purchasePrice}
                        onChange={(e) => updateField('purchasePrice', e.target.value)}
                        placeholder="750,000"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:border-cyan-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                        Deposit Amount Paid ($ AUD)
                      </label>
                      <input
                        type="text"
                        value={formData.depositPaid}
                        onChange={(e) => updateField('depositPaid', e.target.value)}
                        placeholder="50,000"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:border-cyan-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                        Target Settlement Date
                      </label>
                      <input
                        type="date"
                        value={formData.settlementDate}
                        onChange={(e) => updateField('settlementDate', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:border-cyan-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                        Selling Real Estate Agency
                      </label>
                      <input
                        type="text"
                        value={formData.realEstateAgency}
                        onChange={(e) => updateField('realEstateAgency', e.target.value)}
                        placeholder="e.g. Ray White / Harcourts"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:border-cyan-600"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Finance & Mortgage */}
              {step === 3 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                    3. Financing &amp; Mortgage Details
                  </h3>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Is this purchase subject to finance? <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex gap-4">
                      {['yes', 'no'].map(opt => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => updateField('financeRequired', opt)}
                          className={`px-5 py-2.5 rounded-lg border text-xs font-semibold uppercase tracking-wider transition-all ${
                            formData.financeRequired === opt
                              ? 'bg-cyan-50 border-cyan-600 text-cyan-800'
                              : 'bg-slate-50 border-slate-200 text-slate-600'
                          }`}
                        >
                          {opt === 'yes' ? 'Yes (Bank Loan)' : 'No (Cash Purchase)'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {formData.financeRequired === 'yes' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                          Lending Institution (Bank) <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.lenderName}
                          onChange={(e) => updateField('lenderName', e.target.value)}
                          placeholder="e.g. CBA, ANZ, Westpac, NAB"
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:border-cyan-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                          Mortgage Broker Name / Contact
                        </label>
                        <input
                          type="text"
                          value={formData.brokerName}
                          onChange={(e) => updateField('brokerName', e.target.value)}
                          placeholder="Broker Name & Contact"
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:border-cyan-600"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Are you a First Home Buyer?
                    </label>
                    <select
                      value={formData.firstHomeBuyer}
                      onChange={(e) => updateField('firstHomeBuyer', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:border-cyan-600"
                    >
                      <option value="no">No, standard buyer</option>
                      <option value="yes">Yes, eligible for First Home Buyer Duty Concessions</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Step 4: Declaration & Signature */}
              {step === 4 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                    4. Electronic Verification &amp; Declaration
                  </h3>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-xs text-slate-700 space-y-2 leading-relaxed">
                    <p className="font-semibold text-slate-900">Statutory Notice &amp; Authority:</p>
                    <p>
                      1. I/We authorize Raiken Corporation (and its appointed licensed conveyancers) to act on my/our behalf in respect of the property transaction described above.
                    </p>
                    <p>
                      2. I/We consent to electronic settlement and documentation via the PEXA electronic workspace.
                    </p>
                    <p>
                      3. I/We declare that all information submitted in this form is true, correct, and complete.
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="declaration"
                      checked={formData.declarationAgreed}
                      onChange={(e) => updateField('declarationAgreed', e.target.checked)}
                      className="mt-1 w-4 h-4 text-cyan-600 border-slate-300 rounded-sm focus:ring-cyan-500"
                    />
                    <label htmlFor="declaration" className="text-xs text-slate-800 font-medium">
                      I have read, understood, and agree to the statutory declaration and retain Raiken Corporation as our representative conveyancers. <span className="text-rose-500">*</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Electronic Signature (Type Full Legal Name) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.signatureName}
                      onChange={(e) => updateField('signatureName', e.target.value)}
                      placeholder="e.g. John Robert Smith"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-base font-serif italic text-slate-900 focus:bg-white focus:outline-none focus:border-cyan-600"
                    />
                    <span className="block text-[11px] text-slate-500 mt-1">
                      Typing your legal name constitutes an electronic signature under the Electronic Transactions Act.
                    </span>
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" /> Previous
                  </button>
                ) : <div />}

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-700 shadow-sm transition-all"
                  >
                    Next Step <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-700 hover:to-indigo-700 shadow-md transition-all"
                  >
                    {status === 'submitting' ? 'Transmitting Secure File...' : 'Submit Purchaser Application (5116)'}
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
