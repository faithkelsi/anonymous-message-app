
const express = require("express");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// File to store messages
const DATA_FILE = "messages.json";

// Ensure data file exists
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({}));
}

// Home
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// Create user link
app.get("/create", (req, res) => {
  const userId = uuidv4();
  res.json({
    link: `${req.protocol}://${req.get("host")}/send/${userId}`,
    inbox: `${req.protocol}://${req.get("host")}/inbox/${userId}`
  });
});

// Send anonymous message
app.post("/send/:userId", (req, res) => {
  const { message } = req.body;
  const userId = req.params.userId;

  if (!message) {
    return res.status(400).json({ error: "Message required" });
  }

  const data = JSON.parse(fs.readFileSync(DATA_FILE));

  if (!data[userId]) {
    data[userId] = [];
  }

  data[userId].push({
    text: message,
    time: new Date().toISOString()
  });

  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

  res.json({ success: true });
});

// Message inbox
app.get("/messages/:userId", (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  res.json(data[req.params.userId] || []);
});

// Inbox page
app.get("/inbox/:userId", (req, res) => {
  res.sendFile(path.join(__dirname, "public/inbox.html"));
});

// Send page
app.get("/send/:userId", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
