const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt"); // Importar bcrypt
const pool = require("../config/postgresClient");
require("dotenv").config();

// Método para manejar el login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Validar datos
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email y contraseña son requeridos." });
  }

  try {
    // Buscar el usuario por email
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const user = result.rows[0];

    // Comparar contraseñas usando bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Crear el payload para el token
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    // Crear el JWT
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Devolver el token y los datos del usuario
    return res.json({
      message: "Login exitoso",
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error al consultar PostgreSQL:", error);
    return res.status(500).json({ message: "Error del servidor" });
  }
};

// Método para registrar un nuevo usuario
const registerUser = async (req, res) => {
  const { name, document, email, password } = req.body;

  console.log("Datos recibidos:", name, document, email, password); // Verifica los datos

  // Validar datos
  if (!name || !document || !email || !password) {
    return res
      .status(400)
      .json({ message: "Todos los campos son requeridos." });
  }

  try {
    // Verificar si el correo ya está registrado
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (existingUser.rows.length > 0) {
      return res
        .status(400)
        .json({ message: "El correo electrónico ya está registrado" });
    }

    // Hashear la contraseña con bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    console.log("Contraseña hasheada:", hashedPassword);

    // Insertar el nuevo usuario con la contraseña hasheada
    const result = await pool.query(
      "INSERT INTO users (name, document, email, password, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING *",
      [name, document, email, hashedPassword]
    );

    const newUser = result.rows[0];

    // Devolver solo los datos del usuario sin la contraseña
    res.status(201).json({
      message: "Usuario registrado exitosamente",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        document: newUser.document,
      },
    });
  } catch (error) {
    console.error("Error al registrar el usuario:", error);
    res.status(500).json({ message: "Error al registrar el usuario" });
  }
};

module.exports = { loginUser, registerUser };
