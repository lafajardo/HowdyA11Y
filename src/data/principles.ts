import type { WCAGPrinciple } from "./challenges/types";

export interface PrincipleInfo {
  id: WCAGPrinciple;
  name: string;
  number: number;
  description: string;
  longDescription: string;
  icon: string;
  color: string;
  challengeCount: number;
}

export const principles: PrincipleInfo[] = [
  {
    id: "perceivable",
    name: "Perceivable",
    number: 1,
    description:
      "Information and UI components must be presentable in ways users can perceive.",
    longDescription:
      "Like a lantern in the dark, content must be visible to at least one of a user's senses. This means providing text alternatives for non-text content, captions for multimedia, and ensuring content can be presented in different ways without losing meaning.",
    icon: "lantern",
    color: "#b45309",
    challengeCount: 5,
  },
  {
    id: "operable",
    name: "Operable",
    number: 2,
    description:
      "UI components and navigation must be operable by all users.",
    longDescription:
      "Every trail on the frontier must be passable by all riders. All functionality must be available from a keyboard, users must have enough time to read content, and navigation must be predictable and free of traps.",
    icon: "horseshoe",
    color: "#15803d",
    challengeCount: 5,
  },
  {
    id: "understandable",
    name: "Understandable",
    number: 3,
    description:
      "Information and operation of the UI must be understandable.",
    longDescription:
      "Like a well-written wanted poster, content must be readable and clear. Forms should help users avoid and correct mistakes. The interface should operate in predictable ways and provide instructions plain as day.",
    icon: "scroll",
    color: "#b91c1c",
    challengeCount: 4,
  },
  {
    id: "robust",
    name: "Robust",
    number: 4,
    description:
      "Content must be robust enough to be interpreted by a wide variety of user agents.",
    longDescription:
      "Built to last like a frontier fort. Content must be compatible with current and future tools, including assistive technologies. This means using proper semantic HTML, valid ARIA attributes, and ensuring all components have proper names, roles, and values.",
    icon: "star",
    color: "#7e22ce",
    challengeCount: 3,
  },
];
