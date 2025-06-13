// import { Image } from "expo-image";
// import { useRouter } from "expo-router";
// import { useEffect } from "react";
// import { Platform, StyleSheet, Text, View } from "react-native";

// export default function HomeScreen() {
//   const router = useRouter();

//   useEffect(() => {
//     router.replace("/"); // redirects to login screen immediately
//   }, []);

//   // return null;
//   // return (
//   //   <View>
//   //     <Text>Welcomet</Text>
//   //   </View>
//   // );
// }

// const styles = StyleSheet.create({
//   titleContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//   },
//   stepContainer: {
//     gap: 8,
//     marginBottom: 8,
//   },
//   reactLogo: {
//     height: 178,
//     width: 290,
//     bottom: 0,
//     left: 0,
//     position: "absolute",
//   },
// });
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";

export default function Index() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100); // small delay ensures layout mounts

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isReady) {
      router.replace("/login");
    }
  }, [isReady]);

  return (
    <View>
      <Text>Redirecting...</Text>
    </View>
  );
}

// import { View, Text, StyleSheet } from "react-native";

// export default function Dashboard() {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Welcome to the Dashboard</Text>
//       {/* You can add more components here like stats, charts, buttons, etc. */}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 16,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//   },
// });
