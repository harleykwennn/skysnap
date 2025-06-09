import axiosInstance from "@/services/axios-instance";
import type { AutocompleteParamsProps, AutocompleteProps, ReverseGeocodingParamsProps, ReverseGeocodingProps } from "@/services/locationiq/locationiq.service-d";

const BASE_URL = import.meta.env.VITE_LOCATIONIQ_BASE_URL
const API_KEY = import.meta.env.VITE_LOCATIONIQ_API_KEY

const locationiqService = {
  autocomplete: async (params: AutocompleteParamsProps) => {
    const response = await axiosInstance.get<AutocompleteProps>('/v1/autocomplete', { baseURL: BASE_URL, params: { ...params, key: API_KEY } })
    return response.data;
  },
  reverseGeocoding: async (params: ReverseGeocodingParamsProps) => {
    const response = await axiosInstance.get<ReverseGeocodingProps>('/v1/reverse', { baseURL: BASE_URL, params: { ...params, key: API_KEY } })
    return response.data;
  },
}

export default locationiqService