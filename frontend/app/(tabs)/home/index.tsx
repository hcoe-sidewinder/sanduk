"use client";

import type React from "react";
import { useEffect, useState, useRef } from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Animated,
  Dimensions,
} from "react-native";
import { familyTreeData } from "@/constants/MockFamilyTreeData";
import { SafeAreaView } from "react-native-safe-area-context";
import FamilyTree from "@/components/HereditaryTree";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import AnimatedBackground from "@/components/AnimatedBackground";
import Graph from "@/components/graphs";


const { width } = Dimensions.get("window");

const clearAsyncStorage = async () => {
  try {
    await AsyncStorage.clear();
    console.log("AsyncStorage cleared successfully");
  } catch (error) {
    console.error("Error clearing AsyncStorage:", error);
  }
};

const getData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error("Error retrieving data:", error);
    return null;
  }
};

const HomeScreen: React.FC = () => {
  const [auth, setAuth] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  const colors = {
    primary: "#bcc4f3",
    secondary: "#6368ba",
    accent: "#b4b8cb",
    text: "#0f172a",
    textSecondary: "#475569",
    textTertiary: "#64748b",
    surface: "#ffffff",
    surfaceSecondary: "#f8fafc",
  };

  useEffect(() => {
    // const getAuth = async () => {
    // try {
    //   const data = await getData("auth");
    //   if (!data) {
    //     router.replace("/login");
    //     return;
    //   }
    //   setAuth(data);
    // } catch (error) {
    //   console.error("Auth error:", error);
    //   router.replace("/login");
    // } finally {
    //   setIsLoading(false);
    // }
    // };

    // getAuth();

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleAddMemberClick = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.push("./newMem");
    });
  };

  const handleProfilePress = () => {
    console.log("Profile pressed");
  };

  // if (isLoading) {
  //   return (
  //     <AnimatedBackground>
  //       <View style={styles.loadingContainer}>
  //         <Text style={[styles.loadingText, { color: colors.secondary }]}>
  //           Loading...
  //         </Text>
  //       </View>
  //     </AnimatedBackground>
  //   );
  // }

  return (
    <AnimatedBackground>
      <SafeAreaView style={styles.safeArea}>
        <Animated.View
          style={[
            styles.topBar,
            {
              backgroundColor: colors.surface,
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.welcomeSection}>
            <View>
              <TouchableOpacity
                onPress={handleProfilePress}
                style={styles.profileContainer}
              >
                <View
                  style={[
                    styles.profileImageContainer,
                    { backgroundColor: colors.primary + "20" },
                  ]}
                >
                  <Image
                    source={require("@/assets/images/login_image.png")}
                    style={styles.profileImage}
                    resizeMode="cover"
                  />
                  <View
                    style={[
                      styles.onlineIndicator,
                      { backgroundColor: "#10b981" },
                    ]}
                  />
                </View>
              </TouchableOpacity>

              <Text
                style={[styles.welcomeText, { color: colors.textTertiary }]}
              >
                Welcome,
              </Text>
            </View>
            <Text style={[styles.userName, { color: colors.text }]}>
              {auth?.name || auth?.email?.split("@")[0] || "User"}
            </Text>
          </View>

          <View style={styles.actionSection}>
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <TouchableOpacity
                onPress={handleAddMemberClick}
                style={[
                  styles.addButton,
                  { backgroundColor: colors.secondary },
                ]}
              >
                <View style={styles.addButtonContent}>
                  <Text style={styles.addButtonIcon}>👥</Text>
                  <Text style={styles.addButtonText}>Add Members</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Animated.View>
        <br />
        <br />

        <ScrollView
          style={styles.mainContent}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Animated.View
            style={[
              styles.section,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Family Tree
              </Text>
              <Text
                style={[
                  styles.sectionSubtitle,
                  { color: colors.textSecondary },
                ]}
              >
                Your hereditary health network
              </Text>
            </View>
            <FamilyTree data={familyTreeData} />
          </Animated.View>
          <br />
          <br />

          <Animated.View
            style={[
              styles.section,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <View style={styles.timelineContainer}>
              <Animated.View
                style={{
                  opacity: fadeAnim,
                  transform: [
                    {
                      translateY: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [30, 0],
                      }),
                    },
                  ],
                }}
              >
                <Graph />
              </Animated.View>
            </View>
          </Animated.View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </AnimatedBackground>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "600",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  welcomeSection: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 2,
  },
  userName: {
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  actionSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  addButton: {
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
    shadowColor: "#6368ba",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  addButtonIcon: {
    fontSize: 16,
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  profileContainer: {
    position: "relative",
  },
  profileImageContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    padding: 2,
    position: "relative",
  },
  profileImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  mainContent: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  sectionEmoji: {
    fontSize: 20,
  },
  sectionTitleText: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  timelineContainer: {
    paddingHorizontal: 8,
  },
  statsSection: {
    paddingHorizontal: 24,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
});

export default HomeScreen;
