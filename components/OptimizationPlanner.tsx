
import React, { useState, useEffect } from 'react';
import { getOptimizationSuggestions } from '../services/geminiService';
import type { OptimizationSuggestion, UserRole } from '../types';
import { mockBuildings, mockDevices } from '../constants';
import { LightbulbIcon, ThermometerIcon, ZapIcon, PlannerIcon } from './icons';

const SuggestionCard: React.FC<{ suggestion: OptimizationSuggestion }> = ({ suggestion }) => {
    const categoryIcons = {
        'HVAC': <ThermometerIcon className="w-6 h-6 text-blue-500" />,
        'Lighting': <LightbulbIcon className="w-6 h-6 text-yellow-500" />,
        'Scheduling': <PlannerIcon className="w-6 h-6 text-purple-500" />,
        'EV Charging': <ZapIcon className="w-6 h-6 text-green-500" />,
    };

    const priorityColors = {
        'High': 'border-red-500',
        'Medium': 'border-yellow-500',
        'Low': 'border-green-500',
    };

    return (
        <div className={`bg-white p-5 rounded-lg shadow-md border-l-4 ${priorityColors[suggestion.priority]}`}>
            <div className="flex items-start justify-between">
                <div className="flex items-center">
                    {categoryIcons[suggestion.category] || <PlannerIcon className="w-6 h-6 text-gray-500" />}
                    <h3 className="ml-3 text-lg font-semibold text-brand-secondary">{suggestion.title}</h3>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    suggestion.priority === 'High' ? 'bg-red-100 text-red-800' :
                    suggestion.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                }`}>
                    {suggestion.priority}
                </span>
            </div>
            <p className="mt-2 text-gray-600">{suggestion.description}</p>
            <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm font-medium text-green-600">
                    Estimated Savings: <span className="font-bold">{suggestion.estimatedSavings}</span>
                </p>
            </div>
        </div>
    );
};

export const OptimizationPlanner: React.FC<{ userRole: UserRole }> = ({ userRole }) => {
    const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchSuggestions = async () => {
            setLoading(true);
            const fetchedSuggestions = await getOptimizationSuggestions(mockBuildings, mockDevices);
            setSuggestions(fetchedSuggestions);
            setLoading(false);
        };

        fetchSuggestions();
    }, []);

    if (userRole !== 'Admin' && userRole !== 'Energy Manager') {
        return (
            <div className="text-center p-10 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-brand-secondary">Access Denied</h2>
                <p className="mt-2 text-gray-600">You do not have permission to view the Optimization Planner.</p>
            </div>
        );
    }
    
    return (
        <div>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h1 className="text-3xl font-bold text-brand-secondary">AI Optimization Planner</h1>
                <p className="mt-2 text-gray-600">
                    Powered by Gemini, this planner analyzes real-time campus data to provide actionable strategies for reducing energy waste and lowering costs.
                </p>
            </div>
            
            {loading ? (
                <div className="text-center p-10">
                    <p className="text-lg text-brand-secondary">Generating AI Recommendations...</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {suggestions.map((suggestion) => (
                        <SuggestionCard key={suggestion.id} suggestion={suggestion} />
                    ))}
                </div>
            )}
        </div>
    );
};
