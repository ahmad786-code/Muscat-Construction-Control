import React, { useState } from 'react';
import { useDemo } from '../context/DemoContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  ShieldCheck, 
  AlertOctagon, 
  Building, 
  Clock, 
  Coins, 
  ArrowRight, 
  RefreshCw,
  Layers,
  FileSpreadsheet,
  Cpu,
  Check,
  X,
  Search,
  BellRing
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ExecutiveDashboard: React.FC = () => {
  const { 
    workers, 
    materialLogs, 
    expenseLogs, 
    auditStream, 
    siteStats, 
    totalBurnRate, 
    activeLaborCount, 
    leakagePrevented,
    resolveLeakage,
    clearAllDemoLogs
  } = useDemo();

  const [activeTab, setActiveTab] = useState<'overview' | 'sites' | 'invoices' | 'ai'>('overview');
  const [searchTerm, setSearchTerm] = useState('');

  // Prepare chart data: Planned Budget vs Live Actual Spend
  const chartData = siteStats.map(site => {
    const liveSpendToday = site.laborSpend + site.materialSpend + site.otherSpend;
    const actualTotal = site.initialSpend + liveSpendToday;
    
    return {
      name: site.name.replace(' Residential Complex', '').replace(' Commercial Tower', '').replace(' Logistics Hub', ''),
      'Planned Budget': site.plannedBudget,
      'Live Cumulative Spend': Number(actualTotal.toFixed(1)),
      'Daily Burn Rate': Number(liveSpendToday.toFixed(1)),
      'Labor': site.laborSpend,
      'Materials': site.materialSpend,
      'Other Expenses': site.otherSpend
    };
  });

  // Filter materials and expenses that are pending or flagged for immediate action
  const flaggedMaterials = materialLogs.filter(m => m.status === 'Flagged');
  const flaggedExpenses = expenseLogs.filter(e => e.status === 'Flagged');
  const totalPendingThreats = flaggedMaterials.length + flaggedExpenses.length;

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden" id="hq-dashboard-panel">
      
      {/* Dashboard Top Navigation / Control Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-tr from-amber-600 to-amber-500 rounded-lg shadow-lg shadow-amber-500/10">
            <Layers className="text-slate-950" size={20} strokeWidth={2.5} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded border border-amber-500/20">
                MUSCAT HUB
              </span>
              <span className="text-[10px] text-slate-500 font-mono">NODE ID: OM-MCT-09</span>
            </div>
            <h1 className="text-lg font-black tracking-tight text-white uppercase mt-0.5">
              Al Omania Contracting Co. <span className="text-amber-500 font-medium">| Executive Console</span>
            </h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3 self-end md:self-auto">
          <div className="hidden sm:flex items-center space-x-1 text-xs text-slate-400 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800">
            <Clock size={12} className="text-amber-500 mr-1" />
            <span className="font-mono text-[10px]">Oman Standard Time (GST): 11:58 AM</span>
          </div>
          <button 
            onClick={clearAllDemoLogs}
            className="flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-lg border border-slate-700 transition-all font-semibold cursor-pointer"
          >
            <RefreshCw size={12} />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* Main Internal Layout with Sidebar */}
      <div className="flex flex-1 overflow-hidden min-h-[500px]">
        
        {/* INNER SIDEBAR */}
        <div className="w-52 bg-slate-900/40 border-r border-slate-800 flex flex-col justify-between p-4 shrink-0">
          <div className="space-y-6">
            <div className="space-y-1">
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-2">MANAGEMENT DESK</p>
              
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  activeTab === 'overview' 
                    ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/10' 
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <TrendingUp size={14} />
                <span>Active Dashboard</span>
              </button>

              <button
                onClick={() => setActiveTab('sites')}
                className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  activeTab === 'sites' 
                    ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/10' 
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <Building size={14} />
                <span>Muscat Project Sites</span>
              </button>

              <button
                onClick={() => setActiveTab('invoices')}
                className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  activeTab === 'invoices' 
                    ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/10' 
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <FileSpreadsheet size={14} />
                <span>Vendor Invoices</span>
              </button>

              <button
                onClick={() => setActiveTab('ai')}
                className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  activeTab === 'ai' 
                    ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/10' 
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <Cpu size={14} />
                <span className="flex items-center justify-between w-full">
                  <span>AI Insights</span>
                  <span className="bg-amber-500/20 text-amber-400 text-[8px] px-1 rounded font-bold animate-pulse">LIVE</span>
                </span>
              </button>
            </div>

            {/* Simulated Live Connection Info */}
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-slate-400 font-bold uppercase">Field PWAs</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] text-slate-300 font-mono">
                  <span>Al Mouj App:</span>
                  <span className="text-emerald-400">Connected</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-300 font-mono">
                  <span>Bawshar App:</span>
                  <span className="text-emerald-400">Connected</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-300 font-mono">
                  <span>Ruwi App:</span>
                  <span className="text-emerald-400">Connected</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-4 text-[10px] text-slate-500">
            <p className="font-semibold text-slate-400">Security: Encrypted</p>
            <p className="mt-0.5">Authorized for Al Omania CEO only.</p>
          </div>
        </div>

        {/* MAIN DISPLAY VIEW */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950 space-y-6">
          
          {/* TOP DYNAMIC KPI CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* KPI 1: Active Daily Burn Rate */}
            <div className="bg-slate-900 border border-slate-800/80 p-4 rounded-xl relative overflow-hidden group hover:border-slate-700 transition-all">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-500/5 to-transparent pointer-events-none rounded-full" />
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dynamic Daily Burn Rate</span>
                  <h3 className="text-2xl font-black text-white font-mono mt-1">
                    OMR {totalBurnRate.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                  </h3>
                  <p className="text-[9px] text-emerald-400 flex items-center mt-1.5 font-medium">
                    <TrendingUp size={12} className="mr-0.5" />
                    Live active crew labor + logs today
                  </p>
                </div>
                <div className="p-2.5 bg-slate-950 border border-slate-800 text-amber-500 rounded-lg">
                  <Coins size={16} />
                </div>
              </div>
            </div>

            {/* KPI 2: Active Labor Force */}
            <div className="bg-slate-900 border border-slate-800/80 p-4 rounded-xl relative overflow-hidden group hover:border-slate-700 transition-all">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-500/5 to-transparent pointer-events-none rounded-full" />
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">On-Site Active Crew</span>
                  <h3 className="text-2xl font-black text-white font-mono mt-1">
                    {activeLaborCount} <span className="text-xs text-slate-500 font-sans font-normal">checked in</span>
                  </h3>
                  <p className="text-[9px] text-slate-400 flex items-center mt-1.5 font-medium">
                    <Users size={12} className="mr-0.5 text-amber-500" />
                    Instant check-ins via supervisor PWAs
                  </p>
                </div>
                <div className="p-2.5 bg-slate-950 border border-slate-800 text-amber-500 rounded-lg">
                  <Users size={16} />
                </div>
              </div>
            </div>

            {/* KPI 3: Prevented Site Leakage (OMR Saved) */}
            <div className="bg-slate-900 border border-amber-500/30 p-4 rounded-xl relative overflow-hidden group shadow-lg shadow-amber-500/5 ring-1 ring-amber-500/10">
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-amber-500/10 blur-xl pointer-events-none rounded-full" />
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-wider">PREVENTED SITE LEAKAGE</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                  </div>
                  <h3 className="text-2xl font-black text-amber-500 font-mono mt-1">
                    OMR {leakagePrevented.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                  </h3>
                  <p className="text-[9px] text-amber-400 font-bold flex items-center mt-1.5">
                    <ShieldCheck size={12} className="mr-0.5 text-amber-500" />
                    Flagged double-billing blocked!
                  </p>
                </div>
                <div className="p-2.5 bg-amber-500 text-slate-950 rounded-lg shadow-lg shadow-amber-500/20">
                  <ShieldCheck size={16} strokeWidth={2.5} />
                </div>
              </div>
            </div>

          </div>

          {/* TAB CONTENT: 1. OVERVIEW (CHARTS & AUDIT STREAM) */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* FLAGGED AUDIT ALERTS (LEAKAGE PROTECTION REVIEW BOARD) */}
              <AnimatePresence>
                {totalPendingThreats > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-rose-950/20 border border-rose-500/30 rounded-xl p-4 space-y-3 shadow-lg shadow-rose-950/10"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-rose-400">
                        <AlertOctagon size={16} className="animate-bounce" />
                        <h4 className="text-xs font-bold uppercase tracking-wider">
                          HQ System Alerts: {totalPendingThreats} Unverified Site Financial Leakages Detected
                        </h4>
                      </div>
                      <span className="text-[8px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded font-mono font-bold uppercase">
                        Requires CEO Action
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Flagged Material Delivery Cards */}
                      {flaggedMaterials.map(log => (
                        <div key={log.id} className="bg-slate-900/90 border border-rose-500/20 rounded-lg p-3 flex flex-col justify-between space-y-3">
                          <div className="text-xs">
                            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                              <span>Site: {log.site}</span>
                              <span>{log.timestamp}</span>
                            </div>
                            <h5 className="font-bold text-white mt-1.5">
                              Suspicious Delivery: {log.quantity} {log.material}
                            </h5>
                            <p className="text-[10px] text-rose-300 mt-1">
                              Flagged Issue: Duplicate digital delivery note matches identical vendor serial. Expected leakage: <span className="font-bold text-rose-400 font-mono">OMR {log.cost}</span>.
                            </p>
                          </div>
                          
                          <div className="flex items-center justify-end space-x-2 pt-1 border-t border-slate-800">
                            <button
                              onClick={() => resolveLeakage(log.id, true)}
                              className="px-2.5 py-1 text-[10px] text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 font-semibold"
                            >
                              Ignore & Override
                            </button>
                            <button
                              onClick={() => resolveLeakage(log.id, false)}
                              className="px-2.5 py-1 text-[10px] bg-rose-500 hover:bg-rose-600 text-white rounded font-bold shadow-lg shadow-rose-500/20"
                            >
                              Block Delivery & Save OMR {log.cost}
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Flagged Expense Cards */}
                      {flaggedExpenses.map(log => (
                        <div key={log.id} className="bg-slate-900/90 border border-rose-500/20 rounded-lg p-3 flex flex-col justify-between space-y-3">
                          <div className="text-xs">
                            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                              <span>Site: {log.site}</span>
                              <span>{log.timestamp}</span>
                            </div>
                            <h5 className="font-bold text-white mt-1.5">
                              Unusual Expense: {log.expenseType} Reimbursement
                            </h5>
                            <p className="text-[10px] text-rose-300 mt-1">
                              Flagged Issue: Submitted amount (<span className="font-bold text-rose-400 font-mono">OMR {log.amount}</span>) is 300% above Muscat site food benchmarks. No digital invoice audit trail.
                            </p>
                          </div>
                          
                          <div className="flex items-center justify-end space-x-2 pt-1 border-t border-slate-800">
                            <button
                              onClick={() => resolveLeakage(log.id, true)}
                              className="px-2.5 py-1 text-[10px] text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 font-semibold"
                            >
                              Approve Reimbursement
                            </button>
                            <button
                              onClick={() => resolveLeakage(log.id, false)}
                              className="px-2.5 py-1 text-[10px] bg-rose-500 hover:bg-rose-600 text-white rounded font-bold shadow-lg shadow-rose-500/20"
                            >
                              Audit Decline & Save OMR {log.amount}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* DUAL COLUMN MIDDLE: CHARTS & AUDIT LIST */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* LEFT COL: FINANCIAL VISUALS (8 columns) */}
                <div className="lg:col-span-8 space-y-6">
                  
                  {/* CHART 1: Planned vs Live Spend */}
                  <div className="bg-slate-900 border border-slate-800/80 p-5 rounded-xl">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                          Planned Project Budgets vs. Live Actual Spend
                        </h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Cumulative expenditure synced dynamically from supervisor check-ins & receipts (OMR)
                        </p>
                      </div>
                      <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono font-medium">
                        Live Auto-refresh
                      </span>
                    </div>

                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={chartData}
                          margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                          <XAxis 
                            dataKey="name" 
                            stroke="#64748b" 
                            fontSize={10} 
                            tickLine={false}
                          />
                          <YAxis 
                            stroke="#64748b" 
                            fontSize={10} 
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${(value/1000).toFixed(1)}k`}
                          />
                          <Tooltip
                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                            labelStyle={{ color: '#f8fafc', fontWeight: 'bold', fontSize: '11px' }}
                            itemStyle={{ fontSize: '11px' }}
                            formatter={(value: any) => [`${value.toLocaleString()} OMR`]}
                          />
                          <Legend 
                            verticalAlign="top" 
                            height={36} 
                            iconSize={10} 
                            wrapperStyle={{ fontSize: '10px', color: '#94a3b8' }}
                          />
                          <Bar dataKey="Planned Budget" fill="#334155" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="Live Cumulative Spend" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* CHART 2: Live Daily Cost Breakdown Areas */}
                  <div className="bg-slate-900 border border-slate-800/80 p-5 rounded-xl">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                          Active Sites Daily Expense Burdens
                        </h4>
                        <p className="text-[10px] text-slate-400 mt-0.5 font-sans">
                          Today's live cost distribution: Labor vs. Materials vs. Incidentals (OMR)
                        </p>
                      </div>
                      <span className="text-[9px] text-slate-500 font-mono">
                        Updated 1s ago
                      </span>
                    </div>

                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={chartData}
                          margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="colorLabor" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorMaterials" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                          <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                          <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                          <Tooltip
                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                            itemStyle={{ fontSize: '11px' }}
                            formatter={(value: any) => [`${value} OMR`]}
                          />
                          <Legend verticalAlign="top" height={30} iconSize={10} wrapperStyle={{ fontSize: '10px' }} />
                          <Area type="monotone" dataKey="Labor" stroke="#f59e0b" fillOpacity={1} fill="url(#colorLabor)" />
                          <Area type="monotone" dataKey="Materials" stroke="#10b981" fillOpacity={1} fill="url(#colorMaterials)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                </div>

                {/* RIGHT COL: LIVE AUDIT FEED (4 columns) */}
                <div className="lg:col-span-4 bg-slate-900 border border-slate-800/80 rounded-xl p-4 flex flex-col h-[525px]">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
                    <div className="flex items-center space-x-1.5">
                      <BellRing size={14} className="text-amber-500 animate-pulse" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Live Audit Stream</h4>
                    </div>
                    <span className="text-[8px] bg-slate-950 px-2 py-0.5 text-slate-400 border border-slate-800 font-mono rounded-full">
                      Live
                    </span>
                  </div>

                  {/* Audit List Container */}
                  <div className="flex-1 overflow-y-auto space-y-3 pt-3 pr-1 font-sans">
                    <AnimatePresence initial={false}>
                      {auditStream.map((audit) => {
                        // determine styles based on severity
                        let colorClass = 'border-slate-800 bg-slate-950/60 text-slate-300';
                        let typeBadge = 'bg-slate-800 text-slate-400';

                        if (audit.severity === 'success') {
                          colorClass = 'border-emerald-500/20 bg-emerald-500/5 text-emerald-100';
                          typeBadge = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
                        } else if (audit.severity === 'warning') {
                          colorClass = 'border-amber-500/20 bg-amber-500/5 text-amber-100';
                          typeBadge = 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
                        } else if (audit.severity === 'danger') {
                          colorClass = 'border-rose-500/30 bg-rose-500/10 text-rose-100';
                          typeBadge = 'bg-rose-500/20 text-rose-400 border border-rose-500/30';
                        }

                        return (
                          <motion.div
                            key={audit.id}
                            initial={{ opacity: 0, x: 20, height: 0 }}
                            animate={{ opacity: 1, x: 0, height: 'auto' }}
                            exit={{ opacity: 0, x: -20, height: 0 }}
                            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                            className={`p-3 rounded-xl border text-xs space-y-1.5 ${colorClass}`}
                          >
                            <div className="flex items-center justify-between">
                              <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${typeBadge}`}>
                                {audit.type}
                              </span>
                              <span className="text-[9px] text-slate-500 font-mono flex items-center">
                                <Clock size={8} className="mr-0.5" />
                                {audit.timestamp}
                              </span>
                            </div>

                            <p className="text-[10px] leading-relaxed text-slate-300">
                              {audit.message}
                            </p>

                            <div className="flex justify-between items-center pt-1 border-t border-slate-800/40 text-[9px]">
                              <span className="text-slate-500">Site: {audit.site.replace(' Residential Complex', '').replace(' Commercial Tower', '').replace(' Logistics Hub', '')}</span>
                              {audit.amount !== undefined && (
                                <span className="font-mono font-bold text-amber-500">OMR {audit.amount}</span>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB CONTENT: 2. SITES DETAILS */}
          {activeTab === 'sites' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">Omani Project Portfolio Details</h3>
                <p className="text-xs text-slate-500 mt-0.5">Audit log of human resource deployment and material storage across active projects.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {siteStats.map(site => {
                  const liveTotalSpend = site.initialSpend + site.laborSpend + site.materialSpend + site.otherSpend;
                  const ratio = (liveTotalSpend / site.plannedBudget) * 100;
                  const siteWorkers = workers.filter(w => w.site === site.name);
                  
                  return (
                    <div key={site.name} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-xs font-bold text-white">{site.name}</h4>
                          <span className="text-[9px] text-slate-400 font-mono uppercase block mt-1">Muscat, Oman</span>
                        </div>
                        <span className={`text-[9px] px-2 py-0.5 rounded font-bold font-mono ${ratio > 90 ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                          {ratio.toFixed(0)}% Budget Used
                        </span>
                      </div>

                      {/* Spend Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                          <span>Live Actual: OMR {liveTotalSpend.toLocaleString()}</span>
                          <span>Budget: OMR {site.plannedBudget.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-300 ${ratio > 90 ? 'bg-rose-500' : 'bg-amber-500'}`}
                            style={{ width: `${Math.min(100, ratio)}%` }}
                          />
                        </div>
                      </div>

                      {/* Cost Breakdown */}
                      <div className="bg-slate-950/60 p-3 rounded-lg space-y-2 border border-slate-800">
                        <h5 className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Live Breakdown Today</h5>
                        <div className="grid grid-cols-3 gap-1 divide-x divide-slate-800 text-center">
                          <div>
                            <p className="text-[8px] text-slate-500">Labor</p>
                            <p className="text-[10px] font-bold font-mono text-white mt-0.5">OMR {site.laborSpend}</p>
                          </div>
                          <div>
                            <p className="text-[8px] text-slate-500">Materials</p>
                            <p className="text-[10px] font-bold font-mono text-white mt-0.5">OMR {site.materialSpend}</p>
                          </div>
                          <div>
                            <p className="text-[8px] text-slate-500">Other</p>
                            <p className="text-[10px] font-bold font-mono text-white mt-0.5">OMR {site.otherSpend}</p>
                          </div>
                        </div>
                      </div>

                      {/* Active Labor list on this site */}
                      <div className="space-y-2">
                        <h5 className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Deployed Crew ({siteWorkers.length})</h5>
                        <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
                          {siteWorkers.map(w => (
                            <div key={w.id} className="flex justify-between items-center text-[10px] bg-slate-950/40 p-1.5 rounded border border-slate-800/60">
                              <span className="text-white truncate font-medium max-w-[100px]">{w.name}</span>
                              <div className="flex items-center space-x-1.5">
                                {w.overtimeHours > 0 && (
                                  <span className="bg-amber-500/10 text-amber-500 text-[8px] px-1 rounded font-bold font-mono">
                                    +{w.overtimeHours}h OT
                                  </span>
                                )}
                                <span className={`w-2 h-2 rounded-full ${w.present ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB CONTENT: 3. VENDOR INVOICES */}
          {activeTab === 'invoices' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">HQ Matched Vendor Invoices</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Cross-matching of digital delivery notes logged via Supervisor PWAs against vendor statements.</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 text-[9px] px-2 py-0.5 rounded-full font-bold">
                    Automated Verification Active
                  </span>
                </div>
              </div>

              {/* Invoices List */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs font-sans">
                  <thead className="bg-slate-950 border-b border-slate-800 text-[10px] text-slate-400 uppercase tracking-widest">
                    <tr>
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">Project Site</th>
                      <th className="p-3">Item Description</th>
                      <th className="p-3">Est. Value</th>
                      <th className="p-3">HQ Audit Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {materialLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-900/60 transition-colors">
                        <td className="p-3 text-slate-400 font-mono">{log.timestamp}</td>
                        <td className="p-3 font-semibold text-white">{log.site}</td>
                        <td className="p-3 text-slate-300">{log.quantity} of {log.material}</td>
                        <td className="p-3 text-amber-500 font-mono font-bold">OMR {log.cost}</td>
                        <td className="p-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold border ${
                            log.status === 'Verified' 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                              : log.status === 'Flagged'
                                ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 animate-pulse'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}>
                            {log.status === 'Verified' ? 'Matched & Paid' : log.status === 'Flagged' ? 'Fraud Held' : 'Pending Match'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB CONTENT: 4. AI INSIGHTS */}
          {activeTab === 'ai' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">Live AI Leakage Insights</h3>
                <p className="text-xs text-slate-500 mt-0.5">Mathematical audits of site metrics and anomaly detection patterns computed live.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Insight Card 1 */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                  <div className="flex items-center space-x-2 text-amber-500">
                    <Cpu size={16} />
                    <h4 className="text-xs font-bold uppercase tracking-wider">Labor Overtime Benchmark Audit</h4>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Analyzing checked-in workers across sites. Currently, <span className="text-white font-semibold">Tariq Sajid</span> and <span className="text-white font-semibold">Ali Al-Balushi</span> have accumulated active overtime hours. This remains within Muscat municipality legal guidelines, representing a highly efficient deployment ratio of <span className="text-emerald-400 font-bold">14.2%</span> overtime costs compared to the total baseline.
                  </p>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[10px] text-slate-400">
                    <span className="text-amber-500 font-bold uppercase block mb-1">Recommendation</span>
                    Overtime is healthy. No action required.
                  </div>
                </div>

                {/* Insight Card 2 */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                  <div className="flex items-center space-x-2 text-emerald-500">
                    <ShieldCheck size={16} />
                    <h4 className="text-xs font-bold uppercase tracking-wider">Material Double-billing Protection Log</h4>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    HQ database holds structured tables of active purchase orders. When field supervisors submit digital delivery tickets, they are cross-matched in under <span className="text-white">50ms</span>. 
                    Our double-billing algorithm blocks any duplicate delivery notes carrying overlapping ticket coordinates, protecting you from on-site materials loss.
                  </p>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[10px] text-emerald-400">
                    <span className="font-bold uppercase block mb-1">Leakage Savings Summary</span>
                    Prevented duplicates saved a total of <span className="font-bold font-mono">OMR 420.00</span> this week.
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
