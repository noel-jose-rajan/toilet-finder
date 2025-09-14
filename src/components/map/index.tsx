import { View, Text, StyleSheet, Image } from 'react-native';
import React, { useEffect, useRef } from 'react';
import MapView, { PROVIDER_GOOGLE, MapMarker, Marker } from 'react-native-maps';
import { blackAndWhiteMapStyle } from '../map-style';
import { useLocationPermission } from '../../hooks/useLocationPermission';
import { useLiveLocation } from '../../hooks/useLiveLocation';

export default function Map() {
  const { granted, requestPermission } = useLocationPermission();
  const { location } = useLiveLocation(!!granted);

  const mapRef = useRef<MapView | null>(null);

  useEffect(() => {
    if (!granted) {
      requestPermission();
    }
    return () => {};
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
    return () => {};
  }, [location]);

  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
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
