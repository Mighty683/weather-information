import * as React from "react"
import { CityData }  from "./Widget"

interface props {
  cityData: CityData
}
const CityPanel = (props: props) => <div className='city-panel'>
  <div className='city-name'>Name: {props.cityData.name}</div>
  {props.cityData.temp && <div className='city-temp'>Temp: {props.cityData.temp} °C</div>}
  <div className='city-text'>Describe: {props.cityData.text}</div>
  {props.cityData.iconURL && <img src={props.cityData.iconURL} className='city-img'></img>}
</div>
export default CityPanel