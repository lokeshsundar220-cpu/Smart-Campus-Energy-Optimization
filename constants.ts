
import type { Building, Device, EnergyDataPoint, Alert } from './types';

export const mockBuildings: Building[] = [
  { id: 'b1', name: 'Engineering Block', type: 'Academic', currentUsage: 2500, temperature: 22, occupancy: 75 },
  { id: 'b2', name: 'Library & Learning Center', type: 'Academic', currentUsage: 1800, temperature: 21, occupancy: 60 },
  { id: 'b3', name: 'Student Hostel A', type: 'Residential', currentUsage: 3200, temperature: 24, occupancy: 90 },
  { id: 'b4', name: 'Admin Building', type: 'Admin', currentUsage: 950, temperature: 22, occupancy: 85 },
  { id: 'b5', name: 'Bio-Science Labs', type: 'Lab', currentUsage: 4100, temperature: 20, occupancy: 50 },
  { id: 'b6', name: 'Sports Complex', type: 'Sports Complex', currentUsage: 2800, temperature: 23, occupancy: 40 },
];

export const mockDevices: Device[] = [
  // Engineering Block
  { id: 'd1', name: 'Main HVAC', buildingId: 'b1', type: 'HVAC', status: 'On', usage: 1200, temperatureSetting: 22 },
  { id: 'd2', name: 'Floor 1 Lights', buildingId: 'b1', type: 'Lighting', status: 'On', usage: 300 },
  { id: 'd3', name: 'CNC Machine', buildingId: 'b1', type: 'Lab Equipment', status: 'On', usage: 600 },
  // Library
  { id: 'd4', name: 'Central Air', buildingId: 'b2', type: 'HVAC', status: 'On', usage: 900, temperatureSetting: 21 },
  { id: 'd5', name: 'Reading Hall Lights', buildingId: 'b2', type: 'Lighting', status: 'On', usage: 450 },
  // Hostel A
  { id: 'd6', name: 'Hostel HVAC', buildingId: 'b3', type: 'HVAC', status: 'On', usage: 2000, temperatureSetting: 24 },
  { id: 'd7', name: 'EV Charger 1', buildingId: 'b3', type: 'EV Charger', status: 'Standby', usage: 50 },
  // Bio-Science Labs
  { id: 'd8', name: 'Lab Freezer -80C', buildingId: 'b5', type: 'Lab Equipment', status: 'On', usage: 1500 },
  { id: 'd9', name: 'Fume Hoods', buildingId: 'b5', type: 'Lab Equipment', status: 'On', usage: 1100 },
];

export const mockHourlyUsage: EnergyDataPoint[] = [
  { time: '12 AM', usage: 8000 }, { time: '1 AM', usage: 7500 }, { time: '2 AM', usage: 7200 },
  { time: '3 AM', usage: 7000 }, { time: '4 AM', usage: 6900 }, { time: '5 AM', usage: 7100 },
  { time: '6 AM', usage: 8500 }, { time: '7 AM', usage: 10000 }, { time: '8 AM', usage: 12500 },
  { time: '9 AM', usage: 14000 }, { time: '10 AM', usage: 15500 }, { time: '11 AM', usage: 16000 },
  { time: '12 PM', usage: 15800 }, { time: '1 PM', usage: 16200 }, { time: '2 PM', usage: 16500 },
  { time: '3 PM', usage: 16300 }, { time: '4 PM', usage: 15900 }, { time: '5 PM', usage: 14800 },
  { time: '6 PM', usage: 13500 }, { time: '7 PM', usage: 12000 }, { time: '8 PM', usage: 11000 },
  { time: '9 PM', usage: 10500 }, { time: '10 PM', usage: 9500 }, { time: '11 PM', usage: 8800 },
];

export const mockWeeklyUsage: EnergyDataPoint[] = [
  { time: 'Mon', usage: 140000 }, { time: 'Tue', usage: 145000 }, { time: 'Wed', usage: 150000 },
  { time: 'Thu', usage: 148000 }, { time: 'Fri', usage: 142000 }, { time: 'Sat', usage: 90000 },
  { time: 'Sun', usage: 85000 },
];

export const mockAlerts: Alert[] = [
    { id: 'a1', type: 'High Usage', message: 'Bio-Science Labs usage is 30% above average.', severity: 'Warning', timestamp: '2024-07-31 14:30' },
    { id: 'a2', type: 'Anomaly', message: 'Unusual energy spike detected in Student Hostel A overnight.', severity: 'Critical', timestamp: '2024-07-31 03:15' },
    { id: 'a3', type: 'Inefficiency', message: 'HVAC in Engineering Block running at full capacity during low occupancy.', severity: 'Info', timestamp: '2024-07-30 20:00' },
];
