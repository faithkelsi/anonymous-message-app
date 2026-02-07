// -----------------------------
// GET USER ID FROM URL
// -----------------------------
const pathParts = window.location.pathname.replace(/\/$/, "").split("/");
const userId = pathParts[pathParts.length - 1];
console.log("Current userId:", userId); // useful for debugging

// -----------------------------
// SEND ANONYMOUS MESSAGE
// -----------------------------
function sendMessage() {
  const messageInput = document.getElementById("message");
  const status = document.getElementById("status");
  const message = messageInput.value.trim();

  if (!message) {
    status.innerText = "Please write a message before sending.";
    status.style.color = "red";
    return;
  }

  status.innerText = "Sending...";
  status.style.color = "#555";

  fetch(`/send/${userId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        status.innerText = "Message sent successfully ✔️";
        status.style.color = "green";
        messageInput.value = "";

        // Show CTA for visitor to create their own link
        document.getElementById("cta")?.classList.remove("hidden");
      } else {
        status.innerText = "Something went wrong. Try again.";
        status.style.color = "red";
      }
    })
    .catch(() => {
      status.innerText = "Network error. Please try again.";
      status.style.color = "red";
    });
}

// -----------------------------
// LOAD INBOX MESSAGES
// -----------------------------
if (window.location.pathname.includes("/inbox")) {
  fetch(`/messages/${userId}`)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("messages");
      const empty = document.getElementById("empty");

      if (!data || data.length === 0) {
        empty?.classList.remove("hidden");
        return;
      }

      data.reverse().forEach(msg => {
        const card = document.createElement("div");
        card.className = "message-card";

        const text = document.createElement("p");
        text.className = "message-text";
        text.innerText = msg.text;

        const time = document.createElement("span");
        time.className = "message-time";
        time.innerText = new Date(msg.time).toLocaleString();

        card.appendChild(text);
        card.appendChild(time);
        container.appendChild(card);
      });
    })
    .catch(() => console.error("Failed to load messages"));
}

// -----------------------------
// CREATE USER LINK (LANDING PAGE)
// -----------------------------
function createLink() {
  fetch("/create")
    .then(res => res.json())
    .then(data => {
      document.getElementById("result")?.classList.remove("hidden");
      document.getElementById("publicLink").value = data.link;
      document.getElementById("inboxLink").value = data.inbox;
    })
    .catch(() => alert("Failed to create link. Try again."));
}

// -----------------------------
// CREATE LINK FROM CTA (send.html)
// -----------------------------
function createMyLink() {
  fetch("/create")
    .then(res => res.json())
    .then(data => {
      window.location.href = data.inbox;
    })
    .catch(() => alert("Failed to create link. Try again."));
}
