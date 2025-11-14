
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { mockBuildings, mockHourlyUsage, mockWeeklyUsage } from '../constants';
import type { Building, UserRole, EnergyDataPoint } from '../types';
import { BoltIcon, BuildingIcon, SunIcon, MoonIcon, InfoIcon, WarningIcon, CriticalIcon } from './icons';
import { getAnomalyAlerts } from '../services/geminiService';

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; color: string; }> = ({ title, value, icon, color }) => (
    <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
        <div className={`p-3 rounded-full ${color}`}>
            {icon}
        </div>
        <div className="ml-4">
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

const BuildingHeatmap: React.FC<{ buildings: Building[] }> = ({ buildings }) => {
    const maxUsage = Math.max(...buildings.map(b => b.currentUsage));
    const getColor = (usage: number) => {
        const percentage = usage / maxUsage;
        if (percentage > 0.8) return 'bg-red-500';
        if (percentage > 0.6) return 'bg-orange-400';
        if (percentage > 0.4) return 'bg-yellow-300';
        return 'bg-green-400';
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-brand-secondary">Building Energy Consumption Heatmap</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {buildings.map(building => (
                    <div key={building.id} className="text-center">
                        <div className={`w-full h-16 rounded-md flex items-center justify-center text-white font-bold ${getColor(building.currentUsage)}`}>
                            {building.currentUsage.toLocaleString()} kWh
                        </div>
                        <p className="mt-2 text-sm text-gray-600">{building.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const AlertItem: React.FC<{ alert: any }> = ({ alert }) => {
    const iconMap = {
        'Critical': <CriticalIcon className="w-5 h-5 text-status-danger" />,
        'Warning': <WarningIcon className="w-5 h-5 text-status-warning" />,
        'Info': <InfoIcon className="w-5 h-5 text-blue-500" />,
    };

    const colorMap = {
        'Critical': 'border-status-danger',
        'Warning': 'border-status-warning',
        'Info': 'border-blue-500',
    };

    return (
        <div className={`flex items-start p-3 border-l-4 ${colorMap[alert.severity]} bg-white rounded-r-lg mb-3`}>
            <div className="flex-shrink-0">{iconMap[alert.severity]}</div>
            <div className="ml-3">
                <p className="text-sm font-medium text-gray-800">{alert.message}</p>
                <p className="text-xs text-gray-500">{alert.timestamp}</p>
            </div>
        </div>
    );
};

export const Dashboard: React.FC<{ userRole: UserRole }> = ({ userRole }) => {
    const [alerts, setAlerts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const totalUsage = mockBuildings.reduce((sum, b) => sum + b.currentUsage, 0);
    const estimatedCost = totalUsage * 0.12; // Assuming $0.12 per kWh

    useEffect(() => {
        const fetchAlerts = async () => {
            setLoading(true);
            const geminiAlerts = await getAnomalyAlerts(mockHourlyUsage);
            setAlerts(geminiAlerts);
            setLoading(false);
        };
        fetchAlerts();
    }, []);


    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Live Usage" value={`${(totalUsage / 1000).toFixed(2)} MWh`} icon={<BoltIcon className="w-6 h-6 text-white" />} color="bg-brand-primary" />
                <StatCard title="Estimated Hourly Cost" value={`$${estimatedCost.toFixed(2)}`} icon={<BuildingIcon className="w-6 h-6 text-white" />} color="bg-green-500" />
                <StatCard title="Peak Hours" value="1 PM - 4 PM" icon={<SunIcon className="w-6 h-6 text-white" />} color="bg-yellow-500" />
                <StatCard title="Off-Peak Hours" value="12 AM - 5 AM" icon={<MoonIcon className="w-6 h-6 text-white" />} color="bg-indigo-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4 text-brand-secondary">Today's Energy Usage (kWh)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={mockHourlyUsage}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="time" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="usage" stroke="#007A7A" strokeWidth={2} dot={false} name="Live Usage" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                     <h3 className="text-lg font-semibold mb-4 text-brand-secondary">AI-Powered Alerts</h3>
                    {loading ? <p>Loading alerts...</p> : alerts.map(alert => <AlertItem key={alert.id} alert={alert} />)}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BuildingHeatmap buildings={mockBuildings} />
                <div className="bg-white p-6 rounded-lg shadow-md">
                     <h3 className="text-lg font-semibold mb-4 text-brand-secondary">This Week's Energy Usage (MWh)</h3>
                     <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={mockWeeklyUsage.map(d => ({...d, usage: d.usage/1000}))}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="time" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="usage" fill="#004D4D" name="Usage (MWh)" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};
