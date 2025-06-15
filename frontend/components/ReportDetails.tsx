import { View, Text, StyleSheet } from "react-native";
import { ITest, ILabReport } from "@/app/(tabs)/report";

const COLORS = {
  primary: "#bcc4f3",
  secondary: "#6368ba",
  accent: "#b4b8cb",
  lightBg: "#f4f5ff",
  textPrimary: "#2e3171",
  textSecondary: "#4b4e6d",
  cover: "#e0e3ff",
};


interface ReportDetailsProps {
  report: ILabReport;
}
const ReportDetails = ({ report }: ReportDetailsProps) => {
  console.log(report);
  return (
    <View style={styles.container}>
      <View style={styles.sampleContainer}>
        <Text style={styles.sampleLabel}>Sample Number</Text>
        <Text style={styles.sampleNo}>{report.sampleNo}</Text>
      </View>

      <View style={styles.tableContainer}>
        <View style={[styles.row, styles.headerRow]}>
          <Text style={styles.headerCell}>Test Name</Text>
          <Text style={styles.headerCell}>Result</Text>
          <Text style={styles.headerCell}>Unit</Text>
          <Text style={styles.headerCell}>Reference</Text>
        </View>

        {report.tests.map((test, i) => (
          <View key={i} style={[styles.row, styles.dataRow]}>
            <Text style={styles.testNameCell}>{test.testName}</Text>
            <Text style={styles.resultCell}>{test.result}</Text>
            <Text style={styles.cell}>{test.unit || "—"}</Text>
            <Text style={styles.refCell} numberOfLines={2}>
              {test.referenceRange || "—"}
            </Text>
          </View>
        ))}
      </View>
      {report.tests.some((test) => test.method || test.conversionFactor) && (
        <View style={styles.additionalInfo}>
          <Text style={styles.additionalTitle}>Additional Information</Text>
          {report.tests.map(
            (test, i) =>
              (test.method || test.conversionFactor) && (
                <View key={i} style={styles.additionalRow}>
                  <Text style={styles.additionalTestName}>
                    {test.testName}:
                  </Text>
                  {test.method && (
                    <Text style={styles.additionalText}>
                      Method: {test.method}
                    </Text>
                  )}
                  {test.conversionFactor && (
                    <Text style={styles.additionalText}>
                      Conv. Factor: {test.conversionFactor}
                    </Text>
                  )}
                </View>
              )
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    borderTopWidth: 2,
    borderTopColor: COLORS.primary,
    paddingTop: 16,
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
    marginBottom: 2,
  },
  sampleNo: {
    fontSize: 16,
    color: COLORS.textPrimary,
    fontWeight: "700",
    letterSpacing: 0.5,
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
  cell: {
    flex: 1,
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: "center",
    paddingHorizontal: 2,
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
  additionalInfo: {
    marginTop: 16,
    backgroundColor: COLORS.cover,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  additionalTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  additionalRow: {
    marginBottom: 6,
  },
  additionalTestName: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.secondary,
    marginBottom: 2,
  },
  additionalText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginLeft: 8,
  },
});

export default ReportDetails;
