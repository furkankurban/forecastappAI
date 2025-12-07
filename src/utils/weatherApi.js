export async function fetchWeatherData(lat, lon) {
    try {
        const params = new URLSearchParams({
            latitude: lat,
            longitude: lon,
            current: [
                'temperature_2m',
                'relative_humidity_2m',
                'apparent_temperature',
                'precipitation',
                'weather_code',
                'cloud_cover',
                'pressure_msl',
                'wind_speed_10m',
                'wind_direction_10m'
            ].join(','),
            daily: [
                'weather_code',
                'temperature_2m_max',
                'temperature_2m_min',
                'sunrise',
                'sunset',
                'precipitation_probability_max'
            ].join(','),
            hourly: 'temperature_2m,weather_code,relative_humidity_2m,precipitation,wind_speed_10m',
            timezone: 'auto',
            forecast_days: 1
        });

        const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);

        if (!response.ok) {
            throw new Error('Weather data fetch failed');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching weather:', error);
        throw error;
    }
}

export const fetchLocationName = async (lat, lon) => {
    try {
        // Using BigDataCloud's free reverse geocoding API (no key required for client-side)
        // Alternative: OpenStreetMap Nominatim (requires strict User-Agent)
        const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=tr`);
        if (!response.ok) throw new Error('Geocoding failed');

        const data = await response.json();
        // Construct location string: "District, City" or just "City"
        const city = data.city || data.principalSubdivision || data.locality || '';
        const district = data.locality || data.city || '';

        if (city && district && city !== district) {
            return `${district}, ${city}`;
        }
        return city || district || `${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E`;
    } catch (error) {
        console.error("Location name fetch error:", error);
        return `${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E`; // Fallback to coords
    }
};

export const getWeatherDescription = (code) => {
    const codes = {
        0: 'Açık',
        1: 'Çoğunlukla açık',
        2: 'Parçalı bulutlu',
        3: 'Kapalı',
        45: 'Sisli',
        48: 'Kırağılı sis',
        51: 'Hafif çiseleme',
        53: 'Orta çiseleme',
        55: 'Yoğun çiseleme',
        56: 'Hafif dondurucu çiseleme',
        57: 'Yoğun dondurucu çiseleme',
        61: 'Hafif yağmur',
        63: 'Orta yağmur',
        65: 'Şiddetli yağmur',
        66: 'Hafif dondurucu yağmur',
        67: 'Yoğun dondurucu yağmur',
        71: 'Hafif kar yağışı',
        73: 'Orta kar yağışı',
        75: 'Yoğun kar yağışı',
        77: 'Kar taneleri',
        80: 'Hafif sağanak yağış',
        81: 'Orta sağanak yağış',
        82: 'Şiddetli sağanak yağış',
        85: 'Hafif kar sağanağı',
        86: 'Yoğun kar sağanağı',
        95: 'Gök gürültülü fırtına',
        96: 'Hafif dolu ile fırtına',
        99: 'Yoğun dolu ile fırtına',
    };
    return codes[code] || 'Bilinmiyor';
};
