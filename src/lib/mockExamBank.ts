export interface MockQuestion {
  id: string;
  domain: string;
  question: string;
  options: { id: string; label: string; correct?: boolean }[];
  explanation: string;
}

const AZ900_QUESTIONS: MockQuestion[] = [
  {
    id: "az900-q1",
    domain: "Cloud concepts",
    question:
      "Which pricing model allows you to pay only for the compute resources you actually use, with no upfront cost?",
    options: [
      { id: "a", label: "Pay-as-you-go", correct: true },
      { id: "b", label: "Capital expenditure (CapEx)" },
      { id: "c", label: "Reserved instance prepayment" },
      { id: "d", label: "Perpetual licensing" },
    ],
    explanation:
      "Pay-as-you-go is a core cloud benefit — it shifts spending from CapEx to OpEx and scales with actual usage.",
  },
  {
    id: "az900-q2",
    domain: "Cloud concepts",
    question: "What best describes 'elasticity' in cloud computing?",
    options: [
      { id: "a", label: "The ability to automatically scale resources up or down to match demand", correct: true },
      { id: "b", label: "The physical durability of data center hardware" },
      { id: "c", label: "A fixed allocation of compute set at deployment" },
      { id: "d", label: "The number of Azure regions a service is deployed to" },
    ],
    explanation:
      "Elasticity is the ability to scale resources automatically to match real-time demand, avoiding both under- and over-provisioning.",
  },
  {
    id: "az900-q3",
    domain: "Azure architecture & services",
    question: "Which Azure service is best suited for scalable, unstructured object storage such as images and documents?",
    options: [
      { id: "a", label: "Azure Blob Storage", correct: true },
      { id: "b", label: "Azure SQL Database" },
      { id: "c", label: "Azure Virtual Network" },
      { id: "d", label: "Azure Active Directory" },
    ],
    explanation:
      "Blob Storage is Azure's object storage service, optimized for storing massive amounts of unstructured data like images, video, and documents.",
  },
  {
    id: "az900-q4",
    domain: "Azure architecture & services",
    question: "What is the primary purpose of an Azure Resource Group?",
    options: [
      { id: "a", label: "A logical container for resources that share the same lifecycle", correct: true },
      { id: "b", label: "A physical data center location" },
      { id: "c", label: "A billing currency setting" },
      { id: "d", label: "A type of virtual machine" },
    ],
    explanation:
      "A resource group is a logical container used to group related Azure resources for lifecycle management, deployment, and access control.",
  },
  {
    id: "az900-q5",
    domain: "Management & governance",
    question:
      "Which Azure feature lets you enforce organizational rules, such as restricting VM SKUs or requiring specific tags, across resources?",
    options: [
      { id: "a", label: "Azure Policy", correct: true },
      { id: "b", label: "Azure Monitor" },
      { id: "c", label: "Azure Advisor" },
      { id: "d", label: "Azure Cost Management" },
    ],
    explanation:
      "Azure Policy evaluates resources against defined rules and can enforce or audit compliance across a subscription or management group.",
  },
];

function genericQuestions(examCode: string): MockQuestion[] {
  return Array.from({ length: 5 }, (_, i) => ({
    id: `${examCode}-q${i + 1}`,
    domain: "Core concepts",
    question: `Sample ${examCode} practice question ${i + 1} — placeholder content demonstrating the exam-taking flow.`,
    options: [
      { id: "a", label: "Option A", correct: i % 4 === 0 },
      { id: "b", label: "Option B", correct: i % 4 === 1 },
      { id: "c", label: "Option C", correct: i % 4 === 2 },
      { id: "d", label: "Option D", correct: i % 4 === 3 },
    ],
    explanation: "This is placeholder content — wire a real question bank for this exam before shipping.",
  }));
}

export function getMockQuestions(examCode: string, count: number): MockQuestion[] {
  const bank = examCode === "AZ-900" ? AZ900_QUESTIONS : genericQuestions(examCode);
  return bank.slice(0, Math.min(count, bank.length));
}
