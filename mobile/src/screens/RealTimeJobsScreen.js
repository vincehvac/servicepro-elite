import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  Alert,
  Animated
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import io from 'socket.io-client';

const RealTimeJobsScreen = ({ navigation }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    initializeSocket();
    loadJobs();
    startPulseAnimation();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const initializeSocket = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const apiUrl = 'http://localhost:5000'; // Replace with your API URL

      const socketConnection = io(apiUrl, {
        auth: { token },
        transports: ['websocket'],
      });

      socketConnection.on('connect', () => {
        console.log('Connected to real-time server');
        showNotification('Connected to office', 'success');
      });

      socketConnection.on('disconnect', () => {
        console.log('Disconnected from server');
        showNotification('Disconnected from office', 'warning');
      });

      // Listen for job updates from office
      socketConnection.on('job-created', (job) => {
        console.log('New job received:', job);
        setJobs(prevJobs => [job, ...prevJobs]);
        showNotification(`New job assigned: ${job.customer}`, 'info');
        Alert.alert(
          'New Job Assigned',
          `Customer: ${job.customer}\nTime: ${job.scheduledTime}\nAddress: ${job.address}`,
          [
            { text: 'View Details', onPress: () => navigation.navigate('JobDetail', { job }) },
            { text: 'OK' }
          ]
        );
      });

      socketConnection.on('job-updated', (updatedJob) => {
        console.log('Job updated:', updatedJob);
        setJobs(prevJobs =>
          prevJobs.map(job => job.id === updatedJob.id ? updatedJob : job)
        );
        showNotification(`Job updated: ${updatedJob.customer}`, 'info');
      });

      socketConnection.on('job-cancelled', (jobId) => {
        console.log('Job cancelled:', jobId);
        setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
        showNotification('Job cancelled by office', 'warning');
        Alert.alert('Job Cancelled', 'A job has been cancelled by the office');
      });

      socketConnection.on('job-rescheduled', (job) => {
        console.log('Job rescheduled:', job);
        setJobs(prevJobs =>
          prevJobs.map(j => j.id === job.id ? job : j)
        );
        showNotification(`Job rescheduled: ${job.scheduledTime}`, 'warning');
        Alert.alert(
          'Job Rescheduled',
          `Customer: ${job.customer}\nNew Time: ${job.scheduledTime}`,
          [{ text: 'OK' }]
        );
      });

      socketConnection.on('priority-changed', (data) => {
        console.log('Priority changed:', data);
        setJobs(prevJobs =>
          prevJobs.map(job =>
            job.id === data.jobId ? { ...job, priority: data.priority } : job
          )
        );
        showNotification(`Priority changed to ${data.priority}`, 'warning');
      });

      socketConnection.on('office-message', (message) => {
        console.log('Office message:', message);
        showNotification(message.text, 'info');
        Alert.alert('Message from Office', message.text);
      });

      setSocket(socketConnection);
    } catch (error) {
      console.error('Socket connection error:', error);
      showNotification('Failed to connect to office', 'error');
    }
  };

  const loadJobs = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');

      // Mock API call - replace with actual API
      const response = await fetch(`http://localhost:5000/api/jobs?technician=${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setJobs(data.jobs || []);
      }
    } catch (error) {
      console.error('Error loading jobs:', error);
      showNotification('Failed to load jobs', 'error');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadJobs();
    setRefreshing(false);
    showNotification('Jobs refreshed', 'success');
  };

  const showNotification = (message, type) => {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date(),
    };

    setNotifications(prev => [notification, ...prev.slice(0, 4)]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  const updateJobStatus = async (jobId, newStatus) => {
    try {
      const token = await AsyncStorage.getItem('token');

      const response = await fetch(`http://localhost:5000/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedJob = await response.json();
        setJobs(prevJobs =>
          prevJobs.map(job => job.id === jobId ? updatedJob : job)
        );

        // Emit status update to office
        if (socket) {
          socket.emit('job-status-update', {
            jobId,
            status: newStatus,
            timestamp: new Date(),
          });
        }

        showNotification(`Job status updated to ${newStatus}`, 'success');
      }
    } catch (error) {
      console.error('Error updating job status:', error);
      showNotification('Failed to update job status', 'error');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return '#3B82F6';
      case 'en_route': return '#F59E0B';
      case 'in_progress': return '#8B5CF6';
      case 'completed': return '#10B981';
      case 'cancelled': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'scheduled': return 'Scheduled';
      case 'en_route': return 'En Route';
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success': return '#10B981';
      case 'warning': return '#F59E0B';
      case 'error': return '#EF4444';
      case 'info': return '#3B82F6';
      default: return '#6B7280';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Today's Jobs</Text>
          <View style={styles.connectionStatus}>
            <Animated.View
              style={[
                styles.statusDot,
                {
                  backgroundColor: socket?.connected ? '#10B981' : '#EF4444',
                  transform: [{ scale: socket?.connected ? pulseAnim : 1 }],
                },
              ]}
            />
            <Text style={styles.statusText}>
              {socket?.connected ? 'Live' : 'Offline'}
            </Text>
          </View>
        </View>
        <Text style={styles.headerSubtitle}>
          {jobs.length} jobs • Real-time updates enabled
        </Text>
      </View>

      {/* Notifications */}
      {notifications.length > 0 && (
        <View style={styles.notificationsContainer}>
          {notifications.map(notification => (
            <View
              key={notification.id}
              style={[
                styles.notification,
                { borderLeftColor: getNotificationColor(notification.type) }
              ]}
            >
              <Text style={styles.notificationText}>{notification.message}</Text>
            </View>
          ))}
        </View>
      )}

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#667eea"
          />
        }
      >
        {jobs.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No jobs scheduled for today</Text>
            <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
              <Text style={styles.refreshButtonText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        ) : (
          jobs.map((job) => (
            <View key={job.id} style={styles.jobCard}>
              <View style={styles.jobHeader}>
                <View style={styles.jobHeaderLeft}>
                  <Text style={styles.jobCustomer}>{job.customer}</Text>
                  <Text style={styles.jobTime}>⏰ {job.scheduledTime}</Text>
                </View>
                <View style={styles.jobHeaderRight}>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(job.status) + '20' }
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        { color: getStatusColor(job.status) }
                      ]}
                    >
                      {getStatusLabel(job.status)}
                    </Text>
                  </View>
                  {job.priority === 'high' && (
                    <View style={styles.priorityBadge}>
                      <Text style={styles.priorityText}>🔥 HIGH</Text>
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.jobDetails}>
                <Text style={styles.jobType}>📋 {job.type}</Text>
                <Text style={styles.jobAddress}>📍 {job.address}</Text>
                {job.description && (
                  <Text style={styles.jobDescription}>{job.description}</Text>
                )}
              </View>

              <View style={styles.jobActions}>
                {job.status === 'scheduled' && (
                  <>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.enRouteButton]}
                      onPress={() => updateJobStatus(job.id, 'en_route')}
                    >
                      <Text style={styles.actionButtonText}>🚗 En Route</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.viewButton]}
                      onPress={() => navigation.navigate('JobDetail', { job })}
                    >
                      <Text style={styles.actionButtonText}>View Details</Text>
                    </TouchableOpacity>
                  </>
                )}

                {job.status === 'en_route' && (
                  <>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.startButton]}
                      onPress={() => updateJobStatus(job.id, 'in_progress')}
                    >
                      <Text style={styles.actionButtonText}>▶️ Start Job</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.viewButton]}
                      onPress={() => navigation.navigate('RouteNavigation', { job })}
                    >
                      <Text style={styles.actionButtonText}>Navigate</Text>
                    </TouchableOpacity>
                  </>
                )}

                {job.status === 'in_progress' && (
                  <>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.completeButton]}
                      onPress={() => updateJobStatus(job.id, 'completed')}
                    >
                      <Text style={styles.actionButtonText}>✅ Complete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.viewButton]}
                      onPress={() => navigation.navigate('JobDetail', { job })}
                    >
                      <Text style={styles.actionButtonText}>Add Notes</Text>
                    </TouchableOpacity>
                  </>
                )}

                {job.status === 'completed' && (
                  <View style={styles.completedBanner}>
                    <Text style={styles.completedText}>✅ Job Completed</Text>
                  </View>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.calculatorButton}
          onPress={() => navigation.navigate('Calculator')}
        >
          <Text style={styles.calculatorButtonText}>🧮 HVAC Calculators</Text>
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
  header: {
    backgroundColor: '#667eea',
    padding: 20,
    paddingTop: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#E0E7FF',
  },
  notificationsContainer: {
    padding: 15,
    paddingBottom: 0,
  },
  notification: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationText: {
    fontSize: 14,
    color: '#1F2937',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 20,
  },
  refreshButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  jobHeaderLeft: {
    flex: 1,
  },
  jobHeaderRight: {
    alignItems: 'flex-end',
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
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 6,
  },
  priorityBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#EF4444',
  },
  jobDetails: {
    marginBottom: 16,
  },
  jobType: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 6,
  },
  jobAddress: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 6,
  },
  jobDescription: {
    fontSize: 13,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  jobActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  enRouteButton: {
    backgroundColor: '#F59E0B',
  },
  startButton: {
    backgroundColor: '#8B5CF6',
  },
  completeButton: {
    backgroundColor: '#10B981',
  },
  viewButton: {
    backgroundColor: '#667eea',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  completedBanner: {
    flex: 1,
    backgroundColor: '#D1FAE5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  completedText: {
    color: '#065F46',
    fontSize: 14,
    fontWeight: 'bold',
  },
  footer: {
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  calculatorButton: {
    backgroundColor: '#8B5CF6',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  calculatorButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RealTimeJobsScreen;