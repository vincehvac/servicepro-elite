import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import { Card, Title, Paragraph, Chip } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const JobsScreen = () => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Mock jobs data
  const jobs = [
    {
      id: 1,
      jobNumber: 'JOB-2024-001',
      customer: 'John Smith',
      address: '123 Main St, Anytown, USA',
      type: 'HVAC Maintenance',
      scheduledTime: '10:00 AM',
      status: 'completed',
      priority: 'normal',
      estimatedDuration: '2 hours',
      description: 'Annual maintenance check for residential HVAC system'
    },
    {
      id: 2,
      jobNumber: 'JOB-2024-002',
      customer: 'Sarah Williams',
      address: '456 Oak Ave, Anytown, USA',
      type: 'Electrical Repair',
      scheduledTime: '2:00 PM',
      status: 'scheduled',
      priority: 'high',
      estimatedDuration: '1.5 hours',
      description: 'Outlet repair and electrical safety inspection'
    },
    {
      id: 3,
      jobNumber: 'JOB-2024-003',
      customer: 'Robert Brown',
      address: '789 Pine Rd, Anytown, USA',
      type: 'Plumbing Installation',
      scheduledTime: '9:00 AM',
      status: 'in_progress',
      priority: 'normal',
      estimatedDuration: '3 hours',
      description: 'Kitchen sink installation and plumbing connection'
    },
    {
      id: 4,
      jobNumber: 'JOB-2024-004',
      customer: 'Lisa Davis',
      address: '321 Elm St, Anytown, USA',
      type: 'General Maintenance',
      scheduledTime: '11:00 AM',
      status: 'scheduled',
      priority: 'low',
      estimatedDuration: '1 hour',
      description: 'General home maintenance and inspection'
    }
  ];

  const statusFilters = ['all', 'scheduled', 'in_progress', 'completed', 'cancelled'];

  const filteredJobs = selectedStatus === 'all' 
    ? jobs 
    : jobs.filter(job => job.status === selectedStatus);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
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
      case 'cancelled':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#EF4444';
      case 'normal':
        return '#F59E0B';
      case 'low':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  const renderJobItem = ({ item }) => (
    <TouchableOpacity
      style={styles.jobItem}
      onPress={() => navigation.navigate('JobDetail', { job: item })}
    >
      <Card style={styles.jobCard}>
        <Card.Content>
          <View style={styles.jobHeader}>
            <Title style={styles.jobNumber}>{item.jobNumber}</Title>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Chip
                mode="outlined"
                style={[styles.statusChip, { borderColor: getStatusColor(item.status) }]}
                textStyle={{ color: getStatusColor(item.status), fontSize: 12 }}
              >
                {item.status.replace('_', ' ').toUpperCase()}
              </Chip>
              {item.priority === 'high' && (
                <Chip
                  mode="outlined"
                  style={[styles.priorityChip, { borderColor: getPriorityColor(item.priority), marginLeft: 4 }]}
                  textStyle={{ color: getPriorityColor(item.priority), fontSize: 10 }}
                >
                  HIGH
                </Chip>
              )}
            </View>
          </View>

          <Text style={styles.customerName}>{item.customer}</Text>
          <Text style={styles.jobAddress}>{item.address}</Text>
          <Text style={styles.jobType}>{item.type}</Text>
          <Text style={styles.jobDescription}>{item.description}</Text>

          <View style={styles.jobFooter}>
            <Text style={styles.scheduledTime}>
              {item.scheduledTime} • {item.estimatedDuration}
            </Text>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Status Filter */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
        >
          {statusFilters.map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterButton,
                selectedStatus === status && styles.filterButtonActive
              ]}
              onPress={() => setSelectedStatus(status)}
            >
              <Text style={[
                styles.filterButtonText,
                selectedStatus === status && styles.filterButtonTextActive
              ]}>
                {status === 'all' ? 'All Jobs' : status.replace('_', ' ').charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Jobs List */}
      <FlatList
        data={filteredJobs}
        renderItem={renderJobItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No jobs found for selected status</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  filterContainer: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  filterScroll: {
    flexDirection: 'row',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  filterButtonActive: {
    backgroundColor: '#3B82F6',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: 'white',
  },
  listContent: {
    padding: 16,
  },
  jobItem: {
    marginBottom: 12,
  },
  jobCard: {
    elevation: 2,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  jobNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
  },
  statusChip: {
    height: 24,
  },
  priorityChip: {
    height: 20,
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
    fontWeight: '500',
  },
  jobDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 8,
    lineHeight: 18,
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  scheduledTime: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default JobsScreen;