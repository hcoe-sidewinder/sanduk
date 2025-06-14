"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import {
  Svg,
  Circle,
  Text as SvgText,
  Defs,
  RadialGradient,
  Stop,
} from "react-native-svg";
import { predictDiseaseRisk, sampleModel } from "../utils/predictor";
import AnimatedBackground from "@/components/AnimatedBackground";

const { width, height } = Dimensions.get("window");

const familyMembers = [
  "maternal_grandfather",
  "maternal_grandmother",
  "paternal_grandfather",
  "paternal_grandmother",
  "father",
  "mother",
] as const;

const diseases = Object.keys(sampleModel.diseases);

type FamilyMember = (typeof familyMembers)[number];
type Disease = (typeof diseases)[number];

const familyMemberData = {
  maternal_grandfather: {
    name: "Maternal Grandfather",
    emoji: "👴",
    position: { x: 0.2, y: 0.1 },
    color: "#4a90e2",
  },
  maternal_grandmother: {
    name: "Maternal Grandmother",
    emoji: "👵",
    position: { x: 0.4, y: 0.1 },
    color: "#e24a90",
  },
  paternal_grandfather: {
    name: "Paternal Grandfather",
    emoji: "👴",
    position: { x: 0.6, y: 0.1 },
    color: "#4a90e2",
  },
  paternal_grandmother: {
    name: "Paternal Grandmother",
    emoji: "👵",
    position: { x: 0.8, y: 0.1 },
    color: "#e24a90",
  },
  father: {
    name: "Father",
    emoji: "👨",
    position: { x: 0.3, y: 0.4 },
    color: "#4a90e2",
  },
  mother: {
    name: "Mother",
    emoji: "👩",
    position: { x: 0.7, y: 0.4 },
    color: "#e24a90",
  },
};

const diseaseData: {
  [key: string]: { name: string; emoji: string; color: string };
} = {
  heart_disease: { name: "Heart Disease", emoji: "❤️", color: "#ef4444" },
  diabetes: { name: "Diabetes", emoji: "🩺", color: "#f59e0b" },
  cancer: { name: "Cancer", emoji: "🎗️", color: "#8b5cf6" },
  hypertension: { name: "Hypertension", emoji: "🫀", color: "#ec4899" },
  alzheimers: { name: "Alzheimer's", emoji: "🧠", color: "#06b6d4" },
  stroke: { name: "Stroke", emoji: "⚡", color: "#f97316" },
};

interface FloatingDiseaseProps {
  disease: Disease;
  onAssign: (disease: Disease, member: FamilyMember) => void;
  isAssigned: boolean;
}

const FloatingDisease: React.FC<FloatingDiseaseProps> = ({
  disease,
  onAssign,
  isAssigned,
}) => {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const colors = {
    primary: "#bcc4f3",
    secondary: "#6368ba",
    accent: "#b4b8cb",
  };

  const diseaseInfo = diseaseData[disease] || {
    name: disease,
    emoji: "🏥",
    color: colors.primary,
  };

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2000 + Math.random() * 1000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000 + Math.random() * 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 10000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Animated.View
      style={[
        styles.floatingDisease,
        {
          backgroundColor: isAssigned
            ? diseaseInfo.color + "40"
            : diseaseInfo.color + "20",
          borderColor: diseaseInfo.color,
          transform: [
            {
              translateY: floatAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -10],
              }),
            },
            { scale: scaleAnim },
            {
              rotate: rotateAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ["0deg", "360deg"],
              }),
            },
          ],
        },
      ]}
    >
      <Pressable onPress={handlePress} style={styles.diseaseButton}>
        <Text style={styles.diseaseEmoji}>{diseaseInfo.emoji}</Text>
        <Text style={[styles.diseaseName, { color: diseaseInfo.color }]}>
          {diseaseInfo.name}
        </Text>
        {isAssigned && (
          <View
            style={[
              styles.assignedBadge,
              { backgroundColor: diseaseInfo.color },
            ]}
          >
            <Text style={styles.assignedText}>✓</Text>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
};

interface FamilyMemberCardProps {
  member: FamilyMember;
  diseases: Disease[];
  onToggle: (disease: Disease, member: FamilyMember) => void;
  assignedDiseases: Disease[];
}

const FamilyMemberCard: React.FC<FamilyMemberCardProps> = ({
  member,
  diseases,
  onToggle,
  assignedDiseases,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  const memberInfo = familyMemberData[member];
  const colors = {
    primary: "#bcc4f3",
    secondary: "#6368ba",
    accent: "#b4b8cb",
  };

  useEffect(() => {
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    if (assignedDiseases.length > 0) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [assignedDiseases.length]);

  return (
    <Animated.View
      style={[
        styles.familyMemberCard,
        {
          backgroundColor: memberInfo.color + "15",
          borderColor: memberInfo.color,
          transform: [{ scale: pulseAnim }],
          shadowColor: memberInfo.color,
          shadowOpacity: glowAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.2, 0.8],
          }),
        },
      ]}
    >
      <View style={styles.memberHeader}>
        <Text style={styles.memberEmoji}>{memberInfo.emoji}</Text>
        <Text style={[styles.memberName, { color: memberInfo.color }]}>
          {memberInfo.name}
        </Text>
      </View>

      <View style={styles.diseaseGrid}>
        {diseases.map((disease) => {
          const isAssigned = assignedDiseases.includes(disease);
          const diseaseInfo = diseaseData[disease] || {
            name: disease,
            emoji: "🏥",
            color: colors.primary,
          };

          return (
            <Pressable
              key={disease}
              onPress={() => onToggle(disease, member)}
              style={[
                styles.diseaseToggle,
                {
                  backgroundColor: isAssigned
                    ? diseaseInfo.color
                    : "transparent",
                  borderColor: diseaseInfo.color,
                },
              ]}
            >
              <Text style={styles.toggleEmoji}>{diseaseInfo.emoji}</Text>
              {isAssigned && (
                <View style={styles.checkMark}>
                  <Text style={styles.checkText}>✓</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      <View style={styles.diseaseCount}>
        <Text style={[styles.countText, { color: memberInfo.color }]}>
          {assignedDiseases.length} condition
          {assignedDiseases.length !== 1 ? "s" : ""}
        </Text>
      </View>
    </Animated.View>
  );
};

interface RiskVisualizationProps {
  result: { [disease: string]: { risk: number } };
}

const RiskVisualization: React.FC<RiskVisualizationProps> = ({ result }) => {
  const animValues = useRef(
    Object.keys(result).reduce(
      (acc, disease) => ({
        ...acc,
        [disease]: new Animated.Value(0),
      }),
      {} as { [key: string]: Animated.Value }
    )
  ).current;

  const colors = {
    primary: "#bcc4f3",
    secondary: "#6368ba",
    accent: "#b4b8cb",
  };

  useEffect(() => {
    const animations = Object.keys(result).map((disease, index) =>
      Animated.timing(animValues[disease], {
        toValue: result[disease].risk,
        duration: 1500,
        delay: index * 200,
        useNativeDriver: false,
      })
    );

    Animated.parallel(animations).start();
  }, [result]);

  return (
    <View style={styles.riskVisualization}>
      <Text style={[styles.resultTitle, { color: colors.secondary }]}>
        🎯 Risk Assessment Results
      </Text>

      <View style={styles.riskGrid}>
        {Object.entries(result).map(([disease, { risk }]) => {
          const diseaseInfo = diseaseData[disease] || {
            name: disease,
            emoji: "🏥",
            color: colors.primary,
          };
          const riskLevel = risk >= 70 ? "High" : risk >= 40 ? "Medium" : "Low";
          const riskColor =
            risk >= 70 ? "#ef4444" : risk >= 40 ? "#f59e0b" : "#10b981";

          return (
            <View
              key={disease}
              style={[styles.riskCard, { borderColor: diseaseInfo.color }]}
            >
              <View style={styles.riskHeader}>
                <Text style={styles.riskEmoji}>{diseaseInfo.emoji}</Text>
                <Text
                  style={[styles.riskDisease, { color: diseaseInfo.color }]}
                >
                  {diseaseInfo.name}
                </Text>
              </View>

              <View style={styles.riskMeter}>
                <Svg width={120} height={120}>
                  <Defs>
                    <RadialGradient
                      id={`gradient-${disease}`}
                      cx="50%"
                      cy="50%"
                      r="50%"
                    >
                      <Stop
                        offset="0%"
                        stopColor={riskColor}
                        stopOpacity="0.8"
                      />
                      <Stop
                        offset="100%"
                        stopColor={riskColor}
                        stopOpacity="0.3"
                      />
                    </RadialGradient>
                  </Defs>
                  <Circle
                    cx={60}
                    cy={60}
                    r={50}
                    stroke={colors.accent + "30"}
                    strokeWidth="8"
                    fill="none"
                  />
                  <Circle
                    cx={60}
                    cy={60}
                    r={50}
                    stroke={`url(#gradient-${disease})`}
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(risk / 100) * 314} 314`}
                    strokeLinecap="round"
                    transform="rotate(-90 60 60)"
                  />
                  <SvgText
                    x={60}
                    y={65}
                    fontSize="18"
                    fontWeight="bold"
                    fill={riskColor}
                    textAnchor="middle"
                  >
                    {risk}%
                  </SvgText>
                </Svg>
              </View>

              <View
                style={[styles.riskLevelBadge, { backgroundColor: riskColor }]}
              >
                <Text style={styles.riskLevelText}>{riskLevel} Risk</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default function RiskScreen() {
  const [diseaseHistory, setDiseaseHistory] = useState<
    Record<Disease, Record<FamilyMember, boolean>>
  >(
    () =>
      Object.fromEntries(
        diseases.map((disease) => [
          disease,
          Object.fromEntries(familyMembers.map((member) => [member, false])),
        ])
      ) as Record<Disease, Record<FamilyMember, boolean>>
  );

  const [result, setResult] = useState<{
    [disease: string]: { risk: number };
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const buttonScale = useRef(new Animated.Value(1)).current;
  const analyzeAnim = useRef(new Animated.Value(0)).current;

  const colors = {
    primary: "#bcc4f3",
    secondary: "#6368ba",
    accent: "#b4b8cb",
  };

  const toggle = (disease: Disease, member: FamilyMember) => {
    setDiseaseHistory((prev) => ({
      ...prev,
      [disease]: {
        ...prev[disease],
        [member]: !prev[disease][member],
      },
    }));
  };

  const predict = async () => {
    setIsAnalyzing(true);

    // Dramatic button animation
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1.1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Analyzing animation
    Animated.loop(
      Animated.timing(analyzeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();

    // Simulate analysis time for dramatic effect
    setTimeout(() => {
      const output: { [disease: string]: { risk: number } } = {};

      diseases.forEach((disease) => {
        const inputs = familyMembers.map((member) =>
          diseaseHistory[disease][member] ? 1 : 0
        );
        const prediction = predictDiseaseRisk(
          { diseases: { [disease]: sampleModel.diseases[disease] } },
          inputs
        );
        output[disease] = { risk: prediction[disease].risk };
      });

      setResult(output);
      setIsAnalyzing(false);
      analyzeAnim.stopAnimation();
      analyzeAnim.setValue(0);
    }, 2000);
  };

  const getAssignedDiseases = (member: FamilyMember): Disease[] => {
    return diseases.filter((disease) => diseaseHistory[disease][member]);
  };

  const getTotalAssignments = () => {
    return diseases.reduce((total, disease) => {
      return (
        total +
        familyMembers.filter((member) => diseaseHistory[disease][member]).length
      );
    }, 0);
  };

  return (
    <AnimatedBackground>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Creative Header */}
        <View style={styles.header}>
          <View
            style={[styles.headerBadge, { backgroundColor: colors.secondary }]}
          >
            <Text style={styles.headerEmoji}>🧬</Text>
          </View>
          <Text style={[styles.headerTitle, { color: colors.secondary }]}>
            Family Health Matrix
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.accent }]}>
            Assign conditions to family members and discover your genetic risk
            profile
          </Text>
        </View>

        {/* Progress Indicator */}
        <View
          style={[
            styles.progressContainer,
            { backgroundColor: colors.primary + "20" },
          ]}
        >
          <Text style={[styles.progressText, { color: colors.secondary }]}>
            📊 {getTotalAssignments()} conditions assigned across{" "}
            {familyMembers.length} family members
          </Text>
        </View>

        {/* Family Members Grid */}
        <View style={styles.familyGrid}>
          {familyMembers.map((member) => (
            <FamilyMemberCard
              key={member}
              member={member}
              diseases={diseases}
              onToggle={toggle}
              assignedDiseases={getAssignedDiseases(member)}
            />
          ))}
        </View>

        {/* Analyze Button */}
        <Animated.View
          style={[
            styles.analyzeContainer,
            { transform: [{ scale: buttonScale }] },
          ]}
        >
          <Pressable
            onPress={predict}
            disabled={isAnalyzing}
            style={[
              styles.analyzeButton,
              {
                backgroundColor: isAnalyzing ? colors.accent : colors.secondary,
              },
            ]}
          >
            {isAnalyzing ? (
              <Animated.View
                style={{
                  transform: [
                    {
                      rotate: analyzeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0deg", "360deg"],
                      }),
                    },
                  ],
                }}
              >
                <Text style={styles.analyzeEmoji}>🔄</Text>
              </Animated.View>
            ) : (
              <Text style={styles.analyzeEmoji}>🎯</Text>
            )}
            <Text style={styles.analyzeText}>
              {isAnalyzing
                ? "Analyzing Genetic Patterns..."
                : "Analyze Risk Profile"}
            </Text>
          </Pressable>
        </Animated.View>

        {/* Results */}
        {result && <RiskVisualization result={result} />}

        <View style={{ height: 50 }} />
      </ScrollView>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  headerBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  headerEmoji: {
    fontSize: 32,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
  },
  progressContainer: {
    padding: 15,
    borderRadius: 15,
    marginBottom: 25,
    alignItems: "center",
  },
  progressText: {
    fontSize: 16,
    fontWeight: "600",
  },
  familyGrid: {
    gap: 20,
    marginBottom: 30,
  },
  familyMemberCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 8,
  },
  memberHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  memberEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  memberName: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
  },
  diseaseGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 15,
  },
  diseaseToggle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  toggleEmoji: {
    fontSize: 20,
  },
  checkMark: {
    position: "absolute",
    top: -5,
    right: -5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#10b981",
    justifyContent: "center",
    alignItems: "center",
  },
  checkText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  diseaseCount: {
    alignItems: "center",
  },
  countText: {
    fontSize: 14,
    fontWeight: "600",
  },
  analyzeContainer: {
    marginBottom: 30,
  },
  analyzeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  analyzeEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  analyzeText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  riskVisualization: {
    marginTop: 20,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
  },
  riskGrid: {
    gap: 20,
  },
  riskCard: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  riskHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  riskEmoji: {
    fontSize: 24,
    marginRight: 10,
  },
  riskDisease: {
    fontSize: 18,
    fontWeight: "bold",
  },
  riskMeter: {
    marginBottom: 15,
  },
  riskLevelBadge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  riskLevelText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  floatingDisease: {
    borderRadius: 15,
    borderWidth: 2,
    margin: 5,
  },
  diseaseButton: {
    padding: 15,
    alignItems: "center",
    position: "relative",
  },
  diseaseEmoji: {
    fontSize: 24,
    marginBottom: 5,
  },
  diseaseName: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  assignedBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  assignedText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});
