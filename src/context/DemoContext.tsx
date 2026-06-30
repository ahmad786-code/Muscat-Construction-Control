import React, { createContext, useContext, useState, useEffect } from 'react';
import { Worker, MaterialLog, ExpenseLog, SiteStats, AuditItem } from '../types';

interface DemoContextType {
  workers: Worker[];
  materialLogs: MaterialLog[];
  expenseLogs: ExpenseLog[];
  auditStream: AuditItem[];
  siteStats: SiteStats[];
  totalBurnRate: number;
  activeLaborCount: number;
  leakagePrevented: number;
  toggleWorkerAttendance: (id: string) => void;
  updateWorkerOvertime: (id: string, hours: number) => void;
  addMaterialLog: (site: string, material: string, quantity: number, isDuplicateLeak?: boolean) => void;
  addExpenseLog: (site: string, type: string, amount: number, receiptDesc?: string) => void;
  resolveLeakage: (logId: string, approve: boolean) => void;
  clearAllDemoLogs: () => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

const INITIAL_WORKERS: Worker[] = [
  { id: 'w1', name: 'Sunil Kumar', role: 'Concrete Lead Specialist', dailyRate: 28, present: true, overtimeHours: 0, site: 'Al Mouj Residential Complex' },
  { id: 'w2', name: 'Ali Al-Balushi', role: 'Senior Site Foreman', dailyRate: 45, present: true, overtimeHours: 1, site: 'Bawshar Commercial Tower' },
  { id: 'w3', name: 'Amit Patel', role: 'Structural Welder', dailyRate: 22, present: false, overtimeHours: 0, site: 'Ruwi Logistics Hub' },
  { id: 'w4', name: 'Salim Al-Harthy', role: 'Safety Inspector', dailyRate: 40, present: true, overtimeHours: 0, site: 'Al Mouj Residential Complex' },
  { id: 'w5', name: 'Tariq Sajid', role: 'Excavator Operator', dailyRate: 32, present: true, overtimeHours: 2, site: 'Bawshar Commercial Tower' },
];

const INITIAL_MATERIALS: MaterialLog[] = [
  {
    id: 'm1',
    timestamp: '08:32 AM',
    site: 'Al Mouj Residential Complex',
    material: 'Cement (Bags)',
    quantity: 120,
    cost: 264, // 2.2 OMR per bag
    status: 'Verified',
    isLeakageBlocked: false,
  },
  {
    id: 'm2',
    timestamp: '09:15 AM',
    site: 'Bawshar Commercial Tower',
    material: 'Steel Rebars (Tons)',
    quantity: 8,
    cost: 1840, // 230 OMR per Ton
    status: 'Verified',
    isLeakageBlocked: false,
  },
  {
    id: 'm3',
    timestamp: '11:05 AM',
    site: 'Bawshar Commercial Tower',
    material: 'Ready-Mix Concrete (m³)',
    quantity: 12,
    cost: 420, // 35 OMR per m3
    status: 'Flagged',
    isLeakageBlocked: true, // This starts as blocked to represent the 420 OMR leakage prevented!
  }
];

const INITIAL_EXPENSES: ExpenseLog[] = [
  {
    id: 'e1',
    timestamp: '10:20 AM',
    site: 'Ruwi Logistics Hub',
    expenseType: 'Emergency Repair',
    amount: 150,
    receiptImage: 'Hydraulic hose replacement receipt stamp',
    status: 'Approved',
  },
  {
    id: 'e2',
    timestamp: '11:45 AM',
    site: 'Al Mouj Residential Complex',
    expenseType: 'Fuel',
    amount: 85,
    receiptImage: 'Diesel fuel delivery verification doc',
    status: 'Approved',
  }
];

const INITIAL_SITES: SiteStats[] = [
  { name: 'Al Mouj Residential Complex', plannedBudget: 18500, initialSpend: 13800, laborSpend: 0, materialSpend: 0, otherSpend: 0 },
  { name: 'Bawshar Commercial Tower', plannedBudget: 29000, initialSpend: 23200, laborSpend: 0, materialSpend: 0, otherSpend: 0 },
  { name: 'Ruwi Logistics Hub', plannedBudget: 12500, initialSpend: 8400, laborSpend: 0, materialSpend: 0, otherSpend: 0 }
];

const INITIAL_AUDITS: AuditItem[] = [
  { id: 'a1', timestamp: '08:32 AM', site: 'Al Mouj Residential Complex', type: 'MATERIAL', message: 'Supervisor logged 120 Bags of Cement. Verified automatically via vendor manifest.', amount: 264, severity: 'success' },
  { id: 'a2', timestamp: '09:15 AM', site: 'Bawshar Commercial Tower', type: 'MATERIAL', message: 'Supervisor logged 8 Tons of Steel Rebars. Verified against PO #OM-4402.', amount: 1840, severity: 'success' },
  { id: 'a3', timestamp: '10:20 AM', site: 'Ruwi Logistics Hub', type: 'EXPENSE', message: 'Emergency repair of hydraulic lift logged by Supervisor Sunil K.', amount: 150, severity: 'info' },
  { id: 'a4', timestamp: '11:05 AM', site: 'Bawshar Commercial Tower', type: 'LEAKAGE_PREVENTED', message: 'CRITICAL WARNING: Duplicate delivery ticket #2938 logged for 12m³ Ready-Mix. Leakage blocked!', amount: 420, severity: 'danger' },
  { id: 'a5', timestamp: '11:45 AM', site: 'Al Mouj Residential Complex', type: 'EXPENSE', message: 'Fuel expenses logged for onsite emergency generator.', amount: 85, severity: 'info' },
  { id: 'a6', timestamp: '07:30 AM', site: 'All Sites', type: 'LABOR', message: 'Daily crew digital check-in complete. 4 workers checked in.', severity: 'info' }
];

export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workers, setWorkers] = useState<Worker[]>(INITIAL_WORKERS);
  const [materialLogs, setMaterialLogs] = useState<MaterialLog[]>(INITIAL_MATERIALS);
  const [expenseLogs, setExpenseLogs] = useState<ExpenseLog[]>(INITIAL_EXPENSES);
  const [auditStream, setAuditStream] = useState<AuditItem[]>(INITIAL_AUDITS);
  const [siteStats, setSiteStats] = useState<SiteStats[]>(INITIAL_SITES);

  // Derived KPIs
  const [totalBurnRate, setTotalBurnRate] = useState(0);
  const [activeLaborCount, setActiveLaborCount] = useState(0);
  const [leakagePrevented, setLeakagePrevented] = useState(420); // starts with the 420 OMR blocked concrete leak

  // Calculate dynamic labor wages and KPIs
  useEffect(() => {
    // 1. Calculate active labor count
    const activeWorkers = workers.filter(w => w.present);
    setActiveLaborCount(activeWorkers.length);

    // 2. Calculate dynamic spend breakdowns per site
    // Labor cost today
    const laborSiteMap: { [site: string]: number } = {};
    workers.forEach(w => {
      if (!laborSiteMap[w.site]) laborSiteMap[w.site] = 0;
      if (w.present) {
        // Overtime rate standard OMR
        const hourlyOvertime = (w.dailyRate / 8) * 1.5;
        const wage = w.dailyRate + (w.overtimeHours * hourlyOvertime);
        laborSiteMap[w.site] += wage;
      }
    });

    // Material cost today
    const materialSiteMap: { [site: string]: number } = {};
    materialLogs.forEach(m => {
      if (!materialSiteMap[m.site]) materialSiteMap[m.site] = 0;
      if (m.status === 'Verified') {
        materialSiteMap[m.site] += m.cost;
      }
    });

    // Other expenses today
    const otherSiteMap: { [site: string]: number } = {};
    expenseLogs.forEach(e => {
      if (!otherSiteMap[e.site]) otherSiteMap[e.site] = 0;
      if (e.status === 'Approved') {
        otherSiteMap[e.site] += e.amount;
      }
    });

    // 3. Update the SiteStats list dynamically
    setSiteStats(prev => prev.map(site => ({
      ...site,
      laborSpend: Number((laborSiteMap[site.name] || 0).toFixed(1)),
      materialSpend: Number((materialSiteMap[site.name] || 0).toFixed(1)),
      otherSpend: Number((otherSiteMap[site.name] || 0).toFixed(1))
    })));

    // 4. Calculate total daily burn rate
    // Live actual burn rate includes: active labor + active material logs + approved expenses today
    const activeLaborCostTotal = workers.reduce((sum, w) => {
      if (w.present) {
        const hourlyOvertime = (w.dailyRate / 8) * 1.5;
        return sum + w.dailyRate + (w.overtimeHours * hourlyOvertime);
      }
      return sum;
    }, 0);

    const activeMaterialCostTotal = materialLogs
      .filter(m => m.status === 'Verified')
      .reduce((sum, m) => sum + m.cost, 0);

    const activeExpenseCostTotal = expenseLogs
      .filter(e => e.status === 'Approved')
      .reduce((sum, e) => sum + e.amount, 0);

    setTotalBurnRate(Number((activeLaborCostTotal + activeMaterialCostTotal + activeExpenseCostTotal).toFixed(1)));

    // 5. Update Leakage Prevented KPI dynamically
    const blockedMaterials = materialLogs
      .filter(m => m.status === 'Flagged' && m.isLeakageBlocked)
      .reduce((sum, m) => sum + m.cost, 0);
    const blockedExpenses = expenseLogs
      .filter(e => e.status === 'Flagged')
      .reduce((sum, e) => sum + e.amount, 0);
    
    // We start with baseline 420, if anything else gets flagged/prevented, it accumulates
    setLeakagePrevented(420 + blockedMaterials - 420 + blockedExpenses); // Offset the default m3 log so it doesn't double count if user changes status
  }, [workers, materialLogs, expenseLogs]);

  // Actions
  const toggleWorkerAttendance = (id: string) => {
    setWorkers(prev => prev.map(w => {
      if (w.id === id) {
        const nextState = !w.present;
        
        // Add audit notification
        const actionTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const newAudit: AuditItem = {
          id: `audit-${Date.now()}`,
          timestamp: actionTime,
          site: w.site,
          type: 'LABOR',
          message: `${w.name} (${w.role}) marked ${nextState ? 'PRESENT' : 'ABSENT'} at ${w.site}.`,
          severity: nextState ? 'success' : 'warning'
        };
        setAuditStream(audits => [newAudit, ...audits]);

        return { ...w, present: nextState };
      }
      return w;
    }));
  };

  const updateWorkerOvertime = (id: string, hours: number) => {
    setWorkers(prev => prev.map(w => {
      if (w.id === id) {
        const prevHours = w.overtimeHours;
        if (prevHours !== hours) {
          const actionTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const newAudit: AuditItem = {
            id: `audit-${Date.now()}`,
            timestamp: actionTime,
            site: w.site,
            type: 'LABOR',
            message: `Updated overtime for ${w.name} to ${hours} hours.`,
            severity: 'info'
          };
          setAuditStream(audits => [newAudit, ...audits]);
        }
        return { ...w, overtimeHours: hours };
      }
      return w;
    }));
  };

  const addMaterialLog = (site: string, material: string, quantity: number, isDuplicateLeak?: boolean) => {
    // Estimating materials cost
    let unitCost = 2.2; // Cement bag
    if (material.includes('Steel')) unitCost = 230; // Steel per Ton
    if (material.includes('Concrete')) unitCost = 35; // Concrete per m3
    
    const cost = Number((quantity * unitCost).toFixed(1));
    const actionTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const logId = `mat-${Date.now()}`;

    const newLog: MaterialLog = {
      id: logId,
      timestamp: actionTime,
      site,
      material,
      quantity,
      cost,
      status: isDuplicateLeak ? 'Flagged' : 'Verified',
      isLeakageBlocked: isDuplicateLeak ? true : false
    };

    setMaterialLogs(prev => [newLog, ...prev]);

    // Add corresponding audit logs
    if (isDuplicateLeak) {
      const auditWarn: AuditItem = {
        id: `audit-${Date.now()}-warn`,
        timestamp: actionTime,
        site,
        type: 'LEAKAGE_PREVENTED',
        message: `AUTOMATED SYSTEM BLOCK: Suspicious duplicate manifest found for ${quantity} of ${material} at ${site}. Prevented overpayment!`,
        amount: cost,
        severity: 'danger'
      };
      setAuditStream(prev => [auditWarn, ...prev]);
    } else {
      const auditOk: AuditItem = {
        id: `audit-${Date.now()}-ok`,
        timestamp: actionTime,
        site,
        type: 'MATERIAL',
        message: `Field Supervisor submitted ${quantity} ${material} delivery. Checked & Verified.`,
        amount: cost,
        severity: 'success'
      };
      setAuditStream(prev => [auditOk, ...prev]);
    }
  };

  const addExpenseLog = (site: string, type: string, amount: number, receiptDesc?: string) => {
    const actionTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const logId = `exp-${Date.now()}`;

    // Random leakage test: If expense amount is unusually high for "Food" or "Fuel" with no matching log
    const isLeakageSuspected = type === 'Food' && amount > 100;
    const status = isLeakageSuspected ? 'Flagged' : 'Approved';

    const newLog: ExpenseLog = {
      id: logId,
      timestamp: actionTime,
      site,
      expenseType: type,
      amount,
      receiptImage: receiptDesc || 'Receipt photograph uploaded via mobile camera scanner',
      status
    };

    setExpenseLogs(prev => [newLog, ...prev]);

    // Audit logs
    if (isLeakageSuspected) {
      const auditLeak: AuditItem = {
        id: `audit-${Date.now()}-leak`,
        timestamp: actionTime,
        site,
        type: 'LEAKAGE_PREVENTED',
        message: `SUSPICIOUS EXPENSE AUDIT: Food expense OMR ${amount} exceeds site standard threshold of OMR 30. Held for Review!`,
        amount,
        severity: 'warning'
      };
      setAuditStream(prev => [auditLeak, ...prev]);
    } else {
      const auditOk: AuditItem = {
        id: `audit-${Date.now()}-ok`,
        timestamp: actionTime,
        site,
        type: 'EXPENSE',
        message: `New expense log: ${type} of OMR ${amount} submitted at ${site}.`,
        amount,
        severity: 'info'
      };
      setAuditStream(prev => [auditOk, ...prev]);
    }
  };

  // Resolve leakages flagged by system - Owner dashboard can approve or decline
  const resolveLeakage = (logId: string, approve: boolean) => {
    const actionTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Check material logs
    const matLog = materialLogs.find(m => m.id === logId);
    if (matLog) {
      setMaterialLogs(prev => prev.map(m => {
        if (m.id === logId) {
          return {
            ...m,
            status: approve ? 'Verified' : 'Flagged',
            isLeakageBlocked: !approve
          };
        }
        return m;
      }));

      const auditMsg: AuditItem = {
        id: `audit-${Date.now()}`,
        timestamp: actionTime,
        site: matLog.site,
        type: approve ? 'MATERIAL' : 'LEAKAGE_PREVENTED',
        message: approve 
          ? `Owner manually OVERRODE and APPROVED flagged delivery of ${matLog.quantity} ${matLog.material}.`
          : `Owner REJECTED duplicate manifest of ${matLog.quantity} ${matLog.material}. OMR ${matLog.cost} leakage permanently saved.`,
        amount: matLog.cost,
        severity: approve ? 'success' : 'success'
      };
      setAuditStream(prev => [auditMsg, ...prev]);
      return;
    }

    // Check expense logs
    const expLog = expenseLogs.find(e => e.id === logId);
    if (expLog) {
      setExpenseLogs(prev => prev.map(e => {
        if (e.id === logId) {
          return {
            ...e,
            status: approve ? 'Approved' : 'Flagged'
          };
        }
        return e;
      }));

      const auditMsg: AuditItem = {
        id: `audit-${Date.now()}`,
        timestamp: actionTime,
        site: expLog.site,
        type: approve ? 'EXPENSE' : 'LEAKAGE_PREVENTED',
        message: approve 
          ? `Owner APPROVED flagged expense ${expLog.expenseType} of OMR ${expLog.amount}.`
          : `Owner REJECTED fraudulent expense ${expLog.expenseType} of OMR ${expLog.amount}. Financial leak stopped.`,
        amount: expLog.amount,
        severity: approve ? 'success' : 'success'
      };
      setAuditStream(prev => [auditMsg, ...prev]);
    }
  };

  const clearAllDemoLogs = () => {
    setWorkers(INITIAL_WORKERS);
    setMaterialLogs(INITIAL_MATERIALS);
    setExpenseLogs(INITIAL_EXPENSES);
    setAuditStream(INITIAL_AUDITS);
  };

  return (
    <DemoContext.Provider value={{
      workers,
      materialLogs,
      expenseLogs,
      auditStream,
      siteStats,
      totalBurnRate,
      activeLaborCount,
      leakagePrevented,
      toggleWorkerAttendance,
      updateWorkerOvertime,
      addMaterialLog,
      addExpenseLog,
      resolveLeakage,
      clearAllDemoLogs
    }}>
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = () => {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
};
