import React, { useEffect, useState } from "react";
import { ScrollView, Text, StyleSheet, TouchableOpacity } from "react-native";
import DataTimeline from "@/components/DataTimeline";
import mockTimelineData from "@/constants/MockTimelineData";
import { familyTreeData } from "@/constants/MockFamilyTreeData";
import { SafeAreaView } from "react-native-safe-area-context";
import FamilyTree from "@/components/HereditaryTree";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

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
  const [auth, setAuth] = useState();
  useEffect(() => {
    const getAuth = async () => {
      const data = await getData("auth");
      console.log(data);
      if (!data) {
        router.replace("/login");
      }
      setAuth(data);
    };
    getAuth();
  }, [auth]);

  const handleClear = async () => {
    await clearAsyncStorage();
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <TouchableOpacity onPress={handleClear} className="bg-red-600">
          <Text>Clear storage</Text>
        </TouchableOpacity>
        <Text style={styles.header}>Family Health Timeline</Text>
        {mockTimelineData.map((member) => (
          <DataTimeline key={member.memberId} member={member} />
        ))}
      </ScrollView>
      <SafeAreaView style={styles.container}>
        <FamilyTree data={familyTreeData} />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 50, paddingHorizontal: 20 },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
});

export default HomeScreen;
