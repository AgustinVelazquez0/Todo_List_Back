const { Pool } = require("pg");

// Configuración del Pool de conexiones usando la variable de entorno POSTGRES_URL
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL, // Usar la URL de conexión proporcionada por Railway
});

// Manejo de errores
pool.on("error", (err) => {
  console.error("Error en el pool de PostgreSQL:", err);
});

module.exports = pool;
