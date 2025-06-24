import { useEffect, useState } from 'react'
import locationiqService from '@/services/locationiq/locationiq.service'
import openweatherService from '@/services/openweather/openweather.service'
import CurrentWeather from '@/pages/Home/components/CurrentWeather'
import Forecast from './components/Forecast'
import type { AutocompleteResultProps } from '@/services/locationiq/locationiq.service-d'
import { useSearchParams } from 'react-router-dom'
import { useDebouncedCallback } from 'use-debounce'
import { useQuery } from '@tanstack/react-query'
import { useGeolocation } from '@/hooks/use-geolocation'
import { MapPinIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  Box,
  Text,
  Flex,
  Container,
  useDisclosure,
  Spinner,
} from '@chakra-ui/react'

export default function Home() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { location: geolocation } = useGeolocation()

  const [searchParams, setSearchParams] = useSearchParams()

  const lat = searchParams.get('lat')
  const lon = searchParams.get('lon')

  const [location, setLocation] = useState<string>('')
  const [selectedLocation, setSelectedLocation] =
    useState<AutocompleteResultProps | null>(null)

  const debouncedLocation = useDebouncedCallback((value) => {
    setLocation(value)
  }, 1000)

  const reverseQuery = useQuery({
    queryKey: ['reverse', lat, lon],
    queryFn: () =>
      locationiqService.reverseGeocoding({ lat, lon, format: 'json' }),
    enabled: lat !== null && lon !== null,
  })

  const locationsQuery = useQuery({
    queryKey: ['locations', location],
    queryFn: () =>
      locationiqService.autocomplete({ q: location, format: 'json' }),
    enabled: location !== '',
  })

  const currentWeatherQuery = useQuery({
    queryKey: ['weather', lat, lon],
    queryFn: () =>
      openweatherService.currentWeather({
        lat: Number(lat),
        lon: Number(lon),
      }),
    enabled: lat !== null && lon !== null,
  })

  const forecastQuery = useQuery({
    queryKey: ['forecast', lat, lon],
    queryFn: () =>
      openweatherService.forecast({
        lat: Number(lat),
        lon: Number(lon),
      }),
    enabled: lat !== null && lon !== null,
  })

  function handleChangeLonLatParams(lat: string, lon: string) {
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams.toString())
      newParams.set('lat', lat)
      newParams.set('lon', lon)
      return newParams
    })
  }

  function handleLocationSelect(data: AutocompleteResultProps) {
    setSelectedLocation(data)
    handleChangeLonLatParams(data.lat, data.lon)
    onClose()
  }

  useEffect(() => {
    if (reverseQuery.isSuccess && reverseQuery.data) {
      const data = reverseQuery?.data
      setSelectedLocation(() => ({ ...data }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reverseQuery.isSuccess])

  useEffect(() => {
    if ((lat && lon) || !geolocation) return
    handleChangeLonLatParams(geolocation.latitude.toString(), geolocation.longitude.toString())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geolocation])

  console.log('render')

  return (
    <Container maxWidth="container.sm" paddingY="1rem">
      <Flex direction="column" gap="20px">
        {/* Location */}
        <Popover
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
          matchWidth
          placement="bottom-start"
          isLazy
        >
          <PopoverTrigger>
            <InputGroup>
              <InputLeftElement>
                <Icon as={MapPinIcon} fontSize="lg" />
              </InputLeftElement>
              <Input
                readOnly
                variant="filled"
                rounded="full"
                value={
                  selectedLocation?.display_name
                    ? selectedLocation?.display_name
                    : reverseQuery?.isFetching
                    ? 'Reverse location...'
                    : 'Search location'
                }
                fontSize="sm"
              />
            </InputGroup>
          </PopoverTrigger>

          <PopoverContent
            width="100%"
            backgroundColor="background"
            border="none"
            boxShadow="0 0 6px 3px rgba(0, 0, 0, 0.1)"
          >
            <PopoverBody
              padding=".5rem"
              as={Flex}
              direction="column"
              gap=".5rem"
            >
              <InputGroup>
                <InputLeftElement>
                  <Icon as={MagnifyingGlassIcon} fontSize="lg" />
                </InputLeftElement>
                <Input
                  type="search"
                  placeholder={'Search location'}
                  defaultValue={location}
                  onChange={(e) => debouncedLocation(e.target.value)}
                  fontSize={{ base: 'md', md: 'sm' }}
                />
              </InputGroup>
              {location && locationsQuery?.isFetching ? (
                <Spinner margin="1rem auto" />
              ) : null}
              {location && locationsQuery?.data ? (
                <Flex direction="column" maxHeight="200px" overflowY="auto">
                  {locationsQuery.data.map((data, dataIndex) => (
                    <Box
                      key={dataIndex}
                      p={2}
                      borderRadius="md"
                      _hover={{ backgroundColor: 'gray', cursor: 'pointer' }}
                      onClick={() => handleLocationSelect(data)}
                    >
                      <Text fontSize="sm">{data.display_name}</Text>
                    </Box>
                  ))}
                </Flex>
              ) : null}
            </PopoverBody>
          </PopoverContent>
        </Popover>

        {currentWeatherQuery?.isFetching || forecastQuery?.isFetching ? (
          <Spinner margin="auto" />
        ) : null}

        {/* Current Weather */}
        {currentWeatherQuery?.data ? (
          <CurrentWeather data={currentWeatherQuery?.data} />
        ) : null}

        {/* Forecast */}
        {forecastQuery?.data ? (
          <Forecast list={forecastQuery?.data?.list} />
        ) : null}
      </Flex>
    </Container>
  )
}
