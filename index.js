// index.js
import express from "express";
import usuariosApp from "./users/app.js";
import productosApp from "./products/app.js";
import webhookRouter from "./webhook.js";

const app = express();

app.use(express.json());

// Montar las rutas de usuarios y productos en el servidor principal
app.use("/usuarios", usuariosApp);
app.use("/productos", productosApp);

// Montar la ruta del webhook (en la raíz)
app.use("/", webhookRouter);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});
