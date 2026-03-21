import React, { useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  Easing,
  FadeIn
} from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function AnimatedSplashScreen() {
  const pulseScale = useSharedValue(1);
  const opacity = useSharedValue(0.5);
  const progress = useSharedValue(0);

  useEffect(() => {
    // Pulse Animation for Logo
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    
    // Pulse Glow
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000 }),
        withTiming(0.4, { duration: 1000 })
      ),
      -1,
      true
    );

    // Infinite Progress Bar
    progress.value = withRepeat(
      withSequence(
        withTiming(100, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 0 }) // instant reset
      ),
      -1
    );
  }, []);

  const animatedLogoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const animatedGlowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value * 1.5 }],
    opacity: opacity.value * 0.25,
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
    left: `${progress.value - 100}%` // Creates a sliding right effect
  }));

  return (
    <View style={styles.container}>
      <View style={styles.backgroundBlobSecondary} />
      <View style={styles.backgroundBlobPrimary} />
      
      <Animated.View style={[styles.glow, animatedGlowStyle]} />
      
      <Animated.View style={[styles.logoContainer, animatedLogoStyle]}>
        <MaterialCommunityIcons name="moped" size={80} color="#0A8754" />
      </Animated.View>

      <Animated.View entering={FadeIn.delay(300).duration(800)} style={styles.textContainer}>
        <Text style={styles.brandName}>Partner Hub</Text>
        <Text style={styles.tagline}>Anusha Bazaar Delivery</Text>
      </Animated.View>
      
      <Animated.View entering={FadeIn.delay(600).duration(800)} style={styles.loaderContainer}>
         <View style={styles.loaderBar}>
            <Animated.View style={[styles.loaderProgress, progressStyle]} />
         </View>
         <Text style={styles.loadingText}>Authenticating Secure Session...</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundBlobPrimary: {
    position: "absolute",
    top: -150,
    right: -100,
    width: 450,
    height: 450,
    borderRadius: 225,
    backgroundColor: "#E2F2E9",
    opacity: 0.9,
  },
  backgroundBlobSecondary: {
    position: "absolute",
    bottom: -200,
    left: -150,
    width: 600,
    height: 600,
    borderRadius: 300,
    backgroundColor: "#FEF9C3",
    opacity: 0.4,
  },
  glow: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#0A8754",
  },
  logoContainer: {
    width: 140,
    height: 140,
    borderRadius: 45,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 20,
    shadowColor: "#0A8754",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 35,
    marginBottom: 40,
    zIndex: 10,
    borderWidth: 1,
    borderColor: "rgba(10,135,84,0.05)"
  },
  textContainer: {
    alignItems: "center",
  },
  brandName: {
    fontSize: 38,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: -1.2,
  },
  tagline: {
    fontSize: 15,
    color: "#64748B",
    marginTop: 8,
    fontWeight: "800",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  loaderContainer: {
    position: "absolute",
    bottom: 80,
    width: width * 0.55,
    alignItems: "center",
  },
  loaderBar: {
    width: "100%",
    height: 6,
    backgroundColor: "#E2E8F0",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 16,
  },
  loaderProgress: {
    height: "100%",
    backgroundColor: "#0A8754",
    borderRadius: 3,
  },
  loadingText: {
    color: "#94A3B8",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase"
  }
});
