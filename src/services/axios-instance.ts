import axios from 'axios';
import type {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
  CancelTokenSource,
} from 'axios'

/**
 * Axios instance
 */
const axiosInstance: AxiosInstance = axios.create({
  baseURL: '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Cancel duplicate requests
 */
const pendingRequests = new Map<string, CancelTokenSource>();

const getRequestKey = (config: InternalAxiosRequestConfig): string => {
  return `${config.method}:${config.url}:${JSON.stringify(config.params)}:${JSON.stringify(config.data)}`;
};

/**
 * Retry config
 */
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const delay = (ms: number): Promise<void> => new Promise((res) => setTimeout(res, ms));

/**
 * Request Interceptor
 */
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const requestKey = getRequestKey(config);

    if (pendingRequests.has(requestKey)) {
      const cancelSource = pendingRequests.get(requestKey);
      cancelSource?.cancel('Duplicate request canceled.');
      pendingRequests.delete(requestKey);
    }

    const source = axios.CancelToken.source();
    config.cancelToken = source.token;
    pendingRequests.set(requestKey, source);

    console.info('[Axios][Request]', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    console.error('[Axios][Request Error]', error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 */
axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    const requestKey = getRequestKey(response.config);
    pendingRequests.delete(requestKey);
    console.info('[Axios][Response]', response.status, response.config.url);
    return response;
  },
  async (error: AxiosError): Promise<unknown> => {
    const config = error.config as InternalAxiosRequestConfig & { _retryCount?: number };
    const requestKey = getRequestKey(config);
    pendingRequests.delete(requestKey);

    config._retryCount = config._retryCount ?? 0;

    if (
      (error.code === 'ECONNABORTED' ||
        error.message.includes('Network Error') ||
        (error.response && error.response.status >= 500)) &&
      config._retryCount < MAX_RETRIES
    ) {
      config._retryCount += 1;
      console.warn(`[Axios][Retry] Attempt ${config._retryCount} for ${config.url}`);
      await delay(RETRY_DELAY * config._retryCount);
      return axiosInstance(config);
    }

    console.error('[Axios][Response Error]', error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;
