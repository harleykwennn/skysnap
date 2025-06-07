import axiosInstance from "@/services/axios-instance";
import type { ForwardGeocodingParamsProps, ForwardGeocodingProps } from "@/services/locationiq/locationiq.service-d";

const BASE_URL = import.meta.env.VITE_LOCATIONIQ_BASE_URL
const API_KEY = import.meta.env.VITE_LOCATIONIQ_API_KEY

const locationiqService = {
  forwardGeocoding: async (params: ForwardGeocodingParamsProps) => {
    const response = await axiosInstance.get<ForwardGeocodingProps>('/v1/search', { baseURL: BASE_URL, params: { ...params, key: API_KEY } })
    return response.data;
  }
}

export default locationiqService