
const express = require("express");
const cors = require("cors");
const db = require("./database");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/tasks", (req, res) => {
  db.all("SELECT * FROM tasks", [], (err, rows) => {
    res.json(rows);
  });
});

app.post("/tasks", (req, res) => {
  const { title } = req.body;
  db.run("INSERT INTO tasks (title) VALUES (?)", [title], function () {
    res.json({ id: this.lastID, title });
  });
});

app.put("/tasks/:id", (req, res) => {
  db.run("UPDATE tasks SET completed = 1 WHERE id = ?", [req.params.id], () => {
    res.json({ message: "updated" });
  });
});

app.delete("/tasks/:id", (req, res) => {
  db.run("DELETE FROM tasks WHERE id = ?", [req.params.id], () => {
    res.json({ message: "deleted" });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));