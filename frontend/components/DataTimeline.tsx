"use client";

import type React from "react";
import { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Dimensions } from "react-native";
import { Svg, Line, Circle, Text as SvgText, G, Rect } from "react-native-svg";
import * as d3 from "d3";

interface HealthEvent {
  date: string;
  type: string;
  description: string;
}

interface FamilyMember {
  memberId: number;
  name: string;
  events: HealthEvent[];
}

interface TimelineProps {
  member: FamilyMember;
}

const { width } = Dimensions.get("window");

const DataTimeline: React.FC<TimelineProps> = ({ member }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  const colors = {
    primary: "#bcc4f3",
    secondary: "#6368ba",
    accent: "#b4b8cb",
    text: "#333333",
    background: "#ffffff",
  };

  const getEventColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "diagnosis":
        return colors.secondary;
      case "treatment":
        return "#50a3a2";
      case "surgery":
        return "#e57373";
      case "checkup":
        return "#66bb6a";
      default:
        return colors.primary;
    }
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const timelineWidth = Math.max(width - 40, member.events.length * 120);

  return (
    <Animated.View
      style={[
        styles.memberBlock,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View style={styles.headerContainer}>
        <View
          style={[
            styles.memberIndicator,
            { backgroundColor: colors.secondary },
          ]}
        />
        <Text style={[styles.memberName, { color: colors.text }]}>
          {member.name}
        </Text>
      </View>

      <View style={styles.timelineContainer}>
        <Svg height="160" width={timelineWidth}>
          <Line
            x1="10"
            y1="80"
            x2={timelineWidth - 10}
            y2="80"
            stroke={colors.accent}
            strokeWidth="3"
            strokeDasharray="1,3"
          />

          {member.events.map((event, index) => {
            const x = 70 + index * (timelineWidth / (member.events.length + 1));
            const eventColor = getEventColor(event.type);

            return (
              <G key={index}>
                <Rect
                  x={x - 50}
                  y={20}
                  width="100"
                  height="40"
                  rx="8"
                  ry="8"
                  fill={colors.background}
                  stroke={colors.accent}
                  strokeWidth="1"
                />

                <SvgText
                  x={x}
                  y={35}
                  fontSize="11"
                  fontWeight="bold"
                  fill={colors.text}
                  textAnchor="middle"
                >
                  {event.type}
                </SvgText>

                <SvgText
                  x={x}
                  y={50}
                  fontSize="10"
                  fill={colors.text}
                  textAnchor="middle"
                >
                  {event.description.length > 15
                    ? `${event.description.substring(0, 15)}...`
                    : event.description}
                </SvgText>

                <Line
                  x1={x}
                  y1="60"
                  x2={x}
                  y2="80"
                  stroke={eventColor}
                  strokeWidth="2"
                />

                <Circle cx={x} cy={80} r={8} fill={eventColor} />
                <Circle cx={x} cy={80} r={4} fill="#ffffff" />

                <Rect
                  x={x - 30}
                  y={95}
                  width="60"
                  height="25"
                  rx="12"
                  ry="12"
                  fill={eventColor}
                  opacity={0.8}
                />

                <SvgText
                  x={x}
                  y={110}
                  fontSize="10"
                  fontWeight="bold"
                  fill="#ffffff"
                  textAnchor="middle"
                >
                  {d3.timeFormat("%b %Y")(new Date(event.date))}
                </SvgText>
              </G>
            );
          })}
        </Svg>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  memberBlock: {
    marginBottom: 40,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 16,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  memberIndicator: {
    width: 12,
    height: 24,
    borderRadius: 6,
    marginRight: 10,
  },
  memberName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  timelineContainer: {
    overflow: "scroll",
    marginHorizontal: -15,
  },
});

export default DataTimeline;
