// Rule-Based Decision Engine for Thermal Comfort Analysis

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const analyzeComfort = (weather, userProfile) => {
    const { current, hourly } = weather;
    const { temperature_2m: temp, wind_speed_10m: wind, relative_humidity_2m: humidity, precipitation, weather_code, apparent_temperature } = current;
    const { age, gender, weight, height, activityLevel, heatSensitivity } = userProfile;

    // --- 1. Smart Effective Temperature Calculation (Hissedilen Sıcaklık) ---
    // Start with the API's apparent temperature or fallback to temp
    let effectiveTemp = apparent_temperature !== undefined ? apparent_temperature : temp;

    // Gender Adjustment
    // Women generally feel colder (lower metabolic rate), Men feel warmer
    if (gender === 'female') {
        effectiveTemp -= 1.0; // Feels colder
    } else {
        effectiveTemp += 0.5; // Feels warmer/stronger resistance
    }

    // Age Adjustment
    // 13-30: Young/Resistant (No change or slight boost)
    // 30-50: Normal
    // 50+: Sensitive (Feels colder)
    const ageNum = Number(age);
    if (ageNum > 50) {
        effectiveTemp -= 2.0;
    } else if (ageNum >= 13 && ageNum <= 30) {
        effectiveTemp += 0.5;
    }

    // BMI Adjustment
    // BMI = weight (kg) / (height (m) * height (m))
    const heightM = Number(height) / 100;
    const bmi = Number(weight) / (heightM * heightM);

    // Low BMI (<18.5): Less insulation, feels colder -> Sensitive
    // Normal BMI (18.5-25): Normal
    // High BMI (>25): More insulation, feels warmer -> Sensitive to heat
    if (bmi < 18.5) {
        effectiveTemp -= 1.0; // Feels colder
    } else if (bmi > 25) {
        effectiveTemp += 1.0; // Feels warmer
    }

    // Heat Sensitivity Adjustment
    if (heatSensitivity === 'cold_sensitive') { // Çabuk üşürüm
        effectiveTemp -= 2.0;
    } else if (heatSensitivity === 'heat_sensitive') { // Çabuk terlerim
        effectiveTemp += 2.0;
    }

    // Round for display
    const displayFeelsLike = Math.round(effectiveTemp);


    // --- 2. Weather Outputs & Notifications ---

    // Wind Description
    let windDesc = "Sakin";
    if (wind > 40) windDesc = "Çok Şiddetli";
    else if (wind > 25) windDesc = "Şiddetli";
    else if (wind > 15) windDesc = "Orta Şiddetli";
    else windDesc = "Sakin";

    // Forecast Analysis (Moved to end for enhanced logic)



    // --- 3. Activity Recommendations ---
    let activityMsg = "";

    // Activity Logic based on Level and Adjusted Temp
    if (activityLevel === 'low') { // Az aktif
        if (effectiveTemp < 10) {
            activityMsg = getRandom([
                "Düşük aktivite seviyesindesin ve hava soğuk hissediliyor. Kısa bir yürüyüş yapacaksan sıkı giyin.",
                "Hareketsiz kalmak üşümene neden olabilir, evde hafif egzersizler yapabilirsin.",
                "Dışarı çıkacaksan kısa mesafeli yolculukları tercih et, çabuk üşüyebilirsin."
            ]);
        } else {
            activityMsg = getRandom([
                "Hafif bir yürüyüş için güzel bir hava.",
                "Kısa mesafeli bir yürüyüşle gününü hareketlendirebilirsin.",
                "Açık havada biraz vakit geçirmek iyi gelecektir."
            ]);
        }
    } else if (activityLevel === 'moderate') { // Orta aktif
        if (effectiveTemp > 25) {
            activityMsg = getRandom([
                "Hava sıcak, tempolu yürüyüşte terleyebilirsin. Su içmeyi unutma.",
                "Orta seviye aktiviteler için sıcaklık biraz yüksek, gölgede kalmaya çalış.",
                "Hafif koşular için uygun ama güneşin tepede olduğu saatlerden kaçın."
            ]);
        } else {
            activityMsg = getRandom([
                "Hafif koşular ve uzun yürüyüşler için ideal bir hava.",
                "Dışarıda spor yapmak için harika bir zaman.",
                "Orta tempolu bir egzersizle günün tadını çıkar."
            ]);
        }
    } else if (activityLevel === 'high') { // Çok aktif
        if (effectiveTemp > 25 || (weather_code <= 1 && temp > 20)) {
            activityMsg = getRandom([
                "Yüksek eforlu sporlarda aşırı terleme riski var, bol sıvı tüket.",
                "Güneş altında ağır antrenman yapmaktan kaçın, akşam saatlerini bekle.",
                "Sıcak hava performansını etkileyebilir, molaları sıklaştır."
            ]);
        } else if (effectiveTemp < 5) {
            activityMsg = getRandom([
                "Soğuk havada yüksek tempo iyidir ama terleyip soğumamaya dikkat et.",
                "Isınma hareketlerini uzun tut, kaslarını soğuktan koru.",
                "Dışarıda koşacaksan termal kıyafetler tercih et."
            ]);
        } else {
            activityMsg = getRandom([
                "Fitness veya koşu için mükemmel koşullar, sınırlarını zorla!",
                "Tam performans göstermek için harika bir gün.",
                "Antrenmanını aksatma, hava senin yanında."
            ]);
        }
    }


    // --- 4. Clothing Recommendations ---
    let outfitMsg = "";
    const rainIn24h = hourly.precipitation.slice(0, 24).some(p => p > 0) || hourly.weather_code.slice(0, 24).some(c => c >= 51);
    const cloudCover = current.cloud_cover;

    // Rain Logic
    if (rainIn24h) {
        outfitMsg += getRandom([
            "Bugün yağmur riski var, yağmurluk veya şemsiye almalısın. ",
            "Günün ilerleyen saatlerinde ıslanmamak için şemsiyeni yanından ayırma. ",
            "Yağış ihtimaline karşı hazırlıklı ol, su geçirmez ayakkabılar iyi olabilir. "
        ]);
    }

    // Sun/Heat Logic
    if (effectiveTemp > 20 && cloudCover < 30) {
        outfitMsg += getRandom([
            "Güneş etkili, şapka ve güneş gözlüğü takmanı öneririm. ",
            "Güneşten korunmak için şapka takabilirsin. ",
            "Gözlerini güneşten koru, gözlüğünü unutma. "
        ]);
    }

    // Layering Logic based on Temp vs Normal (Assuming 'Normal' is around 15-20C for context)
    if (effectiveTemp < 5) {
        // Very Cold
        if (wind > 20) {
            outfitMsg += getRandom([
                "Hava çok soğuk ve rüzgarlı, mutlaka atkı ve eldiven tak.",
                "Rüzgar kesici kalın bir mont, atkı ve bere şart.",
                "Dondurucu bir soğuk var, eldivensiz çıkma."
            ]);
        } else {
            outfitMsg += getRandom([
                "Kalın bir mont veya kaban giymelisin.",
                "Kat kat giyinmek seni sıcak tutacaktır.",
                "Kışlıklarını giy, hava bayağı soğuk."
            ]);
        }
    } else if (effectiveTemp >= 5 && effectiveTemp < 15) {
        // Cold/Cool
        outfitMsg += getRandom([
            "Bir mont veya kalın bir ceket yeterli olacaktır.",
            "Üşümemek için üzerine bir şeyler al.",
            "Mevsimlik montunu giyebilirsin."
        ]);
    } else if (effectiveTemp >= 15 && effectiveTemp < 22) {
        // Mild
        outfitMsg += getRandom([
            "Hava ılık, bir ceket veya hırka alabilirsin.",
            "Tişört üzerine ince bir gömlek veya sweat iyi olur.",
            "Ne çok sıcak ne çok soğuk, rahat bir şeyler giy."
        ]);
    } else if (effectiveTemp >= 22 && effectiveTemp < 30) {
        // Warm
        outfitMsg += getRandom([
            "Tişört giymek için harika bir hava.",
            "İnce kıyafetler tercih et, hava sıcak.",
            "Kısa kollu bir şeyler giyebilirsin."
        ]);
    } else {
        // Hot
        outfitMsg += getRandom([
            "Çok sıcak! Mümkün olduğunca ince ve açık renkli giyin.",
            "Şort ve atlet gibi en serin tutacak kıyafetleri seç.",
            "Sıcaktan bunalmamak için bol kıyafetler giy."
        ]);
    }

    // --- Final Assembly ---

    // Weather Comment Construction
    let weatherComment = `Senin hissettiğin sıcaklık ${displayFeelsLike}°C. Rüzgar ${windDesc}. `;

    // Enhanced Forecast Analysis (3h & 6h) - ALWAYS SHOW
    const next3Hours = hourly.temperature_2m.slice(0, 3);
    const next6Hours = hourly.temperature_2m.slice(0, 6);
    const wind3Hours = hourly.wind_speed_10m.slice(0, 3);
    const wind6Hours = hourly.wind_speed_10m.slice(0, 6);

    const tempIn3 = next3Hours[2];
    const tempIn6 = next6Hours[5];
    const windIn3 = wind3Hours[2];
    const windIn6 = wind6Hours[5];

    // 3 Hours Forecast
    let msg3h = "3 saat sonra ";
    let change3h = false;

    if (tempIn3 < temp - 2) { msg3h += "hava soğuyacak"; change3h = true; }
    else if (tempIn3 > temp + 2) { msg3h += "hava ısınacak"; change3h = true; }
    else { msg3h += "sıcaklık aynı kalacak"; } // Default if no change

    if (windIn3 > wind + 5) { msg3h += (change3h ? " ve " : ", ") + "rüzgar artacak"; }
    else if (windIn3 < wind - 5 && wind > 10) { msg3h += (change3h ? " ve " : ", ") + "rüzgar azalacak"; }
    else if (!change3h) { msg3h += " ve rüzgar stabil"; } // Add wind info if temp didn't change much

    weatherComment += msg3h + ". ";

    // 6 Hours Forecast
    let msg6h = "6 saat sonra ";
    let change6h = false;

    if (tempIn6 < tempIn3 - 2) { msg6h += "hava daha da soğuyacak"; change6h = true; }
    else if (tempIn6 > tempIn3 + 2) { msg6h += "sıcaklık artmaya devam edecek"; change6h = true; }
    else { msg6h += "sıcaklık dengesini koruyacak"; }

    if (windIn6 > windIn3 + 5) { msg6h += (change6h ? " ve " : ", ") + "rüzgar şiddetlenecek"; }
    else if (windIn6 < windIn3 - 5 && windIn3 > 10) { msg6h += (change6h ? " ve " : ", ") + "rüzgar sakinleşecek"; }

    weatherComment += msg6h + ".";

    return {
        weather: weatherComment,
        outfit: outfitMsg,
        activity: activityMsg,
        stats: { // Passing extra stats if needed for UI
            feelsLike: displayFeelsLike,
            windDesc: windDesc
        }
    };
};
