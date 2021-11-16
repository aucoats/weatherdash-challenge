var apiKey = "8114b53ff06599b649e7864e0adbaa91"

var stateInput = document.querySelector("#city");
var searchBtn = document.querySelector("button");
var displayArea = document.querySelector("#displayArea");
var searchArea = document.querySelector("#search-area");
var savedSearchesBtn = document.querySelector("button");

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0');
var yyyy = today.getFullYear();
today = mm + '/' + dd + '/' + yyyy;

// function to create buttons and populate with localStorage data
function createButtons(input) {
    var buttonArea = document.createElement("div");
    buttonArea.className = "container border-top";
    searchArea.append(buttonArea);

    // gets past searches from local storage
    var pastSearches = JSON.parse(localStorage.getItem("pastSearches"));
    
    // if localStorage is empty, create new array for pastSearches
    if (!pastSearches) {
        var pastSearches = []
    }
    
    // pushes user input into pastsearches array
    pastSearches.push(input);

    // creates and appends buttons with pastSearches
    for (i=0; i < pastSearches.length; i++) {
        var savedButton = document.createElement("button");
        savedButton.textContent = pastSearches[i]; 
        savedButton.className = "btn btn-secondary";
        savedButton.id = "saved-searches"
        savedButton.setAttribute("data-query", pastSearches[i]);
        buttonArea.append(savedButton);
    }

    // saves pastSearches to localStorage
    localStorage.setItem("pastSearches", JSON.stringify(pastSearches));

}

function searchHandler(event) {
    var input = event.target.getAttribute("data-query");
    console.log(input);

    if (input) {
        weatherSearch(input);
    } else if (!input) {
        weatherSearch;
    }
}

// function to format area and search api for lat and long and pass to next function
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

        createButtons(input);
   
};

// uses lat and long from first fetch to create new fetch request and pass to new fn
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

// displays info from second fetch request in generated elements
function displayWeather(data, input) { 
    // variables for current forecast
    var temp = ((data.current.temp - 273.15) * 9/5 + 32).toFixed(2);
    var wind = data.current.wind_speed;
    var humidity = data.current.humidity;
    var uvIndex = data.current.uvi;

    // current forecast elements
    var tempEl = document.createElement("p");
    tempEl.textContent = "Temp: " + temp + "°F"

    var windEl = document.createElement("p");
    windEl.textContent = "Wind: " + wind + " MPH";

    var humidityEl = document.createElement("p");
    humidityEl.textContent = "Humidity: " + humidity + "%";

    var uvEl = document.createElement("p");
    uvEl.textContent = "UV Index: " + uvIndex; 

    // appends current forecast elements to displayArea
    displayArea.append(tempEl, windEl, humidityEl, uvEl);

    var fiveHeader = document.createElement("h4");
    fiveHeader.textContent = "5-Day Forecast:"
    fiveHeader.className = "w-100";
    displayArea.appendChild(fiveHeader);

    // area for 5 day forecast 
    var fiveDay = document.createElement("div");
    fiveDay.className = "five-day d-flex justify-content-around";
    displayArea.appendChild(fiveDay);

    // creates and populates 5 day forecast cards
    for (i = 0; i <= 4; i++) {
        // var fiveConditions
        var fiveTemp = ((data.daily[i].temp.day  - 273.15) * 9/5 + 32).toFixed(1);
        var fiveWind = data.daily[i].wind_speed;
        var fiveHumidity = data.daily[i].humidity;

        // date formatting for cards
        var x = i; 
        y = x + 1;
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();
        dd = parseInt(dd);
        dd = dd + y;
        var today = mm + "/" + dd + "/" + yyyy;

        // container for forecast elements
        var dayCast = document.createElement("div");
        dayCast.className = "card text-dark bg-info";
        fiveDay.appendChild(dayCast);

        // creates card elements and assigns content and classes
        var dayCastTitle = document.createElement("h5");
        dayCastTitle.textContent = "(" + today + ")";
        dayCastTitle.className = "card-header"; 

        var fiveTempEl = document.createElement("p");
        fiveTempEl.textContent = "Temp: " + fiveTemp + " °F";
        fiveTempEl.className = "card-text";

        var fiveWindEl = document.createElement("p");
        fiveWindEl.textContent = "Wind: " + fiveWind + " MPH";
        fiveWindEl.className = "card-text";

        var fiveHumidityEl = document.createElement("p");
        fiveHumidityEl.textContent = "Humidity " + fiveHumidity + "%";
        fiveHumidityEl.className = "card-text";

        // appends card elements to card
        dayCast.append(dayCastTitle, fiveTempEl, fiveWindEl, fiveHumidityEl);
    }

    
}



savedSearchesBtn.addEventListener("click", searchHandler);
searchBtn.addEventListener("click", weatherSearch);