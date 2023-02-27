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
  z.object({
    name: z.string(),
    local_names: z.any(),
    lat: z.number(),
    lon: z.number(),
    country: z.string(),
    state: z.string()
  })
)

async function getRoute (originCity: string, destinationCity: string): Promise<{
  length: number
  duration: number
}> {
  const ocOwResponse = await axios.get(
    `http://api.openweathermap.org/geo/1.0/direct?q=${originCity}&limit=1&appid=${config.openweather.apiKey}`
  ).catch((err) => {
    return new Error(err)
  })
  if (ocOwResponse instanceof Error) {
    throw ocOwResponse
  }
  const ocOpenweatherData = openweatherResponse.safeParse(ocOwResponse.data)
  if (!ocOpenweatherData.success) {
    throw new Error('Invalid response')
  }
  // console.log(JSON.stringify(ocOpenweatherData.data, null, 2))
  if (ocOpenweatherData.data[0].country !== 'BR') {
    throw new Error('Invalid country')
  }
  const ocLat = ocOpenweatherData.data[0].lat
  const ocLon = ocOpenweatherData.data[0].lon
  const dcOwResponse = await axios.get(
    `http://api.openweathermap.org/geo/1.0/direct?q=${destinationCity}&limit=1&appid=${config.openweather.apiKey}`
  ).catch((err) => {
    return new Error(err)
  })
  if (dcOwResponse instanceof Error) {
    throw dcOwResponse
  }
  const dcOpenweatherData = openweatherResponse.safeParse(dcOwResponse.data)
  if (!dcOpenweatherData.success) {
    throw new Error('Invalid response')
  }
  // console.log(JSON.stringify(dcOpenweatherData.data, null, 2))
  if (dcOpenweatherData.data[0].country !== 'BR') {
    throw new Error('Invalid country')
  }
  const dcLat = dcOpenweatherData.data[0].lat
  const dcLon = dcOpenweatherData.data[0].lon
  const hereResponse = await axios.get(
    `https://router.hereapi.com/v8/routes?transportMode=car&origin=${ocLat},${ocLon}&destination=${dcLat},${dcLon}&return=summary&apikey=${config.here.apiKey}`
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
  // console.log(JSON.stringify(hereData.data, null, 2))
  return hereData.data.routes[0].sections[0].summary
}

async function start (): Promise<void> {
  // console.log('Starting app...')
  const destinationCity = 'Osasco'
  const originCities = [
    // 'ADAMANTINA',
    'ALVARES MACHADO',
    'AMERICANA',
    'ANDRADINA',
    'ARACATUBA',
    'ARARAQUARA',
    'ARUJA',
    'ASSIS',
    'ATIBAIA',
    'AURIFLAMA',
    'BARRETOS',
    'BARUERI',
    'BATATAIS',
    'BAURU',
    'BOTUCATU',
    'CAFELANDIA',
    'CAJAMAR',
    'CAMPINAS',
    'CAMPO LIMPO PAULISTA',
    'CANDIDO MOTA',
    'CAPAO BONITO',
    'CARAGUATATUBA',
    'CARAPICUIBA',
    'CATANDUVA',
    'COTIA',
    'DIADEMA',
    'DRACENA',
    'EMBU',
    'EMBU-GUACU',
    "ESTRELA D'OESTE",
    'FERNANDOPOLIS',
    'FERRAZ DE VASCONCELOS',
    'FLORIDA PAULISTA',
    'FRANCA',
    'FRANCO DA ROCHA',
    'GUARARAPES',
    'GUARUJA',
    'GUARULHOS',
    'HORTOLANDIA',
    'ILHA SOLTEIRA',
    'INDAIATUBA',
    'IRAPURU',
    'ITAJOBI',
    'ITANHAEM',
    'ITAPECERICA DA SERRA',
    'ITAPETININGA',
    'ITAPEVA',
    'ITAPEVI',
    'ITAQUAQUECETUBA',
    'ITARARE',
    'ITATIBA',
    'ITU',
    'ITUVERAVA',
    'JACAREI',
    'JALES',
    'JANDIRA',

    // 'JAU',
    'JOSE BONIFACIO',
    'JUNDIAI',
    'JUNQUEIROPOLIS',
    'LIMEIRA',
    'LORENA',
    'MARILIA',
    'MARTINOPOLIS',
    'MATAO',
    'MAUA',
    'MIRANDOPOLIS',
    'MIRASSOL',
    'MOGI DAS CRUZES',
    'MOGI-MIRIM',
    'MONGAGUA',
    'MONTE APRAZIVEL',
    'MORRO AGUDO',

    // 'NOVO HORIZONTE',

    // 'OLIMPIA',
    'OSASCO',
    'OSVALDO CRUZ',
    'OURINHOS',
    'PACAEMBU',
    'PARIQUERA-ACU',
    'PATROCINIO PAULISTA',
    'PENAPOLIS',
    'PEREIRA BARRETO',
    'PERUIBE',
    'PIRACAIA',
    'PIRACICABA',
    'PIRAJU',
    'PIRAPOZINHO',
    'POA',
    'POTIRENDABA',
    'PRAIA GRANDE',
    'PRESIDENTE EPITACIO',
    'PRESIDENTE PRUDENTE',
    'PRESIDENTE VENCESLAU',
    'REGENTE FEIJO',
    'REGISTRO',
    'RIBEIRAO PIRES',
    'RIBEIRAO PRETO',
    'RIO CLARO',
    'SANTA ADELIA',
    "SANTA BARBARA D'OESTE",
    'SANTA CRUZ DO RIO PARDO',
    'SANTA FE DO SUL',
    'SANTO ANDRE',
    'SANTOS',
    'SAO BERNARDO DO CAMPO',
    'SAO CAETANO DO SUL',
    'SAO JOAQUIM DA BARRA',
    'SAO JOSE DO RIO PRETO',
    'SAO JOSE DOS CAMPOS',
    'SAO PAULO',
    'SAO VICENTE',
    'SOROCABA',
    'SUMARE',
    'SUZANO',
    'TABOAO DA SERRA',
    'TANABI',
    'TAUBATE',
    'TRES FRONTEIRAS',
    'TUPI PAULISTA',
    'VALINHOS',
    'VARZEA PAULISTA',
    'VINHEDO',
    'VIRADOURO',
    'VOTUPORANGA']
  for (const originCity of originCities) {
    const route = await getRoute(originCity, destinationCity)
    console.log(`Origem: ${originCity} - Destino: ${destinationCity} - Distancia em KM: ${route.length / 100 ?? 'Não encontrado'} - Tempo em minutos: ${route.duration / 60 ?? 'Não encontrado'}`)
  }
}

start().catch((err) => {
  console.error(`Error: ${String(err)}`)
})
