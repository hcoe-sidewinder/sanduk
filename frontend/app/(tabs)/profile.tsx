import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
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

const calculateAge = (dob: string): number => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const Profile = () => {
  const router = useRouter();
  const user = {
    name: "Aayush Shrestha",
    relation: "Son",
    dob: "2002-05-18",
    sex: "Male",
    isAdmin: true,
    bloodGroup: "A+",
    allergies: ["Peanuts", "Dust"],
    profileImage: "https://placekitten.com/200/200",
    reportsCount: 12,
    upcomingCheckup: "2025-07-12",
    hereditaryRisks: ["Diabetes", "Hypertension"],
  };

  const age = calculateAge(user.dob);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.coverBg} />
      <View style={styles.profileSection}>
        <Image source={{ uri: user.profileImage }} style={styles.avatar} />

        <View style={styles.headerText}>
          <Text style={styles.userName}>{user.name}</Text>
          {user.isAdmin && <Text style={styles.adminBadge}>Family Admin</Text>}
          <Text style={styles.relation}>{user.relation}</Text>
        </View>

        <TouchableOpacity
          onPress={() => alert("Edit profile")}
          style={styles.editBtn}
        >
          <MaterialIcons name="edit" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* user info */}
      <View style={styles.infoCard}>
        <InfoLabel label="Age" value={`${age} years`} />
        <InfoLabel label="Sex" value={user.sex} />
        <InfoLabel label="Blood Group" value={user.bloodGroup} />
        <InfoLabel label="Allergies" value={user.allergies.join(", ")} />
      </View>

      <View style={styles.summaryRow}>
        <SummaryCard
          label="Reports Scanned"
          value={user.reportsCount}
          bgColor={COLORS.primary}
        />
        <SummaryCard
          label="Upcoming Checkup"
          value={user.upcomingCheckup}
          bgColor={COLORS.accent}
        />
      </View>

      {/* heriditary */}
      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>Hereditary Risks</Text>
        {user.hereditaryRisks.map((risk, idx) => (
          <Text key={idx} style={styles.bulletText}>
            • {risk}
          </Text>
        ))}
      </View>

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={() => alert("Surgical History coming soon")}
        >
          <Text style={styles.primaryButtonText}>Surgical History</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => alert("Vaccination History coming soon")}
        >
          <Text style={styles.secondaryButtonText}>Vaccination History</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.switchButton]}
          onPress={() => alert("Profile switcher coming soon")}
        >
          <MaterialIcons
            name="switch-account"
            size={20}
            color={COLORS.secondary}
          />
          <Text style={styles.switchText}>Switch Profile</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const InfoLabel = ({ label, value }: { label: string; value: string }) => (
  <Text style={styles.infoText}>
    <Text style={styles.infoLabel}>{label}: </Text>
    {value}
  </Text>
);

const SummaryCard = ({
  label,
  value,
  bgColor,
}: {
  label: string;
  value: string | number;
  bgColor: string;
}) => (
  <View style={[styles.summaryCard, { backgroundColor: bgColor }]}>
    <Text style={styles.summaryLabel}>{label}</Text>
    <Text style={styles.summaryValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  coverBg: {
    height: 120,
    backgroundColor: COLORS.cover,
    width: "100%",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: -30,
    marginBottom: 24,
    position: "relative",
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 4,
    borderColor: "#fff",
    backgroundColor: COLORS.accent,
  },
  headerText: {
    marginLeft: 5,
    marginTop: 22,
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.secondary,
  },
  adminBadge: {
    marginTop: 1,
    fontSize: 12,
    fontWeight: "600",
    color: "#d46504",
    // backgroundColor: COLORS.secondary,
    paddingVertical: 2,
    alignSelf: "flex-start",
  },
  relation: {
    color: COLORS.accent,
    marginTop: 1,
  },
  editBtn: {
    backgroundColor: COLORS.secondary,
    padding: 8,
    borderRadius: 24,
  },
  infoCard: {
    backgroundColor: COLORS.lightBg,
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    marginHorizontal: 16,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 8,
    color: COLORS.textSecondary,
  },
  infoLabel: {
    fontWeight: "600",
    color: COLORS.secondary,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  summaryCard: {
    padding: 16,
    borderRadius: 16,
    width: "48%",
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.secondary,
    marginBottom: 8,
  },
  bulletText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  buttonGroup: {
    marginBottom: 60,
    gap: 12,
    paddingHorizontal: 16,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: COLORS.secondary,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: COLORS.primary,
  },
  secondaryButtonText: {
    color: COLORS.textPrimary,
    fontWeight: "600",
  },
  switchButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.accent,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  switchText: {
    color: COLORS.secondary,
    fontSize: 16,
  },
});

export default Profile;
