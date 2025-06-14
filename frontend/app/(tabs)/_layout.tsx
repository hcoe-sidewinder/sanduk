import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
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
            case "dashboard":
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
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "gray",
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
    </Tabs>
  );
}
