import express from "express";
import { createNewChannel, deleteChannel, getAllChannels, getCurrentChannel, updateChannel } from "../controllers/channelController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import { createOrGetConversation, getCurrentConversation } from "../controllers/conversationController.js";


const router = express.Router();

// router.get('/all-channels', getAllChannels);
router.get('/get-current-conversation/:memberId', authMiddleware, getCurrentConversation);

router.get('/create-or-get', authMiddleware, createOrGetConversation);

// router.put('/:channelId', updateChannel);

// router.delete('/:channelId', deleteChannel);



export default router;