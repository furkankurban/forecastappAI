import React, { useState, useEffect, useRef } from 'react';
import { FilesetResolver, LlmInference } from '@mediapipe/tasks-genai';
import { Sparkles, AlertTriangle, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const WeatherAssistant = ({ weather, userProfile }) => {
    const [output, setOutput] = useState('');
    const [loading, setLoading] = useState(false);
    const [modelLoaded, setModelLoaded] = useState(false);
    const [error, setError] = useState(null);
    const llmRef = useRef(null);

    useEffect(() => {
        const loadModel = async () => {
            try {
                const filesetResolver = await FilesetResolver.forGenAiTasks(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-genai/wasm"
                );

                llmRef.current = await LlmInference.createFromOptions(filesetResolver, {
                    baseOptions: {
                        modelAssetPath: "/gemma-2b-it-gpu-int4.bin" // User needs to download this
                    },
                    maxTokens: 1000,
                    topK: 40,
                    temperature: 0.8,
                    randomSeed: 101
                });

                setModelLoaded(true);
            } catch (err) {
                console.error("Model loading error:", err);
                setError("Yapay zeka modeli yüklenemedi. Lütfen 'gemma-2b-it-gpu-int4.bin' dosyasının 'public' klasöründe olduğundan emin olun.");
            }
        };

        loadModel();
    }, []);

    const generateAdvice = async () => {
        if (!llmRef.current || !weather || !userProfile) return;

        setLoading(true);
        setOutput('');

        const { current, daily } = weather;
        const { age, gender, weight, height, activityLevel } = userProfile;

        const prompt = `
Sen yardımsever bir hava durumu asistanısın. Aşağıdaki bilgilere göre kullanıcıya Türkçe olarak kısa ve öz önerilerde bulun.
Yanıtını şu başlıklar altında maddeleyerek ver:
1. Hava Durumu Özeti
2. Kıyafet Önerisi
3. Fiziksel Aktivite Önerisi

Kullanıcı Bilgileri:
- Yaş: ${age}
- Cinsiyet: ${gender === 'male' ? 'Erkek' : 'Kadın'}
- Kilo: ${weight} kg
- Boy: ${height} cm
- Aktivite Seviyesi: ${activityLevel}

Hava Durumu:
- Sıcaklık: ${current.temperature_2m}°C
- Hissedilen: ${current.apparent_temperature}°C
- Durum Kodu: ${current.weather_code} (WMO kodu)
- Rüzgar: ${current.wind_speed_10m} km/s
- Günlük Max Sıcaklık: ${daily.temperature_2m_max[0]}°C
- Günlük Min Sıcaklık: ${daily.temperature_2m_min[0]}°C
- Yağış İhtimali: ${daily.precipitation_probability_max[0]}%

Lütfen samimi ve motive edici bir dil kullan.
`;

        try {
            const response = await llmRef.current.generateResponse(prompt);
            setOutput(response);
        } catch (err) {
            console.error("Inference error:", err);
            setError("Öneri oluşturulurken bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    // Auto-generate when model loads
    useEffect(() => {
        if (modelLoaded && !output && !loading) {
            generateAdvice();
        }
    }, [modelLoaded]);

    if (error) {
        return (
            <div className="glass-panel p-4 rounded-xl border-l-4 border-red-500/50 bg-red-500/10">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="text-red-400 shrink-0 mt-1" />
                    <div className="text-sm text-red-200">
                        <p className="font-bold mb-1">AI Asistan Hatası</p>
                        <p>{error}</p>
                        <p className="mt-2 text-xs text-red-300/70">
                            Not: Bu özellik için yaklaşık 1.3GB boyutundaki model dosyasını indirip projenin public klasörüne koymanız gerekmektedir.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="glass-card p-6 relative overflow-hidden min-h-[200px]">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles size={100} />
            </div>

            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 relative z-10">
                <Sparkles className="text-purple-400" size={20} />
                AI Hava Durumu Asistanı
            </h3>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-8 space-y-3 text-gray-400">
                    <Loader2 className="animate-spin" size={32} />
                    <p className="text-sm animate-pulse">Yapay zeka analiz yapıyor...</p>
                </div>
            ) : (
                <div className="prose prose-invert prose-sm max-w-none relative z-10">
                    <ReactMarkdown>{output}</ReactMarkdown>
                </div>
            )}
        </div>
    );
};

export default WeatherAssistant;
