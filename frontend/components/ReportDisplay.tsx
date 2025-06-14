import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

type TestResult = {
  testName: string;
  result: string;
  unit: string;
  referenceRange: string;
  method: string;
  conversionFactor: string;
};

type ReportProps = {
  report: {
    patientName: string;
    sampleNumber: string;
    collectedDate: string;
    billedDate: string;
    reportedDate: string;
    specimen: string;
    testResults: TestResult[];
  };
  onBack: () => void;
};

const ReportDisplay: React.FC<ReportProps> = ({ report, onBack }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Patient: {report.patientName}</Text>
      <Text>Sample No: {report.sampleNumber}</Text>
      <Text>Collected: {new Date(report.collectedDate).toLocaleString()}</Text>
      <Text>Billed: {new Date(report.billedDate).toLocaleString()}</Text>
      <Text>Reported: {new Date(report.reportedDate).toLocaleString()}</Text>
      <Text>Specimen: {report.specimen}</Text>

      <Text style={[styles.title, { marginTop: 20 }]}>Test Results:</Text>
      <View style={styles.table}>
        <View style={styles.tableRowHeader}>
          <Text style={styles.headerCell}>Test</Text>
          <Text style={styles.headerCell}>Result</Text>
          <Text style={styles.headerCell}>Reference</Text>
        </View>
        {report.testResults.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.cell}>{item.testName}</Text>
            <Text style={styles.cell}>{item.result}</Text>
            <Text style={styles.cell}>{item.referenceRange}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity onPress={onBack} style={styles.button}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ReportDisplay;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000",
  },
  table: {
    borderWidth: 1,
    borderColor: "#ccc",
  },
  tableRowHeader: {
    flexDirection: "row",
    backgroundColor: "#eee",
    padding: 5,
  },
  tableRow: {
    flexDirection: "row",
    padding: 5,
  },
  headerCell: {
    flex: 1,
    fontWeight: "bold",
  },
  cell: {
    flex: 1,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
