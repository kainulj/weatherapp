import React from 'react'
import  PropTypes  from 'prop-types'
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core'

import windDirection from '../utils/WindDirection'

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
      <Table options={{
        rowStyle: {
          fontSize: 24,
        }
      }}>
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

export default DailyForecast

DailyForecast.propTypes = {
  forecast: PropTypes.array,
  tab: PropTypes.number,
  index: PropTypes.number
}