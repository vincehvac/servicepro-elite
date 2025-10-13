import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from '../contexts/LocationContext';

const DashboardScreen = () => {
  const { user } = useAuth();
  const { location, startLocationTracking, stopLocationTracking } = useLocation();
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    todayJobs: 4,
    completedJobs: 2,
    pendingJobs: 2,
    weeklyAverage: 4.5,
  });

  const recentJobs = [
    {
      id: 1,
      jobNumber: 'JOB-2024-001',
      customer: 'John Smith',
      address: '123 Main St, Anytown',
      type: 'HVAC Maintenance',
      scheduledTime: '10:00 AM',
      status: 'completed',
      duration: '2 hours'
    },
    {
      id: 2,
      jobNumber: 'JOB-2024-002',
      customer: 'Sarah Williams',
      address: '456 Oak Ave, Anytown',
      type: 'Electrical Repair',
      scheduledTime: '2:00 PM',
      status: 'scheduled',
      duration: '2 hours'
    }
  ];

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#10B981';
      case 'scheduled':
        return '#3B82F6';
      case 'in_progress':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'scheduled':
        return 'Scheduled';
      case 'in_progress':
        return 'In Progress';
      default:
        return 'Unknown';
    }
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome back!</Text>
        <Text style={styles.userName}>{user?.firstName} {user?.lastName}</Text>
        <Text style={styles.userRole}>{user?.role}</Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Card.Content>
            <Title style={styles.statNumber}>{stats.todayJobs}</Title>
            <Paragraph style={styles.statLabel}>Today's Jobs</Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <Title style={styles.statNumber}>{stats.completedJobs}</Title>
            <Paragraph style={styles.statLabel}>Completed</Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <Title style={styles.statNumber}>{stats.pendingJobs}</Title>
            <Paragraph style={styles.statLabel}>Pending</Paragraph>
          </Card.Content>
        </Card>
      </View>

      {/* Location Status */}
      {location && (
        <Card style={styles.locationCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>Location Status</Title>
            <View style={styles.locationInfo}>
              <Text style={styles.locationText}>
                Latitude: {location.latitude.toFixed(6)}
              </Text>
              <Text style={styles.locationText}>
                Longitude: {location.longitude.toFixed(6)}
              </Text>
              <Text style={styles.locationText}>
                Accuracy: ±{location.accuracy.toFixed(0)}m
              </Text>
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Today's Schedule */}
      <Card style={styles.scheduleCard}>
        <Card.Content>
          <Title style={styles.cardTitle}>Today's Schedule</Title>
          
          {recentJobs.map((job) => (
            <TouchableOpacity
              key={job.id}
              style={styles.jobItem}
              onPress={() => navigation.navigate('JobDetail', { jobId: job.id })}
            >
              <View style={styles.jobHeader}>
                <Text style={styles.jobNumber}>{job.jobNumber}</Text>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(job.status) }
                ]}>
                  <Text style={styles.statusText}>
                    {getStatusText(job.status)}
                  </Text>
                </View>
              </View>
              
              <Text style={styles.customerName}>{job.customer}</Text>
              <Text style={styles.jobAddress}>{job.address}</Text>
              <Text style={styles.jobType}>{job.type}</Text>
              
              <View style={styles.jobFooter}>
                <Text style={styles.jobTime}>{job.scheduledTime}</Text>
                <Text style={styles.jobDuration}>{job.duration}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </Card.Content>
      </Card>

      {/* Quick Actions */}
      <Card style={styles.actionsCard}>
        <Card.Content>
          <Title style={styles.cardTitle}>Quick Actions</Title>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Start Job</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Add Photo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Complete Job</Text>
            </TouchableOpacity>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    backgroundColor: '#3B82F6',
    padding: 20,
    paddingTop: 40,
  },
  welcomeText: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 4,
  },
  userRole: {
    fontSize: 14,
    color: 'white',
    opacity: 0.8,
    marginTop: 2,
    textTransform: 'capitalize',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 16,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
  },
  locationCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  locationInfo: {
    marginTop: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 4,
  },
  scheduleCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  jobItem: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  jobNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  jobAddress: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  jobType: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 8,
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  jobTime: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '500',
  },
  jobDuration: {
    fontSize: 12,
    color: '#6B7280',
  },
  actionsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 80,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default DashboardScreen;