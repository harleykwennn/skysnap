import { useEffect, useState } from 'react';

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface GeolocationResult {
  location: Coordinates | null;
  error: string | null;
}

export function useGeolocation (): GeolocationResult {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      return;
    }

    const onSuccess = (position: GeolocationPosition) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    };

    const onError = (error: GeolocationPositionError) => {
      setError(error.message);
    };

    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  }, []);

  return { location, error };
};
