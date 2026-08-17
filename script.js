// ================= API Base URLs =================
const API_BASE_STATS = "https://leetcode-stats.tashif.codes/";
const API_BASE_PROFILE = "https://leetcode-stats.tashif.codes/";

// ================= DOM Elements =================
const userInput = document.getElementById("user-input");
const searchBtn = document.getElementById("search-btn");

// Overview Stats
const easyLabel = document.getElementById("easy-label");
const mediumLabel = document.getElementById("medium-label");
const hardLabel = document.getElementById("hard-label");

// Extra Cards
const totalSolvedEl = document.getElementById("total-solved");
const totalQuestionsLabel = document.getElementById("total-questions-label");
const acceptanceEl = document.getElementById("acceptance");
const rankingEl = document.getElementById("ranking");
const contributionLabel = document.getElementById("contribution");
const reputationLabel = document.getElementById("reputation");

// Profile Card
const profilePic = document.querySelector(".profile-pic img");
const profileUsername = document.querySelector(".profile-username");
const profileHandle = document.querySelector(".profile-handle");
const profileCountry = document.querySelector(".profile-country");

// Heatmap
const heatmapGrid = document.getElementById("heatmap-grid");
const heatmapMonths = document.getElementById("heatmap-months");
const heatmapEmpty = document.getElementById("heatmap-empty");
let heatmapTooltip = null; // created lazily on first hover

// ================= Event Listener =================
searchBtn.addEventListener("click", async () => {
  const username = userInput.value.trim();
  if (!username) return;

  resetStats(); // Reset UI before fetching

  try {
    // -------- Fetch Stats --------
    const statsRes = await fetch(`${API_BASE_STATS}${username}`);
    if (!statsRes.ok) throw new Error("Stats fetch failed");
    const statsData = await statsRes.json();

    // -------- Fetch Profile --------
    const profileRes = await fetch(`${API_BASE_PROFILE}${username}/profile`);
    if (!profileRes.ok) throw new Error("Profile fetch failed");
    const profileData = await profileRes.json();

    // -------- Update Overview Stats --------
    easyLabel.textContent = statsData.easySolved || 0;
    mediumLabel.textContent = statsData.mediumSolved || 0;
    hardLabel.textContent = statsData.hardSolved || 0;

    // -------- Update Extra Cards --------
    totalSolvedEl.textContent = statsData.totalSolved || 0;
    totalQuestionsLabel.textContent = `/ ${statsData.totalQuestions || 0}`;
    acceptanceEl.textContent = statsData.acceptanceRate
      ? `${statsData.acceptanceRate}%`
      : "-";
    rankingEl.textContent = statsData.ranking || "-";
    contributionLabel.textContent = statsData.contributionPoints || 0;
    reputationLabel.textContent = statsData.reputation || 0;

    // -------- Update Profile Card --------
    profileUsername.textContent = username;
    profileHandle.textContent = `@${username}`;
    profileCountry.textContent = profileData.profile?.countryName || "Unknown";
    profilePic.src = profileData.profile?.userAvatar || "./assets/image.jpg";

    // -------- Render Heatmap --------
    renderHeatmap(statsData.submissionCalendar || {});
  } catch (err) {
    alert("User not found or something went wrong!");
    resetStats();
  }
});

// ================= Reset Stats Function =================
function resetStats() {
  // Overview
  easyLabel.textContent = 0;
  mediumLabel.textContent = 0;
  hardLabel.textContent = 0;

  // Extra Cards
  totalSolvedEl.textContent = 0;
  totalQuestionsLabel.textContent = "";
  acceptanceEl.textContent = "0";
  rankingEl.textContent = "0";
  contributionLabel.textContent = "0";
  reputationLabel.textContent = "0";

  // Profile Card
  profileUsername.textContent = "Username";
  profileHandle.textContent = "UserHandle";
  profileCountry.textContent = "Country";
  profilePic.src = "./assets/image.jpg";

  // Heatmap
  heatmapGrid.innerHTML = "";
  heatmapMonths.innerHTML = "";
  heatmapEmpty.style.display = "block";
}

// Enter Button Search Feature
userInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    searchBtn.click(); 
  }
});

// ================= Heatmap =================
const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function toDateKey(date) {
  // Local YYYY-MM-DD key, independent of timezone shifting the day.
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function renderHeatmap(submissionCalendar) {
  heatmapGrid.innerHTML = "";
  heatmapMonths.innerHTML = "";

  // submissionCalendar looks like { "<unix_seconds>": count, ... }
  const countByDate = {};
  let maxCount = 0;

  Object.entries(submissionCalendar || {}).forEach(([timestamp, count]) => {
    const ts = Number(timestamp) * 1000;
    if (Number.isNaN(ts)) return;
    const date = new Date(ts);
    const key = toDateKey(date);
    const value = Number(count) || 0;
    countByDate[key] = (countByDate[key] || 0) + value;
    if (countByDate[key] > maxCount) maxCount = countByDate[key];
  });

  if (Object.keys(countByDate).length === 0 || maxCount === 0) {
    heatmapEmpty.textContent = "No submission activity found";
    heatmapEmpty.style.display = "block";
    return;
  }

  heatmapEmpty.style.display = "none";

  // Build a 53-week grid ending today, starting on a Sunday.
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const totalDays = 371; // 53 weeks * 7 days
  const start = new Date(today);
  start.setDate(start.getDate() - (totalDays - 1));
  // Roll back to the preceding Sunday so weeks align into full columns.
  start.setDate(start.getDate() - start.getDay());

  const weeks = [];
  let cursor = new Date(start);
  while (cursor <= today) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      week.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }

  let lastMonthLabeled = -1;

  weeks.forEach((week) => {
    const monthOfFirstDay = week[0].getMonth();
    const monthLabel = document.createElement("span");
    if (monthOfFirstDay !== lastMonthLabeled && week[0] <= today) {
      monthLabel.textContent = MONTH_NAMES[monthOfFirstDay];
      lastMonthLabeled = monthOfFirstDay;
    }
    heatmapMonths.appendChild(monthLabel);

    week.forEach((date) => {
      const cell = document.createElement("div");
      cell.classList.add("heatmap-cell");

      if (date > today) {
        cell.style.visibility = "hidden";
        heatmapGrid.appendChild(cell);
        return;
      }

      const key = toDateKey(date);
      const count = countByDate[key] || 0;
      cell.classList.add(`level-${getHeatLevel(count, maxCount)}`);
      cell.dataset.date = date.toDateString();
      cell.dataset.count = count;

      cell.addEventListener("mouseenter", (e) => showHeatmapTooltip(e, date, count));
      cell.addEventListener("mousemove", (e) => positionHeatmapTooltip(e));
      cell.addEventListener("mouseleave", hideHeatmapTooltip);

      heatmapGrid.appendChild(cell);
    });
  });
}

function getHeatLevel(count, maxCount) {
  if (count <= 0) return 0;
  const ratio = count / maxCount;
  if (ratio <= 0.25) return 1;
  if (ratio <= 0.5) return 2;
  if (ratio <= 0.75) return 3;
  return 4;
}

function ensureHeatmapTooltip() {
  if (!heatmapTooltip) {
    heatmapTooltip = document.createElement("div");
    heatmapTooltip.className = "heatmap-tooltip";
    document.body.appendChild(heatmapTooltip);
  }
  return heatmapTooltip;
}

function showHeatmapTooltip(event, date, count) {
  const tooltip = ensureHeatmapTooltip();
  const submissionText = count === 1 ? "submission" : "submissions";
  tooltip.textContent = `${count} ${submissionText} on ${date.toDateString()}`;
  tooltip.classList.add("visible");
  positionHeatmapTooltip(event);
}

function positionHeatmapTooltip(event) {
  if (!heatmapTooltip) return;
  heatmapTooltip.style.left = `${event.clientX}px`;
  heatmapTooltip.style.top = `${event.clientY - 12}px`;
}

function hideHeatmapTooltip() {
  if (heatmapTooltip) heatmapTooltip.classList.remove("visible");
}
