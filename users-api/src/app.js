// users-api/src/app.js

import express from "express";
import cors from "cors";
// 1. Importar la conexión a la base de datos desde el nuevo módulo db.js
import { pool } from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4001;
const SERVICE = process.env.SERVICE_NAME || "users-api";

// Ruta de Salud
app.get("/health", (_req, res) => res.json({ status: "ok", service: SERVICE }));

// GET /users (Ahora consulta la DB)
app.get("/users", async (_req, res) => {
  try {
    const result = await pool.query("SELECT id, name, email FROM users ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener usuarios:", err.stack);
    res.status(500).json({ error: "Error interno al consultar la base de datos." });
  }
});

// GET /users/:id (Ahora consulta la DB)
app.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT id, name, email FROM users WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error al obtener usuario:", err.stack);
    res.status(500).json({ error: "Error interno al consultar la base de datos." });
  }
});

// POST /users (Ahora inserta en la DB)
app.post("/users", async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: "Faltan campos (name, email) requeridos." });
    }
    
    const result = await pool.query(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id, name, email, created_at",
      [name, email]
    );

    res.status(201).json({
      message: "Usuario creado exitosamente",
      payload: result.rows[0]
    });
  } catch (err) {
    // Código 23505 es una violación de clave única (ej: email repetido)
    if (err.code === '23505') { 
        return res.status(409).json({ error: "El email ya está registrado." });
    }
    console.error("Error al crear usuario:", err.stack);
    res.status(500).json({ error: "Error interno al crear el usuario." });
  }
});

// PUT /users/:id (Ahora actualiza la DB)
app.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    
    const result = await pool.query(
      "UPDATE users SET name = COALESCE($1, name), email = COALESCE($2, email) WHERE id = $3 RETURNING id, name, email",
      [name, email, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "Usuario actualizado exitosamente",
      payload: result.rows[0]
    });
  } catch (err) {
    console.error("Error al actualizar usuario:", err.stack);
    res.status(500).json({ error: "Error interno al actualizar el usuario." });
  }
});

// DELETE /users/:id (Ahora elimina de la DB)
app.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM users WHERE id = $1", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "Usuario eliminado exitosamente", id });
  } catch (err) {
    console.error("Error al eliminar usuario:", err.stack);
    res.status(500).json({ error: "Error interno al eliminar el usuario." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ ${SERVICE} listening on http://localhost:${PORT}`);
});