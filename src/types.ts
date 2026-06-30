export interface Worker {
  id: string;
  name: string;
  role: string;
  dailyRate: number; // in OMR
  present: boolean;
  overtimeHours: number; // 0 to 4 hours
  site: string;
}

export interface MaterialLog {
  id: string;
  timestamp: string;
  site: string;
  material: string; // Cement (Bags), Steel Rebars (Tons), Ready-Mix Concrete (m³)
  quantity: number;
  cost: number; // in OMR
  status: 'Pending' | 'Verified' | 'Flagged';
  isLeakageBlocked: boolean;
}

export interface ExpenseLog {
  id: string;
  timestamp: string;
  site: string;
  expenseType: string; // Fuel, Emergency Repair, Food, Safety Gear, Equipment Rental
  amount: number; // in OMR
  receiptImage: string; // Base64 or placeholder description
  status: 'Approved' | 'Flagged' | 'Pending';
}

export interface SiteStats {
  name: string;
  plannedBudget: number; // in OMR
  initialSpend: number;  // static baseline spend in OMR
  laborSpend: number;    // dynamic labor spend
  materialSpend: number; // dynamic material spend
  otherSpend: number;    // dynamic other expenses
}

export interface AuditItem {
  id: string;
  timestamp: string;
  site: string;
  type: 'LABOR' | 'MATERIAL' | 'EXPENSE' | 'LEAKAGE_PREVENTED' | 'ALERT';
  message: string;
  amount?: number;
  severity: 'info' | 'warning' | 'success' | 'danger';
}
