/* eslint-disable react/prop-types */
import './App.css'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Weather = ({ weather, forecast }) => {
  if(!weather || !forecast){
    return null
  }
  console.log(`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`)

  return (
    <div>
      <h2>Temperature: {weather.main.temp}℃</h2>
      <h2>Temperature: {forecast.lat}℃</h2>
      <img
        src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt={weather.weather[0].description}
      />
    </div>
  )
}

function App() {
  const [city, setCity] = useState('Helsinki')
  const [currentWeather, setCurrentWeather] = useState(null)
  const [forecast, setForecast] = useState(null)

  const getWeather = async () => {
    try {
      const weather = await axios.get(
        `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.REACT_APP_API_KEY}`
      )
      setCurrentWeather(weather.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getWeather()
  }, [])

  useEffect(() => {
    if(currentWeather){
      const coords = currentWeather.coord
      axios
        .get(
          `http://api.openweathermap.org/data/2.5/onecall?lat=${coords.lat}&lon=${coords.lon}&exclude=current,minutely&units=metric&appid=${process.env.REACT_APP_API_KEY}`
        )
        .then(response => setForecast(response.data))
    }
  }, [currentWeather])

  const handleSubmit =  (event) => {
    event.preventDefault()
    getWeather()
  }

  const changeCity = (event) => {
    setCity(event.target.value)
  }

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <input name="city" defaultValue={city} onChange={changeCity}></input>
        <button type="submit">Search</button>
      </form>
      <Weather weather={currentWeather} forecast={forecast}/>
    </div>
  )
}

export default App