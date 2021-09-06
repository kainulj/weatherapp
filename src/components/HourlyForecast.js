import React from 'react'
import  PropTypes  from 'prop-types'
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core'

import windDirection from '../utils/WindDirection'

// Daily forecast for the next 24 hours
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
                  src={`https://openweathermap.org/img/wn/${row.weather[0].icon}@2x.png`}
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

export default HourlyForecast

HourlyForecast.propTypes = {
  forecast: PropTypes.array,
  tab: PropTypes.number,
  index: PropTypes.number
}