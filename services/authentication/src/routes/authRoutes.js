const express = require("express");
const {
  register,
  login,
  getAdmin,
  getUser,
  getUserRole,
  getProtected,
} = require("../controllers/authController");
const {
  requireAuth,
  checkRole,
  handleAuthErrors,
} = require("../middlewares/authMiddleware");
const {
  validateRegister,
  validateLogin,
} = require("../middlewares/validationMiddleware");

const router = express.Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.get("/admin", requireAuth, checkRole("write:any"), getAdmin);
router.get("/user", requireAuth, checkRole("read:own"), getUser);
router.get("/user-role", requireAuth, getUserRole);
router.get("/protected", requireAuth, getProtected);

router.use(handleAuthErrors);

module.exports = router;
