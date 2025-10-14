// webhook.js
import express from 'express';

const router = express.Router();

router.post('/webhook', (req, res) => {
  const payload = req.body;

  console.log('Webhook recibido:', payload);

  // Aquí puedes agregar lógica para procesar el payload, por ejemplo guardar en BD

  res.status(200).json({ message: 'Webhook recibido correctamente' });
});

export default router;
