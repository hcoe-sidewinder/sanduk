"use client";

import type React from "react";
import { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Animated, Dimensions } from "react-native";
import Svg, {
  G,
  Text as SvgText,
  Circle,
  Rect,
  Defs,
  LinearGradient,
  Stop,
  Path,
} from "react-native-svg";
import * as d3 from "d3";

interface TreeNode {
  name: string;
  gender?: "male" | "female";
  generation?: "root" | "parent" | "child";
  children?: TreeNode[];
}

interface FamilyTreeProps {
  data: TreeNode;
  width?: number;
  height?: number;
}

const { width: screenWidth } = Dimensions.get("window");

const FamilyTree: React.FC<FamilyTreeProps> = ({
  data,
  width = screenWidth,
  height = 600,
}) => {
  const [nodes, setNodes] = useState<any[]>([]);
  const [links, setLinks] = useState<any[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  const colors = {
    primary: "#bcc4f3",
    secondary: "#6368ba",
    accent: "#b4b8cb",
    male: "#4a90e2",
    female: "#e24a90",
    text: "#333333",
    background: "#ffffff",
    connection: "#d1d9ff",
  };

  useEffect(() => {
    const root = d3.hierarchy(data);
    const treeLayout = d3.tree<TreeNode>().size([width - 50, height - 100]);
    const treeData = treeLayout(root);

    setNodes(treeData.descendants());
    setLinks(treeData.links());

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, [data, height, width, scaleAnim, fadeAnim]);

  const getNodeSize = (node: any) => {
    if (node.data.name === "Family Root") return 25;
    if (node.data.name.startsWith("Parent")) return 15;
    if (node.data.name.startsWith("Child")) return 10;
    return 20;
  };

  const createCurvedPath = (link: any) => {
    const source = link.source;
    const target = link.target;
    const midY = (source.y + target.y) / 2;

    return `M${source.x},${source.y} C${source.x},${midY} ${target.x},${midY} ${target.x},${target.y}`;
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.treeContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Svg width={width} height={height}>
          <Defs>
            <LinearGradient
              id="primaryGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <Stop offset="0%" stopColor={colors.primary} stopOpacity="1" />
              <Stop
                offset="100%"
                stopColor={colors.secondary}
                stopOpacity="0.8"
              />
            </LinearGradient>
            <LinearGradient
              id="maleGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <Stop offset="0%" stopColor={colors.male} stopOpacity="1" />
              <Stop offset="100%" stopColor="#2c5aa0" stopOpacity="0.9" />
            </LinearGradient>
            <LinearGradient
              id="femaleGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <Stop offset="0%" stopColor={colors.female} stopOpacity="1" />
              <Stop offset="100%" stopColor="#b8356b" stopOpacity="0.9" />
            </LinearGradient>
          </Defs>

          <G transform={`translate(10, 50)`}>
            {links.map((link, i) => (
              <G key={`link-${i}`}>
                <Path
                  d={createCurvedPath(link)}
                  stroke="rgba(0,0,0,0.1)"
                  strokeWidth="4"
                  fill="none"
                  transform="translate(0, 2)"
                />

                <Path
                  d={createCurvedPath(link)}
                  stroke={colors.connection}
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="5,5"
                />
              </G>
            ))}

            {nodes.map((node, i) => {
              const nodeSize = getNodeSize(node);
              const isRoot = node.data.name === "Family Root";
              const isChild = node.data.name.startsWith("Child");

              return (
                <G
                  key={`node-${i}`}
                  transform={`translate(${node.x}, ${node.y})`}
                >
                  <Circle
                    cx={2}
                    cy={2}
                    r={nodeSize + 5}
                    fill="rgba(0,0,0,0.1)"
                  />

                  <Circle
                    cx={0}
                    cy={0}
                    r={nodeSize + 3}
                    fill={colors.background}
                    stroke={colors.accent}
                    strokeWidth="2"
                  />

                  <Circle
                    cx={0}
                    cy={0}
                    r={nodeSize}
                    fill={
                      isRoot
                        ? "url(#primaryGradient)"
                        : node.data.gender === "male"
                          ? "url(#maleGradient)"
                          : node.data.gender === "female"
                            ? "url(#femaleGradient)"
                            : colors.primary
                    }
                  />

                  {isRoot ? (
                    <SvgText
                      fontSize="14"
                      x={0}
                      y={5}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontWeight="bold"
                    >
                      🏠
                    </SvgText>
                  ) : (
                    <SvgText
                      fontSize={isChild ? "5" : "10"}
                      x={0}
                      y={5}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontWeight="bold"
                    >
                      {node.data.gender === "male"
                        ? "👨"
                        : node.data.gender === "female"
                          ? "👩"
                          : "👤"}
                    </SvgText>
                  )}

                  <Rect
                    x={isChild ? "-13" : isRoot ? "-30" : "-35"}
                    y={nodeSize + 10}
                    width={isChild ? "25" : isRoot ? "60" : "70"}
                    height={20}
                    rx={5}
                    ry={5}
                    fill={colors.background}
                    stroke={colors.accent}
                    strokeWidth="1"
                    opacity={0.9}
                  />

                  <SvgText
                    fontSize={isChild ? "5" : "10"}
                    x={0}
                    y={nodeSize + 23}
                    textAnchor="middle"
                    fill={colors.text}
                    fontWeight="400"
                  >
                    {node.data.name.length > 12
                      ? `${node.data.name.substring(0, 12)}...`
                      : node.data.name}
                  </SvgText>

                  {!isRoot && (
                    <Circle
                      cx={nodeSize - 5}
                      cy={-nodeSize + 5}
                      r={4}
                      fill={
                        node.data.generation === "parent"
                          ? colors.secondary
                          : colors.accent
                      }
                    />
                  )}
                </G>
              );
            })}
          </G>
        </Svg>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 20,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  treeContainer: {
    padding: 10,
  },
});

export default FamilyTree;
