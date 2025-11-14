
import { GoogleGenAI, Type } from "@google/genai";
import type { Building, Device, EnergyDataPoint } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. Using mocked data. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const MOCK_SUGGESTIONS = [
  { id: 's1', title: 'Optimize HVAC in Engineering Block', description: 'Adjust HVAC schedule to align with class timetables. Reduce temperature by 2°C during off-peak hours (8 PM - 6 AM).', category: 'HVAC', priority: 'High', estimatedSavings: '150 kWh/day' },
  { id: 's2', title: 'Smart Lighting for Library', description: 'Implement occupancy sensors for lighting in lesser-used sections of the library, especially stacks and archive rooms.', category: 'Lighting', priority: 'Medium', estimatedSavings: '80 kWh/day' },
  { id: 's3', title: 'Shift EV Charging to Off-Peak', description: 'Incentivize students and staff to charge electric vehicles overnight (11 PM - 5 AM) when campus-wide demand is lowest.', category: 'EV Charging', priority: 'Medium', estimatedSavings: '120 kWh/day' },
];

const MOCK_ALERTS = [
  { id: 'a1', type: 'Anomaly', message: 'Unusual 20% energy spike detected in Bio-Science Labs at 2 AM. Potential equipment malfunction.', severity: 'Critical', timestamp: 'Just now' },
  { id: 'a2', type: 'High Usage', message: 'Sports Complex HVAC usage is 40% higher than expected for current occupancy.', severity: 'Warning', timestamp: '1 hour ago' },
];

export const getOptimizationSuggestions = async (buildings: Building[], devices: Device[]): Promise<any[]> => {
  if (!API_KEY) return Promise.resolve(MOCK_SUGGESTIONS);
  
  const prompt = `
    You are an AI Energy Optimization expert for a university campus.
    Analyze the following campus data and provide a list of 3-5 actionable optimization suggestions to reduce energy consumption.
    For each suggestion, provide a title, a concise description, a category (HVAC, Lighting, Scheduling, EV Charging), a priority (High, Medium, Low), and an estimated daily kWh saving.

    Current Buildings Data:
    ${JSON.stringify(buildings, null, 2)}

    Current Devices Data:
    ${JSON.stringify(devices, null, 2)}

    Focus on high-impact, practical recommendations.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              category: { type: Type.STRING },
              priority: { type: Type.STRING },
              estimatedSavings: { type: Type.STRING },
            },
          },
        },
      },
    });

    const suggestions = JSON.parse(response.text);
    return suggestions.map((s: any, i: number) => ({ ...s, id: `s${i + 1}` }));
  } catch (error) {
    console.error("Error fetching optimization suggestions from Gemini:", error);
    return MOCK_SUGGESTIONS;
  }
};


export const getEnergyForecast = async (historicalData: EnergyDataPoint[]): Promise<EnergyDataPoint[]> => {
    if (!API_KEY) {
        const lastValue = historicalData[historicalData.length - 1].usage;
        return historicalData.map(p => ({...p, forecast: p.usage * (0.9 + Math.random() * 0.2)}));
    }

    const prompt = `
        Given the following hourly energy usage data (in kWh) for the last 24 hours, predict the usage for the same 24 hours.
        Return a JSON array of objects, each with "time" and "usage" properties. The usage should be a number.
        
        Historical Data:
        ${JSON.stringify(historicalData)}
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });

        const forecastData = JSON.parse(response.text);

        // Combine historical and forecast
        return historicalData.map((point, index) => ({
            ...point,
            forecast: forecastData[index]?.usage || point.usage,
        }));
    } catch (error) {
        console.error("Error fetching energy forecast from Gemini:", error);
        // Fallback to mock logic
        return historicalData.map(p => ({...p, forecast: p.usage * (0.9 + Math.random() * 0.2)}));
    }
};

export const getAnomalyAlerts = async (energyData: EnergyDataPoint[]): Promise<any[]> => {
  if (!API_KEY) return Promise.resolve(MOCK_ALERTS);

  const prompt = `
    You are an AI anomaly detection system for campus energy monitoring.
    Analyze the recent hourly energy usage data. Identify up to 2 significant anomalies or high-usage events that an energy manager should investigate.
    For each, provide a short, clear "message", a "type" ('Anomaly' or 'High Usage'), and a "severity" ('Critical', 'Warning', or 'Info').

    Energy Data (last 24 hours):
    ${JSON.stringify(energyData)}

    Focus on sudden spikes, unexpected usage during off-hours, or deviations from typical patterns.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING },
              message: { type: Type.STRING },
              severity: { type: Type.STRING },
            },
          },
        },
      },
    });

    const alerts = JSON.parse(response.text);
    return alerts.map((a: any, i: number) => ({ ...a, id: `a${i + 1}`, timestamp: 'Just now' }));
  } catch (error) {
    console.error("Error fetching anomaly alerts from Gemini:", error);
    return MOCK_ALERTS;
  }
};
