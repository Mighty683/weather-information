import * as React from "react"
import CityPanel from "./CityPanel"
import Spinner from "./Spinner"
import CityData from './CityData'
import './widget.scss'

interface MyProps {
    cityShuffleInterval: number,
    dataUpdateInterval: number,
    citiesNames: string[]
}

interface MyState {
    citiesData: CityData[]
}
export default class Widget extends React.Component<MyProps, MyState> {
    citiesNames: string[]
    citiesShuffleTimer: number
    updateDataTimer: number

    constructor (props: MyProps) {
        super(props)
        this.citiesNames = props.citiesNames
        this.updateData = this.updateData.bind(this)
        this.setCitiesShuffleTimer = this.setCitiesShuffleTimer.bind(this)
        this.setDataUpdateTimer = this.setDataUpdateTimer.bind(this)
    }

    componentDidMount () {
        let citiesNames = this.shuffleArray(this.citiesNames).slice(0, 3)
        this.setCitiesShuffleTimer(citiesNames)
        this.setDataUpdateTimer(citiesNames)
    }

    componentWillUnmount () {
        this.updateDataTimer || window.clearInterval(this.updateDataTimer)
        this.citiesShuffleTimer || window.clearInterval(this.citiesShuffleTimer)
    }

    setCitiesShuffleTimer (citiesNames: string[]) {
        this.citiesShuffleTimer = window.setInterval(() => {
            citiesNames = this.shuffleArray(this.citiesNames).slice(0, 3)
            this.setDataUpdateTimer(citiesNames)
        }, this.props.cityShuffleInterval)
    }

    setDataUpdateTimer (citiesNames: string[]) {
        this.updateDataTimer && window.clearInterval(this.updateDataTimer)
        this.updateData(citiesNames)
        this.updateDataTimer = window.setInterval(() => {
            this.updateData(citiesNames)
        }, this.props.dataUpdateInterval)
    }

    updateData (citiesNames: string[]) {
        let cityRequests: Promise<any>[] = citiesNames.map(this.fetchRequest.bind(this))
        Promise.all(cityRequests).then((responses => {
            let citiesData = responses.map((response, index) => {
                let data = this.parseResponse(response)
                return new CityData(citiesNames[index], data.text, data.link, data.temp, data.iconURL)
            })
            this.setState({citiesData})
        })).catch((err) => {
            console.log(err)
            let citiesData = citiesNames.map(cityName => new CityData(cityName, 'Data download failed'))
            this.setState({citiesData})
        })
    }

    parseResponse (response: any) {
        let dataItem = response.query.results.channel.item,
        conditions = dataItem.condition,
        data = {
            temp: conditions.temp,
            text: conditions.text,
            link: this.parseLinkFromResponse(dataItem.link),
            iconURL: this.parseGifFromDesc(dataItem.description)
        }
        return data
    }

    parseLinkFromResponse (string: string) {
        return string.slice(string.indexOf('*') + 1)
    }

    parseGifFromDesc (string: string) {
        let _string = string.slice(string.indexOf('src="') + 5)
        _string = _string && _string.slice(0, _string.indexOf('"'))
        return _string
    }

    fetchRequest (city: string) {
        return fetch(new Request(this.getCityQuery(city))).then(res => {
            return res.status === 200 ? res.json() :  Promise.reject('Api Error')
        })
    }

    getCityQuery (city: string) {
        return `https://query.yahooapis.com/v1/public/yql?q=select item from weather.forecast where woeid in (select woeid from geo.places(1) where text='${city}') and u='c'&format=json`
    }

    shuffleArray (array: string[]) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1))
            let x = array[i]
            array[i] = array[j]
            array[j] = x
        }
        return array
    }

    render() {
        let content = this.state && this.state.citiesData ? this.state.citiesData.map((cityData) => {
            return <CityPanel key={cityData.key} {...{cityData: cityData}}/>}) : <Spinner />
        return <div className='weather-widget'>{content}</div>
    }
}