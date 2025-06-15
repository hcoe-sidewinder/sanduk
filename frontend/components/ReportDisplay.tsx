import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

type TestResult = {
  testName: string;
  result: string;
  unit: string;
  referenceRange: string;
  method: string;
  conversionFactor: string;
};

export type ReportProps = {
  report: {
    sampleNo: string;
    date: string;
    specimen: string;
    tests: TestResult[];
  };
  onBack: () => void;
};

const COLORS = {
  primary: "#bcc4f3",
  secondary: "#6368ba",
  accent: "#b4b8cb",
  lightBg: "#f4f5ff",
  textPrimary: "#2e3171",
  textSecondary: "#4b4e6d",
  cover: "#e0e3ff",
};

const ReportDisplay: React.FC<ReportProps> = ({ report, onBack }) => {
  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.sampleContainer}>
          <Text style={styles.sampleLabel}>Sample Number</Text>
          <Text style={styles.sampleNo}>{report.sampleNo}</Text>
          <Text style={styles.sampleLabel}>Collected On</Text>
          <Text style={styles.sampleDate}>
            {new Date(report.date).toLocaleString()}
          </Text>
          <Text style={styles.sampleLabel}>Specimen</Text>
          <Text style={styles.sampleDate}>{report.specimen}</Text>
        </View>

        <View style={styles.tableContainer}>
          <View style={[styles.row, styles.headerRow]}>
            <Text style={styles.headerCell}>Test Name</Text>
            <Text style={styles.headerCell}>Result</Text>
            <Text style={styles.headerCell}>Reference</Text>
            <Text style={styles.headerCell}>Method</Text>
            <Text style={styles.headerCell}>Conversion Fc.</Text>
          </View>

          {report.tests.map((test, i) => (
            <View key={i} style={[styles.row, styles.dataRow]}>
              <Text style={styles.testNameCell}>{test.testName}</Text>
              <Text style={styles.resultCell}>{test.result}</Text>
              <Text style={styles.refCell}>{test.referenceRange || "—"}</Text>
              <Text style={styles.refCell}>{test.method || "—"}</Text>
              <Text style={styles.refCell}>{test.conversionFactor || "—"}</Text>
            </View>
          ))}
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity
            onPress={onBack}
            style={[styles.button, styles.cancelButton]}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onBack}
            style={[styles.button, styles.saveButton]}
          >
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default ReportDisplay;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 30,
    backgroundColor: "white",
  },

  sampleContainer: {
    backgroundColor: COLORS.cover,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.secondary,
  },
  sampleLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "500",
    marginTop: 8,
  },
  sampleNo: {
    fontSize: 16,
    color: COLORS.textPrimary,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  sampleDate: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: "600",
  },
  tableContainer: {
    backgroundColor: COLORS.lightBg,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 1,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerRow: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  row: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  dataRow: {
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cover,
  },
  headerCell: {
    flex: 1,
    fontWeight: "600",
    fontSize: 13,
    color: "white",
    textAlign: "center",
  },
  testNameCell: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: "600",
    textAlign: "left",
    paddingHorizontal: 4,
  },
  resultCell: {
    flex: 1,
    fontSize: 13,
    color: COLORS.secondary,
    fontWeight: "700",
    textAlign: "center",
  },
  refCell: {
    flex: 1,
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: "center",
    paddingHorizontal: 2,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
    marginHorizontal: 6,
  },
  saveButton: {
    backgroundColor: COLORS.secondary,
  },
  cancelButton: {
    borderWidth: 2,
    borderColor: COLORS.secondary,
    backgroundColor: "transparent",
  },
  // buttonText: {
  //   color: "white",
  //   fontWeight: "600",
  // },
  cancelText: {
    color: COLORS.cover,
    fontWeight: "600",
  },
});
