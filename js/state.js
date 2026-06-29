export function createInitialState() {
  return {
    activeTab: "kiwi",

    kiwi: {
      level: 1,
      affection: 0,
      totalBokbok: 0,
      thought: "삐익.",
      help: 0
    },

    subjects: [],

    fields: [],

    tasks: [],

    inventory: {
      crops: {
        wheat: 0,
        potato: 0,
        tomato: 0,
        flower: 0
      }
    }
  };
}

export function uid(prefix = "id") {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function updateKiwiLevel(kiwi) {
  kiwi.level = Math.floor(kiwi.affection / 20) + 1;
}
