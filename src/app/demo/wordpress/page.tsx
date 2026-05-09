import Link from 'next/link';
import { OptimizedImage } from '@/components/OptimizedImage';
import { 
  Wrench, 
  ExternalLink, 
  Download, 
  Layout, 
  ShoppingBag, 
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { BulkImportFacility } from '@/components/wordpress/BulkImportFacility';
import { BookingAndCheckoutWidget } from '@/components/wordpress/BookingAndCheckoutWidget';

export default function WordPressDemo() {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <nav className="sticky top-0 z-50 py-4 border-b border-white/10 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tighter flex items-center gap-2">
            Going Genius 
            <span className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded uppercase font-extrabold">WP Demo</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/developer" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Developer Hub</Link>
            <Link href="/auth/register" className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold py-2 px-4 rounded-full transition-colors">Get Started</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <section className="text-center mb-24">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            WordPress <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Power-Up</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
            Turn any WordPress site into a high-scale membership and e-commerce platform with our drop-in integration.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-6 rounded-xl flex items-center gap-2 transition-colors">
              <Download size={20} /> Download Plugin (v0.1.0)
            </button>
            <Link href="/developer/docs/wordpress" className="bg-transparent border border-zinc-700 hover:border-zinc-500 text-white font-semibold py-3 px-6 rounded-xl transition-colors">
              View Implementation Guide
            </Link>
          </div>
        </section>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 flex items-center justify-center rounded-xl">
                <ShoppingBag className="text-blue-500" size={24} />
              </div>
              <h3 className="text-3xl font-bold">Drop-in Checkout & Scheduling</h3>
            </div>
            <p className="text-lg text-zinc-400 leading-relaxed">
              Embed beautiful, secure checkout flows and scheduling widgets into any post or page with a simple shortcode: <code>[gg_subscribe]</code>. Sync calendars and process payments securely without touching any code.
            </p>
            <ul className="space-y-3 text-zinc-300">
              <li className="flex items-center space-x-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                <span>Real-time availability syncing</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                <span>Secure, PCI-compliant payment tokenization</span>
              </li>
            </ul>
          </div>
          <div className="flex justify-center bg-zinc-900/50 p-6 md:p-8 rounded-3xl border border-zinc-800/50">
            <BookingAndCheckoutWidget />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div className="order-2 md:order-1 flex justify-center bg-zinc-900/50 p-6 md:p-8 rounded-3xl border border-zinc-800/50">
            <BulkImportFacility />
          </div>
          <div className="order-1 md:order-2 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500/10 flex items-center justify-center rounded-xl">
                <Layers className="text-purple-400" size={24} />
              </div>
              <h3 className="text-3xl font-bold">Bulk Import Utility</h3>
            </div>
            <p className="text-lg text-zinc-400 leading-relaxed">
              Migrate thousands of legacy users and order history from WooCommerce or MemberPress into the Going Genius cloud in seconds. Our powerful import facility handles it automatically.
            </p>
            <ul className="space-y-3 text-zinc-300">
              <li className="flex items-center space-x-3">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                <span>Automatic data mapping and validation</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                <span>Detailed error reporting for invalid rows</span>
              </li>
            </ul>
          </div>
        </div>

        <section className="flex flex-col md:flex-row min-h-[300px] border border-zinc-800 rounded-3xl overflow-hidden bg-black shadow-2xl">
          <div className="w-full md:w-48 bg-zinc-900 border-b md:border-b-0 md:border-r border-zinc-800 py-6">
            <div className="px-6 py-3 text-sm font-medium text-white bg-zinc-800 border-l-4 border-blue-500 flex items-center gap-3">
              <Layout size={16}/> Dashboard
            </div>
            <div className="px-6 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300 cursor-pointer flex items-center gap-3">
              <Wrench size={16}/> GG Settings
            </div>
          </div>
          <div className="flex-1 flex flex-col">
            <div className="px-8 py-4 border-b border-zinc-800 font-semibold bg-zinc-950/50">
              Going Genius Integration Settings
            </div>
            <div className="p-8 flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <label className="w-32 text-sm text-zinc-500">App ID</label>
                <input type="text" readOnly value="app_cl_983274..." className="flex-1 bg-black border border-zinc-800 rounded-lg px-4 py-2 text-sm text-blue-400 focus:outline-none" />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <label className="w-32 text-sm text-zinc-500">API Endpoint</label>
                <input type="text" readOnly value="https://going-genius.com/api/v1" className="flex-1 bg-black border border-zinc-800 rounded-lg px-4 py-2 text-sm text-blue-400 focus:outline-none" />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <label className="w-32 text-sm text-zinc-500">Auth Layer</label>
                <div>
                  <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Connected</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="text-center py-16 border-t border-zinc-900 mt-20 text-sm text-zinc-500">
        <div className="max-w-7xl mx-auto px-4">
          <p>&copy; 2026 Going Genius. Built for the modern open web.</p>
        </div>
      </footer>
    </div>
  );
}
