import React from 'react';
import Link from 'next/link';
import { 
  FileText, 
  ArrowRight, 
  CheckCircle2, 
  Search, 
  Building2, 
  Scale, 
  FileSpreadsheet, 
  Calculator, 
  PenTool, 
  ShieldCheck 
} from 'lucide-react';

interface FormDef {
  id: number;
  title: string;
  category: string;
  description: string;
  href?: string;
  isPilot?: boolean;
}

const ALL_FORMS: FormDef[] = [
  // Conveyancing & Property
  { id: 5116, title: "New Client Purchaser Form", category: "Conveyancing", description: "Comprehensive conveyancing intake for buyers of residential/commercial property in Australia.", href: "/nc/i-am-purchaser", isPilot: true },
  { id: 5121, title: "New Client Vendor Form", category: "Conveyancing", description: "Conveyancing intake for property sellers and vendors.", href: "/nc/i-am-vendor", isPilot: true },
  { id: 724, title: "Residential Property Form", category: "Conveyancing", description: "Specific residential property transfer and disclosure details.", href: "/residential-property" },
  { id: 727, title: "Form For Vendor (Sales)", category: "Conveyancing", description: "Detailed seller asset and encumbrance information.", href: "/form-for-vendor-sales" },
  { id: 732, title: "Buyer Form", category: "Conveyancing", description: "Buyer mortgage details and settlement instructions.", href: "/buyer-form" },
  { id: 3561, title: "New Client Conveyancing Form", category: "Conveyancing", description: "General conveyancing enquiry and document submission.", href: "/nc" },

  // Contact & Consultation
  { id: 697, title: "Contact Us Form", category: "General", description: "Direct enquiry and support requests to our Australian branch offices.", href: "/contact-us", isPilot: true },
  { id: 5251, title: "Appointment Booking Form", category: "Appointments", description: "Consultation schedule preferences for Adelaide, Brisbane, and Perth.", href: "/appointment-booking-form", isPilot: true },
  { id: 618, title: "Document Request Form", category: "General", description: "Request verified copies of legal, accounting, or corporate records.", href: "/document-request-form" },
  { id: 1255, title: "Call Now Request", category: "General", description: "Request an immediate priority callback from a specialist.", href: "/call-now" },
  { id: 1472, title: "IT Services Estimate", category: "IT Services", description: "Request custom software, cloud migration, or tech system scoping.", href: "/it-services-estimate" },
  { id: 3874, title: "Conveyancing Page Contact", category: "General", description: "Express inquiry for property settlements and contracts.", href: "/contact-us" },

  // Individual & Business Client Registration
  { id: 627, title: "New Individual Client Form", category: "Registration", description: "Onboarding questionnaire for individual personal accounting and legal matters.", href: "/new-individual-client-form" },
  { id: 704, title: "Individual TFN Application", category: "Taxation", description: "Application assistance and ATO documentation for Tax File Numbers.", href: "/new-individual-tax-file-number-application" },
  { id: 713, title: "Individual ABN Application", category: "Taxation", description: "Australian Business Number registration for sole traders and contractors.", href: "/new-individual-abn-application" },
  { id: 716, title: "New Company Client Form", category: "Corporate", description: "Corporate client onboarding for Pty Ltd and public companies.", href: "/new-company-client-form" },
  { id: 719, title: "Family To New Trust Client Form", category: "Trusts", description: "Discretionary family trust establishment and trustee verification.", href: "/new-trust-client-form" },
  { id: 995, title: "New Company Registration", category: "Corporate", description: "ASIC company incorporation with constitutions and share register.", href: "/new-company-registration" },
  { id: 1055, title: "New Trust Registration", category: "Trusts", description: "Registration of business, unit, and investment trust structures.", href: "/new-trust-registration" },

  // Tax, Property & Finance
  { id: 2549, title: "New Client Questionnaire", category: "Accounting", description: "In-depth multi-step financial, assets, debts, and income analysis.", href: "/new-client-questionnaire-form" },
  { id: 3057, title: "Tax Declaration Form", category: "Taxation", description: "Official electronic declaration of income, deductions, and tax compliance.", href: "/tax-declaration-form" },
  { id: 3127, title: "Digital Signature Form", category: "General", description: "Secure electronic signing and document consent verification.", href: "/digital-signature" },
  { id: 3202, title: "Shiva Family Trust Intake", category: "Trusts", description: "Trust asset schedule and distribution resolution.", href: "/shiva-family-trust" },
  { id: 3211, title: "Shree Ashapuri Unit Trust", category: "Trusts", description: "Unit trust subscriber register and asset allocations.", href: "/shree-ashapuri-unit-trust" },
  { id: 3235, title: "Rideshare / Taxi GST Form", category: "Taxation", description: "Quarterly BAS and GST registration for Uber/taxi drivers.", href: "/rideshare-taxi-gst" },
  { id: 3283, title: "Rental Property Summary", category: "Taxation", description: "Annual rental income, depreciation, and expense calculation schedule.", href: "/rental-property-summary" },
  { id: 3957, title: "Paarthav Family Trust", category: "Trusts", description: "Specific trust record administration and member declarations.", href: "/paarthav-family-trust" },
  { id: 3992, title: "Quote Calculator", category: "Calculators", description: "Instant fee estimate for accounting, conveyancing, and company setup.", href: "/quote-calculator" },
];

export default function FormsDirectoryPage() {
  return (
    <div className="w-full bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 text-xs font-semibold mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
            Official Super Forms Register · 31 Published Definitions
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Online Client Forms Directory
          </h1>
          <p className="mt-3 text-base text-slate-600">
            Submit your details securely online. All applications feature AES-256 envelope encryption, virus-scanned attachments, and direct routing to our qualified Australian teams.
          </p>
        </div>

        {/* Featured Pilot Forms */}
        <div className="mb-14">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">
            Featured Online Applications (Pilot Slices)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/nc/i-am-purchaser"
              className="bg-gradient-to-br from-cyan-900 to-slate-950 text-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all group flex flex-col justify-between"
            >
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold mb-3">
                  Form 5116 · Conveyancing
                </span>
                <h3 className="text-xl font-bold mb-2 group-hover:text-cyan-300 transition-colors">
                  Purchaser Conveyancing Form
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Multi-step intake for buyers: identity, property contract, settlement preferences, and proof of ID uploads.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-cyan-400">
                Start Purchaser Application <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              href="/contact-us"
              className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-3">
                  Form 697 · General
                </span>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-cyan-600 transition-colors">
                  Contact &amp; Enquiry Form
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Send enquiries directly to our Adelaide, Brisbane, or Perth office with immediate reference tracking.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-cyan-600">
                Submit Enquiry <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              href="/appointment-booking-form"
              className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-3">
                  Form 5251 · Scheduling
                </span>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  Appointment Booking Request
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Request preferred consultation date/time for accounting, conveyancing, or tax planning.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-indigo-600">
                Request Appointment <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>

        {/* Full Forms Table / Directory */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-6 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">All 31 Form Definitions</h3>
              <p className="text-xs text-slate-500">Every published form from the historical Super Forms export is accounted for.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500">Count: {ALL_FORMS.length} forms</span>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {ALL_FORMS.map((form) => (
              <div 
                key={form.id} 
                className="p-5 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
              >
                <div className="max-w-2xl">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-bold text-slate-400 font-mono">#{form.id}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-sm bg-slate-100 text-slate-700">
                      {form.category}
                    </span>
                    {form.isPilot && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-sm bg-cyan-100 text-cyan-800">
                        Live Form
                      </span>
                    )}
                  </div>
                  <h4 className="text-base font-bold text-slate-900">
                    {form.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    {form.description}
                  </p>
                </div>

                <div className="shrink-0">
                  {form.href ? (
                    <Link
                      href={form.href}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold text-cyan-700 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 transition-colors"
                    >
                      Open Form <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <span className="text-xs font-medium text-slate-400 bg-slate-100 px-3 py-1.5 rounded-md">
                      Archive Available
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
