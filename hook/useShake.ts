import { Animated } from 'react-native';
import { useEffect } from 'react';
import { useNativeDriver } from './constant';
import { useAnimatedStyle } from './useAnimatedStyle';

type DriverType = {
  [key: string]: Animated.Value
}

function createSpring(value: Animated.Value, toValue: number, props?: Object) {
  return Animated.spring(value, {
    toValue,
    tension: 10,
    friction: 4,
    useNativeDriver,
    ...props
  })
}

export async function scaleAndFlip({ rotateY, scaleXY }: DriverType, delay: number = 1500) {
  return new Promise<void>(resolve => {
    Animated.sequence([
      createSpring(rotateY, 180),
      createSpring(scaleXY, 1.3),
      Animated.delay(delay),
    ]).start(res => resolve());
  });
}

export function shake({ rotateZ }: DriverType) {
  return Animated.loop(Animated.sequence([
    Animated.timing(rotateZ, { toValue: 3, duration: 0, useNativeDriver }),
    createSpring(rotateZ, 0, { tension: 150, friction: 1 }),
    Animated.delay(3000),
  ]));
}

const iconStyler = ({ rotateZ, scale }: { [key: string]: Animated.Value }) => {
  return {
    transform: [
      {
        rotateZ: rotateZ.interpolate({
          inputRange: [-1, 0, 1],
          outputRange: ['-7deg', '0deg', '7deg'],
          extrapolate: 'extend',
        }),
      },
      { scale },
    ],
  };
};

export function useShake(condition: boolean = true) {
  const [iconStyles, iconDriver] = useAnimatedStyle({ rotateZ: 0, scale: 1 }, iconStyler);

  useEffect(() => {
    if (condition) {
      shake(iconDriver);
    }
  }, [condition]);

  return { iconStyles };
}
