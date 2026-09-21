export type Message =
  | { id: string; role: "user"; text: string }
  | { id: string; role: "assistant"; content: string; quizKeyPoints?: string[][] }
  | { id: string; role: "assistant-quiz" };

export interface ChatThread {
  id: string;
  examCode: string;
  title: string;
  messages: Message[];
}

const AZ900_DRILL = `Good progress. Based on your recent answers, here's where you stand:

Fast study drill

Reply with short answers to these 3 and I'll score you again:

1. Name 3 real cloud benefits.
2. Put one responsibility difference between IaaS and SaaS.
3. Name 3 Azure service categories and one example in each.

If you want, I can turn your weak areas into a 30-minute AZ-900 cram plan next.`;

const AZ900_DRILL_KEY_POINTS: string[][] = [
  ["High availability", "Scalability / elasticity", "Pay-as-you-go, consumption-based pricing"],
  [
    "IaaS: you manage the OS, apps, and data — Microsoft manages the physical infrastructure",
    "SaaS: Microsoft manages almost everything — you just manage your data and user access",
  ],
  ["Compute — Virtual Machines", "Storage — Blob Storage", "Networking — Virtual Network"],
];

export function createGreetingThread(id: string, examCode: string): ChatThread {
  return {
    id,
    examCode,
    title: `${examCode} study chat`,
    messages: [
      {
        id: `${id}-1`,
        role: "assistant",
        content: `New chat started for **${examCode}**. What would you like to study first — a topic explanation, a practice quiz, or a readiness check?`,
      },
    ],
  };
}

export const INITIAL_THREADS: ChatThread[] = [
  {
    id: "thread-az900",
    examCode: "AZ-900",
    title: "AZ-900 study chat",
    messages: [
      { id: "az900-1", role: "user", text: "Quiz me on Azure Virtual Networks, I keep mixing up NSGs and ASGs." },
      {
        id: "az900-2",
        role: "assistant",
        content:
          "Good call — that's a common mix-up on AZ-900. Here's a question targeting exactly that distinction.",
      },
      { id: "az900-3", role: "assistant-quiz" },
      { id: "az900-4", role: "user", text: "Can you check my understanding of Azure fundamentals before I move on?" },
      { id: "az900-5", role: "assistant", content: AZ900_DRILL, quizKeyPoints: AZ900_DRILL_KEY_POINTS },
    ],
  },
  {
    id: "thread-az700",
    examCode: "AZ-700",
    title: "AZ-700 study chat",
    messages: [
      {
        id: "az700-1",
        role: "user",
        text: "What's the difference between a route table and a route filter in Azure networking?",
      },
      {
        id: "az700-2",
        role: "assistant",
        content:
          "A **route table** controls how traffic leaving a subnet is directed — you attach it to a subnet and define user-defined routes (UDRs).\n\nA **route filter** is different: it's used with Azure ExpressRoute to control which Microsoft peering service prefixes (like Exchange Online) are advertised over the circuit. It filters BGP routes, not subnet traffic.",
      },
    ],
  },
  {
    id: "thread-ai900",
    examCode: "AI-900",
    title: "AI-900 study chat",
    messages: [
      {
        id: "ai900-1",
        role: "user",
        text: "Explain the difference between computer vision and natural language processing workloads.",
      },
      {
        id: "ai900-2",
        role: "assistant",
        content:
          "**Computer vision** workloads process and interpret visual input — image classification, object detection, and OCR.\n\n**Natural language processing (NLP)** workloads process and interpret text or speech — sentiment analysis, translation, and entity recognition.\n\nOn AI-900, Azure AI Vision handles the first category; Azure AI Language and Azure AI Speech handle the second.",
      },
    ],
  },
];
