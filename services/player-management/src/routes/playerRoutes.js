const express = require("express");
const { getPlayers } = require("../controllers/playerController");
// const {
//   requireAuth,
//   checkRole,
//   handleAuthErrors,
// } = require("../middlewares/authMiddleware");
// const {
//   validateRegister,
//   validateLogin,
// } = require("../middlewares/validationMiddleware");

const router = express.Router();

// router.post("/register", validateRegister, register);
// router.post("/login", validateLogin, login);
router.get("/players", getPlayers);
// router.get("/user", requireAuth, checkRole("read:own"), getUser);
// router.get("/user-role", requireAuth, getUserRole);
// router.get("/protected", requireAuth, getProtected);

// router.use(handleAuthErrors);

module.exports = router;
