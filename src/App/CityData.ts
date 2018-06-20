export default class CityData {
  constructor(name: string, text: string, link?: string, temp?: number,  iconURL?: string) {
      this.name = name
      this.text = text
      this.temp = temp
      this.iconURL = iconURL
      this.link = link
      this.key = `${name}${new Date()}`
  }
  name: string
  text: string
  link: string
  temp: number
  iconURL: string
  key: string
}