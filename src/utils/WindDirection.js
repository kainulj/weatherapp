import React from 'react'
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

export default windDirection