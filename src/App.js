/* eslint-disable react/prop-types */
import './App.css'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { AppBar, Tabs, Tab, Table, TableRow, TableCell, TableBody, TableContainer, TableHead } from '@material-ui/core'
import { North, NorthEast, East, SouthEast, South, SouthWest, West, NorthWest } from '@material-ui/icons'

const windDirection = (direction) => {
  if(direction <= 22.5 || direction > 337.5){
    return <South />
  } else if(direction <= 67.5){
    return <SouthWest />
  } else if(direction <= 112.5){
    return <West />
  } else if(direction <= 157.5){
    return <NorthWest />
  } else if(direction <= 202.5){
    return <North />
  } else if(direction <= 247.5){
    return <NorthEast />
  } else if(direction <= 292.5){
    return <East />
  } else {
    return <SouthEast />
  }
}

const HourlyForecast = ({ forecast, tab, index }) => {
  const hour = new Date().getHours() + 1
  return (
    <TableContainer hidden={tab !== index}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell>Temperature</TableCell>
            <TableCell>Wind</TableCell>
            <TableCell>Rain</TableCell>
            <TableCell>UV Index</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {forecast.slice(1,24).map((row, i) => (
            <TableRow key={i}>
              <TableCell>{`${(hour+i) % 24}:00`}</TableCell>
              <TableCell>
                <img
                  src={`http://openweathermap.org/img/wn/${row.weather[0].icon}@2x.png`}
                  alt={row.weather[0].description}
                />
              </TableCell>
              <TableCell>{Math.round(row.temp)} ℃</TableCell>
              <TableCell>{windDirection(row.wind_deg)} {row.wind_speed.toFixed(1)} m/s</TableCell>
              <TableCell>{row.rain ? row.rain['1h'] : 0 } mm</TableCell>
              <TableCell>{row.uvi.toFixed(1)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

const DailyForecast = ({ forecast, tab, index }) => {
  const addDays = (date, days) => {
    const newDate = new Date()
    newDate.setDate(date.getDate() + days)
    return newDate
  }
  const date = new Date()
  const dateFormat = { month:'numeric', day:'numeric' }
  return (
    <TableContainer hidden={tab !== index}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell>Temperature</TableCell>
            <TableCell>Wind</TableCell>
            <TableCell>Rain</TableCell>
            <TableCell>UV Index</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {forecast.map((row, i) => (
            <TableRow key={i}>
              <TableCell>{new Intl.DateTimeFormat('fi-FI', dateFormat).format(addDays(date, i+1))}</TableCell>
              <TableCell>
                <img
                  src={`http://openweathermap.org/img/wn/${row.weather[0].icon}@2x.png`}
                  alt={row.weather[0].description}
                />
              </TableCell>
              <TableCell>{Math.round(row.temp.day)} ℃</TableCell>
              <TableCell>{windDirection(row.wind_deg)} {row.wind_speed.toFixed(1)} m/s</TableCell>
              <TableCell>{row.rain ? row.rain : 0 } mm</TableCell>
              <TableCell>{row.uvi.toFixed(1)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

const Alerts = ({ weather, alerts, tab, index }) =>{
  if(!alerts){
    return null
  }
  const currentAlerts = alerts.filter(a => a.start < weather.dt)
  return (
    <TableContainer hidden={tab !== index}>
      <Table>
        <TableBody>
          {currentAlerts.map((a, i) => (
            <TableRow key={i}>
              <TableCell>{a.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

const Weather = ({ weather, forecast }) => {
  const [tab, setTab] = useState(0)

  if(!weather || !forecast){
    return null
  }

  console.log(weather)

  const handleTabChange = (event, newValue) => {
    setTab(newValue)
  }
  console.log(forecast)
  return (
    <div>
      <h1>{weather.name}, {weather.sys.country}</h1>
      <img
        src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt={weather.weather[0].description}
      />
      <h2>{weather.weather[0].description}</h2>
      <h2>Temperature: {Math.round(weather.main.temp)}℃</h2>
      <h2>Feels like: {Math.round(weather.main.feels_like)}℃</h2>
      <h2>Wind: {windDirection(weather.wind.deg)} {weather.wind.speed.toFixed(1)} m/s</h2>
      <h2>Rain: {forecast.hourly[0].rain ? forecast.hourly[0].rain['1h'] : 0} mm</h2>
      <h2>UV Index: {forecast.hourly[0].uvi}</h2>
      <AppBar position="static">
        <Tabs value={tab} onChange={handleTabChange}>
          <Tab label='Hourly'/>
          <Tab label='Daily'/>
          <Tab label='Alerts'/>
        </Tabs>
        <HourlyForecast forecast={forecast.hourly} tab={tab} index={0}/>
        <DailyForecast forecast={forecast.daily} tab={tab} index={1}/>
        <Alerts weather={weather} alerts={forecast.alerts} tab={tab} index={2}></Alerts>
      </AppBar>
    </div>
  )
}

function App() {
  const [city, setCity] = useState('Helsinki')
  const [newCity, setNewCity] = useState('')
  const [currentWeather, setCurrentWeather] = useState(null)
  const [forecast, setForecast] = useState(null)

  const getWeather = async (cityName) => {
    try {
      const weather = await axios.get(
        `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${process.env.REACT_APP_API_KEY}`
      )
      setCurrentWeather(weather.data)
      setCity(cityName)
    } catch (error) {
      console.log(error)
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
          `http://api.openweathermap.org/data/2.5/onecall?lat=${coords.lat}&lon=${coords.lon}&exclude=current,minutely&units=metric&appid=${process.env.REACT_APP_API_KEY}`
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
    <div className="App">
      <form onSubmit={handleSubmit}>
        <input
          value={newCity}
          onChange={handleCityChange}
        ></input>
        <button type="submit">Search</button>
      </form>
      <Weather weather={currentWeather} forecast={forecast}/>
    </div>
  )
}

export default App