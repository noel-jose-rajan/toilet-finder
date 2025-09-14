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
  const [loading, setLoading] = useState(true);
  const watchId = useRef<number | null>(null);

  useEffect(() => {
    if (!permissionGranted) {
      setLocation({ latitude: null, longitude: null, accuracy: null });
      setLoading(false);
      return;
    }

    setLoading(true);

    watchId.current = Geolocation.watchPosition(
      (pos: GeolocationResponse) => {
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
        setError(null);
        setLoading(false);
      },
      (err: GeolocationError) => {
        setError(err);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 0,
        interval: 3000,
        fastestInterval: 2000,
      },
    );

    return () => {
      if (watchId.current !== null) {
        Geolocation.clearWatch(watchId.current);
        watchId.current = null;
      }
    };
  }, [permissionGranted]);

  return { location, error, loading };
}
