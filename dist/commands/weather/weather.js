"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zoneWeathers = {
    "Limsa Lominsa": ["Clouds", "Clear Skies", "Fair Skies", "Fog", "Rain"],
    "Middle La Noscea": ["Clouds", "Clear Skies", "Fair Skies", "Wind", "Fog", "Rain"],
    "Lower La Noscea": ["Clouds", "Clear Skies", "Fair Skies", "Wind", "Fog", "Rain"],
    "Eastern La Noscea": ["Fog", "Clear Skies", "Fair Skies", "Clouds", "Rain", "Showers"],
    "Western La Noscea": ["Fog", "Clear Skies", "Fair Skies", "Clouds", "Wind", "Gales"],
    "Upper La Noscea": ["Clear Skies", "Fair Skies", "Clouds", "Fog", "Thunder", "Thunderstorms"],
    "Outer La Noscea": ["Clear Skies", "Fair Skies", "Clouds", "Fog", "Rain"],
    "The Mist": ["Clouds", "Clear Skies", "Fair Skies", "Fair Skies", "Fog", "Rain"],
    "Gridania": ["Rain", "Rain", "Fog", "Clouds", "Fair Skies", "Clear Skies", "Fair Skies"],
    "Central Shroud": ["Thunder", "Rain", "Fog", "Clouds", "Fair Skies", "Clear Skies", "Fair Skies"],
    "East Shroud": ["Thunder", "Rain", "Fog", "Clouds", "Fair Skies", "Clear Skies", "Fair Skies"],
    "South Shroud": ["Fog", "Thunderstorms", "Thunder", "Fog", "Clouds", "Fair Skies", "Clear Skies"],
    "North Shroud": ["Fog", "Showers", "Rain", "Fog", "Clouds", "Fair Skies", "Clear Skies"],
    "The Lavender Beds": ["Clouds", "Rain", "Fog", "Clouds", "Fair Skies", "Clear Skies", "Fair Skies"],
    "Ul'dah": ["Clear Skies", "Fair Skies", "Clouds", "Fog", "Rain"],
    "Western Thanalan": ["Clear Skies", "Fair Skies", "Clouds", "Fog", "Rain"],
    "Central Thanalan": ["Dust Storms", "Clear Skies", "Fair Skies", "Clouds", "Fog", "Rain"],
    "Eastern Thanalan": ["Clear Skies", "Fair Skies", "Clouds", "Fog", "Rain", "Showers"],
    "Southern Thanalan": ["Heat Waves", "Clear Skies", "Fair Skies", "Clouds", "Fog"],
    "Northern Thanalan": ["Clear Skies", "Fair Skies", "Clouds", "Fog"],
    "The Goblet": ["Clear Skies", "Fair Skies", "Clouds", "Fog", "Rain"],
    "Ishgard": ["Snow", "Fair Skies", "Clear Skies", "Clouds", "Fog"],
    "Coerthas Central Highlands": ["Blizzards", "Snow", "Fair Skies", "Clear Skies", "Clouds", "Fog"],
    "Coerthas Western Highlands": ["Blizzards", "Snow", "Fair Skies", "Clear Skies", "Clouds", "Fog"],
    "The Sea of Clouds": ["Clear Skies", "Fair Skies", "Clouds", "Fog", "Wind", "Umbral Wind"],
    "Azys Lla": ["Fair Skies", "Clouds", "Thunder"],
    "The Diadem": ["Fair Skies", "Fog", "Wind", "Umbral Wind"],
    "Idyllshire": ["Clouds", "Fog", "Rain", "Showers", "Clear Skies", "Fair Skies"],
    "The Dravanian Forelands": ["Clouds", "Fog", "Thunder", "Dust Storms", "Clear Skies", "Fair Skies"],
    "The Dravanian Hinterlands": ["Clouds", "Fog", "Rain", "Showers", "Clear Skies", "Fair Skies"],
    "The Churning Mists": ["Clouds", "Gales", "Umbral Static", "Clear Skies", "Fair Skies"],
    "Mor Dhona": ["Clouds", "Fog", "Gloom", "Clear Skies", "Fair Skies"],
    "Rhalgr's Reach": ["Clear Skies", "Fair Skies", "Clouds", "Fog", "Thunder"],
    "The Fringes": ["Clear Skies", "Fair Skies", "Clouds", "Fog", "Thunder"],
    "The Peaks": ["Clear Skies", "Fair Skies", "Clouds", "Fog", "Wind", "Dust Storms"],
    "The Lochs": ["Clear Skies", "Fair Skies", "Clouds", "Fog", "Thunderstorms"],
    "Kugane": ["Rain", "Fog", "Clouds", "Fair Skies", "Clear Skies"],
    "Shirogane": ["Rain", "Fog", "Clouds", "Fair Skies", "Clear Skies"],
    "The Ruby Sea": ["Thunder", "Wind", "Clouds", "Fair Skies", "Clear Skies"],
    "Yanxia": ["Showers", "Rain", "Fog", "Clouds", "Fair Skies", "Clear Skies"],
    "The Azim Steppe": ["Gales", "Wind", "Rain", "Fog", "Clouds", "Fair Skies", "Clear Skies"],
    "Eureka Anemos": ["Fair Skies", "Gales", "Showers", "Snow"],
    "Eureka Pagos": ["Clear Skies", "Fog", "Heat Waves", "Snow", "Thunder", "Blizzards"],
    "Eureka Pyros": ["Fair Skies", "Heat Waves", "Thunder", "Blizzards", "Umbral Wind", "Snow"],
    "Eureka Hydatos": ["Fair Skies", "Showers", "Gloom", "Thunderstorms", "Snow"],
    "The Crystarium": ["Clear Skies", "Fair Skies", "Clouds", "Fog", "Rain", "Thunderstorms"],
    "Eulmore": ["Gales", "Rain", "Fog", "Clouds", "Fair Skies", "Clear Skies"],
    "Lakeland": ["Clear Skies", "Fair Skies", "Clouds", "Fog", "Rain", "Thunderstorms"],
    "Kholusia": ["Gales", "Rain", "Fog", "Clouds", "Fair Skies", "Clear Skies"],
    "Amh Araeng": ["Fair Skies", "Clouds", "Dust Storms", "Heat Waves", "Clear Skies"],
    "Il Mheg": ["Rain", "Fog", "Clouds", "Thunderstorms", "Clear Skies", "Fair Skies"],
    "The Rak'tika Greatwood": ["Fog", "Rain", "Umbral Wind", "Clear Skies", "Fair Skies", "Clouds"],
    "The Tempest": ["Clouds", "Fair Skies", "Clear Skies"],
};
exports.zoneRates = {
    "Limsa Lominsa": [20, 50, 80, 90, 100],
    "Middle La Noscea": [20, 50, 70, 80, 90, 100],
    "Lower La Noscea": [20, 50, 70, 80, 90, 100],
    "Eastern La Noscea": [5, 50, 80, 90, 95, 100],
    "Western La Noscea": [10, 40, 60, 80, 90, 100],
    "Upper La Noscea": [30, 50, 70, 80, 90, 100],
    "Outer La Noscea": [30, 50, 70, 85, 100],
    "The Mist": [20, 50, 70, 80, 90, 100],
    "Gridania": [5, 20, 30, 40, 55, 85, 100],
    "Central Shroud": [5, 20, 30, 40, 55, 85, 100],
    "East Shroud": [5, 20, 30, 40, 55, 85, 100],
    "South Shroud": [5, 10, 25, 30, 40, 70, 100],
    "North Shroud": [5, 10, 25, 30, 40, 70, 100],
    "The Lavender Beds": [5, 20, 30, 40, 55, 85, 100],
    "Ul'dah": [40, 60, 85, 95, 100],
    "Western Thanalan": [40, 60, 85, 95, 100],
    "Central Thanalan": [15, 55, 75, 85, 95, 100],
    "Eastern Thanalan": [40, 60, 70, 80, 85, 100],
    "Southern Thanalan": [20, 60, 80, 90, 100],
    "Northern Thanalan": [5, 20, 50, 100],
    "The Goblet": [40, 60, 85, 95, 100],
    "Ishgard": [60, 70, 75, 90, 100],
    "Coerthas Central Highlands": [20, 60, 70, 75, 90, 100],
    "Coerthas Western Highlands": [20, 60, 70, 75, 90, 100],
    "The Sea of Clouds": [30, 60, 70, 80, 90, 100],
    "Azys Lla": [35, 70, 100],
    "The Diadem": [30, 60, 90, 100],
    "Idyllshire": [10, 20, 30, 40, 70, 100],
    "The Dravanian Forelands": [10, 20, 30, 40, 70, 100],
    "The Dravanian Hinterlands": [10, 20, 30, 40, 70, 100],
    "The Churning Mists": [10, 20, 40, 70, 100],
    "Mor Dhona": [15, 30, 60, 75, 100],
    "Rhalgr's Reach": [15, 60, 80, 90, 100],
    "The Fringes": [15, 60, 80, 90, 100],
    "The Peaks": [10, 60, 75, 85, 95, 100],
    "The Lochs": [20, 60, 80, 90, 100],
    "Kugane": [10, 20, 40, 80, 100],
    "Shirogane": [10, 20, 40, 80, 100],
    "The Ruby Sea": [10, 20, 35, 75, 100],
    "Yanxia": [5, 15, 25, 40, 80, 100],
    "The Azim Steppe": [5, 10, 17, 25, 35, 75, 100],
    "Eureka Anemos": [30, 60, 90, 100],
    "Eureka Pagos": [10, 28, 46, 64, 82, 100],
    "Eureka Pyros": [10, 28, 46, 64, 82, 100],
    "Eureka Hydatos": [12, 34, 56, 78, 100],
    "The Crystarium": [20, 60, 75, 85, 95, 100],
    "Eulmore": [10, 20, 30, 45, 85, 100],
    "Lakeland": [20, 60, 75, 85, 95, 100],
    "Kholusia": [10, 20, 30, 45, 85, 100],
    "Amh Araeng": [45, 60, 70, 80, 100],
    "Il Mheg": [10, 20, 35, 45, 60, 100],
    "The Rak'tika Greatwood": [10, 20, 30, 45, 85, 100],
    "The Tempest": [20, 80, 100],
};
exports.zones = Object.keys(exports.zoneWeathers);
function calculateForecastTarget(timestamp) {
    // Thanks to Rogueadyn's SaintCoinach library for this calculation.
    var unix = Math.trunc(timestamp / 1000);
    // Get Eorzea hour for weather start
    var bell = Math.trunc(unix / 175);
    // Do the magic 'cause for calculations 16:00 is 0, 00:00 is 8 and 08:00 is 16
    var increment = (bell + 8 - (bell % 8)) % 24;
    // Take Eorzea days since unix epoch
    var totalDays = Math.trunc(unix / 4200) >>> 0;
    var calcBase = totalDays * 0x64 + increment;
    var step1 = ((calcBase << 0xB) ^ calcBase) >>> 0;
    var step2 = ((step1 >>> 8) ^ step1) >>> 0;
    return step2 % 0x64;
}
exports.calculateForecastTarget = calculateForecastTarget;
exports.future = 60;
function init() {
    var weatherDuration = 8 * 175 * 1000;
    var now = Date.now();
    var start = now - (now % weatherDuration) - weatherDuration;
    if (exports.state !== undefined && start === exports.state.start)
        return;
    var futureET = Math.ceil(exports.future * 24 * 60 * 60 / 175 / 8) + 1;
    var weathers = {};
    for (var i = 0; i < futureET; i++) {
        var target = calculateForecastTarget(start + weatherDuration * i);
        for (var _i = 0, zones_1 = exports.zones; _i < zones_1.length; _i++) {
            var zone = zones_1[_i];
            var j = 0;
            while (target >= exports.zoneRates[zone][j])
                j++;
            if (!weathers[zone])
                weathers[zone] = new Array(futureET);
            weathers[zone][i] = j;
        }
    }
    var getter = function (zone, i, j) { return ({
        begin: new Date(start + i * 175 * 1000),
        end: new Date(start + j * 175 * 1000 - 1),
        duration: j - i,
        weathers: weathers[zone]
            .slice(Math.floor(i / 8) - 1, Math.floor((j - 1) / 8) + 1)
            .map(function (w) { return exports.zoneWeathers[zone][w]; }),
    }); };
    var buffer = new Array(futureET * 8);
    exports.state = { start: start, weathers: weathers, getter: getter, buffer: buffer };
}
exports.init = init;
function isHourIn(begin, end, hour) {
    return (begin <= hour && hour <= end) || (end < begin && (hour <= end || begin <= hour));
}
exports.isHourIn = isHourIn;
function hasWeather(weathers, w) {
    return !weathers || weathers.length === 0 || weathers.indexOf(w) !== -1;
}
exports.hasWeather = hasWeather;
function find(condition) {
    init();
    var zone = condition.zone;
    var desiredWeatherMask = condition.desiredWeatherMask ||
        exports.zoneRates[zone].map(function (x, i) { return hasWeather(condition.desiredWeathers, i); });
    var previousWeatherMask = condition.previousWeatherMask ||
        exports.zoneRates[zone].map(function (x, i) { return hasWeather(condition.previousWeathers, i); });
    var weathers = exports.state.weathers[zone];
    var hourMask = condition.hourMask || Array.from({ length: 24 }, function (x, i) { return isHourIn(condition.beginHour || 0, condition.endHour == undefined ? 23 : condition.endHour, i); });
    var baseHour = Math.round(exports.state.start / 175 / 100);
    var matched = exports.state.buffer.fill(false);
    for (var i_1 = 8; i_1 < matched.length; i_1++) {
        var weatherIndex = Math.floor(i_1 / 8);
        if (!desiredWeatherMask[weathers[weatherIndex]])
            continue;
        if (!previousWeatherMask[weathers[weatherIndex - 1]])
            continue;
        if (!hourMask[(baseHour + i_1) % 24])
            continue;
        matched[i_1] = true;
    }
    var ret = [];
    var i, j = 0;
    while (true) {
        i = j;
        while (matched[i] === false)
            i++;
        if (i >= matched.length)
            break;
        j = i;
        while (matched[j] === true)
            j++;
        ret.push(exports.state.getter.bind(null, zone, i, j));
    }
    return ret;
}
exports.find = find;
