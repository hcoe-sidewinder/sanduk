"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import {
  Svg,
  Circle,
  Text as SvgText,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg";
import { mockFamilyData, ALL_DISEASES } from "../data/MockFamily";
import { predictDiseaseRisk, sampleModel } from "../utils/predictor";
import AnimatedBackground from "@/components/AnimatedBackground";

const { width } = Dimensions.get("window");
const diseaseInfo: {
  [key: string]: {
    name: string;
    icon: string;
    color: string;
    category: string;
    severity: number;
  };
} = {
  heart_disease: {
    name: "Cardiovascular Disease",
    icon: "🅗",
    color: "#dc2626",
    category: "Cardiovascular",
    severity: 3,
  },
  diabetes: {
    name: "Type 2 Diabetes",
    icon: "🅓",
    color: "#ea580c",
    category: "Metabolic",
    severity: 2,
  },
  cancer: {
    name: "Malignant Neoplasm",
    icon: "🅒",
    color: "#7c3aed",
    category: "Oncological",
    severity: 3,
  },
  hypertension: {
    name: "Essential Hypertension",
    icon: "🅗",
    color: "#be185d",
    category: "Cardiovascular",
    severity: 2,
  },
  alzheimers: {
    name: "Alzheimer's Disease",
    icon: "🅐",
    color: "#0891b2",
    category: "Neurological",
    severity: 3,
  },
  stroke: {
    name: "Cerebrovascular Accident",
    icon: "🅢",
    color: "#c2410c",
    category: "Neurological",
    severity: 3,
  },
  arthritis: {
    name: "Rheumatoid Arthritis",
    icon: "🅡",
    color: "#65a30d",
    category: "Rheumatological",
    severity: 1,
  },
  osteoporosis: {
    name: "Osteoporosis",
    icon: "🅞",
    color: "#6b7280",
    category: "Musculoskeletal",
    severity: 1,
  },
  depression: {
    name: "Major Depression",
    icon: "🅓",
    color: "#2563eb",
    category: "Psychiatric",
    severity: 2,
  },
};

interface FamilyMemberCardProps {
  member: any;
  index: number;
}

const FamilyMemberCard: React.FC<FamilyMemberCardProps> = ({
  member,
  index,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.98)).current;

  const colors = {
    primary: "#bcc4f3",
    secondary: "#6368ba",
    accent: "#b4b8cb",
    text: "#0f172a",
    textSecondary: "#475569",
    textTertiary: "#64748b",
    surface: "#ffffff",
    surfaceSecondary: "#f8fafc",
  };

  useEffect(() => {
    const delay = index * 100;

    setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);
  }, []);

  const conditionsCount = member.conditions.length;
  const memberColor = member.gender === "male" ? "#3b82f6" : "#ec4899";
  const hasHighRiskConditions = member.conditions.some(
    (condition: string) => diseaseInfo[condition]?.severity >= 3
  );

  return (
    <Animated.View
      style={[
        styles.memberCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          backgroundColor: colors.surface,
          borderColor: hasHighRiskConditions
            ? memberColor + "20"
            : "transparent",
        },
      ]}
    >
      <View style={styles.memberHeader}>
        <View
          style={[
            styles.memberAvatarContainer,
            { backgroundColor: memberColor + "08" },
          ]}
        >
          <View
            style={[
              styles.memberAvatar,
              {
                backgroundColor: memberColor + "15",
                borderColor: memberColor + "30",
              },
            ]}
          >
            <Text style={styles.memberEmoji}>{member.emoji}</Text>
          </View>
          {hasHighRiskConditions && (
            <View
              style={[styles.riskIndicator, { backgroundColor: "#ef4444" }]}
            >
              <Text style={styles.riskIndicatorText}>!</Text>
            </View>
          )}
        </View>

        <View style={styles.memberDetails}>
          <Text style={[styles.memberName, { color: colors.text }]}>
            {member.name}
          </Text>
          <Text
            style={[styles.memberRelation, { color: colors.textSecondary }]}
          >
            {member.relation}
          </Text>

          <View style={styles.memberStats}>
            <View
              style={[
                styles.conditionsBadge,
                { backgroundColor: colors.primary + "15" },
              ]}
            >
              <Text
                style={[styles.conditionsText, { color: colors.secondary }]}
              >
                {conditionsCount} condition{conditionsCount !== 1 ? "s" : ""}
              </Text>
            </View>
            {member.ageOfOnset && Object.keys(member.ageOfOnset).length > 0 && (
              <View
                style={[
                  styles.ageBadge,
                  { backgroundColor: colors.accent + "15" },
                ]}
              >
                <Text style={[styles.ageText, { color: colors.textTertiary }]}>
                  Avg onset:{" "}
                  {Math.round(
                    (Object.values(member.ageOfOnset) as number[]).reduce(
                      (a, b) => a + b,
                      0
                    ) / Object.values(member.ageOfOnset).length
                  )}
                  y
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <View style={styles.conditionsSection}>
        <Text style={[styles.conditionsLabel, { color: colors.textSecondary }]}>
          Medical History
        </Text>
        <View style={styles.conditionsGrid}>
          {ALL_DISEASES.map((disease) => {
            const hasCondition = member.conditions.includes(disease);
            const info = diseaseInfo[disease] || {
              name: disease,
              emoji: "🏥",
              color: colors.accent,
              severity: 1,
            };

            return (
              <View
                key={disease}
                style={[
                  styles.conditionChip,
                  {
                    backgroundColor: hasCondition
                      ? info.color + "12"
                      : colors.surfaceSecondary,
                    borderColor: hasCondition
                      ? info.color + "25"
                      : "transparent",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.conditionEmoji,
                    { opacity: hasCondition ? 1 : 0.3 },
                  ]}
                >
                  {info.icon}
                </Text>
                <View
                  style={[
                    styles.conditionStatus,
                    {
                      backgroundColor: hasCondition
                        ? info.color
                        : colors.accent + "40",
                    },
                  ]}
                >
                  <Text style={styles.conditionStatusText}>
                    {hasCondition ? "✓" : "—"}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </Animated.View>
  );
};

interface RiskResultCardProps {
  disease: string;
  risk: number;
  index: number;
}

const RiskResultCard: React.FC<RiskResultCardProps> = ({
  disease,
  risk,
  index,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  const colors = {
    primary: "#bcc4f3",
    secondary: "#6368ba",
    accent: "#b4b8cb",
    text: "#0f172a",
    textSecondary: "#475569",
    textTertiary: "#64748b",
    surface: "#ffffff",
  };

  const info = diseaseInfo[disease] || {
    name: disease,
    emoji: "🏥",
    color: colors.accent,
    category: "General",
    severity: 1,
  };
  const riskLevel =
    risk >= 70
      ? "Critical"
      : risk >= 50
        ? "High"
        : risk >= 25
          ? "Moderate"
          : "Low";
  const riskColor =
    risk >= 70
      ? "#dc2626"
      : risk >= 50
        ? "#ea580c"
        : risk >= 25
          ? "#ca8a04"
          : "#16a34a";

  useEffect(() => {
    const delay = index * 150;

    setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(progressAnim, {
          toValue: risk,
          duration: 2000,
          useNativeDriver: false,
        }),
      ]).start();

      if (risk >= 50) {
        Animated.loop(
          Animated.sequence([
            Animated.timing(glowAnim, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(glowAnim, {
              toValue: 0,
              duration: 2000,
              useNativeDriver: true,
            }),
          ])
        ).start();
      }
    }, delay);
  }, []);

  return (
    <Animated.View
      style={[
        styles.riskCard,
        {
          opacity: fadeAnim,
          backgroundColor: colors.surface,
          shadowColor: risk >= 50 ? riskColor : "#000",
          shadowOpacity: glowAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.08, 0.25],
          }),
        },
      ]}
    >
      <View style={styles.riskCardHeader}>
        <View style={styles.riskIconSection}>
          <View
            style={[
              styles.riskIconContainer,
              { backgroundColor: info.color + "10" },
            ]}
          >
            <Text style={styles.riskEmoji}>{info.icon}</Text>
          </View>
          <View style={styles.riskTitleSection}>
            <Text style={[styles.riskDisease, { color: colors.text }]}>
              {info.name}
            </Text>
            <Text style={[styles.riskCategory, { color: colors.textTertiary }]}>
              {info.category}
            </Text>
          </View>
        </View>

        <View style={styles.riskLevelSection}>
          <View style={[styles.riskLevelBadge, { backgroundColor: riskColor }]}>
            <Text style={styles.riskLevelText}>{riskLevel}</Text>
          </View>
          <Text style={[styles.riskPercentage, { color: riskColor }]}>
            {risk}%
          </Text>
        </View>
      </View>

      <View style={styles.riskVisualization}>
        <View style={styles.progressSection}>
          <View style={styles.progressLabels}>
            <Text
              style={[styles.progressLabel, { color: colors.textTertiary }]}
            >
              Risk Level
            </Text>
            <Text style={[styles.progressValue, { color: riskColor }]}>
              {risk}%
            </Text>
          </View>
          <View
            style={[
              styles.progressTrack,
              { backgroundColor: colors.accent + "15" },
            ]}
          >
            <Animated.View
              style={[
                styles.progressFill,
                {
                  backgroundColor: riskColor,
                  width: progressAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: ["0%", "100%"],
                    extrapolate: "clamp",
                  }),
                },
              ]}
            />
            <View style={styles.progressMarkers}>
              {[25, 50, 75].map((marker) => (
                <View
                  key={marker}
                  style={[
                    styles.progressMarker,
                    { left: `${marker}%`, backgroundColor: colors.surface },
                  ]}
                />
              ))}
            </View>
          </View>
        </View>

        <View style={styles.circularSection}>
          <Svg width={90} height={90}>
            <Defs>
              <LinearGradient
                id={`gradient-${disease}`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <Stop offset="0%" stopColor={riskColor} stopOpacity="1" />
                <Stop offset="100%" stopColor={riskColor} stopOpacity="0.6" />
              </LinearGradient>
            </Defs>
            <Circle
              cx={45}
              cy={45}
              r={38}
              stroke={colors.accent + "20"}
              strokeWidth="4"
              fill="none"
            />
            <Circle
              cx={45}
              cy={45}
              r={38}
              stroke={`url(#gradient-${disease})`}
              strokeWidth="4"
              fill="none"
              strokeDasharray={`${(risk / 100) * 238} 238`}
              strokeLinecap="round"
              transform="rotate(-90 45 45)"
            />
            <SvgText
              x={45}
              y={50}
              fontSize="16"
              fontWeight="700"
              fill={riskColor}
              textAnchor="middle"
            >
              {risk}%
            </SvgText>
          </Svg>
        </View>
      </View>

      <View style={styles.recommendationSection}>
        <Text
          style={[styles.recommendationLabel, { color: colors.textSecondary }]}
        >
          Clinical Recommendation
        </Text>
        <Text
          style={[styles.recommendationText, { color: colors.textTertiary }]}
        >
          {getAdvancedRecommendation(risk, info.name, info.category)}
        </Text>
      </View>
    </Animated.View>
  );
};

const getAdvancedRecommendation = (
  risk: number,
  diseaseName: string,
  category: string
): string => {
  if (risk >= 70) {
    return `Immediate specialist consultation recommended. Consider genetic counseling and aggressive preventive measures for ${diseaseName.toLowerCase()}.`;
  } else if (risk >= 50) {
    return `High-priority screening protocol advised. Regular monitoring and lifestyle interventions strongly recommended.`;
  } else if (risk >= 25) {
    return `Standard screening schedule with enhanced monitoring. Preventive lifestyle modifications beneficial.`;
  } else {
    return `Routine screening as per clinical guidelines. Maintain healthy lifestyle and regular check-ups.`;
  }
};

export default function RiskScreen() {
  const [result, setResult] = useState<Record<string, number> | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const titleFadeAnim = useRef(new Animated.Value(0)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;
  const analyzeRotateAnim = useRef(new Animated.Value(0)).current;

  const colors = {
    primary: "#bcc4f3",
    secondary: "#6368ba",
    accent: "#b4b8cb",
    text: "#0f172a",
    textSecondary: "#475569",
    textTertiary: "#64748b",
    surface: "#ffffff",
    surfaceSecondary: "#f8fafc",
  };

  useEffect(() => {
    Animated.timing(titleFadeAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();
  }, []);

  const calculateRisk = async () => {
    setIsAnalyzing(true);

    // Sophisticated button animation
    Animated.sequence([
      Animated.timing(buttonScaleAnim, {
        toValue: 0.96,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScaleAnim, {
        toValue: 1.02,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.timing(analyzeRotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();

    setTimeout(() => {
      const diseaseToInput: Record<string, number[]> = {};
      for (const disease of ALL_DISEASES) {
        diseaseToInput[disease] = mockFamilyData.map((member) =>
          member.conditions.includes(disease) ? 1 : 0
        );
      }

      const predictions = Object.fromEntries(
        ALL_DISEASES.map((disease) => {
          const inputs = diseaseToInput[disease];
          const risk = predictDiseaseRisk(
            { diseases: { [disease]: sampleModel.diseases[disease] } },
            inputs
          )[disease].risk;
          return [disease, risk];
        })
      );

      setResult(predictions);
      setIsAnalyzing(false);
      analyzeRotateAnim.stopAnimation();
      analyzeRotateAnim.setValue(0);
    }, 3000);
  };

  const totalConditions = mockFamilyData.reduce(
    (total, member) => total + member.conditions.length,
    0
  );
  const averageRisk = result
    ? Math.round(
        Object.values(result).reduce((a, b) => a + b, 0) /
          Object.values(result).length
      )
    : 0;
  const highRiskCount = result
    ? Object.values(result).filter((risk) => risk >= 50).length
    : 0;

  return (
    <AnimatedBackground>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.header, { opacity: titleFadeAnim }]}>
          <View
            style={[styles.headerBadge, { backgroundColor: colors.secondary }]}
          >
            <Text style={styles.headerEmoji}>🧬</Text>
          </View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Genetic Risk Assessment
          </Text>
          <Text
            style={[styles.headerSubtitle, { color: colors.textSecondary }]}
          >
            Advanced hereditary disease risk analysis based on comprehensive
            family medical history
          </Text>
        </Animated.View>

        <View style={styles.statsGrid}>
          <View
            style={[
              styles.statCard,
              { backgroundColor: colors.primary + "12" },
            ]}
          >
            <View
              style={[
                styles.statIcon,
                { backgroundColor: colors.primary + "20" },
              ]}
            >
              <Text style={styles.statEmoji}>👥</Text>
            </View>
            <Text style={[styles.statNumber, { color: colors.secondary }]}>
              {mockFamilyData.length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textTertiary }]}>
              Family Members
            </Text>
          </View>

          <View
            style={[styles.statCard, { backgroundColor: colors.accent + "12" }]}
          >
            <View
              style={[
                styles.statIcon,
                { backgroundColor: colors.accent + "20" },
              ]}
            >
              <Text style={styles.statEmoji}>🏥</Text>
            </View>
            <Text style={[styles.statNumber, { color: colors.secondary }]}>
              {totalConditions}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textTertiary }]}>
              Total Conditions
            </Text>
          </View>

          {result && (
            <>
              <View
                style={[
                  styles.statCard,
                  { backgroundColor: colors.secondary + "12" },
                ]}
              >
                <View
                  style={[
                    styles.statIcon,
                    { backgroundColor: colors.secondary + "20" },
                  ]}
                >
                  <Text style={styles.statEmoji}>📊</Text>
                </View>
                <Text style={[styles.statNumber, { color: colors.secondary }]}>
                  {averageRisk}%
                </Text>
                <Text
                  style={[styles.statLabel, { color: colors.textTertiary }]}
                >
                  Average Risk
                </Text>
              </View>

              <View
                style={[
                  styles.statCard,
                  {
                    backgroundColor:
                      highRiskCount > 0 ? "#dc262612" : colors.primary + "12",
                  },
                ]}
              >
                <View
                  style={[
                    styles.statIcon,
                    {
                      backgroundColor:
                        highRiskCount > 0 ? "#dc262620" : colors.primary + "20",
                    },
                  ]}
                >
                  <Text style={styles.statEmoji}>⚠️</Text>
                </View>
                <Text
                  style={[
                    styles.statNumber,
                    { color: highRiskCount > 0 ? "#dc2626" : colors.secondary },
                  ]}
                >
                  {highRiskCount}
                </Text>
                <Text
                  style={[styles.statLabel, { color: colors.textTertiary }]}
                >
                  High Risk
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Family Medical History Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Family Medical History
            </Text>
            <Text
              style={[styles.sectionSubtitle, { color: colors.textSecondary }]}
            >
              Comprehensive hereditary condition analysis across your family
              lineage
            </Text>
          </View>

          <View style={styles.membersContainer}>
            {mockFamilyData.map((member, index) => (
              <FamilyMemberCard key={member.id} member={member} index={index} />
            ))}
          </View>
        </View>

        {/* Enhanced Analysis Button */}
        <Animated.View
          style={[
            styles.analyzeContainer,
            { transform: [{ scale: buttonScaleAnim }] },
          ]}
        >
          <Pressable
            onPress={calculateRisk}
            disabled={isAnalyzing}
            style={[
              styles.analyzeButton,
              {
                backgroundColor: isAnalyzing ? colors.accent : colors.secondary,
                shadowColor: colors.secondary,
              },
            ]}
          >
            <View style={styles.buttonContent}>
              {isAnalyzing ? (
                <Animated.View
                  style={[
                    styles.buttonIcon,
                    {
                      transform: [
                        {
                          rotate: analyzeRotateAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ["0deg", "360deg"],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <Text style={styles.buttonEmoji}>🔬</Text>
                </Animated.View>
              ) : (
                <View style={styles.buttonIcon}>
                  <Text style={styles.buttonEmoji}>🎯</Text>
                </View>
              )}
              <View style={styles.buttonTextContainer}>
                <Text style={styles.buttonTitle}>
                  {isAnalyzing
                    ? "Analyzing Genetic Patterns"
                    : "Calculate Risk Profile"}
                </Text>
                <Text style={styles.buttonSubtitle}>
                  {isAnalyzing
                    ? "Processing family medical data..."
                    : "Advanced hereditary risk assessment"}
                </Text>
              </View>
            </View>
          </Pressable>
        </Animated.View>

        {/* Professional Results Section */}
        {result && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Risk Assessment Results
              </Text>
              <Text
                style={[
                  styles.sectionSubtitle,
                  { color: colors.textSecondary },
                ]}
              >
                Personalized genetic risk predictions with clinical
                recommendations
              </Text>
            </View>

            <View style={styles.resultsContainer}>
              {Object.entries(result)
                .sort(([, a], [, b]) => b - a)
                .map(([disease, risk], index) => (
                  <RiskResultCard
                    key={disease}
                    disease={disease}
                    risk={risk}
                    index={index}
                  />
                ))}
            </View>
          </View>
        )}

        {/* Professional Medical Disclaimer */}
        {result && (
          <View
            style={[
              styles.disclaimer,
              { backgroundColor: colors.surfaceSecondary },
            ]}
          >
            <View style={styles.disclaimerHeader}>
              <Text style={styles.disclaimerIcon}>⚕️</Text>
              <Text style={[styles.disclaimerTitle, { color: colors.text }]}>
                Medical Disclaimer
              </Text>
            </View>
            <Text
              style={[styles.disclaimerText, { color: colors.textSecondary }]}
            >
              This genetic risk assessment is generated for informational and
              educational purposes only. Results should not be used as a
              substitute for professional medical advice, diagnosis, or
              treatment. Please consult with qualified healthcare providers and
              genetic counselors for comprehensive medical evaluation and
              personalized care recommendations.
            </Text>
          </View>
        )}

        <View style={{ height: 60 }} />
      </ScrollView>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  headerBadge: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#6368ba",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  headerEmoji: {
    fontSize: 36,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    maxWidth: width - 80,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 40,
    gap: 12,
  },
  statCard: {
    width: (width - 60) / 2,
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statEmoji: {
    fontSize: 20,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
  },
  section: {
    marginBottom: 40,
  },
  sectionHeader: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  membersContainer: {
    gap: 20,
  },
  memberCard: {
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
  },
  memberHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  memberAvatarContainer: {
    position: "relative",
    marginRight: 16,
    borderRadius: 32,
    padding: 8,
  },
  memberAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
  },
  memberEmoji: {
    fontSize: 32,
  },
  riskIndicator: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  riskIndicatorText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  memberDetails: {
    flex: 1,
  },
  memberName: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  memberRelation: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 12,
  },
  memberStats: {
    flexDirection: "row",
    gap: 8,
  },
  conditionsBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  conditionsText: {
    fontSize: 12,
    fontWeight: "600",
  },
  ageBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  ageText: {
    fontSize: 12,
    fontWeight: "500",
  },
  conditionsSection: {
    marginTop: 4,
  },
  conditionsLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
  },
  conditionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  conditionChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  conditionEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  conditionStatus: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  conditionStatusText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  analyzeContainer: {
    marginBottom: 40,
  },
  analyzeButton: {
    borderRadius: 28,
    padding: 24,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  buttonEmoji: {
    fontSize: 24,
  },
  buttonTextContainer: {
    flex: 1,
  },
  buttonTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  buttonSubtitle: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    fontWeight: "500",
  },
  resultsContainer: {
    gap: 20,
  },
  riskCard: {
    borderRadius: 24,
    padding: 24,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 20,
    elevation: 6,
  },
  riskCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  riskIconSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  riskIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  riskEmoji: {
    fontSize: 28,
  },
  riskTitleSection: {
    flex: 1,
  },
  riskDisease: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  riskCategory: {
    fontSize: 13,
    fontWeight: "500",
  },
  riskLevelSection: {
    alignItems: "flex-end",
  },
  riskLevelBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 8,
  },
  riskLevelText: {
    color: "white",
    fontSize: 12,
    fontWeight: "700",
  },
  riskPercentage: {
    fontSize: 24,
    fontWeight: "800",
  },
  riskVisualization: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  progressSection: {
    flex: 1,
    marginRight: 20,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  progressValue: {
    fontSize: 14,
    fontWeight: "700",
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    position: "relative",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressMarkers: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
  },
  progressMarker: {
    position: "absolute",
    width: 2,
    height: "100%",
  },
  circularSection: {
    alignItems: "center",
  },
  recommendationSection: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.05)",
  },
  recommendationLabel: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    lineHeight: 20,
    fontStyle: "italic",
  },
  disclaimer: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
  },
  disclaimerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  disclaimerIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  disclaimerTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  disclaimerText: {
    fontSize: 14,
    lineHeight: 22,
  },
});
