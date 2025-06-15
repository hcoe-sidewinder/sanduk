import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  const COLORS = {
    primary: "#bcc4f3",
    secondary: "#6368ba",
    accent: "#b4b8cb",
    lightBg: "#f4f5ff",
    textPrimary: "#2e3171",
    textSecondary: "#4b4e6d",
    cover: "#e0e3ff",
  };
  return (
    <Tabs
      initialRouteName="index"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName = "ellipse";

          switch (route.name) {
            case "scan":
              iconName = "scan-outline";
              break;
            case "prediction":
              iconName = "analytics-outline";
              break;
            case "home":
              iconName = "grid-outline";
              break;
            case "report":
              iconName = "document-text-outline";
              break;
            case "profile":
              iconName = "person-outline";
              break;
          }
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.lightBg,
        tabBarInactiveTintColor: COLORS.textPrimary,
        tabBarStyle: {
          backgroundColor: COLORS.secondary,
          borderTopColor: COLORS.secondary,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      })}
    >
      <Tabs.Screen name="scan" options={{ title: "Scan" }} />
      <Tabs.Screen name="prediction" options={{ title: "Prediction" }} />
      <Tabs.Screen name="home" options={{ title: "Dashboard" }} />
      <Tabs.Screen name="report" options={{ title: "Report" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="newMem"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="addInformation"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
