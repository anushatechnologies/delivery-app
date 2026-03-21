import React from 'react';
import { Pressable, StyleProp, ViewStyle, Platform } from 'react-native';

interface CustomTouchableOpacityProps {
  children?: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  activeOpacity?: number;
  disabled?: boolean;
}

export default function CustomTouchableOpacity({ 
  children, 
  onPress, 
  style, 
  activeOpacity = 0.7,
  disabled = false 
}: CustomTouchableOpacityProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        style,
        { 
          opacity: pressed ? activeOpacity : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }] 
        }
      ]}
    >
      {children}
    </Pressable>
  );
}
