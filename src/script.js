//// Current Date and time
function formatTodaysDate(date) {
	let days = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];
	let months = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];

	let hours = date.getHours();
	if (hours < 10) {
		hours = `0${hours}`;
	}

	let minutes = date.getMinutes();
	if (minutes < 10) {
		minutes = `0${minutes}`;
	}

	let dateofMonth = date.getDate(); //day of the month
	let day = days[date.getDay()]; //day of the week
	let month = months[date.getMonth()];

	return `${day} ${month} ${dateofMonth} ${hours}:${minutes}`;
}

let now = new Date();
let dateOutput = document.querySelector("#current-date");
dateOutput.innerHTML = formatTodaysDate(now);

//// Toggle between F and C

function displayCelsius(event) {
	event.preventDefault();
	let mainTemperature = document.querySelector("#main-temp");
	mainTemperature.innerHTML = "8";
}

let celsiusUnit = document.querySelector("#celsius-unit");
celsiusUnit.addEventListener("click", displayCelsius);

function displayFahrenheit(event) {
	event.preventDefault();
	let mainTemperature = document.querySelector("#main-temp");
	mainTemperature.innerHTML = "66";
}

let fahrenheitUnit = document.querySelector("#fahrenheit-unit");
fahrenheitUnit.addEventListener("click", displayFahrenheit);

/////Search City + Display current temperature + Forecast

function formatForecastDay(timestamp) {
	let date = new Date(timestamp * 1000);
	let day = date.getDay();
	let days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];

	return days[day];
}

function displayForecast(response) {
	console.log(response.data.daily);

	let forecast = response.data.daily;
	let forecastElement = document.querySelector("#forecast");

	let forecastHtml = `<div class="row">`;

	forecast.forEach(function (forecastDay, index) {
		if (index < 5) {
			forecastHtml =
				forecastHtml +
				`<div class="col">
					<ul class="day-forecast">
						<li class="day-date-forecast">
							<h5><strong>${formatForecastDay(forecastDay.dt)}</strong></h5>
						</li>
						<li>
						<img
         					 src="http://openweathermap.org/img/wn/${
											forecastDay.weather[0].icon
										}@2x.png"
          					alt=""   />
												
						</li>
						<li class="high-temp"><strong>${Math.round(
							forecastDay.temp.max
						)}</strong>°C</li>
						<li class="low-temp"><strong>${Math.round(forecastDay.temp.min)}</strong>°C</li>
					</ul>
				</div>`;
		}
	});
	forecastHtml = forecastHtml + `</div>`;
	forecastElement.innerHTML = forecastHtml;
}

function getForecast(coordinates) {
	let apiKey = "3ef1c4739274de1e0c3fc584c54fc2ec";
	let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&units=metric&appid=${apiKey}`;
	axios.get(apiUrl).then(displayForecast);
}

function displayTemperature(response) {
	let temperature = Math.round(response.data.main.temp);
	let mainTemp = document.querySelector("#main-temp");
	mainTemp.innerHTML = temperature;

	getForecast(response.data.coord);
}
function displayCountry(response) {
	let input = response.data.sys.country;

	let country = document.querySelector("#country");
	country.innerHTML = input;
}

function displayCondition(response) {
	let condition = response.data.weather[0].description;

	let mainCondition = document.querySelector("#condition");
	mainCondition.innerHTML = condition;
}

function changeCity(event) {
	event.preventDefault();
	let input = document.querySelector("#search-input");
	let city = document.querySelector("#city");
	city.innerHTML = input.value;

	let units = "metric";

	let apiKey = "3ef1c4739274de1e0c3fc584c54fc2ec";
	let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${input.value}&appid=${apiKey}&units=${units}`;

	axios.get(apiUrl).then(displayCountry);
	axios.get(apiUrl).then(displayCondition);
	axios.get(apiUrl).then(displayTemperature);
}

let newCity = document.querySelector("form");
newCity.addEventListener("submit", changeCity);

///Current Geolocation Temperature

function displayCurrentTemperature(response) {
	let temperature = Math.round(response.data.main.temp);
	let mainTemp = document.querySelector("#main-temp");
	mainTemp.innerHTML = temperature;

	let city = document.querySelector("#city");
	city.innerHTML = response.data.name;

	let country = document.querySelector("#country");
	country.innerHTML = response.data.sys.country;

	let Condition = document.querySelector("#condition");
	Condition.innerHTML = response.data.weather[0].description;
}

function showPosition(position) {
	let lat = position.coords.latitude;
	let long = position.coords.longitude;
	let units = "metric";

	let apiKey = "3ef1c4739274de1e0c3fc584c54fc2ec";
	let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=${units}`;

	axios.get(apiUrl).then(displayCurrentTemperature);
}

function getCurrentPosition() {
	navigator.geolocation.getCurrentPosition(showPosition);
}

let currentLocation = document.querySelector("#currentLocationButton");
currentLocation.addEventListener("click", getCurrentPosition);
