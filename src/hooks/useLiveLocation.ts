import { useEffect, useState, useRef } from 'react';
import Geolocation, {
  GeolocationResponse,
  GeolocationError,
} from '@react-native-community/geolocation';

type LocationState = {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
};

export function useLiveLocation(permissionGranted: boolean) {
  const [location, setLocation] = useState<LocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
  });
  const [error, setError] = useState<GeolocationError | null>(null);
  const watchId = useRef<number | null>(null);

  useEffect(() => {
    if (!permissionGranted) {
      setLocation({ latitude: null, longitude: null, accuracy: null });
      return;
    }

    watchId.current = Geolocation.watchPosition(
      (pos: GeolocationResponse) => {
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
        setError(null);
      },
      (err: GeolocationError) => {
        setError(err);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 0, // meters before update
        interval: 3000, // Android only
        fastestInterval: 2000, // Android only
      },
    );

    return () => {
      if (watchId.current !== null) {
        Geolocation.clearWatch(watchId.current);
        watchId.current = null;
      }
    };
  }, [permissionGranted]);

  return { location, error };
}
