// create-users-table.js
const pool = require("./config/postgresClient");

async function createUsersTable() {
  const client = await pool.connect();

  try {
    console.log("Creando tabla de usuarios en PostgreSQL...");

    // Crear tabla de usuarios con los campos exactos que espera userController.js
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        document VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Tabla de usuarios creada con éxito");
  } catch (error) {
    console.error("Error al crear la tabla de usuarios:", error);
  } finally {
    client.release();
    // Cerrar el pool al finalizar
    await pool.end();
  }
}

// Ejecutar la función
createUsersTable()
  .then(() => console.log("Proceso completado"))
  .catch((err) => console.error("Error en el proceso:", err));
