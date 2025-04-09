import React, { useEffect, useState, useRef } from 'react';
import { Animated, StyleSheet, Image, Easing, ViewStyle } from 'react-native';
import { useAnimatedStyle } from '../hook/useAnimatedStyle';

const styles = StyleSheet.create({
  border: {
    position: 'absolute',
  },
  asset: {
    width: 80,
    height: 80,
  },
});

function timedLinearEasing(value: Animated.Value, toValue: number, duration: number = 100) {
  return Animated.timing(value, {
    toValue,
    duration,
    useNativeDriver: true,
    easing: Easing.linear,
  });
}

function timedOpacity(value: Animated.Value, toValue: number, duration: number = 100) {
  return Animated.timing(value, {
    toValue,
    duration,
    useNativeDriver: true,
    easing: Easing.linear,
  });
}
type Props = {
  style?: ViewStyle;
};

const outputRanges = [
  ['-90deg', '-90deg'],
  ['-90deg', '-180deg'],
  ['-90deg', '-270deg'],
  ['-90deg', '-360deg'],
];

function rotationStyler(driver: Animated.Value) {
  return outputRanges.map(outputRange =>
    driver.interpolate({
      inputRange: [0, 360],
      outputRange,
    }),
  );
}

export function TurnTimer({ style }: Props) {
  const [arcRotationsZ, rotateAnim] = useAnimatedStyle(0, rotationStyler);
  const opacityRef = useRef(new Animated.Value(0));

  useEffect(() => {
    Animated.parallel([
      timedOpacity(opacityRef.current, 1, 200),
      timedLinearEasing(rotateAnim, 360, 2000)
    ]).start()
  }, []);


  return (
    <Animated.View style={{ opacity: opacityRef.current, position: 'absolute', ...style }}>
      {arcRotationsZ.map((rotateZ, idx) => {
        return (
          <Animated.View style={[styles.border, { transform: [{ rotateZ }] }]} key={idx}>
            <Image source={require('@/assets/images/timerBorderArc.png')} style={styles.asset} />
          </Animated.View>
        );
      })}
    </Animated.View>
  );
}
