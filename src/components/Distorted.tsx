import React, { useRef, useEffect } from "react";
import { Animated, Text, StyleSheet } from "react-native";

interface DistortedTextProps {
  text?: string;
  fontSize?: number;
}

export default function DistortedText({ text = "", fontSize = 16 }: DistortedTextProps) {
  const pinkOpacity = useRef(new Animated.Value(1)).current;
  const blueOpacity = useRef(new Animated.Value(1)).current;
  const greenOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const createFlicker = (animatedValue: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animatedValue, { toValue: 0, duration: 1200, useNativeDriver: true }),
          Animated.timing(animatedValue, { toValue: 1, duration: 1200, useNativeDriver: true }),
        ])
      ).start();
    };

    createFlicker(pinkOpacity, 0);
    createFlicker(blueOpacity, 400);
    createFlicker(greenOpacity, 800);
  }, []);

  return (
    <Text style={[styles.base, { fontSize }]}>
      <Animated.Text
        style={[
          styles.layer,
          { fontSize, color: "#fab3beff", transform: [{ translateX: -1 }, { translateY: -1 }], opacity: pinkOpacity },
        ]}
      >
        {text}
      </Animated.Text>
      <Animated.Text
        style={[
          styles.layer,
          { fontSize, color: "#f8f192ff", transform: [{ translateX: 1 }, { translateY: 0.5 }], opacity: blueOpacity },
        ]}
      >
        {text}
      </Animated.Text>
      <Animated.Text
        style={[
          styles.layer,
          { fontSize, color: "#afdfa1ff", transform: [{ translateX: 0.5 }, { translateY: 1 }], opacity: greenOpacity },
        ]}
      >
        {text}
      </Animated.Text>
      <Text style={{ fontSize, color: "#8494faff" }}>{text}</Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    fontWeight: "bold",
    position: "relative",
  },
  layer: {
    position: "absolute",
  },
});
