// const express = require("express");
// const router = express.Router();
// const UserService = require("../services/UserService");

// router.post("/", async (req, res) => {
//   const result = await UserService.addUserIfNotExists(req.body);
//   res.status(result.success ? 201 : 409).send(result);
// });

// router.post("/update-username", async (req, res) => {
//   const { email, newUsername } = req.body;

//   try {
//     const result = await UserService.updateUsernameByEmail(email, newUsername);
//     if (result.success) {
//       res.json({
//         success: true,
//         message: "Username updated successfully",
//         user: result.data,
//       });
//     } else {
//       res.status(400).json({ success: false, message: result.message });
//     }
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// module.exports = router;
