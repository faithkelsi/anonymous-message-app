// -----------------------------
// GET USER ID FROM URL (robust to trailing slashes)
// -----------------------------
const pathParts = window.location.pathname.replace(/\/$/, "").split("/");
const userId = pathParts[pathParts.length - 1];
console.log("Current userId:", userId);

// -----------------------------
// SEND ANONYMOUS MESSAGE
// -----------------------------
const sendBtn = document.getElementById("sendBtn");
sendBtn?.addEventListener("click", async () => {
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

  try {
    const response = await fetch(`/send/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    if (!response.ok) throw new Error("Network response not ok");

    const data = await response.json();

    if (data.success) {
      status.innerText = "Message sent successfully ✔️";
      status.style.color = "green";
      messageInput.value = "";

      // Show CTA to create their own inbox
      document.getElementById("cta")?.classList.remove("hidden");
    } else {
      status.innerText = "Something went wrong. Try again.";
      status.style.color = "red";
    }
  } catch (err) {
    console.error(err);
    status.innerText = "Network error. Please try again.";
    status.style.color = "red";
  }
});

// -----------------------------
// CREATE MY LINK (CTA button)
// -----------------------------
const createLinkBtn = document.getElementById("createLinkBtn");
createLinkBtn?.addEventListener("click", async () => {
  try {
    const res = await fetch("/create");
    const data = await res.json();
    // Redirect user to their inbox link immediately
    window.location.href = data.inbox;
  } catch (err) {
    console.error(err);
    alert("Failed to create link. Try again.");
  }
});

// -----------------------------
// LOAD INBOX MESSAGES
// -----------------------------
if (window.location.pathname.includes("/inbox")) {
  const loadInbox = async () => {
    try {
      const res = await fetch(`/messages/${userId}`);
      const messages = await res.json();

      const container = document.getElementById("messages");
      const empty = document.getElementById("empty");

      if (!messages || messages.length === 0) {
        empty?.classList.remove("hidden");
        return;
      }

      messages.reverse().forEach(msg => {
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
    } catch (err) {
      console.error("Failed to load messages:", err);
    }
  };

  loadInbox();
}

// -----------------------------
// CREATE USER LINK (landing page)
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
