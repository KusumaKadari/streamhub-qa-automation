const STORAGE_KEY = "savesmart_goals";

// Start with no goals. Users can create their own savings goals from the dashboard.
const sampleGoals = [];

let goals = loadGoals();
let savingsChart = null;

const elements = {
  goalForm: document.getElementById("goal-form"),
  formError: document.getElementById("form-error"),
  formSuccess: document.getElementById("form-success"),
  addSection: document.getElementById("add-goal-section"),
  openAdd: document.getElementById("open-add-form"),
  goalsList: document.getElementById("goals-list"),
  emptyGoals: document.getElementById("empty-goals"),
  search: document.getElementById("goal-search"),
  statusFilter: document.getElementById("status-filter"),
  reportSearch: document.getElementById("report-search"),
  reportBody: document.getElementById("report-table-body"),
  reportEmpty: document.getElementById("report-empty"),
  toast: document.getElementById("toast")
};

function loadGoals() {
  try {
    const storedGoals = localStorage.getItem(STORAGE_KEY);
    if (storedGoals !== null) return JSON.parse(storedGoals);
  } catch (error) {
    console.warn("Could not read saved goals; using sample data.", error);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleGoals));
  return [...sampleGoals];
}

function saveGoals() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
}

function formatDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function getProgress(goal) {
  if (!goal.targetAmount || goal.targetAmount <= 0) return 0;
  return Math.min(100, Math.round((goal.savedAmount / goal.targetAmount) * 100));
}

function getRemaining(goal) {
  return Math.max(0, goal.targetAmount - goal.savedAmount);
}

function getStatus(goal) {
  return getProgress(goal) >= 100 ? "Completed" : "In Progress";
}

function updateDashboard() {
  const totalSaved = goals.reduce((sum, goal) => sum + Number(goal.savedAmount), 0);
  const totalTarget = goals.reduce((sum, goal) => sum + Number(goal.targetAmount), 0);
  const remaining = goals.reduce((sum, goal) => sum + getRemaining(goal), 0);
  const overallProgress = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  document.getElementById("total-savings").textContent = formatCurrency(totalSaved);
  document.getElementById("total-target").textContent = formatCurrency(totalTarget);
  document.getElementById("total-remaining").textContent = formatCurrency(remaining);
  document.getElementById("overall-progress").textContent = `${overallProgress}%`;
}

function renderGoals() {
  const searchText = elements.search.value.trim().toLowerCase();
  const selectedStatus = elements.statusFilter.value;
  const filteredGoals = goals.filter((goal) => {
    const matchesSearch = goal.name.toLowerCase().includes(searchText);
    const matchesStatus = selectedStatus === "All" || getStatus(goal) === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  elements.goalsList.innerHTML = "";
  filteredGoals.forEach((goal) => elements.goalsList.appendChild(createGoalCard(goal)));
  elements.emptyGoals.classList.toggle("hidden", filteredGoals.length !== 0);
  renderReport();
  updateDashboard();
  updateChart();
}

function createGoalCard(goal) {
  const progress = getProgress(goal);
  const status = getStatus(goal);
  const card = document.createElement("article");
  card.className = "goal-card";
  card.dataset.goalId = goal.id;
  card.dataset.testid = "goal-card";
  card.innerHTML = `
    <div class="goal-card-header">
      <h3>${escapeHtml(goal.name)}</h3>
      <span class="status-badge ${status === "Completed" ? "completed" : "in-progress"}">${status}</span>
    </div>
    <p class="goal-date">Target date: ${formatDate(goal.targetDate)}</p>
    <div class="amount-row"><strong>${formatCurrency(goal.savedAmount)}</strong><span>of ${formatCurrency(goal.targetAmount)}</span></div>
    <div class="progress-track" role="progressbar" aria-label="${escapeHtml(goal.name)} progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress}"><div class="progress-bar ${progress >= 100 ? "complete" : ""}" style="width:${progress}%"></div></div>
    <div class="goal-progress"><span>Remaining: ${formatCurrency(getRemaining(goal))}</span><strong>${progress}%</strong></div>
    <form class="add-money-row" data-add-money-form="${goal.id}">
      <label class="sr-only" for="money-${goal.id}">Amount to add to ${escapeHtml(goal.name)}</label>
      <input id="money-${goal.id}" type="number" min="0.01" step="0.01" placeholder="Add amount (₹)" aria-label="Add money to ${escapeHtml(goal.name)}">
      <button class="button button-primary" type="submit" aria-label="Add money to ${escapeHtml(goal.name)}">Add Money</button>
    </form>
    <div class="goal-actions"><button class="delete-button" type="button" data-delete-id="${goal.id}" aria-label="Delete ${escapeHtml(goal.name)}">Delete Goal</button></div>`;
  return card;
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

function validateGoal(name, targetAmount, savedAmount, targetDate) {
  if (!name || !targetDate) return "Please complete all required fields.";
  if (!Number.isFinite(targetAmount) || targetAmount <= 0) return "Target amount must be greater than zero.";
  if (!Number.isFinite(savedAmount) || savedAmount < 0) return "Current saved amount cannot be negative.";
  if (savedAmount > targetAmount) return "Current saved amount cannot exceed the target amount.";
  return "";
}

function showFormFeedback(message, isSuccess) {
  elements.formError.classList.toggle("hidden", isSuccess);
  elements.formSuccess.classList.toggle("hidden", !isSuccess);
  (isSuccess ? elements.formSuccess : elements.formError).textContent = message;
}

function clearFormFeedback() {
  elements.formError.classList.add("hidden");
  elements.formSuccess.classList.add("hidden");
}

function toggleAddForm(open) {
  elements.addSection.classList.toggle("hidden", !open);
  elements.openAdd.setAttribute("aria-expanded", String(open));
  if (open) document.getElementById("goal-name").focus(); else {
    elements.goalForm.reset();
    clearFormFeedback();
  }
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.remove("hidden");
  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => elements.toast.classList.add("hidden"), 2800);
}

function renderReport() {
  const searchText = elements.reportSearch.value.trim().toLowerCase();
  const reportGoals = goals.filter((goal) => goal.name.toLowerCase().includes(searchText));
  elements.reportBody.innerHTML = "";

  reportGoals.forEach((goal) => {
    const progress = getProgress(goal);
    const status = getStatus(goal);
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><strong>${escapeHtml(goal.name)}</strong></td>
      <td>${formatCurrency(goal.targetAmount)}</td>
      <td>${formatCurrency(goal.savedAmount)}</td>
      <td>${formatCurrency(getRemaining(goal))}</td>
      <td><div class="table-progress"><div class="progress-track"><div class="progress-bar ${progress >= 100 ? "complete" : ""}" style="width:${progress}%"></div></div><strong>${progress}%</strong></div></td>
      <td>${formatDate(goal.targetDate)}</td>
      <td><span class="status-badge ${status === "Completed" ? "completed" : "in-progress"}">${status}</span></td>`;
    elements.reportBody.appendChild(row);
  });

  elements.reportEmpty.classList.toggle("hidden", reportGoals.length !== 0);
}

function updateChart() {
  const canvas = document.getElementById("savings-chart");
  if (!canvas || typeof Chart === "undefined") return;
  const labels = goals.map((goal) => goal.name);
  const savedData = goals.map((goal) => Number(goal.savedAmount));
  const remainingData = goals.map((goal) => getRemaining(goal));

  const chartConfig = {
    type: "bar",
    data: { labels, datasets: [{ label: "Saved", data: savedData, backgroundColor: "#2878d0", borderRadius: 5 }, { label: "Remaining", data: remainingData, backgroundColor: "#dbe7f2", borderRadius: 5 }] },
    options: { responsive: true, maintainAspectRatio: false, scales: { x: { stacked: true, ticks: { color: "#687789" }, grid: { display: false } }, y: { stacked: true, beginAtZero: true, ticks: { color: "#687789", callback: (value) => `₹${value.toLocaleString("en-IN")}` }, grid: { color: "#edf1f5" } } }, plugins: { legend: { position: "bottom" }, tooltip: { callbacks: { label: (context) => `${context.dataset.label}: ${formatCurrency(context.parsed.y)}` } } } }
  };

  if (savingsChart) savingsChart.destroy();
  savingsChart = new Chart(canvas, chartConfig);
}

function switchView(viewName) {
  document.getElementById("dashboard-view").classList.toggle("hidden", viewName !== "dashboard");
  document.getElementById("reports-view").classList.toggle("hidden", viewName !== "reports");
  document.querySelectorAll(".nav-button").forEach((button) => {
    const active = button.dataset.view === viewName;
    button.classList.toggle("active", active);
    if (active) button.setAttribute("aria-current", "page"); else button.removeAttribute("aria-current");
  });
  window.location.hash = viewName;
  if (viewName === "reports") renderReport(); else renderGoals();
}

elements.openAdd.addEventListener("click", () => toggleAddForm(elements.addSection.classList.contains("hidden")));
document.getElementById("close-add-form").addEventListener("click", () => toggleAddForm(false));
document.getElementById("cancel-add").addEventListener("click", () => toggleAddForm(false));

elements.goalForm.addEventListener("submit", (event) => {
  event.preventDefault();
  clearFormFeedback();
  const name = document.getElementById("goal-name").value.trim();
  const targetAmountInput = document.getElementById("target-amount").value;
  const savedAmountInput = document.getElementById("current-saved").value;
  const targetDate = document.getElementById("target-date").value;
  if (!name || !targetAmountInput || !savedAmountInput || !targetDate) {
    showFormFeedback("Please complete all required fields.", false);
    return;
  }
  const targetAmount = Number(targetAmountInput);
  const savedAmount = Number(savedAmountInput);
  const validationError = validateGoal(name, targetAmount, savedAmount, targetDate);
  if (validationError) { showFormFeedback(validationError, false); return; }

  goals.push({ id: `goal-${Date.now()}`, name, targetAmount, savedAmount, targetDate });
  saveGoals();
  renderGoals();
  showFormFeedback("Goal added successfully.", true);
  showToast(`${name} was added successfully`);
  window.setTimeout(() => toggleAddForm(false), 700);
});

elements.goalsList.addEventListener("submit", (event) => {
  const form = event.target.closest("[data-add-money-form]");
  if (!form) return;
  event.preventDefault();
  const goalId = form.dataset.addMoneyForm;
  const goal = goals.find((item) => item.id === goalId);
  const input = form.querySelector("input");
  const amount = Number(input.value);

  if (!Number.isFinite(amount) || amount <= 0) { showToast("Enter a valid amount greater than zero"); input.focus(); return; }
  if (goal.savedAmount + amount > goal.targetAmount) { showToast(`Amount would exceed the target. Remaining: ${formatCurrency(getRemaining(goal))}`); input.focus(); return; }

  goal.savedAmount += amount;
  saveGoals();
  renderGoals();
  showToast(`${formatCurrency(amount)} added to ${goal.name}`);
});

elements.goalsList.addEventListener("click", (event) => {
  const deleteButton = event.target.closest("[data-delete-id]");
  if (!deleteButton) return;
  const goalId = deleteButton.dataset.deleteId;
  const goal = goals.find((item) => item.id === goalId);
  if (!goal || !window.confirm(`Delete "${goal.name}"?`)) return;
  goals = goals.filter((item) => item.id !== goalId);
  saveGoals();
  renderGoals();
  showToast(`${goal.name} was deleted`);
});

elements.search.addEventListener("input", renderGoals);
elements.statusFilter.addEventListener("change", renderGoals);
elements.reportSearch.addEventListener("input", renderReport);
document.querySelectorAll(".nav-button").forEach((button) => button.addEventListener("click", () => switchView(button.dataset.view)));

window.addEventListener("hashchange", () => switchView(window.location.hash === "#reports" ? "reports" : "dashboard"));

switchView(window.location.hash === "#reports" ? "reports" : "dashboard");
