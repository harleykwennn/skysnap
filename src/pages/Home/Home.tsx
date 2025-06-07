import { useState } from 'react'
import locationiqService from '@/services/locationiq/locationiq.service'
import type { ForwardGeocodingResultProps } from '@/services/locationiq/locationiq.service-d'
import { useDebouncedCallback } from 'use-debounce'
import { useQuery } from '@tanstack/react-query'
import { MapPinIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import {
  Container,
  Flex,
  Input,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Button,
  InputGroup,
  InputLeftElement,
  Icon,
} from '@chakra-ui/react'

export default function Home() {
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

  return (
    <Flex direction="column" padding="1rem">
      <Container maxWidth="container.sm" padding="0px">
        <Menu>
          <MenuButton
            as={Button}
            variant="outline"
            width="100%"
            textAlign="left"
            fontWeight="normal"
            leftIcon={<Icon as={MapPinIcon} fontSize="24px" />}
          >
            {selectedLocation?.display_name ?? 'Select Location'}
          </MenuButton>
          <MenuList width="300px" paddingY="0px">
            <Flex padding="6px 12px">
              <InputGroup>
                <InputLeftElement>
                  <Icon as={MagnifyingGlassIcon} fontSize="24px" />
                </InputLeftElement>
                <Input
                  type="search"
                  placeholder="Search location"
                  defaultValue={location}
                  onChange={(e) => debouncedLocation(e.target.value)}
                />
              </InputGroup>
            </Flex>
            {(locationsQuery?.data?.length ?? 0) > 0 && location ? (
              <MenuDivider marginY="0px" />
            ) : null}
            {location &&
              locationsQuery?.data?.map((data, dataIndex) => {
                return (
                  <MenuItem
                    key={dataIndex}
                    onClick={() => setSelectedLocation(data)}
                  >
                    {data?.display_name}
                  </MenuItem>
                )
              })}
          </MenuList>
        </Menu>
      </Container>
    </Flex>
  )
}
