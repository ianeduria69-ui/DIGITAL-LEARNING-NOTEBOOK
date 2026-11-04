// Lesson content: Electricity → Ohm's Law

NOTEBOOK_LESSONS["electricity/ohms-law"] = {
  title: "Ohm's Law",

  explanation: [
    "Ohm's Law connects the three ideas you just learned: voltage, current, and resistance.",
    "If the voltage goes up, the current goes up. If the resistance goes up, the current goes down. The formula is V = I × R.",
    "Use the formula triangle: cover the one you want to find, and the other two show you what to do. (Sa Bisaya: tabuni ang gusto nimo makit-an.)"
  ],

  infographic: "images/infographics/ohms-law.svg",
  infographicAlt: "Hand-drawn Ohm's Law triangle with V on top and I and R at the bottom, and the three formulas V = I × R, I = V ÷ R, and R = V ÷ I.",

  details: [
    { label: "Symbols", value: "V, I, R" },
    { label: "Units", value: "volt (V), ampere (A), ohm (Ω)" },
    { label: "Measuring instrument", value: "Multimeter" },
    { label: "Basic formulas", value: "V = I × R,  I = V ÷ R,  R = V ÷ I" }
  ],
  reminders: [
    "Use the right units: volts, amperes, and ohms.",
    "Change mA to A first (for example, 500 mA = 0.5 A).",
    "Ohm's Law works well for resistors. Some parts, like LEDs, do not follow it simply."
  ],

  examples: [
    "A 9 V battery connected to a 3 Ω resistor: I = 9 ÷ 3 = 3 A.",
    "A current of 2 A flows through a 5 Ω resistor: V = 2 × 5 = 10 V.",
    "A circuit has 12 V and 4 A: R = 12 ÷ 4 = 3 Ω."
  ],

  checklist: [
    "I can write V = I × R from memory.",
    "I can use the formula triangle.",
    "I can find current when I know V and R.",
    "I can find resistance when I know V and I.",
    "I solved the three examples by myself."
  ]
};
