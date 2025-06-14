import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { TextInput } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";


import ReportDetails from "@/components/ReportDetails";
import { api, handleApiError } from "@/api/axiosConfig";
import { getData } from "../home";

const COLORS = {
  primary: "#bcc4f3",
  secondary: "#6368ba",
  accent: "#b4b8cb",
  lightBg: "#f4f5ff",
  textPrimary: "#2e3171",
  textSecondary: "#4b4e6d",
  cover: "#e0e3ff",
};

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

useEffect(()=>{
  const fetchLabReports = async () => {
    const data = await getData("auth");
  try {

    const response = await api.get(`/users/${data._id}/reports`);
    console.log(response.data)
  } catch (error) {
    const message = handleApiError(error as Error);
    console.log(message.message);
  }
  }
  fetchLabReports();
},[])

  const filteredReports = mockReports.filter((report) => {
    const query = searchQuery.toLowerCase();
    return (
      report.testTitle.toLowerCase().includes(query) ||
      report.tests.some((test) => test.testName.toLowerCase().includes(query))
    );
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Medical Reports</Text>
        <Text style={styles.subtitle}>Your health reports at a glance</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <TextInput
            placeholder="Search your tests.."
            placeholderTextColor={COLORS.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
          <MaterialIcons
            name="search"
            size={24}
            color={COLORS.textSecondary}
            style={styles.searchIcon}
          />
        </View>
      </View>

      <View style={styles.reportsContainer}>
        {filteredReports.map((report) => {
          const isExpanded = expandedIds.includes(report._id);

          return (
            <View key={report._id} style={styles.card}>
              <TouchableOpacity
                onPress={() => toggleExpand(report._id)}
                activeOpacity={0.7}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.reportInfo}>
                    <Text style={styles.reportTitle}>{report.testTitle}</Text>
                    <Text style={styles.dateText}>
                      {new Date(report.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </Text>
                  </View>
                  <View style={styles.arrowContainer}>
                    <Text
                      style={[styles.arrow, isExpanded && styles.arrowExpanded]}
                    >
                      ▶
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              {isExpanded && <ReportDetails report={report} />}
            </View>
          );
        })}

        {filteredReports.length === 0 && (
          <View style={styles.noResults}>
            <Text style={styles.noResultsText}>No reports found</Text>
            <Text style={styles.noResultsSubtext}>
              Try adjusting your search terms
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightBg,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 36,
    paddingBottom: 16,
    backgroundColor: COLORS.secondary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "white",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.primary,
    opacity: 0.9,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

  reportsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.cover,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
  },
  reportInfo: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  dateText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: "500",
    marginBottom: 8,
  },
  testCount: {
    backgroundColor: COLORS.cover,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  testCountText: {
    fontSize: 12,
    color: COLORS.secondary,
    fontWeight: "600",
  },
  arrowContainer: {
    padding: 4,
  },
  arrowExpanded: {
    transform: [{ rotate: "90deg" }],
  },
  arrow: {
    fontSize: 20,
    color: COLORS.secondary,
    fontWeight: "600",
  },
  noResults: {
    alignItems: "center",
    paddingVertical: 40,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: COLORS.accent,
  },
  searchBox: {
    position: "relative",
    justifyContent: "center",
  },
  searchInput: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    fontSize: 16,
    color: COLORS.textPrimary,
    elevation: 2,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.cover,
    paddingRight: 40, 
  },
  searchIcon: {
    position: "absolute",
    right: 16,
  },
});

export default Report;
