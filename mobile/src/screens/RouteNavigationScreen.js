import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Linking,
  Platform
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

const RouteNavigationScreen = ({ navigation, route }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [optimizedRoute, setOptimizedRoute] = useState(null);
  const [trafficData, setTrafficData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeLocation();
    loadTodaysJobs();
  }, []);

  const initializeLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required for navigation');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      // Start watching location
      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 10000,
          distanceInterval: 50,
        },
        (newLocation) => {
          setCurrentLocation({
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
          });
        }
      );
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Failed to get current location');
    }
  };

  const loadTodaysJobs = async () => {
    try {
      // Mock data - replace with actual API call
      const mockJobs = [
        {
          id: 1,
          customer: 'John Smith',
          address: '123 Main St, Anytown, ST 12345',
          coordinates: { latitude: 40.7128, longitude: -74.0060 },
          scheduledTime: '9:00 AM',
          duration: 60,
          priority: 'high',
          status: 'scheduled'
        },
        {
          id: 2,
          customer: 'Sarah Williams',
          address: '456 Oak Ave, Business City, ST 23456',
          coordinates: { latitude: 40.7589, longitude: -73.9851 },
          scheduledTime: '11:00 AM',
          duration: 90,
          priority: 'normal',
          status: 'scheduled'
        },
        {
          id: 3,
          customer: 'Mike Johnson',
          address: '789 Pine Rd, Lakeside, ST 34567',
          coordinates: { latitude: 40.7505, longitude: -73.9934 },
          scheduledTime: '2:00 PM',
          duration: 45,
          priority: 'normal',
          status: 'scheduled'
        }
      ];

      setJobs(mockJobs);
      optimizeRoute(mockJobs);
      setLoading(false);
    } catch (error) {
      console.error('Error loading jobs:', error);
      setLoading(false);
    }
  };

  const optimizeRoute = (jobsList) => {
    if (!currentLocation || jobsList.length === 0) return;

    // Simple route optimization (nearest neighbor algorithm)
    const unvisited = [...jobsList];
    const route = [];
    let current = currentLocation;

    while (unvisited.length > 0) {
      let nearestIndex = 0;
      let minDistance = Infinity;

      unvisited.forEach((job, index) => {
        const distance = calculateDistance(
          current.latitude,
          current.longitude,
          job.coordinates.latitude,
          job.coordinates.longitude
        );

        if (distance < minDistance) {
          minDistance = distance;
          nearestIndex = index;
        }
      });

      const nearestJob = unvisited.splice(nearestIndex, 1)[0];
      route.push({
        ...nearestJob,
        distance: minDistance,
        estimatedTime: Math.round(minDistance * 2) // Rough estimate: 2 min per mile
      });
      current = nearestJob.coordinates;
    }

    setOptimizedRoute(route);
    fetchTrafficData(route);
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 3959; // Earth's radius in miles
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toRad = (degrees) => {
    return degrees * (Math.PI / 180);
  };

  const fetchTrafficData = (route) => {
    // Mock traffic data - in production, use Google Maps Traffic API
    const mockTraffic = {
      overall: 'moderate',
      delays: [
        { jobId: 1, delay: 5, reason: 'Light traffic' },
        { jobId: 2, delay: 15, reason: 'Heavy traffic on I-95' }
      ],
      alternativeRoutes: [
        { jobId: 2, savings: 10, description: 'Take Route 1 instead' }
      ]
    };

    setTrafficData(mockTraffic);
  };

  const startNavigation = (job) => {
    const destination = `${job.coordinates.latitude},${job.coordinates.longitude}`;
    const label = encodeURIComponent(job.customer);

    let url;
    if (Platform.OS === 'ios') {
      url = `maps://app?daddr=${destination}&dirflg=d`;
    } else {
      url = `google.navigation:q=${destination}`;
    }

    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        // Fallback to Google Maps web
        const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;
        Linking.openURL(webUrl);
      }
    });
  };

  const getTrafficColor = (traffic) => {
    switch (traffic) {
      case 'light': return '#10B981';
      case 'moderate': return '#F59E0B';
      case 'heavy': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getTotalDistance = () => {
    if (!optimizedRoute) return 0;
    return optimizedRoute.reduce((sum, job) => sum + job.distance, 0).toFixed(1);
  };

  const getTotalTime = () => {
    if (!optimizedRoute) return 0;
    const travelTime = optimizedRoute.reduce((sum, job) => sum + job.estimatedTime, 0);
    const workTime = optimizedRoute.reduce((sum, job) => sum + job.duration, 0);
    return Math.round((travelTime + workTime) / 60 * 10) / 10; // Convert to hours
  };

  if (loading || !currentLocation) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading route...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Route Navigation</Text>
        <View style={styles.headerStats}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{jobs.length}</Text>
            <Text style={styles.statLabel}>Jobs</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{getTotalDistance()} mi</Text>
            <Text style={styles.statLabel}>Distance</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{getTotalTime()} hrs</Text>
            <Text style={styles.statLabel}>Est. Time</Text>
          </View>
        </View>
      </View>

      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
        showsTraffic={true}
        showsUserLocation={true}
        followsUserLocation={true}
      >
        {/* Current Location Marker */}
        <Marker
          coordinate={currentLocation}
          title="Your Location"
          pinColor="#667eea"
        />

        {/* Job Markers */}
        {optimizedRoute && optimizedRoute.map((job, index) => (
          <Marker
            key={job.id}
            coordinate={job.coordinates}
            title={`${index + 1}. ${job.customer}`}
            description={job.address}
            pinColor={job.priority === 'high' ? '#EF4444' : '#10B981'}
          >
            <View style={styles.markerContainer}>
              <View style={[
                styles.marker,
                { backgroundColor: job.priority === 'high' ? '#EF4444' : '#667eea' }
              ]}>
                <Text style={styles.markerText}>{index + 1}</Text>
              </View>
            </View>
          </Marker>
        ))}

        {/* Route Polyline */}
        {optimizedRoute && optimizedRoute.length > 0 && (
          <Polyline
            coordinates={[
              currentLocation,
              ...optimizedRoute.map(job => job.coordinates)
            ]}
            strokeColor="#667eea"
            strokeWidth={4}
          />
        )}
      </MapView>

      <ScrollView style={styles.jobsList}>
        {trafficData && trafficData.overall && (
          <View style={[
            styles.trafficAlert,
            { backgroundColor: getTrafficColor(trafficData.overall) + '20' }
          ]}>
            <Text style={[
              styles.trafficAlertText,
              { color: getTrafficColor(trafficData.overall) }
            ]}>
              🚦 Traffic: {trafficData.overall.toUpperCase()}
            </Text>
          </View>
        )}

        {optimizedRoute && optimizedRoute.map((job, index) => {
          const delay = trafficData?.delays?.find(d => d.jobId === job.id);
          const alternative = trafficData?.alternativeRoutes?.find(a => a.jobId === job.id);

          return (
            <View key={job.id} style={styles.jobCard}>
              <View style={styles.jobHeader}>
                <View style={styles.jobNumber}>
                  <Text style={styles.jobNumberText}>{index + 1}</Text>
                </View>
                <View style={styles.jobInfo}>
                  <Text style={styles.jobCustomer}>{job.customer}</Text>
                  <Text style={styles.jobTime}>{job.scheduledTime}</Text>
                  <Text style={styles.jobAddress}>{job.address}</Text>
                </View>
                {job.priority === 'high' && (
                  <View style={styles.priorityBadge}>
                    <Text style={styles.priorityText}>HIGH</Text>
                  </View>
                )}
              </View>

              <View style={styles.jobDetails}>
                <View style={styles.jobDetail}>
                  <Text style={styles.jobDetailLabel}>Distance</Text>
                  <Text style={styles.jobDetailValue}>{job.distance.toFixed(1)} mi</Text>
                </View>
                <View style={styles.jobDetail}>
                  <Text style={styles.jobDetailLabel}>Travel Time</Text>
                  <Text style={styles.jobDetailValue}>{job.estimatedTime} min</Text>
                </View>
                <View style={styles.jobDetail}>
                  <Text style={styles.jobDetailLabel}>Duration</Text>
                  <Text style={styles.jobDetailValue}>{job.duration} min</Text>
                </View>
              </View>

              {delay && (
                <View style={styles.delayAlert}>
                  <Text style={styles.delayText}>
                    ⚠️ +{delay.delay} min delay - {delay.reason}
                  </Text>
                </View>
              )}

              {alternative && (
                <View style={styles.alternativeAlert}>
                  <Text style={styles.alternativeText}>
                    💡 Save {alternative.savings} min: {alternative.description}
                  </Text>
                </View>
              )}

              <TouchableOpacity
                style={styles.navigateButton}
                onPress={() => startNavigation(job)}
              >
                <Text style={styles.navigateButtonText}>🧭 Start Navigation</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.optimizeButton}
          onPress={() => optimizeRoute(jobs)}
        >
          <Text style={styles.optimizeButtonText}>🔄 Re-optimize Route</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  loadingText: {
    fontSize: 18,
    color: '#6B7280',
  },
  header: {
    backgroundColor: '#667eea',
    padding: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  headerStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#E0E7FF',
    marginTop: 4,
  },
  map: {
    height: 300,
  },
  markerContainer: {
    alignItems: 'center',
  },
  marker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  markerText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  jobsList: {
    flex: 1,
    padding: 15,
  },
  trafficAlert: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  trafficAlertText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  jobHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  jobNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  jobNumberText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  jobInfo: {
    flex: 1,
  },
  jobCustomer: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  jobTime: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
    marginBottom: 4,
  },
  jobAddress: {
    fontSize: 14,
    color: '#6B7280',
  },
  priorityBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  priorityText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: 'bold',
  },
  jobDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  jobDetail: {
    alignItems: 'center',
  },
  jobDetailLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  jobDetailValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  delayAlert: {
    backgroundColor: '#FEF3C7',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  delayText: {
    fontSize: 13,
    color: '#92400E',
  },
  alternativeAlert: {
    backgroundColor: '#DBEAFE',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  alternativeText: {
    fontSize: 13,
    color: '#1E40AF',
  },
  navigateButton: {
    backgroundColor: '#667eea',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  navigateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  optimizeButton: {
    backgroundColor: '#10B981',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  optimizeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RouteNavigationScreen;