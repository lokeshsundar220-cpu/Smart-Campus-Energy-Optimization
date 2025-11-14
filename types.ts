
export type UserRole = 'Admin' | 'Energy Manager' | 'Faculty/Staff' | 'Student';
export type View = 'dashboard' | 'planner' | 'devices' | 'reports';

export interface Building {
  id: string;
  name: string;
  type: 'Academic' | 'Residential' | 'Admin' | 'Lab' | 'Sports Complex';
  currentUsage: number; // in kWh
  temperature: number; // in Celsius
  occupancy: number; // percentage
}

export interface Device {
  id: string;
  name: string;
  type: 'HVAC' | 'Lighting' | 'Lab Equipment' | 'EV Charger' | 'Computer';
  buildingId: string;
  status: 'On' | 'Off' | 'Standby';
  usage: number; // in kWh
  scheduledOn?: string;
  scheduledOff?: string;
  temperatureSetting?: number;
}

export interface EnergyDataPoint {
  time: string;
  usage: number;
}

export interface Alert {
  id: string;
  type: 'Anomaly' | 'High Usage' | 'Inefficiency';
  message: string;
  severity: 'Critical' | 'Warning' | 'Info';
  timestamp: string;
}

export interface OptimizationSuggestion {
  id: string;
  title: string;
  description: string;
  category: 'Scheduling' | 'HVAC' | 'Lighting' | 'EV Charging';
  priority: 'High' | 'Medium' | 'Low';
  estimatedSavings: string; // e.g., "50 kWh/day"
}
