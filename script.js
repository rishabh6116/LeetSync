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
  acceptanceEl.textContent = "-";
  rankingEl.textContent = "-";
  contributionLabel.textContent = "-";
  reputationLabel.textContent = "-";

  // Profile Card
  profileUsername.textContent = "Username";
  profileHandle.textContent = "UserHandle";
  profileCountry.textContent = "Country";
  profilePic.src = "./assets/image.jpg";
}
