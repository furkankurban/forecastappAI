import React, { useState } from 'react';
import { ChevronRight, User, Activity, Thermometer, Ruler, Weight as WeightIcon, AlertCircle } from 'lucide-react';

const Onboarding = ({ onComplete }) => {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({
        age: '',
        weight: '',
        height: '',
        gender: 'male',
        activityLevel: 'moderate',
        heatSensitivity: 'neutral',
        // notificationTime removed
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError(''); // Clear error on change
    };

    const validateStep0 = () => {
        const { age, height, weight } = formData;

        if (!age || !height || !weight) return false;

        const ageNum = Number(age);
        const heightNum = Number(height);
        const weightNum = Number(weight);

        if (ageNum < 13 || ageNum > 99) {
            setError('Geçersiz değer: Yaş 13-99 arasında olmalı.');
            return false;
        }
        if (heightNum < 40 || heightNum > 230) {
            setError('Geçersiz değer: Boy 40-230 cm arasında olmalı.');
            return false;
        }
        if (weightNum < 20 || weightNum > 150) {
            setError('Geçersiz değer: Kilo 20-150 kg arasında olmalı.');
            return false;
        }

        return true;
    };

    const handleNext = () => {
        if (step === 0) {
            if (validateStep0()) {
                setStep(step + 1);
            }
        } else {
            // Step 1 is the last step now
            onComplete(formData);
        }
    };

    return (
        <div className="w-full max-w-md p-6 glass-card animate-fade-in relative">
            <h2 className="text-2xl font-bold mb-6 text-center">
                {step === 0 && "Sizi Tanıyalım"}
                {step === 1 && "Vücut & Konfor"}
            </h2>

            <div className="space-y-6">
                {step === 0 && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm text-gray-300 flex items-center gap-2"><User size={16} /> Cinsiyet</label>
                            <div className="flex gap-4">
                                {[
                                    { val: 'male', label: 'Erkek' },
                                    { val: 'female', label: 'Kadın' }
                                ].map(g => (
                                    <button
                                        key={g.val}
                                        onClick={() => setFormData({ ...formData, gender: g.val })}
                                        className={`flex-1 p-3 rounded-xl border transition-all ${formData.gender === g.val ? 'bg-blue-500/20 border-blue-400 text-blue-100' : 'border-white/10 hover:bg-white/5'}`}
                                    >
                                        {g.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm text-gray-300 flex items-center gap-2">Yaş</label>
                                <input
                                    type="number"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-blue-400"
                                    placeholder="25"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-300 flex items-center gap-2"><Ruler size={16} /> Boy (cm)</label>
                                <input
                                    type="number"
                                    name="height"
                                    value={formData.height}
                                    onChange={handleChange}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-blue-400"
                                    placeholder="175"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-300 flex items-center gap-2"><WeightIcon size={16} /> Kilo (kg)</label>
                            <input
                                type="number"
                                name="weight"
                                value={formData.weight}
                                onChange={handleChange}
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-blue-400"
                                placeholder="70"
                            />
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}
                    </div>
                )}

                {step === 1 && (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm text-gray-300 flex items-center gap-2"><Activity size={16} /> Aktivite Seviyesi</label>
                            <select
                                name="activityLevel"
                                value={formData.activityLevel}
                                onChange={handleChange}
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-blue-400 [&>option]:bg-gray-800"
                            >
                                <option value="low">Düşük (Hareketsiz)</option>
                                <option value="moderate">Orta (Hafif egzersiz)</option>
                                <option value="high">Yüksek (Aktif yaşam)</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-300 flex items-center gap-2"><Thermometer size={16} /> Isı Hassasiyeti</label>
                            <div className="space-y-2">
                                {[
                                    { val: 'cold_sensitive', label: 'Çabuk üşürüm' },
                                    { val: 'neutral', label: 'Normal' },
                                    { val: 'heat_sensitive', label: 'Çabuk terlerim' }
                                ].map(opt => (
                                    <button
                                        key={opt.val}
                                        onClick={() => setFormData({ ...formData, heatSensitivity: opt.val })}
                                        className={`w-full p-3 rounded-xl border text-left transition-all ${formData.heatSensitivity === opt.val ? 'bg-orange-500/20 border-orange-400 text-orange-100' : 'border-white/10 hover:bg-white/5'}`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                <button
                    onClick={handleNext}
                    className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20`}
                >
                    {step === 1 ? 'Kurulumu Tamamla' : 'Sonraki Adım'}
                    {step < 1 && <ChevronRight size={20} />}
                </button>
            </div>

            <div className="flex justify-center gap-2 mt-6">
                {[0, 1].map(i => (
                    <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-blue-500' : i < step ? 'w-2 bg-blue-500/50' : 'w-2 bg-white/10'}`} />
                ))}
            </div>
        </div>
    );
};

export default Onboarding;
