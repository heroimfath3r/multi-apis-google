// products-api/src/app.js

import express from "express";
import cors from "cors";
import fetch from "node-fetch";
// 1. Importar la conexión a la base de datos
import { pool } from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;
const SERVICE = process.env.SERVICE_NAME || "products-api";
const USERS_API_URL = process.env.USERS_API_URL || "http://users-api:4001";

// Ruta de Salud
app.get("/health", (_req, res) => res.json({ status: "ok", service: SERVICE }));

// GET /products (Ahora consulta la DB)
app.get("/products", async (_req, res) => {
  try {
    const result = await pool.query("SELECT id, name, price, stock FROM products ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener productos:", err.stack);
    res.status(500).json({ error: "Error interno al consultar la base de datos." });
  }
});

// GET /products/:id (Ahora consulta la DB)
app.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT id, name, price, stock FROM products WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error al obtener producto:", err.stack);
    res.status(500).json({ error: "Error interno al consultar la base de datos." });
  }
});

// POST /products (Ahora inserta en la DB)
app.post("/products", async (req, res) => {
  try {
    const { name, price, description, stock } = req.body;
    if (!name || !price) {
      return res.status(400).json({ error: "Faltan campos (name, price) requeridos." });
    }

    const result = await pool.query(
      "INSERT INTO products (name, price, description, stock) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, price, description || null, stock || 0]
    );

    res.status(201).json({
      message: "Producto creado exitosamente",
      payload: result.rows[0]
    });
  } catch (err) {
    console.error("Error al crear producto:", err.stack);
    res.status(500).json({ error: "Error interno al crear el producto." });
  }
});

// ... otras rutas (PUT, DELETE si las necesitas)

// Ejemplo de comunicación entre servicios (NO SE MODIFICA LA LÓGICA DE FETCH)
app.get("/products/with-users", async (_req, res) => {
  try {
    const r = await fetch(`${USERS_API_URL}/users`);
    const users = await r.json();
    
    // Aquí obtendríamos los productos de la DB:
    const productsResult = await pool.query("SELECT id, name, price FROM products");
    
    res.json({
      products: productsResult.rows,
      usersCount: Array.isArray(users) ? users.length : 0
    });
  } catch (e) {
    res.status(502).json({ error: "No se pudo consultar users-api", detail: String(e) });
  }
});

app.listen(PORT, () => {
  console.log(`✅ ${SERVICE} listening on http://localhost:${PORT}`);
  console.log(`↔️  USERS_API_URL=${USERS_API_URL}`);
});