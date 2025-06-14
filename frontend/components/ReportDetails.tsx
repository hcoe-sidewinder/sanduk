import { View, Text, StyleSheet } from "react-native";

interface ITest {
  testName: string;
  result: string;
  unit?: string;
  referenceRange?: string;
  method?: string;
  conversionFactor?: string;
}

interface ILabReport {
  _id: string;
  testTitle: string;
  date: string;
  sampleNo: string;
  tests: ITest[];
}

interface ReportDetailsProps {
  report: ILabReport;
}

const ReportDetails = ({ report }: ReportDetailsProps) => {
  return (
    <View style={styles.table}>
      <Text style={styles.sampleNo}>Sample No: {report.sampleNo}</Text>

      <View style={[styles.row, styles.headerRow]}>
        <Text style={styles.headerCell}>Test Name</Text>
        <Text style={styles.headerCell}>Result</Text>
        <Text style={styles.headerCell}>Unit</Text>
        <Text style={styles.headerCell}>Ref. Range</Text>
        <Text style={styles.headerCell}>Method</Text>
        <Text style={styles.headerCell}>Conv. Factor</Text>
      </View>

      {report.tests.map((test, i) => (
        <View key={i} style={styles.row}>
          <Text style={styles.cell}>{test.testName}</Text>
          <Text style={styles.cell}>{test.result}</Text>
          <Text style={styles.cell}>{test.unit || "-"}</Text>
          <Text style={styles.cell}>{test.referenceRange || "-"}</Text>
          <Text style={styles.cell}>{test.method || "-"}</Text>
          <Text style={styles.cell}>{test.conversionFactor || "-"}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  table: {
    marginTop: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  sampleNo: {
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 12,
  },
  headerRow: {
    backgroundColor: "#e0e0e0",
  },
  row: {
    flexDirection: "row",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  headerCell: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 12,
  },
  cell: {
    flex: 1,
    fontSize: 12,
  },
});

export default ReportDetails;
