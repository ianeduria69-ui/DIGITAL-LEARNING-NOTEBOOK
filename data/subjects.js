// subjects.js — the list of subjects.
// "lessons" lists the lesson ids in order. Each id has its own file in data/lessons/.
// To add a subject later: copy one block below and change the words.

const NOTEBOOK_SUBJECTS = [
  {
    id: "electricity",
    title: "Electricity",
    icon: "⚡",
    description: "The basics: voltage, current, resistance, and Ohm's Law.",
    lessons: ["voltage", "current", "resistance", "ohms-law"]
  },
  {
    id: "electronics",
    title: "Electronics",
    icon: "🔌",
    description: "Parts and circuits. Coming soon.",
    lessons: []
  },
  {
    id: "programming",
    title: "Programming",
    icon: "💻",
    description: "Learn to give instructions to a computer. Coming soon.",
    lessons: []
  }
];

// All lesson files add themselves into this box, using "subject/lesson" as the name.
const NOTEBOOK_LESSONS = {};
