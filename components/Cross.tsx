import React from 'react'
import { View } from 'react-native';

export default function Cross() {
  return (
    <>
      <View style={{ position: 'absolute', backgroundColor: 'black', width: 5, height: 100, borderRadius: 100, transform: [{ rotate: '40deg' }] }} />
      <View style={{ position: 'absolute', backgroundColor: 'black', width: 5, height: 100, borderRadius: 100, transform: [{ rotate: '-40deg' }] }} />
    </>
  )
}
