import React, { useEffect, useState } from 'react';
import { analyzeComfort } from '../utils/decisionEngine';
import { Brain, Shirt, Activity, CloudSun } from 'lucide-react';

const ThermalComfortAI = ({ weather, userProfile }) => {
    const [advice, setAdvice] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (weather && userProfile) {
            setLoading(true);
            // Instant analysis, no async delay needed for rule-based
            const result = analyzeComfort(weather, userProfile);
            setAdvice(result);
            setLoading(false);
        }
    }, [weather, userProfile]);

    if (loading) {
        return (
            <div className="glass-panel p-6 flex flex-col items-center justify-center space-y-3 animate-pulse">
                <Brain className="text-blue-400 animate-bounce" size={32} />
                <p className="text-sm text-gray-300">Yapay zeka verileri analiz ediyor...</p>
                <p className="text-xs text-gray-500">Model eğitiliyor & tahmin yapılıyor</p>
            </div>
        );
    }

    if (!advice) return null;

    return (
        <div className="glass-card p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
                <Brain size={100} />
            </div>

            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 relative z-10">
                <Brain className="text-purple-400" size={20} />
                AI Önerileri
            </h3>

            <div className="space-y-4 relative z-10">
                {/* Weather Comment */}
                <div className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                    <CloudSun className="text-yellow-300 shrink-0 mt-1" size={18} />
                    <div>
                        <p className="text-xs text-gray-400 mb-1">Hava Durumu Yorumu</p>
                        <p className="text-sm font-medium">{advice.weather}</p>
                    </div>
                </div>

                {/* Outfit Suggestion */}
                <div className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                    <Shirt className="text-blue-300 shrink-0 mt-1" size={18} />
                    <div>
                        <p className="text-xs text-gray-400 mb-1">Kıyafet Önerisi</p>
                        <p className="text-sm font-medium">{advice.outfit}</p>
                    </div>
                </div>

                {/* Activity Suggestion */}
                <div className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                    <Activity className="text-green-300 shrink-0 mt-1" size={18} />
                    <div>
                        <p className="text-xs text-gray-400 mb-1">Aktivite Önerisi</p>
                        <p className="text-sm font-medium">{advice.activity}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThermalComfortAI;
