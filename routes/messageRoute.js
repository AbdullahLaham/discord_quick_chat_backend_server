import express from "express";
import { getAllMessages,getCurrentMessage,createNewMessage, updateMessage, deleteMessage } from "../controllers/messageController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();
router.get('/all-messages', authMiddleware, getAllMessages);
router.get('/get-current-message', getCurrentMessage);
router.post('/new-message', authMiddleware, createNewMessage);

router.put('/:messageId', authMiddleware, updateMessage);
router.delete('/:messageId', authMiddleware, deleteMessage);

export default router;
