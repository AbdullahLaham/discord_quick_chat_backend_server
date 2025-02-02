import express from "express";
import { login, signUp, logout, forgotPasswordToken, resetPassword } from "../controllers/authController.js";

const router = express.Router();
router.post('/login', login);
router.post('/signup', signUp);

router.post('/logout', logout);
router.patch('/forgot-password-token', forgotPasswordToken)
router.patch('/reset-password/:token', resetPassword);
export default router;