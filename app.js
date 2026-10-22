const starterProfiles = [
  {id:1,name:"Aarav Menon",teach:"Java Programming",learn:"UI/UX Design",category:"Technology",bio:"Enjoys solving coding problems and building small apps.",initials:"AM"},
  {id:2,name:"Diya Thomas",teach:"UI/UX Design",learn:"Python Basics",category:"Design",bio:"Interested in user-friendly interfaces and creative design.",initials:"DT"},
  {id:3,name:"Joel Mathew",teach:"Guitar & Music Theory",learn:"Video Editing",category:"Music",bio:"A music enthusiast who likes helping beginners get started.",initials:"JM"},
  {id:4,name:"Ananya Nair",teach:"Mathematics",learn:"Public Speaking",category:"Academics",bio:"Likes making difficult concepts easier to understand.",initials:"AN"},
  {id:5,name:"Kevin Joseph",teach:"Web Development",learn:"Java Programming",category:"Technology",bio:"Building websites and exploring modern web technologies.",initials:"KJ"},
  {id:6,name:"Meera George",teach:"Public Speaking",learn:"Guitar Basics",category:"Communication",bio:"Interested in communication, presentations and teamwork.",initials:"MG"}
];
const storageKey = "peerlearn_profiles_v1";
let profiles = loadProfiles();
const grid = document.getElementById("profileGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const dialog = document.getElementById("profileDialog");
const form = document.getElementById("profileForm");
const toast = document.getElementById("toast");

function loadProfiles() {
  try {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : starterProfiles;
  } catch {
    return starterProfiles;
  }
}
function saveProfiles() {
  try { localStorage.setItem(storageKey, JSON.stringify(profiles)); }
  catch { showToast("Could not save in this browser. You can still view the demo."); }
}
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
}
function renderProfiles() {
  const term = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;
  const filtered = profiles.filter(p => {
    const content = [p.name,p.teach,p.learn,p.category,p.bio].join(" ").toLowerCase();
    return content.includes(term) && (category === "all" || p.category === category);
  });
  grid.innerHTML = filtered.map(p => `
    <article class="profile-card">
      <div class="profile-top"><div class="profile-avatar">${escapeHTML(p.initials || p.name.split(/\s+/).map(n=>n[0]).slice(0,2).join("").toUpperCase())}</div>
        <div><div class="profile-name">${escapeHTML(p.name)}</div><div class="profile-category">${escapeHTML(p.category)}</div></div></div>
      <div class="skill-row"><span class="skill-label">Can teach</span><div class="skill-value teach">${escapeHTML(p.teach)}</div></div>
      <div class="skill-row"><span class="skill-label">Wants to learn</span><div class="skill-value learn">${escapeHTML(p.learn)}</div></div>
      <p class="profile-bio">${escapeHTML(p.bio || "Ready to learn and share with fellow students.")}</p>
      <button class="request-button" data-request="${p.id}">Send learning request ↗</button>
    </article>`).join("");
  document.getElementById("resultsCount").textContent = `${filtered.length} student${filtered.length === 1 ? "" : "s"}`;
  document.getElementById("studentCount").textContent = profiles.length;
  document.getElementById("emptyState").classList.toggle("hidden", filtered.length !== 0);
}
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2800);
}
searchInput.addEventListener("input", renderProfiles);
categoryFilter.addEventListener("change", renderProfiles);
document.getElementById("addProfileBtn").addEventListener("click", () => dialog.showModal());
document.getElementById("closeDialog").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });
grid.addEventListener("click", event => {
  const button = event.target.closest("[data-request]");
  if (!button) return;
  const profile = profiles.find(p => p.id === Number(button.dataset.request));
  if (profile) showToast(`Demo request prepared for ${profile.name}. Backend messaging is not connected yet.`);
});
form.addEventListener("submit", event => {
  event.preventDefault();
  const data = new FormData(form);
  const name = String(data.get("name")).trim();
  const teach = String(data.get("teach")).trim();
  const learn = String(data.get("learn")).trim();
  if (!name || !teach || !learn) { showToast("Please complete the required fields."); return; }
  profiles.unshift({
    id: Date.now(), name, teach, learn,
    category: String(data.get("category")),
    bio: String(data.get("bio")).trim(),
    initials: name.split(/\s+/).map(n=>n[0]).slice(0,2).join("").toUpperCase()
  });
  saveProfiles();
  form.reset();
  dialog.close();
  renderProfiles();
  showToast("Profile added to this browser.");
});
renderProfiles();
