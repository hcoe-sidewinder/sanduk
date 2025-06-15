import React, { useState, useEffect, useCallback } from "react";
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
import { useFocusEffect, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { getData } from "./home";
import { api, handleApiError } from "@/api/axiosConfig";
import { AxiosError } from "axios";

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

interface HereditaryRisk {
  type: string;
  onSetAge: number;
}

interface User {
  id: string;
  name: string;
  relation: string;
  profileImage: string;
}

const Profile = () => {
  const router = useRouter();
  const [surgicalModalVisible, setSurgicalModalVisible] = useState(false);
  const [vaccinationModalVisible, setVaccinationModalVisible] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [switchProfileModalVisible, setSwitchProfileModalVisible] =
    useState(false);
  const [slideAnim] = useState(new Animated.Value(screenHeight));
  const [shareSlideAnim] = useState(new Animated.Value(screenHeight));
  const [switchProfileScaleAnim] = useState(new Animated.Value(0));
  const [switchProfileOpacityAnim] = useState(new Animated.Value(0));
  const [doctors, setDoctors] = useState();

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
  };

  const [vaccinationHistory, setVaccinationHistory] = useState<Vaccination[]>(
    []
  );
  const [surgicalHistory, setSurgicalHistory] = useState<Vaccination[]>([]);
  const [hereditaryRisks, setHereditaryRisks] = useState<HereditaryRisk[]>([]);
  const [loading, setLoading] = useState(true);

  const age = calculateAge(user.dob);

  useFocusEffect(
    useCallback(() => {
      const fetchHereditaryRisks = async () => {
        setLoading(true);
        try {
          const data = await getData("auth");
          const response = await api.get(`/users/${data._id}/hereditaries`, {
            headers: {
              Authorization: `Bearer ${data.accessToken}`,
            },
          });
          setHereditaryRisks(response.data.data || []);
        } catch (error) {
          console.log("Error fetching hereditary risks:", error);
          const msg = handleApiError(error as Error);
          console.log(msg.message);
          Alert.alert("Error", msg.message);
        } finally {
          setLoading(false);
        }
      };

      fetchHereditaryRisks();
    }, [])
  );

  const editProfileHandling = () => {
    router.push("/addInformation");
  };

  const openModal = (type: "surgical" | "vaccination" | "share") => {
    if (type === "surgical") {
      setSurgicalModalVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else if (type === "vaccination") {
      setVaccinationModalVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else if (type === "share") {
      setShareModalVisible(true);
      Animated.timing(shareSlideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };
  const [members, setMembers] = useState([]);
  const switchUserHandling = async () => {
    const data = await getData("auth");
    try {
      const response = await api.get(`/admins/${data._id}/members`, {
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
        },
      });
      setMembers(response.data.data);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        Alert.alert(error.response?.data.message);
      } else {
        Alert.alert("Unexpected Error occured" + error);
      }
    }
  };

  const openSwitchProfileModal = async () => {
    await switchUserHandling();
    setSwitchProfileModalVisible(true);

    Animated.parallel([
      Animated.timing(switchProfileScaleAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(switchProfileOpacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeSwitchProfileModal = () => {
    Animated.parallel([
      Animated.timing(switchProfileScaleAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(switchProfileOpacityAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setSwitchProfileModalVisible(false);
    });
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

  const closeShareModal = () => {
    Animated.timing(shareSlideAnim, {
      toValue: screenHeight,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShareModalVisible(false);
    });
  };

  const handleShareWithUser = (userId: string, userName: string) => {
    Alert.alert("Share Access", `Share Access with ${userName}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Share",
        onPress: () => {
          console.log(`Sharing profile with user: ${userId}`);
          closeShareModal();
          Alert.alert("Success", `Profile shared with ${userName}`);
        },
      },
    ]);
  };

  const handleSwitchProfile = (userId: string, userName: string) => {
    Alert.alert(
      "Switch Profile",
      `Are you sure you want to switch to ${userName}'s profile?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Switch",
          onPress: () => {
            console.log(`Switching to profile: ${userId}`);
            closeSwitchProfileModal();
            Alert.alert("Success", `Switched to ${userName}'s profile`);
          },
        },
      ]
    );
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

  const ShareModal = () => (
    <Modal
      visible={shareModalVisible}
      transparent
      animationType="none"
      onRequestClose={closeShareModal}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.modalBackdrop}
          onPress={closeShareModal}
          activeOpacity={1}
        />
        <Animated.View
          style={[
            styles.shareModalContainer,
            {
              transform: [{ translateY: shareSlideAnim }],
            },
          ]}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Share Access</Text>
            <TouchableOpacity
              onPress={closeShareModal}
              style={styles.closeButton}
            >
              <MaterialIcons name="close" size={24} color={COLORS.secondary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            {doctors?.map((doctor: any) => (
              <TouchableOpacity
                key={doctor._id}
                style={styles.userRow}
                onPress={() => handleShareWithUser(doctor._id, doctor.name)}
                activeOpacity={0.7}
              >
                <Image
                  source={{ uri: doctor.profileImage }}
                  style={styles.userAvatar}
                />
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{doctor.name}</Text>
                </View>
                <MaterialIcons
                  name="arrow-forward-ios"
                  size={16}
                  color={COLORS.accent}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );

  const SwitchProfileModal = () => (
    <Modal
      visible={switchProfileModalVisible}
      transparent
      animationType="none"
      onRequestClose={closeSwitchProfileModal}
    >
      <View style={styles.switchModalOverlay}>
        <TouchableOpacity
          style={styles.switchModalBackdrop}
          onPress={closeSwitchProfileModal}
          activeOpacity={1}
        />
        <Animated.View
          style={[
            styles.switchModalContainer,
            {
              transform: [{ scale: switchProfileScaleAnim }],
              opacity: switchProfileOpacityAnim,
            },
          ]}
        >
          <View style={styles.switchModalHeader}>
            <Text style={styles.switchModalTitle}>Switch Profile</Text>
            <TouchableOpacity
              onPress={closeSwitchProfileModal}
              style={styles.closeButton}
            >
              <MaterialIcons name="close" size={24} color={COLORS.secondary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.switchModalContent}
            showsVerticalScrollIndicator={false}
          >
            {members.map((user: any) => (
              <TouchableOpacity
                key={user._id}
                style={styles.switchUserRow}
                onPress={() => handleSwitchProfile(user._id, user.name)}
                activeOpacity={0.7}
              >
                <Image
                  source={{ uri: user.profileImage }}
                  style={styles.switchUserAvatar}
                />
                <View style={styles.switchUserInfo}>
                  <View style={styles.switchUserNameContainer}>
                    <Text style={styles.switchUserName}>{user.name}</Text>
                  </View>
                  <Text style={styles.switchUserRelation}>
                    {user.relationToFamilyAdmin}
                  </Text>
                </View>
                <MaterialIcons
                  name="arrow-forward-ios"
                  size={16}
                  color={COLORS.accent}
                />
              </TouchableOpacity>
            ))}
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

  const shareHandler = async () => {
    const data = await getData("auth");
    try {
      const response = await api.get("/doctors", {
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
        },
      });
      openModal("share");
      setDoctors(response.data.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        Alert.alert(error.response?.data.message);
      } else {
        console.log(error);
        Alert.alert("Unepectd Error Occured");
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.coverBg}>
 
        <TouchableOpacity
          style={styles.shareIcon}
          onPress={shareHandler}
          activeOpacity={0.7}
        >
          <MaterialIcons name="share" size={24} color={COLORS.secondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.profileSection}>
        <Image source={{ uri: user.profileImage }} style={styles.avatar} />

        <View style={styles.headerText}>
          <Text style={styles.userNameText}>{user.name}</Text>
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

      {/* hereditary risks */}
      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>Hereditary Risks</Text>
        {loading ? (
          <Text style={styles.bulletText}>Loading...</Text>
        ) : hereditaryRisks.length > 0 ? (
          hereditaryRisks.map((risk, idx) => (
            <Text key={idx} style={styles.bulletText}>
              • {risk.type}
            </Text>
          ))
        ) : (
          <Text style={styles.bulletText}>No hereditary risks found</Text>
        )}
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
          onPress={openSwitchProfileModal}
        >
          <MaterialIcons
            name="switch-account"
            size={20}
            color={COLORS.secondary}
          />
          <Text style={styles.switchText}>Switch Profile</Text>
        </TouchableOpacity>
      </View>

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
      <ShareModal />
      <SwitchProfileModal />
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
    position: "relative",
  },
  shareIcon: {
    position: "absolute",
    top: 50,
    right: 16,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    padding: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
  userNameText: {
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
  shareModalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: screenHeight * 0.6,
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
  // Share modal specific styles
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightBg,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
    backgroundColor: COLORS.accent,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  userRelation: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  // Switch Profile Modal styles
  switchModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  switchModalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  switchModalContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "100%",
    maxHeight: screenHeight * 0.7,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  switchModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightBg,
  },
  switchModalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.secondary,
  },
  switchModalContent: {
    maxHeight: screenHeight * 0.5,
    paddingHorizontal: 20,
  },
  switchUserRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightBg,
  },
  switchUserAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    backgroundColor: COLORS.accent,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  switchUserInfo: {
    flex: 1,
  },
  switchUserNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  switchUserName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginRight: 8,
  },
  switchUserRelation: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  adminBadgeContainer: {
    backgroundColor: "#d46504",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  adminBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#fff",
  },
});

export default Profile;
