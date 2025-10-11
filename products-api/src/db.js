// products-api/src/db.js

import pg from 'pg'; 
const { Pool } = pg; 

// Configurar la conexión con variables de entorno
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432
});

// Probar la conexión al iniciar el módulo
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ ERROR CRITICO: No se pudo conectar a Cloud SQL:', err.stack);
    console.error('   Revise la IP pública (34.45.61.250) y su IP autorizada (186.85.240.66) en GCP.');
    return;
  }
  console.log('✅ Conexión exitosa a la base de datos de GCP (PostgreSQL).');
  release(); 
});

// Exportar el pool para que pueda ser usado en app.js
export { pool };