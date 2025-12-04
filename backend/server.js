const express = require("express");
const cors = require("cors");
const db = require("./database");
const app = express();

app.use(cors());
app.use(express.json());

// ---- ENDPOINT RAÍZ PARA RENDER ----
app.get("/", (req, res) => {
  res.send("Backend funcionando correctamente ✔️");
});

// ---- LISTAR TAREAS ----
app.get("/tasks", (req, res) => {
  db.all("SELECT * FROM tasks", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// ---- CREAR TAREA ----
app.post("/tasks", (req, res) => {
  const { title } = req.body;
  db.run(
    "INSERT INTO tasks (title, completed) VALUES (?, ?)",
    [title, 0],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, title, completed: 0 });
    }
  );
});

// ---- COMPLETAR TAREA ----
app.put("/tasks/:id", (req, res) => {
  const id = req.params.id;
  db.run(
    "UPDATE tasks SET completed = 1 WHERE id = ?",
    id,
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});

// ---- ELIMINAR TAREA ----
app.delete("/tasks/:id", (req, res) => {
  const id = req.params.id;
  db.run("DELETE FROM tasks WHERE id = ?", id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// ---- PUERTO IMPORTANTE PARA RENDER ----
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor corriendo en el puerto", PORT);
});
