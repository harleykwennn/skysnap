import { useState } from 'react'
import locationiqService from '@/services/locationiq/locationiq.service'
import openweatherService from '@/services/openweather/openweather.service'
import CurrentWeather from '@/pages/Home/components/CurrentWeather'
import Forecast from './components/Forecast'
import type { ForwardGeocodingResultProps } from '@/services/locationiq/locationiq.service-d'
import { useDebouncedCallback } from 'use-debounce'
import { useQuery } from '@tanstack/react-query'
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

  const [location, setLocation] = useState<string>('')
  const [selectedLocation, setSelectedLocation] =
    useState<ForwardGeocodingResultProps | null>(null)

  const debouncedLocation = useDebouncedCallback((value) => {
    setLocation(value)
  }, 1000)

  const locationsQuery = useQuery({
    queryKey: ['locations', location],
    queryFn: () =>
      locationiqService.forwardGeocoding({ q: location, format: 'json' }),
    enabled: location !== '',
  })

  const currentWeatherQuery = useQuery({
    queryKey: ['weather', selectedLocation],
    queryFn: () =>
      openweatherService.currentWeather({
        lat: Number(selectedLocation?.lat),
        lon: Number(selectedLocation?.lon),
      }),
    enabled: selectedLocation !== null,
  })

  const forecastQuery = useQuery({
    queryKey: ['forecast', selectedLocation],
    queryFn: () =>
      openweatherService.forecast({
        lat: Number(selectedLocation?.lat),
        lon: Number(selectedLocation?.lon),
      }),
    enabled: selectedLocation !== null,
  })

  const handleLocationSelect = (data: ForwardGeocodingResultProps) => {
    setSelectedLocation(data)
    setLocation('')
    onClose()
  }

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
                value={selectedLocation?.display_name ?? 'Select location'}
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
                  placeholder="Search location"
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
