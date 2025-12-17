

const input=  document.querySelector('.search');
const button= document.querySelector('button');
const unitSelect= document.querySelector('.y2 select');
const daySelect= document.querySelector('.k1 select');
const cityName = document.querySelector(".span1");
const mainTemp = document.querySelector(".sn2");
const feelsLikeData = document.querySelector(".sn3");
const humidityData = document.querySelector(".sn4");
const windData = document.querySelector(".sn5");
const precData = document.querySelector(".sn6");


async function getPlaceData() {
    let search=input.value;
  try {
    const response = await fetch('https://nominatim.openstreetmap.org/search?q=&format=jsonv2&addressdetails=1')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result);

    let lat=result[0].lat;
    let lon=result[0].lon;

    findLocationData(result);
    getWeatherData(lat,lon);

  } 
    catch (error) {
    console.error("Fetch error:", error);
  }
}

function findLocationData(locationData){
    let location=locationData[0].address;
    cityName=locationData.city;
    countryName=locationData.country;
    
    const options={
        day:'numeric',
        year:'numeric',
        weekday:'long',
        month:'short',


    };
    let currDate = new Intl.DateTimeFormat("en-US", dateOptions).format(new Date());
    span1.textContent='${city},${country}';
    sn1.textContent=currDate;


}

async function getWeatherData(lat,lon) {

    let tempUnit = "celsius";
    let windUnit = "kmh";
    let precUnit = "mm";

    if(unitSelect==='imperial'){
    let tempUnit = "fahrenheit";
    let windUnit = "mph";
    let precUnit = "inch";


    }
  try {
    const response = await fetch('{https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&daily=weather_code,temperature_2m_max,temperature_2m_min&hourly=temperature_2m,weather_code&current=temperature_2m,precipitation,weather_code,wind_speed_10m,relative_humidity_2m}');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);

    getCurrentWeather(data);
    getHourlyForecast(data);
    getDailyForecast(data);
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

function getCurrentWeather(){
    mainTemp.textContent=Math.round(data.current.temperature_2m);
    feelsLikeData.textContent=Math.round(data.current.apparent_temperature);
    humidityData.textContent=data.current.relative_humidity_2m;
    windData.textContent=`${weatherData.current.wind_speed_10m} ${weatherData.current_units.wind_speed_10m.replace("mp/h", "mph")}`;
    precData.textContent=`${weatherData.current.precipitation} ${weatherData.current_units.precipitation.replace("inch", "in")}`;
}

function getdailyForecast(){
    let daily=data.daily;

    for (let i = 0; i < 7; i++) {
    let date = new Date(daily.time[i]);
    let weekDay = new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date);
    let forecastDay = document.querySelector(`.b${i + 1}`);
    let weatherCodeName = getWeatherCodeName(daily.weather_code[i]);
    let dailyHigh = Math.round(daily.temperature_2m_max[i]) + "Â°";
    let dailyLow = Math.round(daily.temperature_2m_min[i]) + "Â°";

    while (forecastDay.firstChild){
        forecastDay.removeChild(forecastDay.firstChild);
    }

    addDailyElement("p", dayOfWeek, "", forecastDay, "afterbegin");
    addDailyElement("img", "", weatherCodeName, forecastDay, "beforeend");
    addDailyElement("div", "", "", forecastDay, "beforeend");


    let dailyTemps = document.querySelector(`.forecastDay${i + 1}`);

    addDailyElement("p", dailyHigh, "", dailyTemps, "afterbegin");
    addDailyElement("p", dailyLow, "", dailyTemps, "beforeend");
  }
}

function addDailyElement(tag,className,content,weatherCodeName,parentElement,position){
    const newElement= document.createElement(tag);
    newElement.setAttribute('class',className);

    if (content !==" "){
        const newContent=document.createTextNode(content);
        newElement.appendChild(newContent);

    }

    if (tag==='img'){
        newElement.setAttribute("src", `/assets/images/icon-${weatherCodeName}.webp`);
        newElement.setAttribute("alt", weatherCodeName);
        newElement.setAttribute("width", "300");
        newElement.setAttribute("height", "300");
    }

    parentElement.insertAdjacentElement(position, newElement);
}


function getHourlyForecast(){
    console.log('getHourlyForecast()');

    let dayIndex= parseInt(daySelect.value);
    let firstHour = 24 * dayIndex;
    let lastHour = 24 * (dayIndex + 1) - 1;
    let hour=data.hourly.time;
    let weatherCode=data.hourly.weather_code;
    let temp=data.hourly.temperature_2m;

    let boxNo=1;

    for (let h = firstHour; h <= lastHour; h++) {
    
    let weatherCodeName = getWeatherCodeName(weatherCodes[h]);
    let everyTemp = Math.round(temps[h]) + "Â°";
    let everyHour = new Date(hours[h]).toLocaleString("en-US", { hour: "numeric", hour12: true });
    let forecastHour = document.querySelector(`.c${boxNo}`);

    while (forecastHour.firstChild) {
      forecastHour.removeChild(forecastHour.firstChild);
    }

    addDailyElement("img", "", weatherCodeName, forecastHour, "afterbegin");
    addDailyElement("p", hour, "", forecastHour, "beforeend");
    addDailyElement("p", temp, "", forecastHour, "beforeend");

    boxNo++;


    }
}

function getWeatherCodeName(code) {
  const weatherCodes = {
    0: "sunny",
    1: "partly-cloudy",
    2: "partly-cloudy",
    3: "overcast",
    45: "fog",
    48: "fog",
    51: "drizzle",
    53: "drizzle",
    55: "drizzle",
    56: "drizzle",
    57: "drizzle",
    61: "rain",
    63: "rain",
    65: "rain",
    66: "rain",
    67: "rain",
    80: "rain",
    81: "rain",
    82: "rain",
    71: "snow",
    73: "snow",
    75: "snow",
    77: "snow",
    85: "snow",
    86: "snow",
    95: "storm",
    96: "storm",
    99: "storm",
  };

  return weatherCodes[code];
}



