import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image
} from 'react-native';
import { Button, Card, Title } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    
    try {
      const result = await login(email, password);
      
      if (result.success) {
        Alert.alert('Success', 'Login successful!');
      } else {
        Alert.alert('Login Failed', result.error);
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = (role) => {
    const demoCredentials = {
      admin: { email: 'admin@servicepro.com', password: 'password123' },
      technician: { email: 'tech@servicepro.com', password: 'password123' },
      dispatcher: { email: 'dispatcher@servicepro.com', password: 'password123' }
    };

    const creds = demoCredentials[role];
    setEmail(creds.email);
    setPassword(creds.password);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>SP</Text>
          </View>
          <Title style={styles.title}>ServicePro Elite</Title>
          <Text style={styles.subtitle}>Field Service Management</Text>
        </View>

        <Card style={styles.loginCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>Technician Login</Title>
            
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />

            <Button
              mode="contained"
              onPress={handleLogin}
              loading={loading}
              style={styles.loginButton}
              contentStyle={styles.buttonContent}
            >
              Login
            </Button>

            <View style={styles.demoContainer}>
              <Text style={styles.demoTitle}>Demo Login:</Text>
              <View style={styles.demoButtons}>
                <Button
                  mode="outlined"
                  onPress={() => demoLogin('technician')}
                  style={styles.demoButton}
                  compact
                >
                  Tech
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => demoLogin('dispatcher')}
                  style={styles.demoButton}
                  compact
                >
                  Dispatcher
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => demoLogin('admin')}
                  style={styles.demoButton}
                  compact
                >
                  Admin
                </Button>
              </View>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  loginCard: {
    marginHorizontal: 10,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: 'white',
  },
  loginButton: {
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: '#3B82F6',
    borderRadius: 8,
  },
  buttonContent: {
    height: 50,
  },
  demoContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 10,
    textAlign: 'center',
  },
  demoButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  demoButton: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default LoginScreen;