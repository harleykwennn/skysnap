import { useState } from 'react'
import locationiqService from '@/services/locationiq/locationiq.service'
import openweatherService from '@/services/openweather/openweather.service'
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
  Image,
  GridItem,
  Grid,
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
      <Flex direction="column" gap="1rem">
        <Text>Skysnap</Text>

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
                value={selectedLocation?.display_name ?? 'Select location'}
                fontSize="sm"
              />
            </InputGroup>
          </PopoverTrigger>

          <PopoverContent width="100%">
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
                  fontSize="sm"
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
                      _hover={{ bg: 'gray.100', cursor: 'pointer' }}
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

        {/* Current Weather */}
        {currentWeatherQuery?.isFetching ? (
          <Spinner margin="auto" />
        ) : currentWeatherQuery?.data ? (
          <Flex
            direction="column"
            gap=".5rem"
            backgroundColor="gray.50"
            padding="1rem"
            borderRadius="1rem"
          >
            <Text>Current Weather</Text>
            <Flex
              direction="column"
              justifyContent="center"
              alignItems="center"
            >
              <Image
                src={`https://openweathermap.org/img/wn/${currentWeatherQuery?.data?.weather[0]?.icon}@4x.png`}
                alt="weather-icon"
                width="120px"
                height="120px"
              />
              <Text>{currentWeatherQuery?.data?.weather[0]?.main}</Text>
              <Text>{currentWeatherQuery?.data?.weather[0]?.description}</Text>
            </Flex>
          </Flex>
        ) : null}

        {/* Forecast */}
        {forecastQuery?.isFetching ? (
          <Spinner margin="auto" />
        ) : (
          <Flex
            direction="column"
            gap=".5rem"
            backgroundColor="gray.50"
            padding="1rem"
            borderRadius="1rem"
          >
            <Text>Forecast</Text>
            <Grid gridTemplateColumns="repeat(3, 1fr)" gridGap=".5rem">
              {forecastQuery?.data?.list?.map((data, index) => {
                return (
                  <GridItem key={index}>
                    <Flex
                      direction="column"
                      justifyContent="center"
                      alignItems="center"
                      borderWidth="1px"
                      borderColor="gray.200"
                      borderRadius="1rem"
                      padding=".5rem"
                    >
                      <Text>{data?.dt_txt}</Text>
                      <Image
                        src={`https://openweathermap.org/img/wn/${data?.weather[0]?.icon}@4x.png`}
                        alt="weather-icon"
                        width="60px"
                        height="60px"
                      />
                      <Text>{data?.weather[0]?.description}</Text>
                    </Flex>
                  </GridItem>
                )
              })}
            </Grid>
          </Flex>
        )}
      </Flex>
    </Container>
  )
}
