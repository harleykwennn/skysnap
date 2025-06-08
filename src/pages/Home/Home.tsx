import { useState } from 'react'
import locationiqService from '@/services/locationiq/locationiq.service'
import openweatherService from '@/services/openweather/openweather.service'
import CurrentWeather from '@/pages/Home/components/CurrentWeather'
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
import { format } from 'date-fns'

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
          <CurrentWeather data={currentWeatherQuery?.data} />
        ) : null}

        {/* Forecast */}
        {forecastQuery?.isFetching ? (
          <Spinner margin="auto" />
        ) : forecastQuery?.data ? (
          <Flex position="relative" borderRadius="24px" overflow="hidden">
            <Flex
              width="100%"
              height="100%"
              backgroundColor="gray"
              opacity={0.16}
              position="absolute"
            />
            <Grid
              gridTemplateColumns="repeat(3, 1fr)"
              gridGap="1rem"
              margin="1rem"
              width="100%"
            >
              {forecastQuery?.data?.list?.map((data, index) => {
                return (
                  <GridItem key={index}>
                    <Flex
                      position="relative"
                      borderRadius="12px"
                      overflow="hidden"
                      height="100%"
                    >
                      <Flex
                        width="100%"
                        height="100%"
                        backgroundColor="gray"
                        opacity={0.1}
                        position="absolute"
                      />
                      <Flex
                        direction="column"
                        alignItems="center"
                        padding="8px"
                        width="100%"
                      >
                        <Text>
                          {format(new Date(data?.dt_txt), 'iii, d MMM')}
                        </Text>
                        <Text>{format(new Date(data?.dt_txt), 'HH:mm')}</Text>
                        <Image
                          src={`https://openweathermap.org/img/wn/${data?.weather[0]?.icon}@4x.png`}
                          alt="weather-icon"
                          width="60px"
                          height="60px"
                        />
                        <Text textAlign="center" marginTop="auto">
                          {data?.weather[0]?.description}
                        </Text>
                      </Flex>
                    </Flex>
                  </GridItem>
                )
              })}
            </Grid>
          </Flex>
        ) : null}
      </Flex>
    </Container>
  )
}
