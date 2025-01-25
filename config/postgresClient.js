const { Pool } = require("pg");

// Configuración del Pool de conexiones usando la variable de entorno DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Usando la URL de la base de datos PostgreSQL de Railway
});

// Manejo de errores
pool.on("error", (err) => {
  console.error("Error en el pool de PostgreSQL:", err);
});

module.exports = pool;
