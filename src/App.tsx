/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { DemoProvider } from './context/DemoContext';
import { MobileSimulator } from './components/MobileSimulator';
import { ExecutiveDashboard } from './components/ExecutiveDashboard';
import { Shield, Sparkles, HelpCircle, HardHat, Info } from 'lucide-react';

export default function App() {
  return (
    <DemoProvider>
      <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-slate-100 flex flex-col p-4 md:p-6 lg:p-8 selection:bg-amber-500 selection:text-slate-950">
        
        {/* Subtle, premium header for the demo showcase */}
        <header className="max-w-[1600px] w-full mx-auto mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-5 gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-500 tracking-wider uppercase">
              <Sparkles size={14} className="text-amber-500 animate-pulse" />
              <span>Interactive Senior UX Showcase</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase">
              Omani Construction <span className="text-amber-500 font-medium">Leakage-Prevention Portal</span>
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl font-medium">
              See how real-time digital matching from field supervisor PWAs instantly resolves double-billing and labor variance in Muscat, Oman.
            </p>
          </div>

          {/* Interactive Tutorial Guide */}
          <div className="flex items-center space-x-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 text-xs text-slate-400 max-w-sm">
            <Info size={16} className="text-amber-500 shrink-0" />
            <p className="text-[10px] leading-tight">
              <strong className="text-slate-200">Interactive Demo:</strong> Tap attendance or log materials on the supervisor's phone mockup on the left. Watch the executive office dashboard on the right update instantly.
            </p>
          </div>
        </header>

        {/* Dual-View Layout Container */}
        <main className="max-w-[1600px] w-full mx-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Side: Field Supervisor Mobile Phone Mockup (lg:col-span-4 xl:col-span-3) */}
          <div className="lg:col-span-4 xl:col-span-3 flex flex-col items-center justify-center bg-slate-900/25 border border-slate-900 p-5 rounded-2xl relative overflow-hidden">
            
            {/* Background glowing effects for the phone container */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-500/5 blur-3xl pointer-events-none rounded-full" />
            
            <div className="w-full text-center mb-4 z-10 select-none">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">STEP 1: FIELD LOGGING</span>
              <h3 className="text-xs font-bold text-slate-300 mt-1 flex items-center justify-center">
                <HardHat size={12} className="text-amber-500 mr-1.5" />
                Field Supervisor App (PWA)
              </h3>
            </div>

            {/* Mobile Phone Mockup */}
            <MobileSimulator />

            {/* Interactive hint under the simulator */}
            <div className="mt-4 text-center text-[10px] text-slate-500 max-w-[280px] z-10 select-none">
              <p>Simulate double-billing by checking "Simulate Duplicate Delivery" in Materials, then watch the office database intercept it.</p>
            </div>
          </div>

          {/* Right Side: Owner Executive Control Center Dashboard (lg:col-span-8 xl:col-span-9) */}
          <div className="lg:col-span-8 xl:col-span-9 flex flex-col">
            <div className="w-full mb-4 px-2 select-none">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">STEP 2: HQ REAL-TIME AUDITING</span>
              <h3 className="text-xs font-bold text-slate-300 mt-1">
                Owner's Executive Dashboard Workspace
              </h3>
            </div>

            {/* Premium Boardroom Dashboard */}
            <div className="flex-1">
              <ExecutiveDashboard />
            </div>
          </div>

        </main>

        {/* Boardroom Quality Footer */}
        <footer className="max-w-[1600px] w-full mx-auto mt-6 pt-5 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-500 gap-3">
          <div className="flex items-center space-x-1.5">
            <Shield size={10} className="text-amber-600" />
            <span className="font-semibold text-slate-400">Oman Digital Construction Framework</span>
            <span>&bull; Registered Muscat Patent Pending</span>
          </div>
          <div>
            <p>&copy; 2026 Al Omania Contracting Co. All rights reserved. Designed for Muscat site compliance.</p>
          </div>
        </footer>

      </div>
    </DemoProvider>
  );
}
