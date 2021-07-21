/* eslint-disable react/prop-types */
import './App.css'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { AppBar, Tabs, Tab, Table, TableRow, TableCell, TableBody, TableContainer, TableHead } from '@material-ui/core'

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
            <TableCell>Feels like</TableCell>
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
              <TableCell>{row.temp} ℃</TableCell>
              <TableCell>{row.feels_like} ℃</TableCell>
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
            <TableCell>Feels like</TableCell>
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
              <TableCell>{row.temp.day} ℃</TableCell>
              <TableCell>{row.feels_like.day} ℃</TableCell>
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

  const handleTabChange = (event, newValue) => {
    setTab(newValue)
  }

  return (
    <div>
      <h1>{weather.name}</h1>
      <img
        src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt={weather.weather[0].description}
      />
      <h2>{weather.weather[0].description}</h2>
      <h2>Temperature: {weather.main.temp}℃</h2>
      <h2>Feels like: {weather.main.feels_like}℃</h2>
      <AppBar position="static">
        <Tabs value={tab} onChange={handleTabChange}>
          <Tab label='hourly'/>
          <Tab label='Daily'/>
        </Tabs>
        <HourlyForecast forecast={forecast.hourly} tab={tab} index={0}/>
        <DailyForecast forecast={forecast.daily} tab={tab} index={1}/>
      </AppBar>
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

  const handleCityChange = (event) => {
    setCity(event.target.value)
  }

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <input name="city" onChange={handleCityChange}></input>
        <button type="submit">Search</button>
      </form>
      <Weather weather={currentWeather} forecast={forecast}/>
    </div>
  )
}

export default App