/**
 * Forward Geocoding
 */

export interface AutocompleteParamsProps {
  q?: string
  format: 'json'
}

export interface AutocompleteResultProps {
  place_id: string
  licence: string
  osm_type: string
  osm_id: string
  lat: string
  lon: string
  display_name: string
  address: {
    village: string
    county: string
    state: string
    region: string
    postcode: string
    country: string
    country_code: string
  }
  boundingbox: [string, string, string, string]
}

export type AutocompleteProps = AutocompleteResultProps[]

/**
 * Reverse Geocoding
 */

export interface ReverseGeocodingParamsProps {
  lat: string | null
  lon: string | null
  format: 'json'
}

export type ReverseGeocodingProps = AutocompleteResultProps