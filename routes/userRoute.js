import express from "express";
import {getAllUsers, getCurrentUser} from '../controllers/userController.js'
const router = express.Router();
router.get('/all-users', getAllUsers);
router.get('/get-logged-user', getCurrentUser);
export default router;