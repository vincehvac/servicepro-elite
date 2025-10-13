import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, Title, Button } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';

const ProfileScreen = () => {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Profile</Title>
          <Text>{user?.firstName} {user?.lastName}</Text>
          <Text>{user?.role}</Text>
        </Card.Content>
      </Card>
      <Button mode="contained" onPress={logout} style={styles.logoutButton}>
        Logout
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f3f4f6',
  },
  card: {
    elevation: 2,
    marginBottom: 16,
  },
  logoutButton: {
    marginTop: 16,
  },
});

export default ProfileScreen;