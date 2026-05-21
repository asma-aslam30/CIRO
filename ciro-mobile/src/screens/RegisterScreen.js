import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView 
} from 'react-native';
import { authAPI } from '../lib/api';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  FadeInDown, 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming 
} from 'react-native-reanimated';
import { ShieldCheck, Eye, EyeOff } from 'lucide-react-native';
import { theme } from '../lib/theme';

export default function RegisterScreen({ navigation, route }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Scanline animation matching the web app
  const scanLinePos = useSharedValue(0);

  useEffect(() => {
    scanLinePos.value = withRepeat(
      withTiming(1, { duration: 4000 }),
      -1,
      false
    );
  }, []);

  const scanLineStyle = useAnimatedStyle(() => ({
    top: `${scanLinePos.value * 100}%`,
    opacity: scanLinePos.value < 0.05 || scanLinePos.value > 0.95 ? 0 : 0.6,
  }));

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all authorization fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Credentials mismatched: Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await authAPI.register(email, password);
      if (route.params?.onLogin) {
        route.params.onLogin();
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Operator registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient 
      colors={[theme.colors.bgDark, theme.colors.bgDarkSecondary, theme.colors.bgDark]} 
      style={styles.container}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.duration(800)} style={styles.glassCard}>
            {/* Scanline element */}
            <Animated.View style={[styles.scanLine, scanLineStyle]} />

            {/* Shield Check logo */}
            <View style={styles.logoContainer}>
              <ShieldCheck color={theme.colors.accent} size={48} style={styles.logoIcon} />
            </View>

            <Text style={styles.title}>
              OPERATOR <Text style={styles.neonText}>SIGNUP</Text>
            </Text>
            <Text style={styles.subtitle}>Register Field Terminal</Text>

            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>[ERR] {error.toUpperCase()}</Text>
              </View>
            ) : null}

            {/* Email Field */}
            <Text style={styles.fieldLabel}>GATEWAY LOGICAL EMAIL</Text>
            <TextInput
              style={[
                styles.input,
                focusedField === 'email' && styles.inputFocused
              ]}
              placeholder="operator@ciro.nexus"
              placeholderTextColor={theme.colors.dim}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
            />

            {/* Password Field */}
            <Text style={styles.fieldLabel}>SECURE AUTH PASSPHRASE</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[
                  styles.input,
                  { flex: 1, marginBottom: 0 },
                  focusedField === 'password' && styles.inputFocused
                ]}
                placeholder="••••••••••••"
                placeholderTextColor={theme.colors.dim}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
              />
              <TouchableOpacity 
                style={styles.eyeButton} 
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff color={theme.colors.primary} size={20} />
                ) : (
                  <Eye color={theme.colors.primary} size={20} />
                )}
              </TouchableOpacity>
            </View>

            {/* Confirm Password Field */}
            <Text style={styles.fieldLabel}>CONFIRM SECURE PASSPHRASE</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[
                  styles.input,
                  { flex: 1, marginBottom: 0 },
                  focusedField === 'confirmPassword' && styles.inputFocused
                ]}
                placeholder="••••••••••••"
                placeholderTextColor={theme.colors.dim}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                onFocus={() => setFocusedField('confirmPassword')}
                onBlur={() => setFocusedField(null)}
              />
              <TouchableOpacity 
                style={styles.eyeButton} 
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff color={theme.colors.primary} size={20} />
                ) : (
                  <Eye color={theme.colors.primary} size={20} />
                )}
              </TouchableOpacity>
            </View>

            {/* Authenticate Button */}
            <TouchableOpacity 
              onPress={handleRegister} 
              disabled={loading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={loading ? [theme.colors.dim, theme.colors.dim] : [theme.colors.accent, theme.colors.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
              >
                {loading ? (
                  <ActivityIndicator color={theme.colors.bgDark} />
                ) : (
                  <Text style={styles.buttonText}>PROVISION OPERATOR</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.linkButton} 
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.linkText}>
                Already registered? <Text style={styles.linkTextBold}>Operator login</Text>
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  glassCard: {
    ...theme.glass,
    backgroundColor: 'rgba(5, 5, 15, 0.75)',
    padding: 30,
    overflow: 'hidden',
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: theme.colors.accent,
    shadowColor: theme.colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 3,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  logoIcon: {
    shadowColor: theme.colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },
  title: {
    color: '#ffffff',
    fontFamily: theme.fonts.bold,
    fontSize: 28,
    textAlign: 'center',
    letterSpacing: 3,
    marginBottom: 4,
  },
  neonText: {
    color: theme.colors.accent,
    textShadowColor: 'rgba(176, 38, 255, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    color: theme.colors.dim,
    fontFamily: theme.fonts.semibold,
    fontSize: 11,
    textAlign: 'center',
    letterSpacing: 3,
    marginBottom: 30,
    textTransform: 'uppercase',
  },
  fieldLabel: {
    color: theme.colors.dim,
    fontFamily: theme.fonts.semibold,
    fontSize: 10,
    letterSpacing: 2,
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: 8,
    color: theme.colors.text,
    padding: 14,
    fontFamily: theme.fonts.semibold,
    fontSize: 14,
    marginBottom: 18,
  },
  inputFocused: {
    borderColor: theme.colors.accent,
    shadowColor: theme.colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 18,
    paddingRight: 10,
  },
  eyeButton: {
    padding: 10,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
    shadowColor: theme.colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: theme.colors.bgDark,
    fontFamily: theme.fonts.bold,
    fontSize: 14,
    letterSpacing: 2,
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 0, 60, 0.1)',
    borderColor: theme.colors.alert,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  errorText: {
    color: theme.colors.alert,
    fontFamily: theme.fonts.semibold,
    fontSize: 11,
    textAlign: 'center',
    letterSpacing: 1,
  },
  linkButton: {
    marginTop: 25,
    alignItems: 'center',
  },
  linkText: {
    color: theme.colors.dim,
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    letterSpacing: 0.5,
  },
  linkTextBold: {
    color: theme.colors.accent,
    fontFamily: theme.fonts.semibold,
  }
});
