interface TreeNode {
  name: string;
  children?: TreeNode[];
}

interface FamilyTreeProps {
  data: TreeNode;
}

export const familyTreeData: TreeNode = {
  name: "Family Root",
  children: [
    {
      name: "Grandparent A",
      children: [
        {
          name: "Parent A",
          children: [{ name: "Child A1" }, { name: "Child A2" }],
        },
      ],
    },
    {
      name: "Grandparent B",
      children: [
        {
          name: "Parent A",
          children: [{ name: "Child A1" }, { name: "Child A2" }],
        },
      ],
    },
    {
      name: "Grandparent C",
      children: [
        {
          name: "Parent B",
          children: [{ name: "Child A1" }, { name: "Child A2" }],
        },
      ],
    },
    {
      name: "Grandparent D",
      children: [
        {
          name: "Parent B",
          children: [{ name: "Child A1" }, { name: "Child A2" }],
        },
      ],
    },
  ],
};
