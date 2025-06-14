import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  Animated,
  Dimensions,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { getData } from "./home";
import { api, handleApiError } from "@/api/axiosConfig";

const { height: screenHeight } = Dimensions.get("window");

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

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

interface Vaccination {
  name: string;
  date: string;
}

const Profile = () => {
  const router = useRouter();
  const [surgicalModalVisible, setSurgicalModalVisible] = useState(false);
  const [vaccinationModalVisible, setVaccinationModalVisible] = useState(false);
  const [slideAnim] = useState(new Animated.Value(screenHeight));

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

  // // Sample data for surgical history
  // const surgicalHistory = [
  //   {
  //     name: "Heart Surgery",
  //     date: "2025-06-05T00:00:00.000+00:00",
  //   },
  //   {
  //     name: "Appendectomy",
  //     date: "2021-07-20T00:00:00.000+00:00",
  //   },
  //   {
  //     name: "Knee Replacement",
  //     date: "2020-03-15T00:00:00.000+00:00",
  //   },
  // ];
  const [vaccinationHistory, setVaccinationHistory] = useState<Vaccination[]>(
    []
  );
  const [surgicalHistory, setSurgicalHistory] = useState<Vaccination[]>([]);

  // const vaccinationHistory = [
  //   {
  //     name: "COVID-19 Vaccine",
  //     date: "2024-11-15T00:00:00.000+00:00",
  //   },
  //   {
  //     name: "Flu Shot",
  //     date: "2024-09-20T00:00:00.000+00:00",
  //   },
  //   {
  //     name: "Hepatitis B",
  //     date: "2023-05-10T00:00:00.000+00:00",
  //   },
  //   {
  //     name: "Tetanus",
  //     date: "2022-08-12T00:00:00.000+00:00",
  //   },
  // ];

  const age = calculateAge(user.dob);

  const editProfileHandling = () => {
    router.push("/addInformation");
  };

  const openModal = (type: "surgical" | "vaccination") => {
    if (type === "surgical") {
      setSurgicalModalVisible(true);
    } else {
      setVaccinationModalVisible(true);
    }

    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: screenHeight,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setSurgicalModalVisible(false);
      setVaccinationModalVisible(false);
    });
  };

  const HistoryModal = ({
    title,
    data,
    visible,
  }: {
    title: string;
    data: any[];
    visible: boolean;
  }) => (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={closeModal}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.modalBackdrop}
          onPress={closeModal}
          activeOpacity={1}
        />
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color={COLORS.secondary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            {data.length > 0 ? (
              data.map((item, index) => (
                <View key={index} style={styles.historyItem}>
                  <View style={styles.historyDot} />
                  <View style={styles.historyDetails}>
                    <Text style={styles.historyName}>{item.name}</Text>
                    <Text style={styles.historyDate}>
                      {formatDate(item.date)}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <MaterialIcons
                  name="medical-services"
                  size={48}
                  color={COLORS.accent}
                />
                <Text style={styles.emptyText}>
                  No {title.toLowerCase()} records found
                </Text>
              </View>
            )}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );

  const vaccinationHandler = async () => {
    const data = await getData("auth");
    try {
      const response = await api.get(`/users/${data._id}/vaccines`, {
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
        },
      });
      setVaccinationHistory(response.data.data);
      openModal("vaccination");
    } catch (error) {
      console.log(error);
      const msg = handleApiError(error as Error);
      console.log(msg.message);
      Alert.alert(msg.message);
    }
  };

  const surgicalHandler = async () => {
    const data = await getData("auth");
    try {
      const response = await api.get(`/users/${data._id}/surgeries`, {
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
        },
      });
      setSurgicalHistory(response.data.data);
      openModal("surgical");
    } catch (error) {
      console.log(error);
      const msg = handleApiError(error as Error);
      console.log(msg.message);
      Alert.alert(msg.message);
    }
  };

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

        <TouchableOpacity onPress={editProfileHandling} style={styles.editBtn}>
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
          onPress={surgicalHandler}
        >
          <Text style={styles.primaryButtonText}>Surgical History</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={vaccinationHandler}
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

      {/* Modals */}
      <HistoryModal
        title="Surgical History"
        data={surgicalHistory}
        visible={surgicalModalVisible}
      />
      <HistoryModal
        title="Vaccination History"
        data={vaccinationHistory}
        visible={vaccinationModalVisible}
      />
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
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: screenHeight * 0.67,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightBg,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.secondary,
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightBg,
  },
  historyDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.secondary,
    marginTop: 4,
    marginRight: 16,
  },
  historyDetails: {
    flex: 1,
  },
  historyName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 12,
    textAlign: "center",
  },
});

export default Profile;
