import { memo } from 'react'
import type { ForecastItemProps } from '@/services/openweather/openweather.service-d'
import { format } from 'date-fns'
import { Flex, Image, Text } from '@chakra-ui/react'

interface ForecastProps {
  list: ForecastItemProps[]
}

function Forecast(props: ForecastProps) {
  const { list } = props

  const groupedByDay: Record<string, ForecastItemProps[]> = list.reduce(
    (acc, item) => {
      const date = item.dt_txt.split(' ')[0]

      if (!acc[date]) {
        acc[date] = []
      }

      acc[date].push(item)
      return acc
    },
    {} as Record<string, ForecastItemProps[]>
  )

  return (
    <Flex direction="column" gap="10px">
      {Object.entries(groupedByDay).map(([key, value], index) => (
        <Flex key={index} direction="row" gap="8px" alignItems="flex-start">
          {/* Date Box */}
          <Flex
            position="relative"
            borderRadius="24px"
            overflow="hidden"
            height="140px"
            width="80px"
            flexShrink={0}
          >
            <Flex
              width="100%"
              height="100%"
              backgroundColor="gray"
              opacity={0.16}
              position="absolute"
            />
            <Flex
              direction="column"
              padding="16px"
              position="relative"
              justifyContent="space-between"
            >
              <Text fontSize="sm">{format(new Date(key), 'iii')}</Text>
              <Text fontSize="xs">{format(new Date(key), 'dd MMM')}</Text>
            </Flex>
          </Flex>

          {/* Forecast cards scrollable */}
          <Flex overflowX="auto" gap="8px" flex="1">
            {value.map((forecast, forecastIndex) => {
              const temperatureInCelcius =
                Math.floor(forecast?.main?.temp - 273.15) + '°C'
              return (
                <Flex
                  key={forecastIndex}
                  position="relative"
                  borderRadius="24px"
                  overflow="hidden"
                  height="140px"
                  width="80px"
                  flexShrink={0}
                >
                  <Flex
                    width="100%"
                    height="100%"
                    backgroundColor="gray"
                    opacity={0.16}
                    position="absolute"
                  />
                  <Flex
                    direction="column"
                    padding="16px"
                    position="relative"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Text fontSize="sm">
                      {format(new Date(forecast.dt_txt), 'HH:mm')}
                    </Text>
                    <Image
                      src={`https://openweathermap.org/img/wn/${forecast?.weather[0]?.icon}@4x.png`}
                      alt="weather-icon"
                      width="100%"
                    />
                    <Text fontSize="xs" fontWeight="bold">
                      {temperatureInCelcius}
                    </Text>
                  </Flex>
                </Flex>
              )
            })}
          </Flex>
        </Flex>
      ))}
    </Flex>
  )
}

export default memo(Forecast)
