import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const COLORS = {
  primary: "#bcc4f3",
  secondary: "#6368ba",
  accent: "#b4b8cb",
  lightBg: "#f4f5ff",
  textPrimary: "#2e3171",
  textSecondary: "#4b4e6d",
  cover: "#e0e3ff",
};

const Navbar = () => {
  return (
    <View style={styles.navbar}>
      <View>
        <Text style={styles.title}>SANDUK</Text>
        <Text style={styles.subtitle}>a family health vault</Text>
      </View>
      <TouchableOpacity style={styles.iconButton}>
        <MaterialIcons name="notifications-none" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    backgroundColor: COLORS.secondary,
    paddingTop: 48,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "700",
  },
  subtitle: {
    color: COLORS.primary,
    fontSize: 14,
    marginTop: 2,
  },
  iconButton: {
    padding: 6,
  },
});

export default Navbar;
