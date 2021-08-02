import React, { useState } from 'react'
import  PropTypes  from 'prop-types'
import { AppBar, Tabs, Tab } from '@material-ui/core'

import HourlyForecast from './HourlyForecast'
import DailyForecast from './DailyForecast'
import Alerts from './Alerts'
import windDirection from '../utils/WindDirection'

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
      <h1>{weather.name}, {weather.sys.country}</h1>
      <div>
        <img
          src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
          alt={weather.weather[0].description}
        />
        <h2 style={{ display: 'block' }}>{weather.weather[0].description}</h2>
      </div>
      <div>
        <h2>Temperature: {Math.round(weather.main.temp)}℃</h2>
        <h2>Feels like: {Math.round(weather.main.feels_like)}℃</h2>
      </div>
      <h2>Wind: {windDirection(weather.wind.deg)} {weather.wind.speed.toFixed(1)} m/s</h2>
      <h2>Rain: {forecast.hourly[0].rain ? forecast.hourly[0].rain['1h'] : 0} mm</h2>
      <h2>UV Index: {forecast.hourly[0].uvi}</h2>
      <AppBar position="static" style={{ background: '#2196f3' }}>
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

export default Weather

Weather.propTypes = {
  weather: PropTypes.object,
  forecast: PropTypes.object
}
