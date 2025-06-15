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
  Modal,
} from "react-native";
import {
  Svg,
  Path,
  Circle,
  Text as SvgText,
  Defs,
  LinearGradient,
  Stop,
  Line,
} from "react-native-svg";
import AnimatedBackground from "@/components/AnimatedBackground";

const { width, height } = Dimensions.get("window");

const healthMetrics = {
  glucose: {
    name: "Blood Glucose",
    emoji: "🩸",
    unit: "mg/dL",
    color: "#ef4444",
    normalRange: [70, 140],
    data: [
      { date: "2024-01-01", value: 95, time: "08:00" },
      { date: "2024-01-02", value: 102, time: "08:15" },
      { date: "2024-01-03", value: 88, time: "08:30" },
      { date: "2024-01-04", value: 110, time: "08:00" },
      { date: "2024-01-05", value: 98, time: "08:45" },
      { date: "2024-01-06", value: 105, time: "08:20" },
      { date: "2024-01-07", value: 92, time: "08:10" },
    ],
  },
  cholesterol: {
    name: "Cholesterol",
    emoji: "💊",
    unit: "mg/dL",
    color: "#f59e0b",
    normalRange: [0, 200],
    data: [
      { date: "2024-01-01", value: 180, time: "09:00" },
      { date: "2024-01-02", value: 175, time: "09:15" },
      { date: "2024-01-03", value: 185, time: "09:30" },
      { date: "2024-01-04", value: 170, time: "09:00" },
      { date: "2024-01-05", value: 178, time: "09:45" },
      { date: "2024-01-06", value: 182, time: "09:20" },
      { date: "2024-01-07", value: 176, time: "09:10" },
    ],
  },
  uricAcid: {
    name: "Uric Acid",
    emoji: "🧪",
    unit: "mg/dL",
    color: "#8b5cf6",
    normalRange: [2.4, 6.0],
    data: [
      { date: "2024-01-01", value: 4.2, time: "10:00" },
      { date: "2024-01-02", value: 4.5, time: "10:15" },
      { date: "2024-01-03", value: 4.1, time: "10:30" },
      { date: "2024-01-04", value: 4.8, time: "10:00" },
      { date: "2024-01-05", value: 4.3, time: "10:45" },
      { date: "2024-01-06", value: 4.6, time: "10:20" },
      { date: "2024-01-07", value: 4.4, time: "10:10" },
    ],
  },
  bloodPressure: {
    name: "Blood Pressure",
    emoji: "🫀",
    unit: "mmHg",
    color: "#ec4899",
    normalRange: [90, 140],
    data: [
      {
        date: "2024-01-01",
        value: 120,
        systolic: 120,
        diastolic: 80,
        time: "07:00",
      },
      {
        date: "2024-01-02",
        value: 118,
        systolic: 118,
        diastolic: 78,
        time: "07:15",
      },
      {
        date: "2024-01-03",
        value: 125,
        systolic: 125,
        diastolic: 82,
        time: "07:30",
      },
      {
        date: "2024-01-04",
        value: 115,
        systolic: 115,
        diastolic: 75,
        time: "07:00",
      },
      {
        date: "2024-01-05",
        value: 122,
        systolic: 122,
        diastolic: 81,
        time: "07:45",
      },
      {
        date: "2024-01-06",
        value: 119,
        systolic: 119,
        diastolic: 79,
        time: "07:20",
      },
      {
        date: "2024-01-07",
        value: 121,
        systolic: 121,
        diastolic: 80,
        time: "07:10",
      },
    ],
  },
  thyroid: {
    name: "Thyroid (TSH)",
    emoji: "🦋",
    unit: "mIU/L",
    color: "#06b6d4",
    normalRange: [0.4, 4.0],
    data: [
      { date: "2024-01-01", value: 2.1, time: "11:00" },
      { date: "2024-01-02", value: 2.3, time: "11:15" },
      { date: "2024-01-03", value: 1.9, time: "11:30" },
      { date: "2024-01-04", value: 2.5, time: "11:00" },
      { date: "2024-01-05", value: 2.2, time: "11:45" },
      { date: "2024-01-06", value: 2.4, time: "11:20" },
      { date: "2024-01-07", value: 2.0, time: "11:10" },
    ],
  },
  weight: {
    name: "Body Weight",
    emoji: "⚖️",
    unit: "kg",
    color: "#84cc16",
    normalRange: [60, 80],
    data: [
      { date: "2024-01-01", value: 72.5, time: "06:00" },
      { date: "2024-01-02", value: 72.3, time: "06:15" },
      { date: "2024-01-03", value: 72.8, time: "06:30" },
      { date: "2024-01-04", value: 72.1, time: "06:00" },
      { date: "2024-01-05", value: 72.6, time: "06:45" },
      { date: "2024-01-06", value: 72.4, time: "06:20" },
      { date: "2024-01-07", value: 72.7, time: "06:10" },
    ],
  },
};

interface FloatingButtonProps {
  metric: keyof typeof healthMetrics;
  index: number;
  onPress: (metric: keyof typeof healthMetrics) => void;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({
  metric,
  index,
  onPress,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const colors = {
    primary: "#bcc4f3",
    secondary: "#6368ba",
    accent: "#b4b8cb",
    surface: "#ffffff",
  };

  const metricData = healthMetrics[metric];
  const latestValue = metricData.data[metricData.data.length - 1];
  const isOutOfRange =
    latestValue.value < metricData.normalRange[0] ||
    latestValue.value > metricData.normalRange[1];

  useEffect(() => {
    const delay = index * 200;

    setTimeout(() => {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();

      if (isOutOfRange) {
        Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.1,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
          ])
        ).start();
      }
    }, delay);
  }, []);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onPress(metric);
    });
  };

  return (
    <Animated.View
      style={[
        styles.floatingButton,
        {
          backgroundColor: colors.surface,
          borderColor: metricData.color + "30",
          transform: [
            { scale: Animated.multiply(scaleAnim, pulseAnim) },
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
      <Pressable onPress={handlePress} style={styles.buttonContent}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: metricData.color + "15" },
          ]}
        >
          <Text style={styles.buttonEmoji}>{metricData.emoji}</Text>
        </View>
        <Text style={[styles.buttonLabel, { color: metricData.color }]}>
          {metricData.name}
        </Text>
        <Text style={[styles.buttonValue, { color: colors.secondary }]}>
          {latestValue.value} {metricData.unit}
        </Text>
        {isOutOfRange && (
          <View style={[styles.alertBadge, { backgroundColor: "#ef4444" }]}>
            <Text style={styles.alertText}>!</Text>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
};

interface AnimatedGraphProps {
  data: any[];
  color: string;
  unit: string;
  normalRange: number[];
}

const AnimatedGraph: React.FC<AnimatedGraphProps> = ({
  data,
  color,
  unit,
  normalRange,
}) => {
  const pathAnim = useRef(new Animated.Value(0)).current;
  const dotsAnim = useRef(data.map(() => new Animated.Value(0))).current;

  const colors = {
    primary: "#bcc4f3",
    secondary: "#6368ba",
    accent: "#b4b8cb",
  };

  useEffect(() => {
    Animated.timing(pathAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start();

    const dotAnimations = dotsAnim.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 300,
        delay: index * 200,
        useNativeDriver: true,
      })
    );

    Animated.sequence(dotAnimations).start();
  }, []);

  const graphWidth = width - 80;
  const graphHeight = 200;
  const padding = 40;

  const maxValue = Math.max(...data.map((d) => d.value), normalRange[1]);
  const minValue = Math.min(...data.map((d) => d.value), normalRange[0]);
  const valueRange = maxValue - minValue;

  const getX = (index: number) =>
    padding + (index * (graphWidth - 2 * padding)) / (data.length - 1);
  const getY = (value: number) =>
    padding + ((maxValue - value) * (graphHeight - 2 * padding)) / valueRange;

  // Create path string
  const pathData = data
    .map((point, index) => {
      const x = getX(index);
      const y = getY(point.value);
      return index === 0 ? `M${x},${y}` : `L${x},${y}`;
    })
    .join(" ");

  return (
    <View style={styles.graphContainer}>
      <Svg width={graphWidth} height={graphHeight}>
        <Defs>
          <LinearGradient id="graphGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <Stop offset="100%" stopColor={color} stopOpacity="0.05" />
          </LinearGradient>
          <LinearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={color} stopOpacity="0.8" />
            <Stop offset="100%" stopColor={color} stopOpacity="1" />
          </LinearGradient>
        </Defs>

        <Path
          d={`M${padding},${getY(normalRange[1])} L${graphWidth - padding},${getY(normalRange[1])} L${
            graphWidth - padding
          },${getY(normalRange[0])} L${padding},${getY(normalRange[0])} Z`}
          fill={colors.primary + "20"}
        />

        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const y = padding + ratio * (graphHeight - 2 * padding);
          return (
            <Line
              key={ratio}
              x1={padding}
              y1={y}
              x2={graphWidth - padding}
              y2={y}
              stroke={colors.accent + "30"}
              strokeWidth="1"
              strokeDasharray="2,2"
            />
          );
        })}

        <Path
          d={pathData}
          stroke="url(#lineGradient)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />

        {data.map((point, index) => {
          const x = getX(index);
          const y = getY(point.value);
          const isOutOfRange =
            point.value < normalRange[0] || point.value > normalRange[1];

          return (
            <Animated.View key={index} style={{ opacity: dotsAnim[index] }}>
              <Circle
                cx={x}
                cy={y}
                r="6"
                fill={isOutOfRange ? "#ef4444" : color}
                stroke="#ffffff"
                strokeWidth="2"
              />
              <SvgText
                x={x}
                y={y - 15}
                fontSize="10"
                fontWeight="600"
                fill={color}
                textAnchor="middle"
              >
                {point.value}
              </SvgText>
            </Animated.View>
          );
        })}

        {[
          normalRange[0],
          (normalRange[0] + normalRange[1]) / 2,
          normalRange[1],
        ].map((value) => (
          <SvgText
            key={value}
            x={padding - 10}
            y={getY(value) + 4}
            fontSize="10"
            fill={colors.accent}
            textAnchor="end"
          >
            {value}
          </SvgText>
        ))}
      </Svg>
    </View>
  );
};

interface HealthModalProps {
  visible: boolean;
  metric: keyof typeof healthMetrics | null;
  onClose: () => void;
}

const HealthModal: React.FC<HealthModalProps> = ({
  visible,
  metric,
  onClose,
}) => {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const colors = {
    primary: "#bcc4f3",
    secondary: "#6368ba",
    accent: "#b4b8cb",
    text: "#0f172a",
    textSecondary: "#475569",
    surface: "#ffffff",
  };

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!metric) return null;

  const metricData = healthMetrics[metric];
  const latestValue = metricData.data[metricData.data.length - 1];
  const previousValue = metricData.data[metricData.data.length - 2];
  const trend = latestValue.value > previousValue.value ? "up" : "down";
  const trendPercentage = Math.abs(
    ((latestValue.value - previousValue.value) / previousValue.value) * 100
  ).toFixed(1);

  return (
    <Modal visible={visible} transparent animationType="none">
      <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
        <Pressable style={styles.modalBackdrop} onPress={onClose} />
        <Animated.View
          style={[
            styles.modalContent,
            {
              backgroundColor: colors.surface,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.modalHeader}>
            <View style={styles.modalTitleSection}>
              <View
                style={[
                  styles.modalIcon,
                  { backgroundColor: metricData.color + "15" },
                ]}
              >
                <Text style={styles.modalEmoji}>{metricData.emoji}</Text>
              </View>
              <View style={styles.modalTitleText}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>
                  {metricData.name}
                </Text>
                <Text
                  style={[
                    styles.modalSubtitle,
                    { color: colors.textSecondary },
                  ]}
                >
                  Latest: {latestValue.value} {metricData.unit}
                </Text>
              </View>
            </View>

            <Pressable
              onPress={onClose}
              style={[
                styles.closeButton,
                { backgroundColor: colors.accent + "20" },
              ]}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </Pressable>
          </View>

          <View
            style={[
              styles.trendContainer,
              { backgroundColor: colors.primary + "10" },
            ]}
          >
            <Text style={[styles.trendLabel, { color: colors.textSecondary }]}>
              7-Day Trend
            </Text>
            <View style={styles.trendValue}>
              <Text
                style={[
                  styles.trendEmoji,
                  { color: trend === "up" ? "#ef4444" : "#10b981" },
                ]}
              >
                {trend === "up" ? "📈" : "📉"}
              </Text>
              <Text style={[styles.trendText, { color: colors.text }]}>
                {trend === "up" ? "+" : "-"}
                {trendPercentage}%
              </Text>
            </View>
          </View>

          <View style={styles.graphSection}>
            <Text style={[styles.graphTitle, { color: colors.text }]}>
              Weekly Progress
            </Text>
            <AnimatedGraph
              data={metricData.data}
              color={metricData.color}
              unit={metricData.unit}
              normalRange={metricData.normalRange}
            />
          </View>

          <View style={styles.tableSection}>
            <Text style={[styles.tableTitle, { color: colors.text }]}>
              Recent Readings
            </Text>
            <ScrollView
              style={styles.tableContainer}
              showsVerticalScrollIndicator={false}
            >
              {metricData.data
                .slice()
                .reverse()
                .map((reading, index) => {
                  const isOutOfRange =
                    reading.value < metricData.normalRange[0] ||
                    reading.value > metricData.normalRange[1];

                  return (
                    <View
                      key={index}
                      style={[
                        styles.tableRow,
                        {
                          backgroundColor:
                            index % 2 === 0
                              ? colors.primary + "05"
                              : "transparent",
                          borderLeftColor: isOutOfRange
                            ? "#ef4444"
                            : metricData.color,
                        },
                      ]}
                    >
                      <View style={styles.tableCell}>
                        <Text
                          style={[styles.tableCellText, { color: colors.text }]}
                        >
                          {new Date(reading.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </Text>
                      </View>
                      <View style={styles.tableCell}>
                        <Text
                          style={[
                            styles.tableCellText,
                            { color: colors.textSecondary },
                          ]}
                        >
                          {reading.time}
                        </Text>
                      </View>
                      <View style={styles.tableCell}>
                        <Text
                          style={[
                            styles.tableCellValue,
                            {
                              color: isOutOfRange
                                ? "#ef4444"
                                : metricData.color,
                            },
                          ]}
                        >
                          {reading.value} {metricData.unit}
                        </Text>
                      </View>
                      <View style={styles.tableCell}>
                        <View
                          style={[
                            styles.statusBadge,
                            {
                              backgroundColor: isOutOfRange
                                ? "#ef444415"
                                : "#10b98115",
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.statusText,
                              { color: isOutOfRange ? "#ef4444" : "#10b981" },
                            ]}
                          >
                            {isOutOfRange ? "Alert" : "Normal"}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
            </ScrollView>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default function Graph() {
  const [selectedMetric, setSelectedMetric] = useState<
    keyof typeof healthMetrics | null
  >(null);
  const [modalVisible, setModalVisible] = useState(false);

  const titleFadeAnim = useRef(new Animated.Value(0)).current;

  const colors = {
    primary: "#bcc4f3",
    secondary: "#6368ba",
    accent: "#b4b8cb",
    text: "#0f172a",
    textSecondary: "#475569",
  };

  useEffect(() => {
    Animated.timing(titleFadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleButtonPress = (metric: keyof typeof healthMetrics) => {
    setSelectedMetric(metric);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setTimeout(() => setSelectedMetric(null), 300);
  };

  const alertCount = Object.values(healthMetrics).filter((metric) => {
    const latest = metric.data[metric.data.length - 1];
    return (
      latest.value < metric.normalRange[0] ||
      latest.value > metric.normalRange[1]
    );
  }).length;

  return (
    <AnimatedBackground>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.header, { opacity: titleFadeAnim }]}>
          <View
            style={[styles.headerBadge, { backgroundColor: colors.secondary }]}
          >
            <Text style={styles.headerEmoji}>📊</Text>
          </View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Health Dashboard
          </Text>
          <Text
            style={[styles.headerSubtitle, { color: colors.textSecondary }]}
          >
            Monitor your vital health metrics with real-time tracking
          </Text>
        </Animated.View>

        {alertCount > 0 && (
          <View
            style={[
              styles.alertSummary,
              { backgroundColor: "#ef444415", borderColor: "#ef444430" },
            ]}
          >
            <Text style={styles.alertIcon}>⚠️</Text>
            <View style={styles.alertContent}>
              <Text style={[styles.alertTitle, { color: "#ef4444" }]}>
                Health Alerts
              </Text>
              <Text style={[styles.alertText, { color: colors.textSecondary }]}>
                {alertCount} metric{alertCount > 1 ? "s" : ""} outside normal
                range
              </Text>
            </View>
          </View>
        )}

        <View style={styles.buttonsGrid}>
          {Object.keys(healthMetrics).map((metric, index) => (
            <FloatingButton
              key={metric}
              metric={metric as keyof typeof healthMetrics}
              index={index}
              onPress={handleButtonPress}
            />
          ))}
        </View>

        <View style={styles.quickStats}>
          <Text style={[styles.quickStatsTitle, { color: colors.text }]}>
            Quick Overview
          </Text>
          <View style={styles.statsGrid}>
            <View
              style={[
                styles.statCard,
                { backgroundColor: colors.primary + "15" },
              ]}
            >
              <Text style={styles.statEmoji}>📈</Text>
              <Text style={[styles.statValue, { color: colors.secondary }]}>
                {Object.values(healthMetrics).length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Metrics Tracked
              </Text>
            </View>
            <View
              style={[
                styles.statCard,
                { backgroundColor: colors.accent + "15" },
              ]}
            >
              <Text style={styles.statEmoji}>🎯</Text>
              <Text style={[styles.statValue, { color: colors.secondary }]}>
                {Object.values(healthMetrics).length - alertCount}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                In Normal Range
              </Text>
            </View>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <HealthModal
        visible={modalVisible}
        metric={selectedMetric}
        onClose={handleCloseModal}
      />
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
    marginBottom: 30,
  },
  headerBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#6368ba",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  headerEmoji: {
    fontSize: 32,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
  },
  alertSummary: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  alertIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 2,
  },
  buttonsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 32,
  },
  floatingButton: {
    width: (width - 80) / 2,
    borderRadius: 24,
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    position: "relative",
  },
  buttonContent: {
    padding: 20,
    alignItems: "center",
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  buttonEmoji: {
    fontSize: 28,
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 4,
  },
  buttonValue: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  alertBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  alertText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  quickStats: {
    marginBottom: 32,
  },
  quickStatsTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 16,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
  },
  statEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: height * 0.9,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 16,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.05)",
  },
  modalTitleSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  modalIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  modalEmoji: {
    fontSize: 28,
  },
  modalTitleText: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: "600",
  },
  trendContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 24,
    padding: 16,
    borderRadius: 16,
  },
  trendLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  trendValue: {
    flexDirection: "row",
    alignItems: "center",
  },
  trendEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  trendText: {
    fontSize: 16,
    fontWeight: "700",
  },
  graphSection: {
    padding: 24,
  },
  graphTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  graphContainer: {
    alignItems: "center",
  },
  tableSection: {
    padding: 24,
    paddingTop: 0,
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  tableContainer: {
    maxHeight: 200,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderLeftWidth: 3,
    marginBottom: 1,
  },
  tableCell: {
    flex: 1,
  },
  tableCellText: {
    fontSize: 14,
    fontWeight: "500",
  },
  tableCellValue: {
    fontSize: 14,
    fontWeight: "700",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
