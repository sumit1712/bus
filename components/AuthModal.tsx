import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { 
  Text, 
  TextInput, 
  Button, 
  SegmentedButtons, 
  useTheme,
  HelperText 
} from 'react-native-paper';
import { useAuth } from '@/context/AuthContext';

interface AuthModalProps {
  onClose?: () => void;
}

export default function AuthModal({ onClose }: AuthModalProps) {
  const theme = useTheme();
  const { login, signup, isLoading } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (mode === 'signup') {
      if (!form.name) {
        newErrors.name = 'Name is required';
      }
      if (!form.phone) {
        newErrors.phone = 'Phone is required';
      } else if (!/^\+?[\d\s-()]+$/.test(form.phone)) {
        newErrors.phone = 'Invalid phone format';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        await signup(form.name, form.email, form.password, form.phone);
      }
      onClose?.();
    } catch (error) {
      setErrors({ general: 'Authentication failed. Please try again.' });
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onBackground }]}>
        Welcome to SwiftBus
      </Text>

      <SegmentedButtons
        value={mode}
        onValueChange={(value) => setMode(value as 'login' | 'signup')}
        buttons={[
          { value: 'login', label: 'Login' },
          { value: 'signup', label: 'Sign Up' },
        ]}
        style={styles.segmentedButtons}
      />

      {errors.general && (
        <HelperText type="error" visible>
          {errors.general}
        </HelperText>
      )}

      {mode === 'signup' && (
        <>
          <TextInput
            label="Full Name"
            value={form.name}
            onChangeText={(text) => {
              setForm(prev => ({ ...prev, name: text }));
              if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
            }}
            mode="outlined"
            style={styles.input}
            error={!!errors.name}
          />
          <HelperText type="error" visible={!!errors.name}>
            {errors.name}
          </HelperText>
        </>
      )}

      <TextInput
        label="Email"
        value={form.email}
        onChangeText={(text) => {
          setForm(prev => ({ ...prev, email: text }));
          if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
        }}
        mode="outlined"
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        error={!!errors.email}
      />
      <HelperText type="error" visible={!!errors.email}>
        {errors.email}
      </HelperText>

      <TextInput
        label="Password"
        value={form.password}
        onChangeText={(text) => {
          setForm(prev => ({ ...prev, password: text }));
          if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
        }}
        mode="outlined"
        style={styles.input}
        secureTextEntry
        error={!!errors.password}
      />
      <HelperText type="error" visible={!!errors.password}>
        {errors.password}
      </HelperText>

      {mode === 'signup' && (
        <>
          <TextInput
            label="Phone Number"
            value={form.phone}
            onChangeText={(text) => {
              setForm(prev => ({ ...prev, phone: text }));
              if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
            }}
            mode="outlined"
            style={styles.input}
            keyboardType="phone-pad"
            error={!!errors.phone}
          />
          <HelperText type="error" visible={!!errors.phone}>
            {errors.phone}
          </HelperText>
        </>
      )}

      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={isLoading}
        style={styles.submitButton}
      >
        {mode === 'login' ? 'Login' : 'Sign Up'}
      </Button>

      {mode === 'login' && (
        <Button
          mode="text"
          onPress={() => {}}
          style={styles.forgotPassword}
        >
          Forgot Password?
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: 'bold',
  },
  segmentedButtons: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 4,
  },
  submitButton: {
    marginTop: 16,
    marginBottom: 8,
  },
  forgotPassword: {
    alignSelf: 'center',
  },
});