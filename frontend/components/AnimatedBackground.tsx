"use client";

import type React from "react";
import { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Dimensions, Easing } from "react-native";

const { width, height } = Dimensions.get("window");

interface AnimatedBackgroundProps {
  children?: React.ReactNode;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  children,
}) => {
  const blob1Position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const blob2Position = useRef(
    new Animated.ValueXY({ x: width, y: height / 2 })
  ).current;
  const blob3Position = useRef(
    new Animated.ValueXY({ x: width / 2, y: height })
  ).current;

  const blob1Scale = useRef(new Animated.Value(1)).current;
  const blob2Scale = useRef(new Animated.Value(0.8)).current;
  const blob3Scale = useRef(new Animated.Value(1.2)).current;

  const colors = {
    primary: "#bcc4f3",
    secondary: "#6368ba",
    accent: "#b4b8cb",
  };

  useEffect(() => {
    // Animation for blob 1
    const animateBlob1 = () => {
      Animated.parallel([
        Animated.timing(blob1Position, {
          toValue: {
            x: Math.random() * width * 0.8,
            y: Math.random() * height * 0.8,
          },
          duration: 15000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.sequence([
          Animated.timing(blob1Scale, {
            toValue: 1.3,
            duration: 7500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(blob1Scale, {
            toValue: 1,
            duration: 7500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
        ]),
      ]).start(() => animateBlob1());
    };

    const animateBlob2 = () => {
      Animated.parallel([
        Animated.timing(blob2Position, {
          toValue: {
            x: Math.random() * width * 0.7,
            y: Math.random() * height * 0.7,
          },
          duration: 18000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.sequence([
          Animated.timing(blob2Scale, {
            toValue: 1.1,
            duration: 9000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(blob2Scale, {
            toValue: 0.8,
            duration: 9000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
        ]),
      ]).start(() => animateBlob2());
    };

    const animateBlob3 = () => {
      Animated.parallel([
        Animated.timing(blob3Position, {
          toValue: {
            x: Math.random() * width * 0.8,
            y: Math.random() * height * 0.8,
          },
          duration: 20000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.sequence([
          Animated.timing(blob3Scale, {
            toValue: 0.9,
            duration: 10000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(blob3Scale, {
            toValue: 1.2,
            duration: 10000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
        ]),
      ]).start(() => animateBlob3());
    };

    animateBlob1();
    animateBlob2();
    animateBlob3();
  }, [
    blob1Position,
    blob1Scale,
    blob2Position,
    blob2Scale,
    blob3Position,
    blob3Scale,
  ]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.blob,
          {
            backgroundColor: colors.primary,
            left: blob1Position.x,
            top: blob1Position.y,
            transform: [{ scale: blob1Scale }],
            opacity: 0.4,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.blob,
          {
            backgroundColor: colors.secondary,
            left: blob2Position.x,
            top: blob2Position.y,
            transform: [{ scale: blob2Scale }],
            opacity: 0.3,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.blob,
          {
            backgroundColor: colors.accent,
            left: blob3Position.x,
            top: blob3Position.y,
            transform: [{ scale: blob3Scale }],
            opacity: 0.25,
          },
        ]}
      />

      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  blob: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    zIndex: -1,
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
});

export default AnimatedBackground;
