<<<<<<< HEAD
import React, { useState } from "react";
=======
import React, { useState, useEffect, useCallback } from "react";
>>>>>>> ammreet
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
<<<<<<< HEAD

const { height: screenHeight } = Dimensions.get("window");
=======
import { AxiosError } from "axios";
import { storeData } from "../login";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
>>>>>>> ammreet

const COLORS = {
  primary: "#bcc4f3",
  secondary: "#6368ba",
  accent: "#b4b8cb",
  lightBg: "#f4f5ff",
  textPrimary: "#2e3171",
  textSecondary: "#4b4e6d",
  cover: "#e0e3ff",
  medicine: "#e8f5e8",
  medicineAccent: "#4caf50",
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
<<<<<<< HEAD
    month: "long",
=======
    month: "short",
>>>>>>> ammreet
    day: "numeric",
  });
};

<<<<<<< HEAD
=======
interface Medicine {
  _id: string;
  formulation: string;
  name: string;
  strength: string;
  frequency: string;
  duration: string;
}

interface MedicineHistory {
  _id: string;
  patient: string;
  doctor: string;
  medicines: Medicine[];
  createdAt: string;
  updatedAt: string;
}

>>>>>>> ammreet
interface Vaccination {
  name: string;
  date: string;
}

<<<<<<< HEAD
const Profile = () => {
  const router = useRouter();
  const [surgicalModalVisible, setSurgicalModalVisible] = useState(false);
  const [vaccinationModalVisible, setVaccinationModalVisible] = useState(false);
  const [slideAnim] = useState(new Animated.Value(screenHeight));
=======
interface HereditaryRisk {
  type: string;
  onSetAge: number;
}

const ProfileWithMedicine = () => {
  const router = useRouter();
  const [activeView, setActiveView] = useState<"profile" | "medicine">(
    "profile"
  );
  const [slideAnim] = useState(new Animated.Value(0));
  const [surgicalModalVisible, setSurgicalModalVisible] = useState(false);
  const [vaccinationModalVisible, setVaccinationModalVisible] = useState(false);
  const [modalSlideAnim] = useState(new Animated.Value(screenHeight));
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [switchProfileModalVisible, setSwitchProfileModalVisible] =
    useState(false);
  const [shareSlideAnim] = useState(new Animated.Value(screenHeight));
  const [switchProfileScaleAnim] = useState(new Animated.Value(0));
  const [switchProfileOpacityAnim] = useState(new Animated.Value(0));
  const [doctors, setDoctors] = useState();
  const [nowUser, setNowUser] = useState<any>();
  const [medicineHistory, setMedicineHistory] = useState<MedicineHistory[]>([]);
  const [vaccinationHistory, setVaccinationHistory] = useState<Vaccination[]>(
    []
  );
  const [surgicalHistory, setSurgicalHistory] = useState<Vaccination[]>([]);
  const [hereditaryRisks, setHereditaryRisks] = useState<HereditaryRisk[]>([]);
  const [loading, setLoading] = useState(true);
  const [medicineLoading, setMedicineLoading] = useState(false);
  const [members, setMembers] = useState([]);
>>>>>>> ammreet

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

<<<<<<< HEAD
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
=======
  useEffect(() => {
    const fetchData = async () => {
      const data = await getData("auth");
      setNowUser(data);
    };
    fetchData();
  }, []);

  const age = nowUser?.dob ? calculateAge(nowUser.dob.split("T")[0]) : 0;

  // Fetch medicine history
  const fetchMedicineHistory = async () => {
    setMedicineLoading(true);
    try {
      const data = await getData("auth");
      const response = await api.get(`/users/${data._id}/medicines`, {
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
        },
      });
      setMedicineHistory(response.data.data || []);
    } catch (error) {
      console.log("Error fetching medicine history:", error);
      const msg = handleApiError(error as Error);
      Alert.alert("Error", msg.message);
    } finally {
      setMedicineLoading(false);
    }
  };

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
          Alert.alert("Error", msg.message);
        } finally {
          setLoading(false);
        }
      };

      fetchHereditaryRisks();
      fetchMedicineHistory();
    }, [])
  );

  const switchView = (view: "profile" | "medicine") => {
    if (view === activeView) return;

    const toValue = view === "medicine" ? -screenWidth : 0;

    Animated.timing(slideAnim, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setActiveView(view);

    if (view === "medicine" && medicineHistory.length === 0) {
      fetchMedicineHistory();
    }
  };

  const editProfileHandling = () => {
    router.push("/addInformation");
  };

  const openModal = (type: "surgical" | "vaccination" | "share") => {
    if (type === "surgical") {
      setSurgicalModalVisible(true);
    } else if (type === "vaccination") {
      setVaccinationModalVisible(true);
    } else if (type === "share") {
      setShareModalVisible(true);
      Animated.timing(shareSlideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }

    if (type !== "share") {
      Animated.timing(modalSlideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const closeModal = () => {
    Animated.timing(modalSlideAnim, {
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
        Alert.alert("Unexpected Error occurred" + error);
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

  const handleShareWithUser = async (userId: string, userName: string) => {
    await storeData("doctorId", userId);
    Alert.alert("Share Access", `Share Access with ${userName}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Share",
        onPress: () => {
          console.log(`Sharing profile with user: ${userId}`);
          closeShareModal();
          router.replace("/medicine");
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
            closeSwitchProfileModal();
            Alert.alert("Success", `Switched to ${userName}'s profile`);
          },
        },
      ]
    );
  };

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
        Alert.alert("Unexpected Error Occurred");
      }
    }
  };

  const renderProfileView = () => (
    <ScrollView
      style={styles.profileContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.coverBg}>
        <TouchableOpacity
          style={styles.shareIcon}
          onPress={shareHandler}
          activeOpacity={0.7}
        >
          <MaterialIcons name="share" size={24} color={COLORS.secondary} />
        </TouchableOpacity>
      </View>

>>>>>>> ammreet
      <View style={styles.profileSection}>
        <Image
          source={{
            uri: nowUser?.profileImage || "https://placekitten.com/200/200",
          }}
          style={styles.avatar}
        />
        <View style={styles.headerText}>
          <Text
            style={styles.userNameText}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {nowUser?.name || "User Name"}
          </Text>
          {nowUser?.role === "FAMILY_ADMIN" && (
            <Text style={styles.adminBadge}>Family Admin</Text>
          )}
          <Text style={styles.relation}>{user.relation}</Text>
        </View>
<<<<<<< HEAD

=======
>>>>>>> ammreet
        <TouchableOpacity onPress={editProfileHandling} style={styles.editBtn}>
          <MaterialIcons name="edit" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.infoCard}>
        <InfoLabel label="Age" value={`${age} years`} />
        <InfoLabel label="Sex" value={nowUser?.sex || "N/A"} />
        <InfoLabel label="Blood Group" value={nowUser?.bloodtype || "N/A"} />
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

  const renderMedicineView = () => (
    <ScrollView
      style={styles.medicineContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.medicineHeader}>
        <MaterialIcons
          name="local-pharmacy"
          size={28}
          color={COLORS.medicineAccent}
        />
        <Text style={styles.medicineTitle}>Medicine History</Text>
      </View>

      {medicineLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading medicine history...</Text>
        </View>
      ) : medicineHistory.length > 0 ? (
        medicineHistory.map((record) => (
          <View key={record._id} style={styles.medicineRecord}>
            <View style={styles.medicineRecordHeader}>
              <Text style={styles.medicineDate}>
                {formatDate(record.createdAt)}
              </Text>
              <View style={styles.medicineBadge}>
                <Text style={styles.medicineBadgeText}>
                  {record.medicines.length}{" "}
                  {record.medicines.length === 1 ? "Medicine" : "Medicines"}
                </Text>
              </View>
            </View>

            {record.medicines.map((medicine) => (
              <View key={medicine._id} style={styles.medicineItem}>
                <View style={styles.medicineItemHeader}>
                  <Text style={styles.medicineName}>{medicine.name}</Text>
                  <View
                    style={[
                      styles.formulationBadge,
                      {
                        backgroundColor: getFormulationColor(
                          medicine.formulation
                        ),
                      },
                    ]}
                  >
                    <Text style={styles.formulationText}>
                      {medicine.formulation}
                    </Text>
                  </View>
                </View>

                <View style={styles.medicineDetails}>
                  <View style={styles.medicineDetail}>
                    <MaterialIcons
                      name="opacity"
                      size={16}
                      color={COLORS.medicineAccent}
                    />
                    <Text style={styles.medicineDetailText}>
                      Strength: {medicine.strength}
                    </Text>
                  </View>

                  <View style={styles.medicineDetail}>
                    <MaterialIcons
                      name="schedule"
                      size={16}
                      color={COLORS.medicineAccent}
                    />
                    <Text style={styles.medicineDetailText}>
                      Frequency: {medicine.frequency}
                    </Text>
                  </View>

                  <View style={styles.medicineDetail}>
                    <MaterialIcons
                      name="timer"
                      size={16}
                      color={COLORS.medicineAccent}
                    />
                    <Text style={styles.medicineDetailText}>
                      Duration: {medicine.duration}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ))
      ) : (
        <View style={styles.emptyMedicineState}>
          <MaterialIcons
            name="local-pharmacy"
            size={64}
            color={COLORS.accent}
          />
          <Text style={styles.emptyMedicineText}>
            No medicine history found
          </Text>
          <Text style={styles.emptyMedicineSubtext}>
            Your prescribed medicines will appear here
          </Text>
        </View>
      )}
    </ScrollView>
  );

  const getFormulationColor = (formulation: string) => {
    const colors: { [key: string]: string } = {
      TABLET: "#2196F3",
      CAPSULE: "#FF9800",
      LIQUID: "#9C27B0",
      INJECTION: "#F44336",
      CREAM: "#4CAF50",
      DROPS: "#00BCD4",
    };
    return colors[formulation] || "#757575";
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
              transform: [{ translateY: modalSlideAnim }],
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

  return (
    <View style={styles.container}>
      {/* Tab Headers */}
      <View style={styles.tabHeader}>
        <TouchableOpacity
          style={[styles.tab, activeView === "profile" && styles.activeTab]}
          onPress={() => switchView("profile")}
        >
          <MaterialIcons
            name="person"
            size={20}
            color={activeView === "profile" ? COLORS.secondary : COLORS.accent}
          />
          <Text
            style={[
              styles.tabText,
              activeView === "profile" && styles.activeTabText,
            ]}
          >
            Profile
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeView === "medicine" && styles.activeTab]}
          onPress={() => switchView("medicine")}
        >
          <MaterialIcons
            name="local-pharmacy"
            size={20}
            color={
              activeView === "medicine" ? COLORS.medicineAccent : COLORS.accent
            }
          />
          <Text
            style={[
              styles.tabText,
              activeView === "medicine" && styles.activeTabText,
            ]}
          >
            Medicines
          </Text>
        </TouchableOpacity>
      </View>

      {/* Sliding Content */}
      <Animated.View
        style={[
          styles.slidingContainer,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <View style={styles.viewContainer}>{renderProfileView()}</View>
        <View style={styles.viewContainer}>{renderMedicineView()}</View>
      </Animated.View>

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
      <ShareModal />
      <SwitchProfileModal />
    </View>
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
  tabHeader: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightBg,
    paddingTop: 50,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.secondary,
  },
  tabText: {
    fontSize: 16,
    color: COLORS.accent,
    fontWeight: "500",
  },
  activeTabText: {
    color: COLORS.secondary,
    fontWeight: "600",
  },
  slidingContainer: {
    flex: 1,
    flexDirection: "row",
    width: screenWidth * 2,
  },
  viewContainer: {
    width: screenWidth,
    flex: 1,
  },
  profileContainer: {
    flex: 1,
  },
  medicineContainer: {
    flex: 1,
    padding: 16,
  },
  medicineHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 12,
  },
  medicineTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.medicineAccent,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  medicineRecord: {
    backgroundColor: COLORS.medicine,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.medicineAccent,
  },
  medicineRecordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  medicineDate: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.medicineAccent,
  },
  medicineBadge: {
    backgroundColor: COLORS.medicineAccent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  medicineBadgeText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
  },
  medicineItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  medicineItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
    flex: 1,
  },
  formulationBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  formulationText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
  },
  medicineDetails: {
    gap: 6,
  },
  medicineDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  medicineDetailText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  emptyMedicineState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyMedicineText: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginTop: 16,
  },
  emptyMedicineSubtext: {
    fontSize: 14,
    color: COLORS.accent,
    marginTop: 8,
    textAlign: "center",
  },
  coverBg: {
    height: 120,
    backgroundColor: COLORS.cover,
    position: "relative",
  },
  shareIcon: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "#fff",
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginTop: -50,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    backgroundColor: "#6368ba",
    borderColor: "#fff",
  },
  headerText: {
    flex: 1,
    marginLeft: 16,
  },
  userNameText: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 30,
    color: COLORS.textPrimary,
    maxWidth: "70%",
  },
  adminBadge: {
    fontSize: 12,
<<<<<<< HEAD
    fontWeight: "600",
    color: "#d46504",
=======
    color: COLORS.secondary,
    backgroundColor: COLORS.lightBg,
    paddingHorizontal: 8,
>>>>>>> ammreet
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  relation: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  editBtn: {
    backgroundColor: COLORS.secondary,
    borderRadius: 20,
    padding: 10,
  },
  infoCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoText: {
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  infoLabel: {
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  bulletText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  summaryRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginVertical: 8,
  },
  summaryCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
    textAlign: "center",
  },
  buttonGroup: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: COLORS.secondary,
  },
  secondaryButton: {
    backgroundColor: COLORS.primary,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  switchButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.lightBg,
    gap: 8,
  },
  switchText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.secondary,
  },
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
    maxHeight: screenHeight * 0.7,
  },
  shareModalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: screenHeight * 0.7,
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
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    padding: 20,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightBg,
  },
  historyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.secondary,
    marginRight: 16,
  },
  historyDetails: {
    flex: 1,
  },
  historyName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  historyDate: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 16,
    textAlign: "center",
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightBg,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  switchModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  switchModalBackdrop: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  switchModalContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: screenWidth * 0.9,
    maxHeight: screenHeight * 0.7,
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
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  switchModalContent: {
    padding: 20,
  },
  switchUserRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightBg,
  },
  switchUserAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  switchUserInfo: {
    flex: 1,
  },
  switchUserNameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  switchUserName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  switchUserRelation: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
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

export default ProfileWithMedicine;
