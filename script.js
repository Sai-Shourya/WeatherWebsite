

const input=  document.querySelector('.search');
const button= document.querySelector('button');
const unitSelect= document.querySelector('.y2 select');
const daySelect= document.querySelector('.k1 select');
const span1 = document.querySelector(".span1");
const mainTemp = document.querySelector(".sn2");
const feelsLikeData = document.querySelector(".sn3");
const humidityData = document.querySelector(".sn4");
const windData = document.querySelector(".sn5");
const precData = document.querySelector(".sn6");
const sn1=document.querySelector(".sn1")




async function getPlaceData() {
    let search=input.value;
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${search}&format=jsonv2&addressdetails=1`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("This is the result out there",result);

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
    const cityName=location.city;
    const countryName=location.country;
    console.log(cityName,countryName)
    
    const options={
        day:'numeric',
        year:'numeric',
        weekday:'long',
        month:'short',


    };
    
    let currDate = new Date().toString();
    span1.textContent=`${cityName},${countryName}`;
    sn1.textContent=currDate.slice(0,15);
    
    console.log(currDate);


}

async function getWeatherData(lat,lon) {

    let tempUnit = "celsius";
    let windUnit = "kmh";
    let precUnit = "mm";

    if(unitSelect==='imperial'){
    tempUnit = "fahrenheit";
    windUnit = "mph";
    precUnit = "inch";


    }
  try {
    console.log("lat",lat,"lon",lon)
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min&hourly=temperature_2m,weather_code&current=temperature_2m,precipitation,weather_code,wind_speed_10m,relative_humidity_2m,apparent_temperature`);
      
    //console.log(response.json())
    console.log("fetch done")
    console.log(res.ok)


    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const weatherData = await res.json();   
    console.log(weatherData);
    //console.log('Data',weatherData)

    getCurrentWeather(weatherData); 
    getHourlyForecast(weatherData);
   console.log("Calling,line 97");
   getDailyForecast(weatherData);
  } catch (error) {
    return
  }
}
   

function getCurrentWeather(weatherData){
  

    mainTemp.textContent=Math.round(weatherData.current.temperature_2m);
    feelsLikeData.textContent=Math.round(weatherData.current.apparent_temperature);
    humidityData.textContent=`${weatherData.current.relative_humidity_2m}%`;
    windData.textContent=`${weatherData.current.wind_speed_10m}${weatherData.current_units.wind_speed_10m.replace("mp/h", "mph")}`;
    precData.textContent=`${weatherData.current.precipitation}${weatherData.current_units.precipitation.replace("inch", "in")}`;
    
}

function getDailyForecast(weatherData){
    //let daily=weatherData.daily;
   

    for (let i = 0; i < 7; i++) {
    let date = new Date(weatherData.daily.time[i]);
    //console.log (weatherData.daily.time[i])
    let weekDay = new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date);
    //console.log(weekDay)
    let forecastDay = document.querySelector(`.b${i+1}`);
    //console.log (forecastDay);
    let weatherCodeName = getWeatherCodeName(weatherData.daily.weather_code[i]);
     //console.log (weatherCodeName);
    let dailyHigh = Math.round(weatherData.daily.temperature_2m_max[i]) ;
    //console.log (dailyHigh);
    let dailyLow = Math.round(weatherData.daily.temperature_2m_min[i]);
    //console.log (dailyLow);
        //console.log(getDailyForecast(weatherData.daily.time[i]))
    while (forecastDay.firstChild){
        
        forecastDay.removeChild(forecastDay.firstChild);
    }
    

    addDailyElement("p", "", weekDay,forecastDay, "afterbegin");
    addDailyElement("img", "", "", forecastDay, "beforeend",weatherCodeName);
    //addDailyElement("div", "", "", forecastDay, "beforeend");
    

    let dailyTemps = document.querySelector(`.b${i+1}`);

    addDailyElement("p", "",dailyHigh, dailyTemps, "beforeend");
    addDailyElement("p", "",dailyLow, dailyTemps, "beforeend");
  }
  
}


function addDailyElement(tag,className,content,parentElement,position,weatherCodeName=""){
    const newElement= document.createElement(tag);
    newElement.setAttribute('class',className);

    if (content !==" "){
        const newContent=document.createTextNode(content);
        newElement.appendChild(newContent);

    }

    if (tag==='img'){
        newElement.setAttribute("src", `./images1/icon-${weatherCodeName}.webp`);
        //newElement.setAttribute("alt", weatherCodeName);
        newElement.setAttribute("width", "50");
        newElement.setAttribute("height", "50");
    }

    parentElement.insertAdjacentElement(position, newElement);
}

//console.log(getHourlyForecast())


function getHourlyForecast(weatherData){
    //console.log(getHourlyForecast())
    //console.log("HHHHHHHHHHHHHHHHHHHHHHHHH")
    console.log(daySelect.value);

    let dayIndex= Number(daySelect.value);
    console.log(dayIndex);
    let firstHour = 24 * dayIndex;
    
    //console.log(firstHour);
    let lastHour = 24 * (dayIndex + 1) - 1;
    let hour=weatherData.hourly.time;
    console.log(hour);
    let weatherCode=weatherData.hourly.weather_code;
    let temp=weatherData.hourly.temperature_2m;
    
    //console.log(temp)

   

    for (let h = firstHour,boxNo=1; h <= lastHour; h++,boxNo++) {
    
    let weatherCodeName = getWeatherCodeName(weatherCode[h]);
    let everyTemp = Math.round(temp[h]) ;
    console.log(everyTemp)
    let everyHour = new Date(hour[h]).toLocaleString("en-US", { hour: "numeric", hour12: true });
    let forecastHour = document.querySelector(`.c${boxNo}`);

    while (forecastHour.firstChild) {
      forecastHour.removeChild(forecastHour.firstChild);
    }

    addDailyElement("img", "", "", forecastHour, "afterbegin",weatherCodeName);
    addDailyElement("p", "",everyHour, forecastHour, "beforeend");
    addDailyElement("p",  "",everyTemp, forecastHour, "beforeend");

    


    }
}



function getWeatherCodeName(code) {
  const weatherCode = {
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

  return weatherCode[code];
}

getPlaceData();
button.addEventListener('click',getPlaceData);




