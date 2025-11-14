
import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { mockWeeklyUsage, mockBuildings } from '../constants';
import type { UserRole } from '../types';
import { DownloadIcon } from './icons';

export const Reports: React.FC<{ userRole: UserRole }> = ({ userRole }) => {
    const reportRef = useRef<HTMLDivElement>(null);

    const handleDownloadPdf = () => {
        const input = reportRef.current;
        if (input) {
            html2canvas(input, { scale: 2 }).then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save("campus-energy-report.pdf");
            });
        }
    };

    if (userRole === 'Student') {
         return (
            <div className="text-center p-10 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-brand-secondary">Access Denied</h2>
                <p className="mt-2 text-gray-600">You do not have permission to view detailed reports.</p>
            </div>
        );
    }
    
    const totalWeeklyUsage = mockWeeklyUsage.reduce((sum, day) => sum + day.usage, 0);
    const avgDailyUsage = totalWeeklyUsage / mockWeeklyUsage.length;
    const carbonEmissions = totalWeeklyUsage * 0.433; // Avg kg CO2 per kWh in US

    return (
        <div>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-brand-secondary">Energy & Sustainability Report</h1>
                    <p className="mt-2 text-gray-600">
                        A summary of weekly performance and key sustainability metrics.
                    </p>
                </div>
                <button
                    onClick={handleDownloadPdf}
                    className="flex items-center px-4 py-2 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-secondary transition-colors"
                >
                    <DownloadIcon className="w-5 h-5 mr-2" />
                    Download PDF
                </button>
            </div>

            <div ref={reportRef} className="p-8 bg-white rounded-lg shadow-md">
                <div className="border-b pb-4 mb-6">
                    <h2 className="text-2xl font-bold text-brand-secondary">Weekly Energy Report</h2>
                    <p className="text-sm text-gray-500">For the week ending July 31, 2024</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="p-4 bg-brand-light rounded-lg text-center">
                        <p className="text-sm text-brand-secondary">Total Weekly Usage</p>
                        <p className="text-3xl font-bold text-brand-primary">{(totalWeeklyUsage / 1000).toLocaleString()} MWh</p>
                    </div>
                    <div className="p-4 bg-brand-light rounded-lg text-center">
                        <p className="text-sm text-brand-secondary">Average Daily Usage</p>
                        <p className="text-3xl font-bold text-brand-primary">{(avgDailyUsage / 1000).toFixed(2)} MWh</p>
                    </div>
                     <div className="p-4 bg-brand-light rounded-lg text-center">
                        <p className="text-sm text-brand-secondary">Est. Carbon Emissions</p>
                        <p className="text-3xl font-bold text-brand-primary">{(carbonEmissions / 1000).toFixed(2)} tCO₂e</p>
                    </div>
                </div>

                <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4 text-brand-secondary">Weekly Usage Breakdown (kWh)</h3>
                     <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={mockWeeklyUsage}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="time" />
                            <YAxis />
                            <Tooltip formatter={(value: number) => `${value.toLocaleString()} kWh`} />
                            <Bar dataKey="usage" fill="#007A7A" name="Usage (kWh)" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div>
                    <h3 className="text-xl font-semibold mb-4 text-brand-secondary">Top Consuming Buildings (Live)</h3>
                    <div className="space-y-2">
                        {mockBuildings
                            .sort((a, b) => b.currentUsage - a.currentUsage)
                            .slice(0, 5)
                            .map((building, index) => (
                            <div key={building.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                <p className="font-medium text-gray-700">{index + 1}. {building.name}</p>
                                <p className="font-bold text-brand-secondary">{building.currentUsage.toLocaleString()} kWh</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
