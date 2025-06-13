import React from "react";
import { ScrollView, Text, StyleSheet } from "react-native";
import DataTimeline from "@/components/DataTimeline";
import mockTimelineData from "@/constants/MockTimelineData";
import  {familyTreeData}  from "@/constants/MockFamilyTreeData";
import { SafeAreaView } from "react-native-safe-area-context";
import FamilyTree from "@/components/HereditaryTree";

const HomeScreen: React.FC = () => {
  return (
    <>
      <ScrollView style={styles.container}>
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
