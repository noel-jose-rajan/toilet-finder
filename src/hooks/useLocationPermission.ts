import { useState, useEffect, useCallback } from 'react';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';
import { Platform, Alert } from 'react-native';

export function useLocationPermission() {
  const [granted, setGranted] = useState<boolean | null>(null);

  const permissionType =
    Platform.OS === 'ios'
      ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
      : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

  const checkPermission = useCallback(async () => {
    try {
      const result = await check(permissionType);
      if (result === RESULTS.GRANTED) {
        setGranted(true);
      } else {
        setGranted(false);
      }
    } catch (err) {
      console.warn('Error checking location permission:', err);
    }
  }, [permissionType]);

  const requestPermission = useCallback(async () => {
    try {
      const result = await request(permissionType);
      if (result === RESULTS.GRANTED) {
        setGranted(true);
      } else if (result === RESULTS.BLOCKED) {
        Alert.alert(
          'Permission required',
          'Please enable location permissions in settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => openSettings() },
          ],
        );
        setGranted(false);
      } else {
        setGranted(false);
      }
    } catch (err) {
      console.warn('Error requesting location permission:', err);
    }
  }, [permissionType]);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  return { granted, checkPermission, requestPermission };
}
