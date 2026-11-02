import Link from 'next/link';
import { ArrowLeft, FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
      <div className="max-w-md bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-xs">
        <div className="w-14 h-14 bg-cyan-100 text-cyan-700 rounded-full flex items-center justify-center mx-auto mb-5">
          <FileQuestion className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Page Not Found</h1>
        <p className="text-sm text-slate-600 mb-6">
          The requested page or form could not be found. Please return to the homepage or browse our complete forms directory.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
          <Link
            href="/forms"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Forms Directory
          </Link>
        </div>
      </div>
    </div>
  );
}
