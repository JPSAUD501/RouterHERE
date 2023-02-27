import dotenv from 'dotenv'
dotenv.config()

export default {
  here: {
    apiKey: process.env.HERE_APIKEY ?? ''
  },
  openweather: {
    apiKey: process.env.OPENWEATHER_APIKEY ?? ''
  }
}
