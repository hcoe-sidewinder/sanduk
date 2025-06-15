import React, { useState, useCallback, memo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { getData } from "./(tabs)/home";
import { api, handleApiError } from "@/api/axiosConfig";
import InputField from "@/components/InputField";
import { router } from "expo-router";

const ALL_FORMULATION = ["TABLET", "CAPSULE", "LIQUID", "INJECTION"];

// Memoized FormulationButton component to prevent unnecessary re-renders
const FormulationButton = memo(
  ({
    formulation,
    entryId,
    isSelected,
    onPress,
  }: {
    formulation: string;
    entryId: number;
    isSelected: boolean;
    onPress: (entryId: number, formulation: string) => void;
  }) => (
    <TouchableOpacity
      style={[
        styles.formulationButton,
        isSelected && styles.selectedFormulation,
      ]}
      onPress={() => onPress(entryId, formulation)}
    >
      <Text
        style={[
          styles.formulationText,
          isSelected && styles.selectedFormulationText,
        ]}
      >
        {formulation}
      </Text>
    </TouchableOpacity>
  )
);

FormulationButton.displayName = "FormulationButton";

// Memoized MedicineEntryForm component to prevent unnecessary re-renders
const MedicineEntryForm = memo(
  ({
    entry,
    index,
    canRemove,
    onUpdateEntry,
    onRemoveEntry,
    onFormulationPress,
  }: {
    entry: any;
    index: number;
    canRemove: boolean;
    onUpdateEntry: (id: number, field: string, value: string) => void;
    onRemoveEntry: (id: number) => void;
    onFormulationPress: (entryId: number, formulation: string) => void;
  }) => (
    <View style={styles.medicineEntryContainer}>
      <View style={styles.entryHeader}>
        <Text style={styles.entryTitle}>Medicine #{index + 1}</Text>
        {canRemove && (
          <TouchableOpacity
            style={styles.removeEntryButton}
            onPress={() => onRemoveEntry(entry.id)}
          >
            <Text style={styles.removeEntryButtonText}>Remove</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.label}>Formulation *</Text>
      <View style={styles.formulationContainer}>
        {ALL_FORMULATION.map((formulation) => (
          <FormulationButton
            key={formulation}
            formulation={formulation}
            entryId={entry.id}
            isSelected={entry.formulation === formulation}
            onPress={onFormulationPress}
          />
        ))}
      </View>

      <InputField
        label="Medicine Name"
        value={entry.name}
        onChangeText={(text) => onUpdateEntry(entry.id, "name", text)}
        placeholder="Enter medicine name"
        secure={false}
      />

      <InputField
        label="Strength"
        value={entry.strength}
        onChangeText={(text) => onUpdateEntry(entry.id, "strength", text)}
        placeholder="e.g., 500mg, 10ml"
        secure={false}
      />

      <InputField
        label="Frequency"
        value={entry.frequency}
        onChangeText={(text) => onUpdateEntry(entry.id, "frequency", text)}
        placeholder="e.g., Twice daily, TID"
        secure={false}
      />

      <InputField
        label="Duration"
        value={entry.duration}
        onChangeText={(text) => onUpdateEntry(entry.id, "duration", text)}
        placeholder="e.g., 7 days, 2 weeks"
        secure={false}
      />
    </View>
  )
);

MedicineEntryForm.displayName = "MedicineEntryForm";

const MedicinePrescriptionPage = () => {
  const [medicineEntries, setMedicineEntries] = useState([
    {
      id: Date.now(),
      formulation: "",
      name: "",
      strength: "",
      frequency: "",
      duration: "",
    },
  ]);

  const handleAddNewMedicineEntry = useCallback(() => {
    const newEntry = {
      id: Date.now(),
      formulation: "",
      name: "",
      strength: "",
      frequency: "",
      duration: "",
    };
    setMedicineEntries((prevEntries) => [...prevEntries, newEntry]);
  }, []);

  const handleRemoveMedicineEntry = useCallback((id: number) => {
    setMedicineEntries((prevEntries) => {
      if (prevEntries.length > 1) {
        return prevEntries.filter((entry) => entry.id !== id);
      } else {
        Alert.alert("Error", "At least one medicine entry is required");
        return prevEntries;
      }
    });
  }, []);

  const handleUpdateMedicineEntry = useCallback(
    (id: number, field: string, value: string) => {
      setMedicineEntries((prevEntries) =>
        prevEntries.map((entry) =>
          entry.id === id ? { ...entry, [field]: value } : entry
        )
      );
    },
    []
  );

  const handleFormulationPress = useCallback(
    (entryId: number, formulation: string) => {
      handleUpdateMedicineEntry(entryId, "formulation", formulation);
    },
    [handleUpdateMedicineEntry]
  );

  const validateAndSavePrescription = useCallback(async () => {
    const invalidEntries = medicineEntries.filter(
      (entry) =>
        !entry.formulation ||
        !entry.name ||
        !entry.strength ||
        !entry.frequency ||
        !entry.duration
    );

    if (invalidEntries.length > 0) {
      Alert.alert("Error", "Please fill all fields in all medicine entries");
      return;
    }

    try {
      const user = await getData("auth");
      const doctor = await getData("doctorId");
      console.log("user and doctorid", user._id, doctor);

      const sentData = medicineEntries.map((medicine) => ({
        formulation: medicine.formulation,
        name: medicine.name,
        duration: medicine.duration,
        strength: medicine.strength,
        frequency: medicine.frequency,
      }));

      const final = { doctor: doctor, medicines: sentData };

      const response = await api.post(`/users/${user._id}/medicines`, final, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      });

      Alert.alert("Success", "Prescription saved successfully!");
      router.replace("/home");
      console.log(response);
    } catch (error) {
      console.log(error);
      const msg = handleApiError(error as Error);
      Alert.alert("Error", msg.message);
    }
  }, [medicineEntries]);

  return (
    <KeyboardAvoidingView behavior="padding" className="flex-1">
      {" "}
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Medicine Prescription Form</Text>

        <View style={styles.entriesContainer}>
          {medicineEntries.map((entry, index) => (
            <MedicineEntryForm
              key={entry.id}
              entry={entry}
              index={index}
              canRemove={medicineEntries.length > 1}
              onUpdateEntry={handleUpdateMedicineEntry}
              onRemoveEntry={handleRemoveMedicineEntry}
              onFormulationPress={handleFormulationPress}
            />
          ))}
        </View>

        <TouchableOpacity
          style={styles.addEntryButton}
          onPress={handleAddNewMedicineEntry}
        >
          <Text style={styles.addEntryButtonText}>+ Add Another Medicine</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={validateAndSavePrescription}
        >
          <Text style={styles.saveButtonText}>
            Save All Prescriptions ({medicineEntries.length})
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9ff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6368ba",
    marginBottom: 20,
    textAlign: "center",
  },
  entriesContainer: {
    marginBottom: 20,
  },
  medicineEntryContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: "#6368ba",
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  entryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6368ba",
  },
  removeEntryButton: {
    backgroundColor: "#ff4757",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  removeEntryButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6368ba",
    marginBottom: 8,
    marginTop: 10,
  },
  formulationContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },
  formulationButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#bcc4f3",
    backgroundColor: "white",
  },
  selectedFormulation: {
    backgroundColor: "#bcc4f3",
    borderColor: "#6368ba",
  },
  formulationText: {
    color: "#6368ba",
    fontSize: 14,
    fontWeight: "500",
  },
  selectedFormulationText: {
    color: "#6368ba",
    fontWeight: "600",
  },
  addEntryButton: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#28a745",
    borderStyle: "dashed",
  },
  addEntryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#6368ba",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 30,
  },
  saveButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default MedicinePrescriptionPage;
