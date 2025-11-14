
import React, { useState } from 'react';
import type { Device, UserRole } from '../types';
import { mockDevices, mockBuildings } from '../constants';
import { ThermometerIcon, LightbulbIcon, ZapIcon, DevicesIcon } from './icons';

const DeviceCard: React.FC<{ device: Device; onUpdate: (updatedDevice: Device) => void; }> = ({ device, onUpdate }) => {
    const buildingName = mockBuildings.find(b => b.id === device.buildingId)?.name || 'Unknown';

    const handleStatusToggle = () => {
        const newStatus = device.status === 'On' ? 'Off' : 'On';
        onUpdate({ ...device, status: newStatus });
    };

    const handleTempChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdate({ ...device, temperatureSetting: parseInt(e.target.value) });
    };

    const iconMap = {
        'HVAC': <ThermometerIcon className="w-6 h-6 text-blue-500" />,
        'Lighting': <LightbulbIcon className="w-6 h-6 text-yellow-500" />,
        'EV Charger': <ZapIcon className="w-6 h-6 text-green-500" />,
        'Lab Equipment': <DevicesIcon className="w-6 h-6 text-purple-500" />,
        'Computer': <DevicesIcon className="w-6 h-6 text-gray-500" />,
    };

    return (
        <div className="bg-white p-5 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    {iconMap[device.type]}
                    <h3 className="ml-3 text-lg font-semibold text-brand-secondary">{device.name}</h3>
                </div>
                <div className={`px-3 py-1 text-sm font-semibold rounded-full ${device.status === 'On' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {device.status}
                </div>
            </div>
            <p className="text-sm text-gray-500 mt-1">{buildingName} - {device.type}</p>
            <div className="mt-4 flex flex-col space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-gray-600">Status Control</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={device.status === 'On'} onChange={handleStatusToggle} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
                    </label>
                </div>
                {device.type === 'HVAC' && device.temperatureSetting !== undefined && (
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">Temperature</span>
                        <div className="flex items-center space-x-2">
                            <input type="range" min="16" max="30" value={device.temperatureSetting} onChange={handleTempChange} className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                            <span className="font-semibold text-brand-secondary">{device.temperatureSetting}°C</span>
                        </div>
                    </div>
                )}
            </div>
             <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">Live Usage: <span className="font-bold text-brand-secondary">{device.usage} kWh</span></p>
             </div>
        </div>
    );
};

export const DeviceControl: React.FC<{ userRole: UserRole }> = ({ userRole }) => {
    const [devices, setDevices] = useState<Device[]>(mockDevices);
    const [filter, setFilter] = useState<string>('all');

    const handleUpdateDevice = (updatedDevice: Device) => {
        setDevices(devices.map(d => d.id === updatedDevice.id ? updatedDevice : d));
    };
    
    if (userRole !== 'Admin') {
        return (
            <div className="text-center p-10 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-brand-secondary">Access Denied</h2>
                <p className="mt-2 text-gray-600">Only Admins can access device controls.</p>
            </div>
        );
    }
    
    const filteredDevices = filter === 'all' ? devices : devices.filter(d => d.buildingId === filter);

    return (
        <div>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-brand-secondary">Simulated Device Control</h1>
                    <p className="mt-2 text-gray-600">
                        Manage and monitor individual devices across campus. Changes are simulated.
                    </p>
                </div>
                <select 
                    value={filter} 
                    onChange={e => setFilter(e.target.value)}
                    className="bg-brand-light border border-brand-primary text-brand-secondary text-sm rounded-lg focus:ring-brand-accent focus:border-brand-accent block p-2.5">
                    <option value="all">All Buildings</option>
                    {mockBuildings.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDevices.map(device => (
                    <DeviceCard key={device.id} device={device} onUpdate={handleUpdateDevice} />
                ))}
            </div>
        </div>
    );
};
