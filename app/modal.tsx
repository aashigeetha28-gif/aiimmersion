import { StyleSheet, Text, View } from 'react-native';

export default function Modal() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Modal</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0a1f0e' },
  text: { color: '#4ade80', fontSize: 18 },
});