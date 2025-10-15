// db.js (usar el mismo en products-api y users-api)

import pg from 'pg'; 
const { Pool } = pg; 

// Configuración para Cloud SQL con Unix Socket
const poolConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // Si DB_HOST es un socket de Cloud SQL, usamos host, de lo contrario puerto 5432
  ...(process.env.DB_HOST?.startsWith('/cloudsql') 
    ? { host: process.env.DB_HOST }
    : { host: process.env.DB_HOST, port: 5432 }
  )
};

const pool = new Pool(poolConfig);

// Probar la conexión al iniciar el módulo
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ ERROR CRITICO: No se pudo conectar a la base de datos:', err.stack);
    console.error('   DB_HOST:', process.env.DB_HOST);
    console.error('   DB_NAME:', process.env.DB_NAME);
    console.error('   DB_USER:', process.env.DB_USER);
    return;
  }
  console.log('✅ Conexión exitosa a la base de datos PostgreSQL');
  console.log('   Conectado a:', process.env.DB_NAME);
  release(); 
});

// Exportar el pool
export { pool };