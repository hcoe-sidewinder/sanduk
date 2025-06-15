import { api, handleApiError } from "@/api/axiosConfig";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { getData } from "./home";

const MedicalRecordsScreen = () => {
  const [vaccinations, setVaccinations] = useState([
    { id: 1, name: "", date: new Date(), showDatePicker: false },
  ]);

  // State for surgeries
  const [surgeries, setSurgeries] = useState([
    { id: 1, name: "", date: new Date(), showDatePicker: false },
  ]);

  // State for hereditary diseases
  const [hereditaryDiseases, setHereditaryDiseases] = useState([
    { id: 1, type: "", onSetAge: "" },
  ]);

  // Hereditary disease types (example - replace with your actual types)
  const diseaseTypes = [
    "ALZHEIMER",
    "ASTHMA",
    "BREAST_CANCER",
    "COLON_CANCER",
    "COPD",
    "CORONARY_ARTERY_DISEASE",
    "DEPRESSION",
    "DIABETES",
    "HYPERTENSION",
    "OSTEOPOROSIS",
    "PARKINSON",
    "PROSTATE_CANCER",
    "RHEUMATOID_ARTHRITIS",
    "SCHIZOPHRENIA",
    "STROKE",
  ];

  // Vaccination handlers
  const addVaccination = () => {
    const newId = Math.max(...vaccinations.map((v) => v.id)) + 1;
    setVaccinations([
      ...vaccinations,
      {
        id: newId,
        name: "",
        date: new Date(),
        showDatePicker: false,
      },
    ]);
  };

  const removeVaccination = (id: number) => {
    if (vaccinations.length > 1) {
      setVaccinations(vaccinations.filter((v) => v.id !== id));
    }
  };

  const updateVaccination = (id: number, field: string, value: string) => {
    setVaccinations(
      vaccinations.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    );
  };

  // Surgery handlers
  const addSurgery = () => {
    const newId = Math.max(...surgeries.map((s) => s.id)) + 1;
    setSurgeries([
      ...surgeries,
      {
        id: newId,
        name: "",
        date: new Date(),
        showDatePicker: false,
      },
    ]);
  };

  const removeSurgery = (id: number) => {
    if (surgeries.length > 1) {
      setSurgeries(surgeries.filter((s) => s.id !== id));
    }
  };

  const updateSurgery = (id: number, field: string, value: string) => {
    setSurgeries(
      surgeries.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  // Hereditary disease handlers
  const addHereditaryDisease = () => {
    const newId = Math.max(...hereditaryDiseases.map((h) => h.id)) + 1;
    setHereditaryDiseases([
      ...hereditaryDiseases,
      {
        id: newId,
        type: "",
        onSetAge: "",
      },
    ]);
  };

  const removeHereditaryDisease = (id: number) => {
    if (hereditaryDiseases.length > 1) {
      setHereditaryDiseases(hereditaryDiseases.filter((h) => h.id !== id));
    }
  };

  const updateHereditaryDisease = (
    id: number,
    field: string,
    value: string
  ) => {
    setHereditaryDiseases(
      hereditaryDiseases.map((h) =>
        h.id === id ? { ...h, [field]: value } : h
      )
    );
  };

  const handleDateChange = (
    type: string,
    id: number,
    event: any,
    selectedDate: any
  ) => {
    const currentDate = selectedDate || new Date();

    if (type === "vaccination") {
      setVaccinations(
        vaccinations.map((v) =>
          v.id === id
            ? { ...v, showDatePicker: Platform.OS === "ios", date: currentDate }
            : { ...v, showDatePicker: false }
        )
      );
    } else if (type === "surgery") {
      setSurgeries(
        surgeries.map((s) =>
          s.id === id
            ? { ...s, showDatePicker: Platform.OS === "ios", date: currentDate }
            : { ...s, showDatePicker: false }
        )
      );
    }
  };

  const showDatePicker = (type: string, id: number) => {
    if (type === "vaccination") {
      setVaccinations(
        vaccinations.map((v) =>
          v.id === id ? { ...v, showDatePicker: true } : v
        )
      );
    } else if (type === "surgery") {
      setSurgeries(
        surgeries.map((s) => (s.id === id ? { ...s, showDatePicker: true } : s))
      );
    }
  };

  const [auth, setAuth] = useState<any>();

  const postVaccinations = async (data: any) => {
    console.log("passed data is", JSON.stringify(data, null, 4));
    console.log("to set", vaccinations);
    try {
      // const vaccinationResponse = await Promise.all(
      //   vaccinations.map((vaccination: any) => {
      //     const toSend = {
      //       patient: data._id,
      //       name: vaccination.name,
      //       date: vaccination.date,
      //     };
      //     return api.post(`/users/${data._id}/vaccines`, toSend, {
      //       headers: {
      //         Authorization: `Bearer ${data.accessToken}`,
      //       },
      //     });
      //   })
      // );
      const sendData = vaccinations.map((vaccination) => {
        return {
          name: vaccination.name,
          date: vaccination.date.toISOString().split("T")[0],
        };
      });
      const vaccinationResponse = await api.post(
        `/users/${data._id}/vaccines`,
        { vaccines: sendData },
        {
          headers: {
            Authorization: `Bearer ${data.accessToken}`,
          },
        }
      );
      console.log(vaccinations);
      console.log(vaccinationResponse);
    } catch (error) {
      const message = handleApiError(error as Error);
      throw message;
    }
  };

  const postSurgery = async (data: any) => {
    try {
      console.log(surgeries);
      const sendData = surgeries.map((surgery) => {
        return {
          name: surgery.name,
          date: surgery.date.toISOString().split("T")[0],
        };
      });
      const surgeryResponse = await api.post(
        `/users/${data._id}/surgeries`,
        { surgeries: sendData },
        {
          headers: {
            Authorization: `Bearer ${data.accessToken}`,
          },
        }
      );
      console.log(surgeries);
      console.log(surgeryResponse);
    } catch (error) {
      const message = handleApiError(error as Error);
      throw message;
    }
  };

  const postDisease = async (data: any) => {
    try {
      console.log(hereditaryDiseases);
      // const hereditaryResponse = await Promise.all(
      //   hereditaryDiseases.map((disease: any) => {
      //     const toSend = {
      //       patient: data._id,
      //       type: disease.type,
      //       onSetAge: disease.onSetAge,
      //     };
      //     return api.post(`/users/${data._id}/hereditaries`, toSend, {
      //       headers: {
      //         Authorization: `Bearer ${data.accessToken}`,
      //       },
      //     });
      //   })
      // );
      const toSend = hereditaryDiseases.map((disease) => {
        return { type: disease.type, onSetAge: disease.onSetAge };
      });
      const hereditaryResponse = await api.post(
        `/users/${data._id}/hereditaries`,
        { hereditaries: toSend },
        {
          headers: {
            Authorization: `Bearer ${data.accessToken}`,
          },
        }
      );
      console.log(hereditaryResponse);
    } catch (error) {
      const message = handleApiError(error as Error);
      throw message;
    }
  };
  const handleSave = async () => {
    const hasEmptyVaccination = vaccinations.some((v) => !v.name.trim());
    const hasEmptySurgery = surgeries.some((s) => !s.name.trim());
    const hasEmptyDisease = hereditaryDiseases.some(
      (h) => !h.type || !h.onSetAge
    );

    if (hasEmptyVaccination && hasEmptySurgery && hasEmptyDisease) {
      Alert.alert("Error", "No data given to add.");
      return;
    }
    const data = await getData("auth");
    console.log("stored data is", data);
    setAuth(data);
    try {
      if (!hasEmptySurgery) {
        await postSurgery(data);
      }
      if (!hasEmptyVaccination) {
        await postVaccinations(data);
      }
      if (!hasEmptyDisease) {
        await postDisease(data);
      }
      router.replace("/home");
    } catch (error) {
      Alert.alert("Something went wrong", error as string);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#f8f9fa",
    },
    scrollContainer: {
      padding: 16,
    },
    sectionContainer: {
      backgroundColor: "#ffffff",
      borderRadius: 12,
      marginBottom: 20,
      padding: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "600",
      color: "#6368ba",
    },
    addButton: {
      backgroundColor: "#bcc4f3",
      borderRadius: 20,
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
    },
    addButtonText: {
      fontSize: 24,
      color: "#6368ba",
      fontWeight: "bold",
    },
    itemContainer: {
      backgroundColor: "#f8f9fa",
      borderRadius: 8,
      padding: 12,
      marginBottom: 12,
      borderLeftWidth: 4,
      borderLeftColor: "#bcc4f3",
    },
    itemHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    itemNumber: {
      fontSize: 14,
      fontWeight: "500",
      color: "#6368ba",
    },
    removeButton: {
      backgroundColor: "#ff6b6b",
      borderRadius: 15,
      width: 30,
      height: 30,
      justifyContent: "center",
      alignItems: "center",
    },
    removeButtonText: {
      fontSize: 16,
      color: "#ffffff",
      fontWeight: "bold",
    },
    input: {
      borderWidth: 1,
      borderColor: "#b4b8cb",
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      backgroundColor: "#ffffff",
      marginBottom: 8,
    },
    dateButton: {
      borderWidth: 1,
      borderColor: "#b4b8cb",
      borderRadius: 8,
      padding: 12,
      backgroundColor: "#ffffff",
      marginBottom: 8,
    },
    dateButtonText: {
      fontSize: 16,
      color: "#333",
    },
    picker: {
      borderWidth: 1,
      borderColor: "#b4b8cb",
      borderRadius: 8,
      backgroundColor: "#ffffff",
      marginBottom: 8,
    },
    saveButton: {
      backgroundColor: "#6368ba",
      borderRadius: 12,
      padding: 16,
      margin: 16,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    saveButtonText: {
      color: "#ffffff",
      fontSize: 18,
      fontWeight: "600",
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Vaccinations Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>💉 Vaccinations</Text>
            <TouchableOpacity style={styles.addButton} onPress={addVaccination}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          {vaccinations.map((vaccination, index) => (
            <View key={vaccination.id} style={styles.itemContainer}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemNumber}>Vaccination #{index + 1}</Text>
                {vaccinations.length > 1 && (
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeVaccination(vaccination.id)}
                  >
                    <Text style={styles.removeButtonText}>×</Text>
                  </TouchableOpacity>
                )}
              </View>

              <TextInput
                style={styles.input}
                placeholder="Vaccine name (e.g., COVID-19, Flu)"
                value={vaccination.name}
                onChangeText={(text) =>
                  updateVaccination(vaccination.id, "name", text)
                }
              />

              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => showDatePicker("vaccination", vaccination.id)}
              >
                <Text style={styles.dateButtonText}>
                  Date: {vaccination.date.toLocaleDateString()}
                </Text>
              </TouchableOpacity>

              {vaccination.showDatePicker && (
                <DateTimePicker
                  value={vaccination.date}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) =>
                    handleDateChange(
                      "vaccination",
                      vaccination.id,
                      event,
                      selectedDate
                    )
                  }
                />
              )}
            </View>
          ))}
        </View>

        {/* Surgeries Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🏥 Surgeries</Text>
            <TouchableOpacity style={styles.addButton} onPress={addSurgery}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          {surgeries.map((surgery, index) => (
            <View key={surgery.id} style={styles.itemContainer}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemNumber}>Surgery #{index + 1}</Text>
                {surgeries.length > 1 && (
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeSurgery(surgery.id)}
                  >
                    <Text style={styles.removeButtonText}>×</Text>
                  </TouchableOpacity>
                )}
              </View>

              <TextInput
                style={styles.input}
                placeholder="Surgery name (e.g., Appendectomy, Knee Replacement)"
                value={surgery.name}
                onChangeText={(text) => updateSurgery(surgery.id, "name", text)}
              />

              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => showDatePicker("surgery", surgery.id)}
              >
                <Text style={styles.dateButtonText}>
                  Date: {surgery.date.toLocaleDateString()}
                </Text>
              </TouchableOpacity>

              {surgery.showDatePicker && (
                <DateTimePicker
                  value={surgery.date}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) =>
                    handleDateChange("surgery", surgery.id, event, selectedDate)
                  }
                />
              )}
            </View>
          ))}
        </View>

        {/* Hereditary Diseases Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🧬 Hereditary Diseases</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={addHereditaryDisease}
            >
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          {hereditaryDiseases.map((disease, index) => (
            <View key={disease.id} style={styles.itemContainer}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemNumber}>Disease #{index + 1}</Text>
                {hereditaryDiseases.length > 1 && (
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeHereditaryDisease(disease.id)}
                  >
                    <Text style={styles.removeButtonText}>×</Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.picker}>
                <Picker
                  selectedValue={disease.type}
                  onValueChange={(itemValue) =>
                    updateHereditaryDisease(disease.id, "type", itemValue)
                  }
                >
                  <Picker.Item label="Select disease type" value="" />
                  {diseaseTypes.map((type, idx) => (
                    <Picker.Item key={idx} label={type} value={type} />
                  ))}
                </Picker>
              </View>

              <TextInput
                style={styles.input}
                placeholder="Onset age (e.g., 25)"
                value={disease.onSetAge}
                onChangeText={(text) =>
                  updateHereditaryDisease(disease.id, "onSetAge", text)
                }
                keyboardType="numeric"
              />
            </View>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Medical Records</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MedicalRecordsScreen;
