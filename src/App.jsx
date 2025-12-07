import { useState, useEffect } from 'react'
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';

function App() {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [weatherCode, setWeatherCode] = useState(null);

  useEffect(() => {
    const savedProfile = localStorage.getItem('weatherApp_profile');
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }
    setLoading(false);
  }, []);

  const handleOnboardingComplete = (data) => {
    localStorage.setItem('weatherApp_profile', JSON.stringify(data));
    setUserProfile(data);
  };

  const handleReset = () => {
    if (confirm('Profilinizi sıfırlamak istediğinize emin misiniz?')) {
      localStorage.removeItem('weatherApp_profile');
      setUserProfile(null);
      setWeatherCode(null);
    }
  };

  const handleWeatherUpdate = (code) => {
    setWeatherCode(code);
  };

  const getBackgroundClass = () => {
    if (weatherCode === null) return 'bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900'; // Default

    // Simple mapping based on WMO codes
    if (weatherCode === 0 || weatherCode === 1) return 'bg-sunny';
    if (weatherCode === 2 || weatherCode === 3) return 'bg-cloudy';
    if ([45, 48].includes(weatherCode)) return 'bg-foggy';
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(weatherCode)) return 'bg-rainy';
    if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) return 'bg-snowy';
    if ([95, 96, 99].includes(weatherCode)) return 'bg-stormy';

    return 'bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900';
  };

  if (loading) return null;

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 text-white transition-all duration-1000 ${getBackgroundClass()}`}>
      {!userProfile ? (
        <Onboarding onComplete={handleOnboardingComplete} />
      ) : (
        <Dashboard
          userProfile={userProfile}
          onReset={handleReset}
          onWeatherUpdate={handleWeatherUpdate}
        />
      )}
    </div>
  )
}

export default App
