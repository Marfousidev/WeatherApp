
/*   Clock script */

const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]; 
let d = new Date(); 
let day = weekday[d.getDay()];
let dayFromdate =  d.toLocaleString('en-us', {  weekday: 'long' });
document.getElementById("day").innerText =  day; 


const MyLabel = document.getElementById("MyLabel");
update();
setInterval(update, 1000);
function update() {

  let date = new Date();
  MyLabel.innerHTML = formatTime(date);
  
  function formatTime(date){
    
    let hours = date.getHours();
    let minutes = date.getMinutes(); 
    let seconds = date.getSeconds();
    let amOrpm = hours >= 12 ? "pm": "am";

    hours = (hours%12) || 12;

    hours = formatZeroes(hours);
    minutes = formatZeroes(minutes);
    seconds = formatZeroes(seconds);



    return `${hours}:${minutes}:${seconds} ${amOrpm}`
  }

  function formatZeroes(time){  
    time = time.toString();
    return time.length <2 ? "0" + time : time;
  }

}
/*   Clock script */






//SELECT ELEMENTS

  const iconElement = document.querySelector(".weather-icon ");
  const tempElement = document.querySelector(".temperature-value p");
  const descElement = document.querySelector(".temperature-description p");
  const locationElement = document.querySelector(".location p");
  const notificationElement = document.querySelector(".notification");
  const humidityElement = document.querySelector(".humidity p");
  const feelsElement = document.querySelector(".feels-like p");
  const windElement = document.querySelector(".wind p");
  const button1Element = document.querySelector(".F");
  const button2Element = document.querySelector(".C");
  
 

//CHECK IF BROWSER SUPPORTS GEOLOCATION

if ('geolocation' in navigator) {
  navigator.geolocation.getCurrentPosition(setPosition, showError);
} else{
  notificationElement.style.display = "block";
  notificationElement.innerHTML = "<p>Browser doesn't Support Geolocation </p>";
}
//SET USER'S POSITION
function setPosition(position){
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;

  
}
//SHOW ERRORS WHEN THERE IS AN ISSUE WITH GEOLOCATION SERVICE
function showError(error){
  notificationElement.style.display = "block";
  notificationElement.innerHTML = `<p> ${error.message} </p>`;
}

//GET WEATHER FROM API PROVIDER

const apikey="13b44ed03d152cbfcb103b6fde22af6b";
 window.addEventListener("load",()=>{
    if(navigator.geolocation){
       navigator.geolocation.getCurrentPosition((position)=>{
            let lon= position.coords.longitude;
            let lat= position.coords.latitude;
            
            const url= `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&` + `lon=${lon}&appid=${apikey}`;
            

            fetch(url).then((res)=>{
                return res.json();
            }).then((data)=>{
                console.log(data);
                console.log(new Date().getTime())
                var dat= new Date(data.dt)
                console.log(dat.toLocaleString(undefined,'AFRICA/MOROCCO'))
                console.log(new Date().getMinutes())
                weatherReport(data);
            })
        })
    }
})

//GET WEATHER BY SEARCH CITY 
function searchByCity(){
  var place= document.getElementById('input').value;
  var urlsearch= `http://api.openweathermap.org/data/2.5/weather?q=${place}&` + `appid=${apikey}`;

  fetch(urlsearch).then((res)=>{
      return res.json();
  }).then((data)=>{
      console.log(data);
      weatherReport(data);
  })
  document.getElementById('input').value='';
}
//GET WEATHER BY SEARCH CITY 

function weatherReport(data){

  var urlcast= `http://api.openweathermap.org/data/2.5/forecast?q=${data.name}&` + `appid=${apikey}`;

  fetch(urlcast).then((res)=>{
      return res.json();
  }).then((forecast)=>{
    console.log(forecast.city);
        hourForecast(forecast);
        dayForecast(forecast)
    
 
    locationElement.innerText= data.name + ', '+data.sys.country;
    console.log(data.name,data.sys.country);

    console.log(Math.floor(data.main.temp-273));
    tempElement.innerText= Math.floor(data.main.temp-273)+ ' °C';

    descElement.innerText= data.weather[0].description;
    console.log(data.weather[0].description)
    humidityElement.innerText= 'Humidity  ' + data.main.humidity +'%'
    feelsElement.innerText= 'Feels Like  ' +Math.floor(data.main.feels_like-273) +' °C'
    windElement.innerText= 'Wind Speed ' +  data.wind.speed +'  KM/H'

    iconElement.innerHTML = `<img src="http://api.openweathermap.org/img/w/${data.weather[0].icon}.png"/>`;
    
    
    
})

//C to F CONVERSION
function celsiusToFahrenheit(temp){
  return ((temp-273) * 9/5) +32;
}

//WHEN USER CLICKS ON THE TEMPERATURE ELEMENT
button1Element.addEventListener("click", function(){
  
  if(data.main.unit == "celsius") {
    let fahrenheit = celsiusToFahrenheit(data.main.temp);
    fahrenheit = Math.floor(fahrenheit);

    tempElement.innerHTML = `${fahrenheit} F`;
    data.main.unit  = "fahrenheit"};
  });
  button2Element.addEventListener("click", function(){
    tempElement.innerHTML =  Math.floor(data.main.temp-273)+ ' °C';
    data.main.unit = "celsius";
  }
);
}

function hourForecast(forecast){
  document.querySelector('.templist').innerHTML=''
  for (let i = 0; i < 5; i++) {

      var date= new Date(forecast.list[i].dt*1000)
      console.log((date.toLocaleTimeString(undefined,'AFRICA/MOROCCO')).replace(':00',''))

      let hourR=document.createElement('div');
      hourR.setAttribute('class','next');

      let div= document.createElement('div');
      let time= document.createElement('p');
      time.setAttribute('class','time')
      time.innerText= (date.toLocaleTimeString(undefined,'AFRIC/MOROCCO')).replace(':00','');

      let temp= document.createElement('p');
      temp.innerText= Math.floor((forecast.list[i].main.temp - 273))+ ' °C' ;

      div.appendChild(time)
      div.appendChild(temp)

      let desc= document.createElement('p');
      desc.setAttribute('class','desc')
      desc.innerText= forecast.list[i].weather[0].description;

      hourR.appendChild(div);
      hourR.appendChild(desc)
      document.querySelector('.templist').appendChild(hourR);
}}
  

function dayForecast(forecast){
  document.querySelector('.WeekF').innerHTML=''
  for (let i = 7; i < forecast.list.length; i+=7) {
      console.log(forecast.list[i]);
      let div= document.createElement('div');
      div.setAttribute('class','dayF');
      
      let day= document.createElement('p');
      day.setAttribute('class','date')
      day.innerText= new Date(forecast.list[i].dt*1000).toDateString(undefined,'AFRICA/MOROCCO');
      div.appendChild(day);

  

      let icon= document.createElement('img');
      icon.setAttribute('class','weather-icon1 ')
       icon.src=   "http://api.openweathermap.org/img/w/" + forecast.list[i].weather[0].icon+ ".png";
       div.appendChild(icon);
     
       let temp= document.createElement('p');
       temp.setAttribute('class','temperature-value1')
       temp.innerText= Math.floor((forecast.list[i].main.temp - 273))+ ' °C';
       div.appendChild(temp)
      
      

      let description= document.createElement('p');
      description.setAttribute('class','desc')
      description.innerText= forecast.list[i].weather[0].description;
      div.appendChild(description);

      document.querySelector('.WeekF').appendChild(div)
      console.log(forecast);
  }
} 











 