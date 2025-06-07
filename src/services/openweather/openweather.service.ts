import axiosInstance from "@/services/axios-instance";
import type {
  CurrentWeatherParamsProps,
  CurrentWeatherProps,
  ForecastParamsProps,
  ForecastProps
} from "@/services/openweather/openweather.service-d";

const BASE_URL = import.meta.env.VITE_OPENWEATHER_BASE_URL
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

const openweatherService = {
  currentWeather: async (params: CurrentWeatherParamsProps) => {
    const response = await axiosInstance.get<CurrentWeatherProps>('/data/2.5/weather', { baseURL: BASE_URL, params: { ...params, appid: API_KEY } })
    return response.data;
  },
  forecast: async (params: ForecastParamsProps) => {
    const response = await axiosInstance.get<ForecastProps>('/data/2.5/forecast', { baseURL: BASE_URL, params: { ...params, appid: API_KEY } })
    return response.data;
  },
}

export default openweatherService