import './App.css'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Alert from '@material-ui/lab/Alert'
import { Box } from '@material-ui/core'

import Weather from './components/Weather'

function App() {
  const [city, setCity] = useState('Helsinki')
  const [newCity, setNewCity] = useState('')
  const [currentWeather, setCurrentWeather] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const getWeather = async (cityName) => {
    try {
      const weather = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${process.env.REACT_APP_API_KEY}`
      )
      setCurrentWeather(weather.data)
      setCity(cityName)
    } catch (error) {
      setErrorMessage(`Could not find ${cityName}`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
    }
  }

  useEffect(() => {
    getWeather(city)
  }, [])

  useEffect(() => {
    if(currentWeather){
      const coords = currentWeather.coord
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/onecall?lat=${coords.lat}&lon=${coords.lon}&exclude=current,minutely&units=metric&appid=${process.env.REACT_APP_API_KEY}`
        )
        .then(response => setForecast(response.data))
    }
  }, [currentWeather])

  const handleSubmit =  (event) => {
    event.preventDefault()
    getWeather(newCity)
    setNewCity('')
  }

  const handleCityChange = (event) => {
    setNewCity(event.target.value)
  }

  return (
    <Box className="App" style={{ background: '#2196f3', minHeight: '100vh' }}>
      { errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      <form onSubmit={handleSubmit}>
        <input
          value={newCity}
          onChange={handleCityChange}
        ></input>
        <button type="submit">Search</button>
      </form>
      <Weather weather={currentWeather} forecast={forecast}/>
    </Box>
  )
}

export default App