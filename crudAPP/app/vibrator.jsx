
import React from 'react'
import { View, Button, Vibration, StyleSheet } from 'react-native';
export default function App() {
  const handleVibrate = () => {
    // Trigger a vibration
    Vibration.vibrate(1000);
  };

  return (
    <View style={styles.container}>
      <Button title="Vibrate" onPress={handleVibrate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

