import AnimatedBackground from "@/components/AnimatedBackground";
import { predictRisk } from "@/components/DiseasePredictor1";
import { mockFamilyHistory } from "@/constants/MockFamilyHistory";
import React from "react";
import { ScrollView, Text, View } from "react-native";

export default function PredictionScreen() {
  const predictions = predictRisk(mockFamilyHistory);

  return (
    <AnimatedBackground>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
          Hereditary Disease Risk (%)
        </Text>
        {Object.entries(predictions).map(([disease, percent]) => (
          <View
            key={disease}
            style={{
              backgroundColor:
                percent >= 66
                  ? "#fecaca"
                  : percent >= 33
                    ? "#fef08a"
                    : "#bbf7d0",
              padding: 12,
              marginBottom: 10,
              borderRadius: 8,
            }}
          >
            <Text style={{ fontSize: 18 }}>{disease}</Text>
            <Text style={{ fontWeight: "600" }}>{percent}% Risk</Text>
          </View>
        ))}
      </ScrollView>
    </AnimatedBackground>
  );
}
