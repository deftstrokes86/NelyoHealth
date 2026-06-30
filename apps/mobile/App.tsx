import { SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text accessibilityRole="header" style={styles.heading}>
          NelyoHealth Mobile Shell
        </Text>
        <Text style={styles.body}>
          Synthetic-only empty Expo shell for P02-ISS-013. No native feature parity claim.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5fbf8"
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    gap: 12
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: "#10362f",
    textAlign: "center"
  },
  body: {
    fontSize: 16,
    lineHeight: 22,
    color: "#2e4e48",
    textAlign: "center"
  }
});
