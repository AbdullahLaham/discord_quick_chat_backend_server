import express from "express";
import { createNewChannel, deleteChannel, getAllChannels, getCurrentChannel, updateChannel } from "../controllers/channelController.js";
import authMiddleware from "../middlewares/authMiddleware.js";


const router = express.Router();
router.get('/all-channels', getAllChannels);
router.get('/get-current-channel/:channelId', authMiddleware, getCurrentChannel);

router.post('/', authMiddleware, createNewChannel);

router.put('/:channelId', updateChannel);

router.delete('/:channelId', deleteChannel);



export default router;