import type React from "react";
import { ScrollView, Text, StyleSheet } from "react-native";
import DataTimeline from "@/components/DataTimeline";
import mockTimelineData from "@/constants/MockTimelineData";
import { familyTreeData } from "@/constants/MockFamilyTreeData";
import { SafeAreaView } from "react-native-safe-area-context";
import FamilyTree from "@/components/HereditaryTree";
import AnimatedBackground from "@/components/AnimatedBackground";

const HomeScreen: React.FC = () => {
  return (
    <AnimatedBackground>
      <ScrollView style={styles.container}>
        <SafeAreaView style={styles.container}>
          <FamilyTree data={familyTreeData} />
        </SafeAreaView>

        <ScrollView style={styles.container}>
          <Text style={styles.header}>Family Health Timeline</Text>
          {mockTimelineData.map((member) => (
            <DataTimeline key={member.memberId} member={member} />
          ))}
        </ScrollView>
      </ScrollView>
    </AnimatedBackground>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 10, paddingHorizontal: 10 },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
});

export default HomeScreen;
