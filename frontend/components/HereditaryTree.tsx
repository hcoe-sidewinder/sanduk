import React from "react";
import { View, Dimensions } from "react-native";
import Svg, { Circle, Line, Text } from "react-native-svg";
import { hierarchy, tree } from "d3-hierarchy";

const { width, height } = Dimensions.get("window");

interface TreeNode {
  name: string;
  children?: TreeNode[];
}

interface FamilyTreeProps {
  data: TreeNode;
}

const FamilyTree: React.FC<FamilyTreeProps> = ({ data }) => {
  const root = hierarchy<TreeNode>(data);
  const layout = tree<TreeNode>().size([width - 60, height - 200]);
  const treeData = layout(root);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Svg width={width} height={height}>
        {treeData.links().map((link, index) => (
          <Line
            key={index}
            x1={link.source.x + 30}
            y1={link.source.y + 50}
            x2={link.target.x + 30}
            y2={link.target.y + 50}
            stroke="#aaa"
          />
        ))}

        {treeData.descendants().map((node, index) => (
          <React.Fragment key={index}>
            <Circle cx={node.x + 30} cy={node.y + 50} r={15} fill="#6C63FF" />
            <Text
              x={node.x + 30}
              y={node.y + 50}
              fill="white"
              fontSize="10"
              fontWeight="bold"
              textAnchor="middle"
              dy={4}
            >
              {node.data.name}
            </Text>
          </React.Fragment>
        ))}
      </Svg>
    </View>
  );
};

export default FamilyTree;
