/**
 * Forward Geocoding
 */

export interface ForwardGeocodingParamsProps {
  q?: string
  format: 'json'
}

export interface ForwardGeocodingResultProps {
  place_id: string
  licence: string
  osm_type: string
  osm_id: string
  boundingbox: string[]
  lat: string
  lon: string
  display_name: string
  class: string
  type: string
  importance: number
  icon: string
}

export type ForwardGeocodingProps = ForwardGeocodingResultProps[]

/**
 * Reverse Geocoding
 */

export interface ReverseGeocodingParamsProps {
  lat: string | null
  lon: string | null
  format: 'json'
}

export interface ReverseGeocodingProps {
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