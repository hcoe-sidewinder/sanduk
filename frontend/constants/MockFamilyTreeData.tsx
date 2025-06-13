interface TreeNode {
  name: string;
  children?: TreeNode[];
}

interface FamilyTreeProps {
  data: TreeNode;
}

export const familyTreeData: TreeNode = {
  name: "Grandparent",
  children: [
    {
      name: "Parent A",
      children: [{ name: "Child A1" }, { name: "Child A2" }],
    },
    {
      name: "Parent B",
      children: [{ name: "Child B1" }, { name: "Child B2" }],
    },
  ],
};
