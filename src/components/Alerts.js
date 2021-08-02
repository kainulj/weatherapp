import React from 'react'
import  PropTypes  from 'prop-types'
import { TableContainer, Table, TableRow, TableCell, TableBody } from '@material-ui/core'

const Alerts = ({ weather, alerts, tab, index }) =>{
  if(!alerts){
    return null
  }

  const currentAlerts = alerts.filter(a => a.start < weather.dt)

  return (
    <TableContainer hidden={tab !== index} >
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

export default Alerts

Alerts.propTypes = {
  weather: PropTypes.object,
  alerts: PropTypes.array,
  tab: PropTypes.number,
  index: PropTypes.number
}
