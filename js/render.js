import { CROPS } from "./data.js";

export function renderApp(state) {
  const app = document.querySelector("#app");

  if (state.activeTab === "kiwi") app.innerHTML = renderKiwiRoom(state);
  if (state.activeTab === "study") app.innerHTML = renderStudyRoom(state);
  if (state.activeTab === "farm") app.innerHTML = renderFarmRoom(state);
  if (state.activeTab === "storage") app.innerHTML = renderStorageRoom(state);

  document.querySelectorAll(".bottom-nav button").forEach(button => {
    button.classList.toggle("active", button.dataset.tab === state.activeTab);
  });
}

function renderKiwiRoom(state) {
  const kiwi = state.kiwi;

  return `
    <main class="screen kiwi-room">
      <section class="card center">
        <p class="eyebrow">Kiwi Room</p>
        <div class="kiwi">🥝💨</div>
        <h1>키위 방</h1>
        <p class="thought">${kiwi.thought}</p>

        <div class="stats">
          <div><span>레벨</span><strong>Lv.${kiwi.level}</strong></div>
          <div><span>친밀도</span><strong>${kiwi.affection}</strong></div>
          <div><span>복복 수</span><strong>${kiwi.totalBokbok}</strong></div>
          <div><span>도움</span><strong>${kiwi.help}</strong></div>
        </div>

        <button id="bokbokBtn" class="main-btn">복복하기</button>
        <button class="ghost go-study">공부하러 가기</button>
      </section>
    </main>
  `;
}

function renderStudyRoom(state) {
  return `
    <main class="screen">
      <section class="card">
        <p class="eyebrow">Study Room</p>
        <h1>공부방</h1>

        <form id="taskForm" class="form">
          <label>퀘스트 제목</label>
          <input id="taskTitle" placeholder="예: 수학 30분" required />

          <label>과목 밭</label>
          <select id="taskSubject" required>
            ${state.subjects.length
              ? state.subjects.map(subject => `<option value="${subject.id}">${subject.name}</option>`).join("")
              : `<option value="">밭을 먼저 만들어 주세요</option>`}
          </select>

          <label>예상 시간(분)</label>
          <input id="taskMinutes" type="number" min="5" step="5" value="30" />

          <button type="submit">퀘스트 추가</button>
        </form>
      </section>

      <section class="card">
        <h2>오늘의 퀘스트</h2>
        <div class="task-list">
          ${state.tasks.length ? state.tasks.map(renderTask).join("") : `<p class="empty">아직 퀘스트가 없습니다.</p>`}
        </div>
      </section>
    </main>
  `;
}

function renderTask(task) {
  return `
    <article class="task ${task.status === "done" ? "done" : ""}">
      <h3>${task.title}</h3>
      <p>${task.estimatedMinutes}분 · ${task.status === "done" ? "완료" : "대기"}</p>

      ${task.status === "done"
        ? `<p class="muted">실제 ${task.actualMinutes || 0}분 · ${task.memo || ""}</p>`
        : `
          <label>실제 시간</label>
          <input class="actual-input" data-task-id="${task.id}" type="number" min="0" step="5" placeholder="분" />

          <label>메모</label>
          <input class="memo-input" data-task-id="${task.id}" placeholder="짧은 기록" />

          <button class="complete-task" data-task-id="${task.id}">완료</button>
        `}
    </article>
  `;
}

function renderFarmRoom(state) {
  return `
    <main class="screen">
      <section class="card">
        <p class="eyebrow">Farm</p>
        <h1>밭</h1>

        <form id="fieldForm" class="form">
          <label>과목명</label>
          <input id="subjectName" placeholder="예: 수학" required />

          <label>밭 이름</label>
          <input id="fieldName" placeholder="예: 수학 밭" />

          <label>심을 작물</label>
          <select id="cropId">
            ${Object.values(CROPS).map(crop => `
              <option value="${crop.id}">${crop.icon} ${crop.name}</option>
            `).join("")}
          </select>

          <button type="submit">밭 만들기</button>
        </form>
      </section>

      <section class="card">
        <h2>내 밭</h2>
        <div class="field-list">
          ${state.fields.length ? state.fields.map(field => renderField(field, state)).join("") : `<p class="empty">아직 밭이 없습니다.</p>`}
        </div>
      </section>
    </main>
  `;
}

function renderField(field, state) {
  const crop = CROPS[field.cropId];
  return `
    <article class="field-card">
      <div class="field-top">
        <h3>${crop.icon} ${field.name}</h3>
        <span>${field.growth}%</span>
      </div>

      <div class="progress">
        <div style="width:${field.growth}%"></div>
      </div>

      <p>퀘스트 ${field.completedQuestCount}/${field.totalQuestCount}</p>

      ${field.harvested
        ? `<p class="harvested">수확 완료</p>`
        : field.harvestReady
          ? `<button class="harvest-field" data-field-id="${field.id}">수확하기</button>`
          : `<p class="muted">아직 자라는 중입니다.</p>`}
    </article>
  `;
}

function renderStorageRoom(state) {
  return `
    <main class="screen">
      <section class="card">
        <p class="eyebrow">Storage</p>
        <h1>창고</h1>

        <div class="inventory">
          ${Object.entries(state.inventory.crops).map(([cropId, amount]) => {
            const crop = CROPS[cropId];
            return `
              <div class="inventory-item">
                <span>${crop.icon}</span>
                <strong>${crop.name}</strong>
                <em>${amount}개</em>
              </div>
            `;
          }).join("")}
        </div>
      </section>
    </main>
  `;
}
