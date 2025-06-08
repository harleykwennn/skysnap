import { memo } from 'react'
import type { CurrentWeatherResultProps } from '@/services/openweather/openweather.service-d'
import { format } from 'date-fns'
import { Flex, Image, Text } from '@chakra-ui/react'

interface CurrentWeatherProps {
  data: CurrentWeatherResultProps
}

function CurrentWeather(props: CurrentWeatherProps) {
  const { data } = props

  function getRainChancePercentage(data: CurrentWeatherResultProps): number {
    const clouds = data.clouds?.all ?? 0 // 0-100
    const humidity = data.main?.humidity ?? 0 // 0-100
    const weatherMain = (data.weather?.[0]?.main ?? '').toLowerCase()

    let chance = 0

    // Direct rain or drizzle => high chance
    if (weatherMain.includes('rain') || weatherMain.includes('drizzle')) {
      chance = 90
    } else if (weatherMain.includes('thunderstorm')) {
      chance = 95
    } else {
      // Base chance from clouds (weight 60%)
      chance += clouds * 0.6

      // Additional chance from humidity (weight 40%)
      chance += humidity * 0.4
    }

    // Clamp between 0 and 100
    if (chance > 100) chance = 100
    if (chance < 0) chance = 0

    return Math.round(chance)
  }

  const temperatureInCelcius = Math.floor(data?.main?.temp - 273.15) + '°C' // unit default in kelvin
  const wind = Math.ceil(data?.wind?.speed) + 'm/s'
  const humidity = Math.floor(data?.main?.humidity) + '%'
  const rainChance = getRainChancePercentage(data) + '%'

  return (
    <Flex direction="column" gap="20px">
      <Flex position="relative" borderRadius="30px" overflow="hidden">
        <Flex
          width="100%"
          height="100%"
          backgroundColor="gray"
          opacity={0.16}
          position="absolute"
        />
        <Flex
          alignItems="center"
          justifyContent="space-between"
          padding="32px 25px"
          position="relative"
          width="100%"
        >
          <Flex direction="column" gap="4px">
            <Text fontSize="10px">
              {format(new Date(), 'iii dd MMMM yyyy, HH:mm')}
            </Text>
            <Text fontSize="14px" fontWeight="semibold">
              {data?.weather[0]?.main}
            </Text>
            <Text fontSize="40px" fontWeight="semibold">
              {temperatureInCelcius}
            </Text>
          </Flex>
          <Image
            src={`https://openweathermap.org/img/wn/${data?.weather[0]?.icon}@4x.png`}
            alt="weather-icon"
            width="152px"
            height="152px"
            position="absolute"
            right="0px"
          />
        </Flex>
      </Flex>

      <Flex position="relative" borderRadius="24px" overflow="hidden">
        <Flex
          width="100%"
          height="100%"
          backgroundColor="gray"
          opacity={0.16}
          position="absolute"
        />
        <Flex
          padding="16px"
          alignItems="center"
          justifyContent="space-around"
          position="relative"
          width="100%"
        >
          <Flex
            direction="column"
            gap="4px"
            alignItems="center"
            justifyContent="center"
          >
            <Text fontSize="14px" fontWeight="semibold">
              {wind}
            </Text>
            <Text fontSize="10px">Wind</Text>
          </Flex>
          <Flex
            direction="column"
            gap="4px"
            alignItems="center"
            justifyContent="center"
          >
            <Text fontSize="14px" fontWeight="semibold">
              {humidity}
            </Text>
            <Text fontSize="10px">Humidity</Text>
          </Flex>
          <Flex
            direction="column"
            gap="4px"
            alignItems="center"
            justifyContent="center"
          >
            <Text fontSize="14px" fontWeight="semibold">
              {rainChance}
            </Text>
            <Text fontSize="10px">Rain</Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default memo(CurrentWeather)
