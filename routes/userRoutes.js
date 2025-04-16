// routes/userRoutes.js

const express = require("express");
const { loginUser, registerUser } = require("../controllers/userController");
const authenticateToken = require("../middleware/verifyToken");

const router = express.Router();

// routes/userRoutes.js
router.post("/login", (req, res) => {
  console.log("Recibiendo solicitud de login");
  loginUser(req, res);
});

router.post("/register", (req, res) => {
  console.log("Recibiendo solicitud de registro");
  registerUser(req, res);
});

// Ruta para obtener la información del usuario autenticado
router.get("/me", authenticateToken, (req, res) => {
  res.json({
    id: req.user.id,
    email: req.user.email,
    name: req.user.name,
  });
});

module.exports = router;
