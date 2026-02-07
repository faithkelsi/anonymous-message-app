const pathParts = window.location.pathname.split("/");
const userId = pathParts[pathParts.length - 1];

// Send message
function sendMessage() {
  const message = document.getElementById("message").value;

  fetch(`/send/${userId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  })
    .then(res => res.json())
    .then(() => {
      document.getElementById("status").innerText = "Message sent anonymously ✔️";
      document.getElementById("message").value = "";
    });
}

// Load inbox
if (window.location.pathname.includes("/inbox")) {
  fetch(`/messages/${userId}`)
    .then(res => res.json())
    .then(data => {
      const ul = document.getElementById("messages");
      data.forEach(msg => {
        const li = document.createElement("li");
        li.innerText = msg.text;
        ul.appendChild(li);
      });
    });
}

