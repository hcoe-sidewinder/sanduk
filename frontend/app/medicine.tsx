import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";

const ALL_FORMULATION = ["TABLET", "CAPSULE", "LIQUID", "INJECTION"];

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

  const addNewMedicineEntry = () => {
    const newEntry = {
      id: Date.now(),
      formulation: "",
      name: "",
      strength: "",
      frequency: "",
      duration: "",
    };
    setMedicineEntries([...medicineEntries, newEntry]);
  };

  const removeMedicineEntry = (id: number) => {
    if (medicineEntries.length > 1) {
      setMedicineEntries(medicineEntries.filter((entry) => entry.id !== id));
    } else {
      Alert.alert("Error", "At least one medicine entry is required");
    }
  };

  const updateMedicineEntry = (id: number, field: string, value: string) => {
    setMedicineEntries(
      medicineEntries.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  const validateAndSavePrescription = () => {
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

    // Prepare data for backend (array of medicine objects)
    const prescriptionData = medicineEntries.map(
      ({ id, ...medicine }) => medicine
    );

    Alert.alert("Success", "Prescription saved successfully!");
    console.log("Prescription Data (Array):", prescriptionData);

    // Here you would send prescriptionData to your backend
    // Example: await savePrescriptionToBackend(prescriptionData);
  };

  const FormulationButton = ({
    formulation,
    entryId,
    isSelected,
  }: {
    formulation: string;
    entryId: number;
    isSelected: boolean;
  }) => (
    <TouchableOpacity
      style={[
        styles.formulationButton,
        isSelected && styles.selectedFormulation,
      ]}
      onPress={() => updateMedicineEntry(entryId, "formulation", formulation)}
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
  );

  const MedicineEntryForm = ({
    entry,
    index,
  }: {
    entry: any;
    index: number;
  }) => (
    <View style={styles.medicineEntryContainer}>
      <View style={styles.entryHeader}>
        <Text style={styles.entryTitle}>Medicine #{index + 1}</Text>
        {medicineEntries.length > 1 && (
          <TouchableOpacity
            style={styles.removeEntryButton}
            onPress={() => removeMedicineEntry(entry.id)}
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
          />
        ))}
      </View>

      <Text style={styles.label}>Medicine Name *</Text>
      <TextInput
        style={styles.input}
        value={entry.name}
        onChangeText={(text) => updateMedicineEntry(entry.id, "name", text)}
        placeholder="Enter medicine name"
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Strength *</Text>
      <TextInput
        style={styles.input}
        value={entry.strength}
        onChangeText={(text) => updateMedicineEntry(entry.id, "strength", text)}
        placeholder="e.g., 500mg, 10ml"
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Frequency *</Text>
      <TextInput
        style={styles.input}
        value={entry.frequency}
        onChangeText={(text) =>
          updateMedicineEntry(entry.id, "frequency", text)
        }
        placeholder="e.g., Twice daily, TID"
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Duration *</Text>
      <TextInput
        style={styles.input}
        value={entry.duration}
        onChangeText={(text) => updateMedicineEntry(entry.id, "duration", text)}
        placeholder="e.g., 7 days, 2 weeks"
        placeholderTextColor="#999"
      />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Medicine Prescription Form</Text>

      {/* Medicine Entries */}
      <View style={styles.entriesContainer}>
        {medicineEntries.map((entry, index) => (
          <MedicineEntryForm key={entry.id} entry={entry} index={index} />
        ))}
      </View>

      {/* Add New Medicine Entry Button */}
      <TouchableOpacity
        style={styles.addEntryButton}
        onPress={addNewMedicineEntry}
      >
        <Text style={styles.addEntryButtonText}>+ Add Another Medicine</Text>
      </TouchableOpacity>

      {/* Save All Prescriptions Button */}
      <TouchableOpacity
        style={styles.saveButton}
        onPress={validateAndSavePrescription}
      >
        <Text style={styles.saveButtonText}>
          Save All Prescriptions ({medicineEntries.length})
        </Text>
      </TouchableOpacity>
    </ScrollView>
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
  input: {
    borderWidth: 1,
    borderColor: "#bcc4f3",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "white",
    marginBottom: 10,
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
