import React, { useEffect, useState } from 'react';
import { fetchWeatherData, getWeatherDescription } from '../utils/weatherApi';
import { Wind, Droplets, Cloud, Settings, Trash2, Bell, ArrowUp, ArrowDown, Umbrella } from 'lucide-react';
import ThermalComfortAI from './ThermalComfortAI';
import NotificationSettings from './NotificationSettings';

const Dashboard = ({ userProfile, onReset, onWeatherUpdate }) => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [locationName, setLocationName] = useState('Konum aranıyor...');
    const [showSettings, setShowSettings] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    // Ad Trigger Placeholder
    const handleAdTrigger = (callback) => {
        console.log("Ad Triggered: Showing Interstitial Ad...");
        // In a real app, you would show the ad here.
        // For now, we just execute the callback immediately.
        callback();
    };

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const { latitude, longitude } = position.coords;

                        // Fetch Location Name (Reverse Geocoding)
                        try {
                            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                            const data = await response.json();
                            const city = data.address.city || data.address.town || data.address.province;
                            const district = data.address.suburb || data.address.district || data.address.county;

                            if (city && district) {
                                setLocationName(`${city}, ${district}`);
                            } else {
                                setLocationName(city || district || `${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E`);
                            }
                        } catch (geoErr) {
                            console.error("Geocoding failed", geoErr);
                            setLocationName(`${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E`);
                        }

                        const data = await fetchWeatherData(latitude, longitude);
                        setWeather(data);
                        if (onWeatherUpdate && data.current) {
                            onWeatherUpdate(data.current.weather_code);
                        }
                    } catch (err) {
                        setError('Hava durumu verisi alınamadı.');
                    } finally {
                        setLoading(false);
                    }
                },
                (err) => {
                    setError('Konum erişimi reddedildi.');
                    setLoading(false);
                }
            );
        } else {
            setError('Konum desteklenmiyor.');
            setLoading(false);
        }
    }, []);

    if (loading) return <div className="flex items-center justify-center h-full text-sm">Yükleniyor...</div>;
    if (error) return <div className="flex items-center justify-center h-full text-red-400 text-sm">{error}</div>;
    if (!weather) return null;

    const current = weather.current;
    const hourly = weather.hourly;

    // --- Calculations ---
    const next24Temps = hourly.temperature_2m.slice(0, 24);
    const maxTemp = Math.round(Math.max(...next24Temps));
    const minTemp = Math.round(Math.min(...next24Temps));

    // Rain Analysis
    const rainIndices = hourly.precipitation.slice(0, 24).map((p, i) => p > 0 ? i : -1).filter(i => i !== -1);
    let rainText = "Yağış yok";
    let isRainingNow = current.precipitation > 0 || current.weather_code >= 51;

    if (isRainingNow) {
        rainText = "Yağış var";
    } else if (rainIndices.length > 0) {
        const startHour = new Date(hourly.time[rainIndices[0]]).getHours();
        rainText = `~${String(startHour).padStart(2, '0')}:00 Yağışlı`;
    }

    return (
        <div className="w-full max-w-md p-4 space-y-6 animate-fade-in pb-20 relative">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">{locationName}</h1>
                    <p className="text-gray-200 text-sm">{new Date().toLocaleDateString('tr-TR', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="relative flex gap-2">
                    <button
                        onClick={() => handleAdTrigger(() => setShowNotifications(true))}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors"
                    >
                        <Bell size={24} />
                    </button>
                    <button
                        onClick={() => handleAdTrigger(() => setShowSettings(!showSettings))}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors"
                    >
                        <Settings size={24} />
                    </button>

                    {showSettings && (
                        <div className="absolute right-0 top-12 w-48 bg-gray-900/90 backdrop-blur-md border border-white/10 rounded-xl shadow-xl overflow-hidden z-50 animate-fade-in">
                            <button
                                onClick={onReset}
                                className="w-full p-3 text-left hover:bg-red-500/20 text-red-400 flex items-center gap-2 text-sm"
                            >
                                <Trash2 size={16} /> Profili Sil
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Weather Card */}
            <div className="glass-card p-6 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Cloud size={120} />
                </div>
                <div className="relative z-10">
                    <div className="text-7xl font-bold mb-2 tracking-tighter">{Math.round(current.temperature_2m)}°</div>
                    <div className="text-xl text-blue-200 font-medium mb-6">{getWeatherDescription(current.weather_code)}</div>

                    <div className="grid grid-cols-3 gap-4 text-sm bg-black/20 rounded-xl p-4 backdrop-blur-sm">
                        <div className="flex flex-col items-center gap-1">
                            <Wind size={18} className="text-gray-400" />
                            <span className="text-xs text-gray-400">Rüzgar</span>
                            <span className="font-semibold">{current.wind_speed_10m} km/s</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <Droplets size={18} className="text-blue-400" />
                            <span className="text-xs text-gray-400">Nem</span>
                            <span className="font-semibold">{current.relative_humidity_2m}%</span>
                        </div>
                        <div className="flex flex-col items-center justify-center gap-1">
                            {/* Improved Max/Min UI */}
                            <div className="flex items-center gap-3">
                                <div className="flex flex-col items-center">
                                    <div className="flex items-center text-red-300 gap-0.5">
                                        <ArrowUp size={14} />
                                        <span className="font-bold text-lg">{maxTemp}°</span>
                                    </div>
                                    <span className="text-[10px] text-red-300/70 uppercase tracking-wider">Max</span>
                                </div>
                                <div className="w-px h-8 bg-white/10"></div>
                                <div className="flex flex-col items-center">
                                    <div className="flex items-center text-blue-300 gap-0.5">
                                        <ArrowDown size={14} />
                                        <span className="font-bold text-lg">{minTemp}°</span>
                                    </div>
                                    <span className="text-[10px] text-blue-300/70 uppercase tracking-wider">Min</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Precipitation Status Card */}
            <div className="glass-panel p-4 rounded-xl flex items-center gap-4 border-l-4 border-blue-500/50">
                <div className="p-3 bg-blue-500/20 rounded-full text-blue-400">
                    <Umbrella size={24} />
                </div>
                <div>
                    <span className="text-xs text-gray-400 uppercase">Yağış Durumu</span>
                    <div className="text-lg font-bold">{rainText}</div>
                </div>
            </div>

            {/* AI Thermal Comfort */}
            <ThermalComfortAI weather={weather} userProfile={userProfile} />

            {/* Notification Modal */}
            {showNotifications && (
                <NotificationSettings onClose={() => setShowNotifications(false)} />
            )}
        </div>
    );
};

export default Dashboard;
