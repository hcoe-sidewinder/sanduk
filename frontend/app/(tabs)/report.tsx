import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { TextInput } from "react-native";


const mockReports: ILabReport[] = [
  {
    _id: "1",
    testTitle: "Urine Test",
    date: "2025-06-10",
    sampleNo: "UR12345",
    tests: [
      {
        testName: "Color",
        result: "Light Yellow",
      },
      {
        testName: "Sugar",
        result: "Nil",
        unit: "mg/dL",
        referenceRange: "<50 = Normal, 50 = Trace, 100 = 1+",
      },
      {
        testName: "pH",
        result: "5.00",
      },
    ],
  },
  {
    _id: "2",
    testTitle: "Blood Test",
    date: "2025-06-01",
    sampleNo: "BL67890",
    tests: [
      {
        testName: "Hemoglobin",
        result: "13.5",
        unit: "g/dL",
        referenceRange: "12 - 16",
      },
      {
        testName: "WBC Count",
        result: "7000",
        unit: "cells/mcL",
        referenceRange: "4500 – 11000",
      },
    ],
  },
];

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
const Report = () => {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");


  const toggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Medical Reports</Text>
      <TextInput
        placeholder="Search by test name..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchInput}
      />
      {mockReports
        .filter((report) => {
          const query = searchQuery.toLowerCase();
          return (
            report.testTitle.toLowerCase().includes(query) ||
            report.tests.some((test) =>
              test.testName.toLowerCase().includes(query)
            )
          );
        })
        .map((report) => {
          const isExpanded = expandedIds.includes(report._id);
          return (
            <View key={report._id} style={styles.card}>
              <TouchableOpacity onPress={() => toggleExpand(report._id)}>
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.reportTitle}>{report.testTitle}</Text>
                    <Text style={styles.dateText}>
                      {new Date(report.date).toLocaleDateString()}
                    </Text>
                  </View>
                  <Text style={styles.arrow}>{isExpanded ? "▼" : "▶"}</Text>
                </View>
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.table}>
                  <Text style={styles.sampleNo}>
                    Sample No: {report.sampleNo}
                  </Text>

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
                      <Text style={styles.cell}>
                        {test.referenceRange || "-"}
                      </Text>
                      <Text style={styles.cell}>{test.method || "-"}</Text>
                      <Text style={styles.cell}>
                        {test.conversionFactor || "-"}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f0f4f8",
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  arrow: {
    fontSize: 18,
    color: "#555",
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  dateText: {
    color: "#666",
  },
  sampleNo: {
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 12,
  },
  table: {
    marginTop: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
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
  searchInput: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    fontSize: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ccc",
  },
});

export default Report

