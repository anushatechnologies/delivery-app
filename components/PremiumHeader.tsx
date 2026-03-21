import React from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions, 
  Platform 
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Animated, { FadeIn } from "react-native-reanimated";

const { width } = Dimensions.get("window");

interface PremiumHeaderProps {
  title: string;
  showBack?: boolean;
  rightContent?: React.ReactNode;
  subtitle?: string;
  transparent?: boolean;
}

export default function PremiumHeader({ 
  title, 
  showBack = false, 
  rightContent, 
  subtitle,
  transparent = false 
}: PremiumHeaderProps) {
  const router = useRouter();

  const HeaderContent = (
    <View style={styles.contentWrap}>
      <View style={styles.leftSection}>
        {showBack && (
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.iconBtn}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="#0F172A" />
          </TouchableOpacity>
        )}
        <View style={[styles.titleWrap, showBack && { marginLeft: 12 }]}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>

      <View style={styles.rightSection}>
        {rightContent}
      </View>
    </View>
  );

  if (transparent) {
    return (
      <View style={styles.containerTransparent}>
        {HeaderContent}
      </View>
    );
  }

  return (
    <Animated.View entering={FadeIn} style={styles.container}>
      {/* Subtle Shadow/Border */}
      <View style={styles.shadowLayer} />
      {HeaderContent}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width,
    height: 80,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    zIndex: 100,
  },
  containerTransparent: {
    width: width,
    height: 80,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    zIndex: 100,
  },
  shadowLayer: {
    ...StyleSheet.absoluteFillObject,
    borderBottomWidth: 1.5,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  contentWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 0 : 4, // Adjust for status bar if needed, though usually handled by SafeAreaView wrapper
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titleWrap: {
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    marginTop: -2,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
});
