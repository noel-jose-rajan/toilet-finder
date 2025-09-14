import {
  View,
  Text,
  StyleSheet,
  Button,
  ActivityIndicator,
  Linking,
} from 'react-native';
import React, { useEffect, useRef } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { blackAndWhiteMapStyle } from '../map-style';
import { useLocationPermission } from '../../hooks/useLocationPermission';
import { useLiveLocation } from '../../hooks/useLiveLocation';

export default function Map() {
  const { granted, requestPermission } = useLocationPermission();
  const { location, error, loading } = useLiveLocation(!!granted);

  const mapRef = useRef<MapView | null>(null);

  // Request permission automatically on mount
  useEffect(() => {
    requestPermission();
  }, []);

  useEffect(() => {
    if (location.latitude != null && location.longitude !== null) {
      mapRef.current?.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    }
  }, [location]);

  if (!granted) {
    return (
      <View style={styles.center}>
        <Text>No permission granted</Text>
        <Button
          title="Open Settings"
          color="black"
          onPress={() => Linking.openSettings()}
        />
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Fetching location...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>Error: {error.message}</Text>
        <Button title="Retry" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFillObject}
        customMapStyle={blackAndWhiteMapStyle}
      >
        {location.latitude != null && location.longitude !== null && (
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            image={require('../../../assets/pee-marker.png')}
          />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
