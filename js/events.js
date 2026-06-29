import { uid, updateKiwiLevel } from "./state.js";

export function bindEvents({ getState, setState, render }) {
  document.addEventListener("click", event => {
    const tabButton = event.target.closest(".bottom-nav button");
    if (tabButton) {
      const state = getState();
      state.activeTab = tabButton.dataset.tab;
      setState(state);
      render();
      return;
    }

    if (event.target.closest(".go-study")) {
      const state = getState();
      state.activeTab = "study";
      setState(state);
      render();
      return;
    }

    if (event.target.closest("#bokbokBtn")) {
      const state = getState();
      state.kiwi.affection += 1;
      state.kiwi.totalBokbok += 1;
      state.kiwi.thought = "삐익.";
      updateKiwiLevel(state.kiwi);
      setState(state);
      render();
      return;
    }

    const completeBtn = event.target.closest(".complete-task");
    if (completeBtn) {
      completeTask(completeBtn.dataset.taskId, getState, setState, render);
      return;
    }

    const harvestBtn = event.target.closest(".harvest-field");
    if (harvestBtn) {
      harvestField(harvestBtn.dataset.fieldId, getState, setState, render);
      return;
    }
  });

  document.addEventListener("submit", event => {
    if (event.target.id === "fieldForm") {
      event.preventDefault();
      createField(getState, setState, render);
    }

    if (event.target.id === "taskForm") {
      event.preventDefault();
      createTask(getState, setState, render);
    }
  });
}

function createField(getState, setState, render) {
  const state = getState();

  const subjectName = document.querySelector("#subjectName").value.trim();
  const fieldName = document.querySelector("#fieldName").value.trim() || `${subjectName} 밭`;
  const cropId = document.querySelector("#cropId").value;

  const subjectId = uid("subject");
  const fieldId = uid("field");

  state.subjects.push({
    id: subjectId,
    name: subjectName
  });

  state.fields.push({
    id: fieldId,
    subjectId,
    name: fieldName,
    cropId,
    growth: 0,
    completedQuestCount: 0,
    totalQuestCount: 0,
    harvestReady: false,
    harvested: false
  });

  setState(state);
  render();
}

function createTask(getState, setState, render) {
  const state = getState();

  const title = document.querySelector("#taskTitle").value.trim();
  const subjectId = document.querySelector("#taskSubject").value;
  const estimatedMinutes = Number(document.querySelector("#taskMinutes").value || 30);

  if (!subjectId) return alert("밭을 먼저 만들어 주세요.");

  state.tasks.push({
    id: uid("task"),
    subjectId,
    title,
    estimatedMinutes,
    actualMinutes: null,
    memo: "",
    status: "pending",
    createdAt: new Date().toISOString(),
    completedAt: null
  });

  updateFieldProgress(state, subjectId);

  setState(state);
  render();
}

function completeTask(taskId, getState, setState, render) {
  const state = getState();
  const task = state.tasks.find(task => task.id === taskId);

  if (!task || task.status === "done") return;

  const actualInput = document.querySelector(`.actual-input[data-task-id="${taskId}"]`);
  const memoInput = document.querySelector(`.memo-input[data-task-id="${taskId}"]`);

  task.status = "done";
  task.actualMinutes = Number(actualInput?.value || task.estimatedMinutes || 0);
  task.memo = memoInput?.value || "";
  task.completedAt = new Date().toISOString();

  updateFieldProgress(state, task.subjectId);

  setState(state);
  render();
}

function updateFieldProgress(state, subjectId) {
  const field = state.fields.find(field => field.subjectId === subjectId);

  if (!field || field.harvested) return;

  const tasks = state.tasks.filter(task => task.subjectId === subjectId);
  const doneTasks = tasks.filter(task => task.status === "done");

  field.totalQuestCount = tasks.length;
  field.completedQuestCount = doneTasks.length;

  field.growth = tasks.length
    ? Math.floor((doneTasks.length / tasks.length) * 100)
    : 0;

  field.harvestReady = field.growth >= 100 && tasks.length > 0;
}

function harvestField(fieldId, getState, setState, render) {
  const state = getState();
  const field = state.fields.find(field => field.id === fieldId);

  if (!field || !field.harvestReady || field.harvested) return;

  const amount = Math.max(1, field.totalQuestCount);

  state.inventory.crops[field.cropId] =
    Number(state.inventory.crops[field.cropId] || 0) + amount;

  field.harvested = true;
  field.harvestReady = false;

  setState(state);
  render();
}
