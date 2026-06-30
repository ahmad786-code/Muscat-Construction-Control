import React, { useState, useRef } from 'react';
import { useDemo } from '../context/DemoContext';
import { 
  Users, 
  Package, 
  CreditCard, 
  Camera, 
  CheckCircle, 
  Wifi, 
  Battery, 
  Signal, 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  FileCheck,
  Check,
  Building
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const MobileSimulator: React.FC = () => {
  const { 
    workers, 
    toggleWorkerAttendance, 
    updateWorkerOvertime, 
    addMaterialLog, 
    addExpenseLog 
  } = useDemo();

  const [activeTab, setActiveTab] = useState<'labor' | 'materials' | 'expenses'>('labor');
  
  // Materials form state
  const [selectedMatSite, setSelectedMatSite] = useState('Al Mouj Residential Complex');
  const [selectedMaterial, setSelectedMaterial] = useState('Cement (Bags)');
  const [matQuantity, setMatQuantity] = useState<number>(50);
  const [simulateDuplicate, setSimulateDuplicate] = useState(false);
  const [matSuccess, setMatSuccess] = useState(false);

  // Expenses form state
  const [selectedExpSite, setSelectedExpSite] = useState('Bawshar Commercial Tower');
  const [expenseType, setExpenseType] = useState('Fuel');
  const [expenseAmount, setExpenseAmount] = useState<string>('45');
  const [receiptCaptured, setReceiptCaptured] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [expSuccess, setExpSuccess] = useState(false);

  // Sound and camera flash effects
  const [showFlash, setShowFlash] = useState(false);

  const handleCaptureReceipt = () => {
    setCapturing(true);
    setTimeout(() => {
      setShowFlash(true);
      setTimeout(() => setShowFlash(false), 150);
      setReceiptCaptured(true);
      setCapturing(false);
    }, 1000);
  };

  const submitMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (matQuantity <= 0) return;
    
    addMaterialLog(selectedMatSite, selectedMaterial, matQuantity, simulateDuplicate);
    setMatSuccess(true);
    
    setTimeout(() => {
      setMatSuccess(false);
      setSimulateDuplicate(false);
    }, 2000);
  };

  const submitExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(expenseAmount);
    if (isNaN(amount) || amount <= 0) return;

    const receiptDesc = receiptCaptured 
      ? `Camera capture: Verified OCR scan of ${expenseType} receipt from Muscat local vendor.`
      : 'No digital receipt attached.';

    addExpenseLog(selectedExpSite, expenseType, amount, receiptDesc);
    setExpSuccess(true);
    
    setTimeout(() => {
      setExpSuccess(false);
      setReceiptCaptured(false);
      setExpenseAmount('');
    }, 2000);
  };

  // Helper to calculate a worker's wage today
  const calculateWage = (rate: number, overtimeHours: number, present: boolean) => {
    if (!present) return 0;
    const otRate = (rate / 8) * 1.5;
    return Number((rate + (overtimeHours * otRate)).toFixed(1));
  };

  return (
    <div className="relative mx-auto max-w-[340px] w-full" id="mobile-pwa-container">
      {/* Phone Silhouette / Border */}
      <div className="relative border-4 border-slate-700 bg-slate-900 rounded-[44px] shadow-2xl p-3 aspect-[9/18.5] flex flex-col overflow-hidden ring-12 ring-slate-800/50">
        
        {/* Dynamic Island / Notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-5 bg-black rounded-full z-50 flex items-center justify-between px-3 text-[10px] text-white">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse"></div>
          </div>
          <div className="text-[9px] font-mono tracking-wider text-amber-500">SYNCD Live</div>
          <div className="w-2 h-2 rounded-full bg-slate-950"></div>
        </div>

        {/* Status Bar */}
        <div className="flex justify-between items-center px-4 pt-1 pb-2 text-[10px] font-medium text-slate-400 z-40 select-none">
          <span className="font-mono">11:58 AM</span>
          <div className="flex items-center space-x-1">
            <Signal size={10} className="text-emerald-500" />
            <span className="text-[8px] font-semibold text-slate-500">5G</span>
            <Wifi size={10} className="text-emerald-500" />
            <Battery size={12} className="text-slate-400" />
          </div>
        </div>

        {/* Outer Reflective Glass Glare Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none z-30 rounded-[38px]" />

        {/* App Main Body Container */}
        <div className="flex-1 bg-slate-950 rounded-[32px] overflow-hidden flex flex-col relative border border-slate-800">
          
          {/* Custom Flash Indicator for Receipt Scan */}
          <AnimatePresence>
            {showFlash && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-white z-50 pointer-events-none"
              />
            )}
          </AnimatePresence>

          {/* App Header */}
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800 p-3 pt-4 text-center">
            <div className="flex items-center justify-center space-x-1.5">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <h2 className="text-[11px] uppercase tracking-widest font-black text-amber-500">OMAN SANDS CO.</h2>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Supervisor Portal (Muscat Portal)</p>
          </div>

          {/* Active Site Marker */}
          <div className="bg-slate-900 px-3 py-1.5 border-b border-slate-800 flex justify-between items-center text-[10px] text-slate-400 font-mono">
            <span className="text-[9px] text-slate-500">Live Connection:</span>
            <span className="text-amber-500 font-semibold flex items-center space-x-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-ping"></span>
              Muscat HQ server
            </span>
          </div>

          {/* Tab Pages / Scrollable Area */}
          <div className="flex-1 overflow-y-auto p-3 text-slate-200">
            
            {/* TAB 1: LABOR ATTENDANCE */}
            {activeTab === 'labor' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Daily Crew Check-In</h3>
                  <span className="text-[9px] px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded font-mono">
                    {workers.filter(w => w.present).length} / {workers.length} Present
                  </span>
                </div>

                <div className="space-y-2">
                  {workers.map((worker) => {
                    const todayWage = calculateWage(worker.dailyRate, worker.overtimeHours, worker.present);
                    
                    return (
                      <div 
                        key={worker.id}
                        className={`p-2.5 rounded-xl border transition-all duration-200 ${
                          worker.present 
                            ? 'bg-slate-900/90 border-slate-800' 
                            : 'bg-slate-950/40 border-slate-900 opacity-60'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0 pr-2">
                            <h4 className="text-[11px] font-bold text-white truncate">{worker.name}</h4>
                            <p className="text-[9px] text-slate-400 truncate">{worker.role}</p>
                            <p className="text-[8px] text-amber-500/80 font-mono mt-0.5 flex items-center">
                              <Building size={8} className="mr-0.5" />
                              {worker.site.replace(' Residential Complex', '').replace(' Commercial Tower', '').replace(' Logistics Hub', '')}
                            </p>
                          </div>
                          
                          {/* Presence toggle button */}
                          <button
                            onClick={() => toggleWorkerAttendance(worker.id)}
                            className={`px-2 py-1 rounded text-[9px] font-bold transition-all ${
                              worker.present 
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            }`}
                          >
                            {worker.present ? 'Present' : 'Absent'}
                          </button>
                        </div>

                        {worker.present && (
                          <div className="mt-2.5 pt-2 border-t border-slate-800/50 flex flex-col space-y-1.5">
                            <div className="flex justify-between items-center text-[9px]">
                              <span className="text-slate-400">Overtime hours:</span>
                              <span className="text-amber-500 font-mono font-bold">{worker.overtimeHours} hrs</span>
                            </div>
                            
                            {/* Simple Slider */}
                            <input 
                              type="range" 
                              min="0" 
                              max="4" 
                              step="1"
                              value={worker.overtimeHours}
                              onChange={(e) => updateWorkerOvertime(worker.id, parseInt(e.target.value))}
                              className="w-full accent-amber-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
                            />

                            <div className="flex justify-between items-center text-[9px] pt-1">
                              <span className="text-slate-400 font-medium">Daily Wage:</span>
                              <span className="text-white font-mono font-bold">
                                OMR {todayWage.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: MATERIALS LOGGER */}
            {activeTab === 'materials' && (
              <form onSubmit={submitMaterial} className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Log Received Materials</h3>
                
                {/* Site Selection */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Delivery Site</label>
                  <select 
                    value={selectedMatSite} 
                    onChange={(e) => setSelectedMatSite(e.target.value)}
                    className="w-full text-[11px] bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="Al Mouj Residential Complex">Al Mouj (Muscat)</option>
                    <option value="Bawshar Commercial Tower">Bawshar Tower</option>
                    <option value="Ruwi Logistics Hub">Ruwi Logistics Hub</option>
                  </select>
                </div>

                {/* Material Selection */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Material Type</label>
                  <select 
                    value={selectedMaterial} 
                    onChange={(e) => setSelectedMaterial(e.target.value)}
                    className="w-full text-[11px] bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="Cement (Bags)">Cement (Bags) — 2.200 OMR</option>
                    <option value="Steel Rebars (Tons)">Steel Rebars (Tons) — 230.000 OMR</option>
                    <option value="Ready-Mix Concrete (m³)">Ready-Mix Concrete (m³) — 35.000 OMR</option>
                  </select>
                </div>

                {/* Quantity Input */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Received Quantity</label>
                  <input 
                    type="number"
                    min="1"
                    max="1000"
                    value={matQuantity}
                    onChange={(e) => setMatQuantity(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full text-[11px] bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:border-amber-500 focus:outline-none font-mono"
                    required
                  />
                </div>

                {/* Simulated Cost Warning Label */}
                <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 text-[9px] text-slate-400 flex justify-between items-center font-mono">
                  <span>Calculated Est. Value:</span>
                  <span className="font-bold text-emerald-400">
                    OMR {(matQuantity * (selectedMaterial.includes('Cement') ? 2.2 : selectedMaterial.includes('Steel') ? 230 : 35)).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                  </span>
                </div>

                {/* Leakage Simulation Demo Checkbox */}
                <div className="p-2.5 bg-rose-500/5 rounded-xl border border-rose-500/10 space-y-1.5">
                  <div className="flex items-start space-x-2">
                    <input 
                      type="checkbox"
                      id="simulateDuplicate"
                      checked={simulateDuplicate}
                      onChange={(e) => setSimulateDuplicate(e.target.checked)}
                      className="mt-0.5 rounded border-slate-800 text-amber-500 focus:ring-amber-500"
                    />
                    <label htmlFor="simulateDuplicate" className="text-[9px] text-rose-300 font-medium leading-tight cursor-pointer">
                      <span className="font-bold text-rose-400 block">Simulate Duplicate Delivery</span>
                      (Tests live HQ anti-double billing algorithm)
                    </label>
                  </div>
                </div>

                {/* Submit button with status */}
                <button
                  type="submit"
                  disabled={matSuccess}
                  className={`w-full py-2.5 rounded-lg text-xs font-bold transition-all uppercase tracking-wider flex items-center justify-center space-x-1.5 ${
                    matSuccess 
                      ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20' 
                      : 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                  }`}
                >
                  {matSuccess ? (
                    <>
                      <Check size={14} strokeWidth={3} />
                      <span>Logged to Dashboard!</span>
                    </>
                  ) : (
                    <>
                      <FileCheck size={14} />
                      <span>Log to Dashboard</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* TAB 3: SITE EXPENSES */}
            {activeTab === 'expenses' && (
              <form onSubmit={submitExpense} className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Log Instant Site Expense</h3>

                {/* Site Selection */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Expense Site</label>
                  <select 
                    value={selectedExpSite} 
                    onChange={(e) => setSelectedExpSite(e.target.value)}
                    className="w-full text-[11px] bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="Al Mouj Residential Complex">Al Mouj (Muscat)</option>
                    <option value="Bawshar Commercial Tower">Bawshar Tower</option>
                    <option value="Ruwi Logistics Hub">Ruwi Logistics Hub</option>
                  </select>
                </div>

                {/* Expense Type */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Expense Type</label>
                  <select 
                    value={expenseType} 
                    onChange={(e) => setExpenseType(e.target.value)}
                    className="w-full text-[11px] bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="Fuel">Generator Fuel Refill</option>
                    <option value="Emergency Repair">Emergency Machinery Repair</option>
                    <option value="Food">Site Lunch Catering</option>
                    <option value="Safety Gear">Urgent Safety Consumables</option>
                    <option value="Equipment Rental">Specialized Tool Daily Rent</option>
                  </select>
                </div>

                {/* Amount input in OMR */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Amount (OMR)</label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-2 text-[10px] text-slate-500 font-mono font-bold">OMR</span>
                    <input 
                      type="number"
                      min="1"
                      placeholder="e.g. 50"
                      value={expenseAmount}
                      onChange={(e) => setExpenseAmount(e.target.value)}
                      className="w-full text-[11px] pl-11 bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:border-amber-500 focus:outline-none font-mono"
                      required
                    />
                  </div>
                </div>

                {/* Camera photo snapshot button */}
                <div className="space-y-1 pt-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">Receipt Attachment</label>
                  
                  {receiptCaptured ? (
                    <div className="relative border border-dashed border-emerald-500/40 bg-emerald-500/5 rounded-lg p-2 flex items-center justify-between">
                      <div className="flex items-center space-x-1.5 text-emerald-400">
                        <CheckCircle size={12} />
                        <span className="text-[9px] font-semibold">Receipt Captured (OCR Ready)</span>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => setReceiptCaptured(false)}
                        className="text-[8px] text-rose-400 underline hover:text-rose-300 font-mono"
                      >
                        Retake
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={capturing}
                      onClick={handleCaptureReceipt}
                      className="w-full border border-dashed border-slate-800 hover:border-slate-700 bg-slate-900 hover:bg-slate-900/80 p-3 rounded-lg text-slate-400 hover:text-slate-200 transition-all text-center flex flex-col items-center justify-center space-y-1"
                    >
                      <Camera size={16} className={`${capturing ? 'animate-bounce text-amber-500' : 'text-slate-400'}`} />
                      <span className="text-[9px] font-semibold">
                        {capturing ? 'Initializing Camera System...' : 'Snap Receipt Photo'}
                      </span>
                      <span className="text-[7px] text-slate-500">Auto-crop receipt frame</span>
                    </button>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={expSuccess}
                  className={`w-full py-2.5 rounded-lg text-xs font-bold transition-all uppercase tracking-wider flex items-center justify-center space-x-1.5 ${
                    expSuccess 
                      ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20' 
                      : 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                  }`}
                >
                  {expSuccess ? (
                    <>
                      <Check size={14} strokeWidth={3} />
                      <span>Expense Saved!</span>
                    </>
                  ) : (
                    <>
                      <CreditCard size={14} />
                      <span>Submit Expense</span>
                    </>
                  )}
                </button>
              </form>
            )}

          </div>

          {/* Bottom Simulated Tab Navigation Bar */}
          <div className="bg-slate-900/90 backdrop-blur-md border-t border-slate-800 grid grid-cols-3 py-1 select-none z-40">
            {/* Labor Tab Button */}
            <button
              onClick={() => setActiveTab('labor')}
              className={`flex flex-col items-center py-1 transition-all ${
                activeTab === 'labor' ? 'text-amber-500 font-bold' : 'text-slate-500 hover:text-slate-400'
              }`}
            >
              <Users size={15} className="mb-0.5" />
              <span className="text-[8px] tracking-wide">Crew Check</span>
            </button>

            {/* Materials Tab Button */}
            <button
              onClick={() => setActiveTab('materials')}
              className={`flex flex-col items-center py-1 transition-all ${
                activeTab === 'materials' ? 'text-amber-500 font-bold' : 'text-slate-500 hover:text-slate-400'
              }`}
            >
              <Package size={15} className="mb-0.5" />
              <span className="text-[8px] tracking-wide">Materials</span>
            </button>

            {/* Expenses Tab Button */}
            <button
              onClick={() => setActiveTab('expenses')}
              className={`flex flex-col items-center py-1 transition-all ${
                activeTab === 'expenses' ? 'text-amber-500 font-bold' : 'text-slate-500 hover:text-slate-400'
              }`}
            >
              <CreditCard size={15} className="mb-0.5" />
              <span className="text-[8px] tracking-wide">Expenses</span>
            </button>
          </div>

          {/* iOS Bottom Swipe Bar */}
          <div className="h-4 bg-slate-950 flex items-center justify-center pointer-events-none pb-1">
            <div className="w-24 h-1 bg-slate-700 rounded-full" />
          </div>

        </div>
      </div>
    </div>
  );
};
