import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Svg, Line, Circle, Text as SvgText } from "react-native-svg";
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

const DataTimeline: React.FC<TimelineProps> = ({ member }) => {
  return (
    <View style={styles.memberBlock}>
      <Text style={styles.memberName}>{member.name}</Text>
      <Svg height="100" width="100%">
        <Line x1="10" y1="50" x2="350" y2="50" stroke="gray" strokeWidth="2" />
        {member.events.map((event, index) => {
          const x = 70 + index * 110;
          return (
            <React.Fragment key={index}>
              <SvgText
                x={x}
                y={30}
                fontSize="10"
                fill="black"
                textAnchor="middle"
              >
                {event.description}
              </SvgText>
              <Circle cx={x} cy={50} r={6} fill="teal" />
              <SvgText
                x={x}
                y={70}
                fontSize="10"
                fill="black"
                textAnchor="middle"
              >
                {d3.timeFormat("%b")(new Date(event.date))}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  memberBlock: { marginBottom: 40 },
  memberName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
});

export default DataTimeline;
