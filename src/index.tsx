import * as React from "react"
import * as ReactDOM from "react-dom"
import Widget from "./App/Widget"


ReactDOM.render(
    <Widget {... {cityShuffleInterval: 60000, dataUpdateInterval: 10000, citiesNames: ['Lodz', 'Warsaw', 'Berlin', 'New York', 'London']}}/>,
    document.getElementById("index")
)