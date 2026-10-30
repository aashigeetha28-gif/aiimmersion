import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Dimensions, Image, StyleSheet, Text, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Logo fade in + scale animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    // 5 seconds கழிச்சு main screen போகும்
    const timer = setTimeout(() => {
      router.replace('/(tabs)');
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Logo Animation */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
          alignItems: 'center',
        }}>
        
        {/* உங்கள் Logo */}
        <Image
          source={require('@/assets/icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* App Name */}
        <Text style={styles.appName}>AgriSmart</Text>

        {/* Tagline */}
        <Text style={styles.tagline}>Smart Farming, Better Future 🌱</Text>

      </Animated.View>

      {/* Bottom Text */}
      <Text style={styles.bottomText}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D2B1A',
    alignItems: 'center',
    justifyContent: 'center',
    width: width,
    height: height,
  },
  logo: {
    width: 160,
    height: 160,
    marginBottom: 24,
  },
  appName: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 3,
    marginBottom: 10,
  },
  tagline: {
    fontSize: 16,
    color: '#A8D5A2',
    textAlign: 'center',
    paddingHorizontal: 40,
    marginBottom: 10,
  },
  bottomText: {
    position: 'absolute',
    bottom: 40,
    fontSize: 13,
    color: '#A8D5A2',
    letterSpacing: 1,
  },
});