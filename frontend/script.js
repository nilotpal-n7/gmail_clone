const API_BASE = "http://localhost:8000/api/mails";
let allMails = [];
let currentCategory = "primary";

function formatMailDate(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();

  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    // Show time like 2:45 PM
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  } else {
    // Show date like 24 May, 2025
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }
}


async function fetchMails() {
  const res = await fetch(`${API_BASE}/getAll`);
  allMails = await res.json();
  renderMails();
  updateUnreadCounts();
  document.querySelector(`.category[data-type="${currentCategory}"]`)?.classList.add("active");
}

function renderMails() {
  const list = document.getElementById("mail-list");
  list.innerHTML = "";

  const filtered = allMails
    .filter(mail => mail.type === currentCategory)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Newest first

  filtered.forEach((mail) => {
    const div = document.createElement("div");
    div.className = `messages ${mail.status === 'unseen' ? 'unread' : ''}`;
    div.id = `mail-${mail._id}`;
    div.innerHTML = `
      <div class="messages-left">
        <button onclick="toggleStar('${mail._id}')">
          <img id="star-icon-${mail._id}" src="${mail.starred ? 'icons/star-solid.svg' : 'icons/star-regular.svg'}" alt="star" class="icon">
        </button>
        <button onclick="deleteMail('${mail._id}')">
          <img src="icons/trash-solid.svg" alt="delete" class="icon">
        </button>
        <span>${mail.sender}</span>
      </div>
      <button type="button" onclick="markAsRead('${mail._id}')">
        <div class="messages-content">${mail.body}</div>
      </button>
      <div class="messages-date">${formatMailDate(mail.createdAt)}</div>
    `;
    list.appendChild(div);
  });
}


function updateUnreadCounts() {
  const categories = ["primary", "promotions", "social", "updates"];
  categories.forEach(type => {
    const count = allMails.filter(mail => mail.type === type && mail.status === "unseen").length;
    const el = document.getElementById(`${type}-count`);
    if (el) el.textContent = count > 0 ? `(${count})` : "";
  });

  const inboxCount = allMails.length;
  const inboxEl = document.getElementById("inbox-count");
  if (inboxEl) inboxEl.textContent = inboxCount > 0 ? `(${inboxCount})` : "";

  const starredCount = allMails.filter(mail => mail.starred).length;
  const starredEl = document.getElementById("starred-count");
  if (starredEl) starredEl.textContent = starredCount > 0 ? `(${starredCount})` : "";
}

async function sendMail(event) {
  event.preventDefault();
  const sender = document.getElementById("sender").value;
  const reciever = 'nilotpal_n7'
  const message = document.getElementById("message").value;
  const type = currentCategory;

  const res = await fetch(`${API_BASE}/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sender, reciever, body: message, type }),
  });
  const newMail = await res.json();
  allMails.unshift(newMail);
  hideMailForm();
  renderMails();
  updateUnreadCounts();
}

async function deleteMail(id) {
  const mailDiv = document.getElementById(`mail-${id}`);
  if (mailDiv) mailDiv.remove();
  allMails = allMails.filter(mail => mail._id !== id);
  updateUnreadCounts();

  const res = await fetch(`${API_BASE}/delete/${id}`, { method: "DELETE" });
  if (!res.ok) {
    console.error("Failed to delete mail.");
  }
}

async function toggleStar(id) {
  const res = await fetch(`${API_BASE}/star/${id}`, { method: "POST" });
  if (res.ok) {
    const updated = await res.json();
    const index = allMails.findIndex(mail => mail._id === id);
    allMails[index].starred = updated.starred;
    document.getElementById(`star-icon-${id}`).src = updated.starred ? "icons/star-solid.svg" : "icons/star-regular.svg";
    updateUnreadCounts();
  }
}

async function markAsRead(id) {
  const mail = allMails.find(m => m._id === id);
  if (!mail || mail.status === 'seen') return;

  mail.status = "seen";
  const mailDiv = document.getElementById(`mail-${id}`);
  if (mailDiv) mailDiv.classList.remove("unread");

  const res = await fetch(`${API_BASE}/read/${id}`, { method: "POST" });
  if (!res.ok) {
    console.error("Failed to mark mail as read.");
    mail.status = "unseen";
    if (mailDiv) mailDiv.classList.add("unread");
  }

  updateUnreadCounts();
}


function showMailForm() {
  document.getElementById("mail-form").classList.remove("hidden");
}

function hideMailForm() {
  document.getElementById("mail-form").classList.add("hidden");
  document.getElementById("subject").value = "";
  document.getElementById("message").value = "";
  document.getElementById("reciever").value = "";
}

// Category tab switching
const categoryElements = Array.from(document.getElementsByClassName("category"));

categoryElements.forEach((el) => {
  el.addEventListener("click", () => {
    // Remove active class from all
    categoryElements.forEach(c => c.classList.remove("active"));

    // Add to clicked one
    el.classList.add("active");

    // Update current category and mails
    currentCategory = el.dataset.type;  // from data-type in HTML
    renderMails();
    updateUnreadCounts();
  });
});


fetchMails();
