const { Pool } = require("pg");
require("dotenv").config(); // Asegurate de tener esto arriba para leer .env

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Ahora viene desde .env
  ssl: {
    rejectUnauthorized: false,
  },
});

// Manejo de errores
pool.on("error", (err) => {
  console.error("Error en el pool de PostgreSQL:", err);
});

module.exports = pool;
