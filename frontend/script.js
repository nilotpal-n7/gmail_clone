// async function fetchMails() {
//   try {
//     const response = await fetch("http://localhost:8000/api/mail/getAll");
//     const mails = await response.json();
//     console.log(mails);
//   } catch (error) {
//     mailContainer.innerHTML = `<p>Error fetching mails: ${error.message}</p>`;
//   }
// }

// fetchMails();




const API_BASE = "http://localhost:8000/api/mails";

async function fetchMails() {
  const res = await fetch(`${API_BASE}/getAll`);
  const mails = await res.json();

  const list = document.getElementById("mail-list");
  list.innerHTML = "";

  mails.forEach((mail) => {
    const div = document.createElement("div");
    div.className = `mail ${mail.starred ? "starred" : ""}`;
    div.innerHTML = `
      <div>
        <strong>${mail.subject}</strong>
        <p>${mail.message}</p>
      </div>
      <div>
        <button onclick="toggleStar('${mail._id}')">⭐</button>
        <button onclick="deleteMail('${mail._id}')">🗑</button>
      </div>
    `;
    list.appendChild(div);
  });
}

async function sendMail(event) {
  event.preventDefault();
  const sender = document.getElementById("sender").value;
  const reciever = document.getElementById("reciever").value;
  const subject = document.getElementById("subject").value;
  const message = document.getElementById("message").value;

  await fetch(`${API_BASE}/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sender, reciever, subject, body: message }),
  });

  hideMailForm();
  fetchMails();
}

async function deleteMail(id) {
  await fetch(`${API_BASE}/delete/${id}`, { method: "DELETE" });
  fetchMails();
}

async function toggleStar(id) {
  await fetch(`${API_BASE}/star?id=${id}`);
  fetchMails();
}

function showMailForm() {
  document.getElementById("mail-form").classList.remove("hidden");
}

function hideMailForm() {
  document.getElementById("mail-form").classList.add("hidden");
  document.getElementById("subject").value = "";
  document.getElementById("message").value = "";
}

fetchMails();
