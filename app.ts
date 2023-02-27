import { z } from 'zod'
import axios from 'axios'
import config from './config'

const hereRouteResponse = z.object({
  routes: z.array(
    z.object({
      id: z.string(),
      sections: z.array(
        z.object({
          arrival: z.object({
            place: z.object({
              location: z.object({ lat: z.number(), lng: z.number() }),
              type: z.string()
            }),
            time: z.string()
          }),
          departure: z.object({
            place: z.object({
              location: z.object({ lat: z.number(), lng: z.number() }),
              type: z.string()
            }),
            time: z.string()
          }),
          id: z.string(),
          summary: z.object({ duration: z.number(), length: z.number() }),
          transport: z.object({ mode: z.string() }),
          type: z.string()
        })
      )
    })
  )
})

export const openweatherResponse = z.array(
  z.union([
    z.object({
      name: z.string(),
      local_names: z.object({
        af: z.string(),
        ar: z.string(),
        ascii: z.string(),
        az: z.string(),
        bg: z.string(),
        ca: z.string(),
        da: z.string(),
        de: z.string(),
        el: z.string(),
        en: z.string(),
        eu: z.string(),
        fa: z.string(),
        feature_name: z.string(),
        fi: z.string(),
        fr: z.string(),
        gl: z.string(),
        he: z.string(),
        hi: z.string(),
        hr: z.string(),
        hu: z.string(),
        id: z.string(),
        it: z.string(),
        ja: z.string(),
        la: z.string(),
        lt: z.string(),
        mk: z.string(),
        nl: z.string(),
        no: z.string(),
        pl: z.string(),
        pt: z.string(),
        ro: z.string(),
        ru: z.string(),
        sk: z.string(),
        sl: z.string(),
        sr: z.string(),
        th: z.string(),
        tr: z.string(),
        vi: z.string(),
        zu: z.string()
      }),
      lat: z.number(),
      lon: z.number(),
      country: z.string()
    }),
    z.object({
      name: z.string(),
      local_names: z.object({
        ar: z.string(),
        ascii: z.string(),
        bg: z.string(),
        de: z.string(),
        en: z.string(),
        fa: z.string(),
        feature_name: z.string(),
        fi: z.string(),
        fr: z.string(),
        he: z.string(),
        ja: z.string(),
        lt: z.string(),
        nl: z.string(),
        pl: z.string(),
        pt: z.string(),
        ru: z.string(),
        sr: z.string()
      }),
      lat: z.number(),
      lon: z.number(),
      country: z.string()
    }),
    z.object({
      name: z.string(),
      local_names: z.object({
        ar: z.string(),
        ascii: z.string(),
        en: z.string(),
        fa: z.string(),
        feature_name: z.string(),
        sr: z.string()
      }),
      lat: z.number(),
      lon: z.number(),
      country: z.string(),
      state: z.string()
    }),
    z.object({
      name: z.string(),
      local_names: z.object({
        ascii: z.string(),
        ca: z.string(),
        en: z.string(),
        feature_name: z.string()
      }),
      lat: z.number(),
      lon: z.number(),
      country: z.string(),
      state: z.string()
    })
  ])
)

async function start (): Promise<void> {
  console.log('Starting app...')

  const city = 'Osasco'

  const owResponse = await axios.get(
    `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${config.openweather.apiKey}`
  ).catch((err) => {
    return new Error(err)
  })
  if (owResponse instanceof Error) {
    throw owResponse
  }
  const openweatherData = openweatherResponse.safeParse(owResponse.data)
  if (!openweatherData.success) {
    throw new Error('Invalid response')
  }
  console.log(JSON.stringify(openweatherData.data, null, 2))

  const hereResponse = await axios.get(
    `https://router.hereapi.com/v8/routes?transportMode=car&origin=52.5308,13.3847&destination=52.5323,13.3789&return=summary&apikey=${config.here.apiKey}`
  ).catch((err) => {
    return new Error(err)
  })
  if (hereResponse instanceof Error) {
    throw hereResponse
  }
  const hereData = hereRouteResponse.safeParse(hereResponse.data)
  if (!hereData.success) {
    throw new Error('Invalid response')
  }
  // console.log(JSON.stringify(data.data, null, 2))
}

start().catch((err) => {
  console.error(`Error: ${String(err)}`)
})
