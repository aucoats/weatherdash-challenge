var apiKey = "8114b53ff06599b649e7864e0adbaa91"

var stateInput = document.querySelector("#city");
var searchBtn = document.querySelector("button");
var displayArea = document.querySelector("#displayArea");

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0');
var yyyy = today.getFullYear();
today = mm + '/' + dd + '/' + yyyy;


function weatherSearch(input) {
    displayArea.innerHTML = "";

    var input = stateInput.value;

    var cityName = document.createElement("h2");
    cityName.textContent = input + " (" + today + ")";

    displayArea.appendChild(cityName);

    var todayUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + input + "&appid=" + apiKey; 
    

    fetch(todayUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    formatApi(data, input);
                });
            } else {
                alert("Please choose a valid city.");
            }
        })
        .catch(function(error) {
            alert("Unable to connect to OpenWeather.");
        });
   
};

function formatApi(data, input) {
    inputLat = data.coord.lat;
    inputLon = data.coord.lon;

    var newFetch = "https://api.openweathermap.org/data/2.5/onecall?lat=" + inputLat + "&lon=" + inputLon + "&exclude=minutely&appid=" + apiKey;
    
    fetch(newFetch)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    displayWeather(data, input);
                });
            } else {
                alert("Please choose a valid city.");
            }
        })
        .catch(function(error) {
            alert("Unable to connect to OpenWeather.");
        });

}

function displayWeather(data, input) {
    console.log(data);

    var temp = ((data.current.temp - 273.15) * 9/5 + 32).toFixed(2);
    var wind = data.current.wind_speed;
    var humidity = data.current.humidity;
    var uvIndex = data.current.uvi;

    var tempEl = document.createElement("p");
    tempEl.textContent = "Temp: " + temp + "°F"

    var windEl = document.createElement("p");
    windEl.textContent = "Wind: " + wind + " MPH";

    var humidityEl = document.createElement("p");
    humidityEl.textContent = "Humidity: " + humidity + "%";

    var uvEl = document.createElement("p");
    uvEl.textContent = "UV Index: " + uvIndex; 

    displayArea.append(tempEl, windEl, humidityEl, uvEl);
}

searchBtn.addEventListener("click", weatherSearch);