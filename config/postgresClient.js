const { Pool } = require("pg");

// Configuración del Pool de conexiones usando la URL externa de la base de datos
const pool = new Pool({
  connectionString:
    "postgresql://todolistpostgres_user:5oEAmpA0GgCBJFZtOPkKG9VFMxbcxdGh@dpg-cvvorh49c44c73f6arf0-a.virginia-postgres.render.com/todolistpostgres",
  ssl: {
    rejectUnauthorized: false,
  },
});

// Manejo de errores
pool.on("error", (err) => {
  console.error("Error en el pool de PostgreSQL:", err);
});

module.exports = pool;
