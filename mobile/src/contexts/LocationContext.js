import React, { createContext, useState, useContext, useEffect } from 'react';
import * as Location from 'expo-location';
import { Platform } from 'react-native';

const LocationContext = createContext();

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [locationHistory, setLocationHistory] = useState([]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        accuracy: currentLocation.coords.accuracy,
        timestamp: currentLocation.timestamp
      });
    })();
  }, []);

  const startLocationTracking = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      // Request background location permission for iOS
      if (Platform.OS === 'ios') {
        let { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
        if (backgroundStatus !== 'granted') {
          console.log('Background location permission denied');
        }
      }

      setIsTracking(true);
      
      // Start background location updates
      await Location.startLocationUpdatesAsync('location-tracking', {
        accuracy: Location.Accuracy.High,
        timeInterval: 30000, // Update every 30 seconds
        distanceInterval: 50, // Update when moved 50 meters
        foregroundService: {
          notificationTitle: 'ServicePro Elite',
          notificationBody: 'Location tracking is active',
        },
      });

      // Listen for location updates
      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 30000,
          distanceInterval: 50,
        },
        (newLocation) => {
          const locationData = {
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
            accuracy: newLocation.coords.accuracy,
            timestamp: newLocation.timestamp
          };
          
          setLocation(locationData);
          
          // Add to history
          setLocationHistory(prev => [...prev, locationData]);
          
          // Keep only last 100 locations
          if (locationHistory.length > 100) {
            setLocationHistory(prev => prev.slice(-100));
          }
        }
      );
    } catch (error) {
      console.error('Error starting location tracking:', error);
      setErrorMsg('Failed to start location tracking');
    }
  };

  const stopLocationTracking = async () => {
    try {
      setIsTracking(false);
      await Location.stopLocationUpdatesAsync('location-tracking');
    } catch (error) {
      console.error('Error stopping location tracking:', error);
    }
  };

  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return null;
      }

      let currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });

      const locationData = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        accuracy: currentLocation.coords.accuracy,
        timestamp: currentLocation.timestamp
      };

      setLocation(locationData);
      return locationData;
    } catch (error) {
      console.error('Error getting current location:', error);
      setErrorMsg('Failed to get current location');
      return null;
    }
  };

  const getDistanceFromLocation = (targetLat, targetLng) => {
    if (!location) return null;

    const R = 6371e3; // Earth's radius in meters
    const φ1 = location.latitude * Math.PI/180;
    const φ2 = targetLat * Math.PI/180;
    const Δφ = (targetLat - location.latitude) * Math.PI/180;
    const Δλ = (targetLng - location.longitude) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  };

  const value = {
    location,
    errorMsg,
    isTracking,
    locationHistory,
    startLocationTracking,
    stopLocationTracking,
    getCurrentLocation,
    getDistanceFromLocation
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};