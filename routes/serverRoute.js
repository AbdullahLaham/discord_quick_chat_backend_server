import express from "express";
import {createNewServer, getAllServers, getCurrentServer, updateServer, deleteServer, leaveServer, InviteCodeServer, getCurrentServerMember, getInvitedServer } from '../controllers/serverController.js'
import { productImageResize, uploadPhoto } from "../middlewares/uploadImages.js";
import { uploadImages } from "../controllers/uploadController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
const router = express.Router();

router.get('/', authMiddleware, getAllServers); // الحصول على جميع السيرفرات
router.get('/invite-code/:inviteCode', authMiddleware, getInvitedServer);
router.get('/:serverId', authMiddleware, getCurrentServer); // الحصول على سيرفر محدد

router.get('/current-member/:serverId', authMiddleware, getCurrentServerMember);

router.post('/new-server', authMiddleware, createNewServer); // إنشاء سيرفر جديد

router.put('/upload', uploadPhoto.array("images", 10), productImageResize, uploadImages); // رفع الصور
router.put('/:serverId', authMiddleware, updateServer); // تحديث بيانات السيرفر
router.put('/:serverId/invite-code', authMiddleware, InviteCodeServer); // تحديث كود الدعوة

router.delete('/:serverId', authMiddleware, deleteServer); // حذف السيرفر
router.delete('/:serverId/leave-server', authMiddleware, leaveServer); // مغادرة السيرفر


export default router;