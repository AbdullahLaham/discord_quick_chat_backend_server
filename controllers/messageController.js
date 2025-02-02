import User from '../models/userModel.js';
import mongoose from "mongoose";
import Message from "../models/messageModel.js";
import Server from '../models/serverModel.js'
import Channel from '../models/channelModel.js'
import Member from '../models/memberModel.js';
export const getAllMessages = async (req, res) => {
    // console.log('helooooooooo', 'rrrrrrrr');
    const MESSAGES_BATCH = 10;
    const profile = new mongoose.Types.ObjectId(req?.user?.id);
    try {
        const { cursor, channelId } = req.query;

        if (!profile) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!channelId) {
            return res.status(400).json({ message: "Channel ID Missing" });
        }

        let messages = [];

        if (cursor) {
            messages = await Message.find({
                channel: new mongoose.Types.ObjectId(channelId),
                _id: { $gt: new mongoose.Types.ObjectId(cursor) }, // البحث عن الرسائل الأحدث بعد الـ cursor
            })
                .limit(MESSAGES_BATCH)
                .populate({
                    path: "member",
                    populate: { path: "profile", model: 'User' },
                })
                .exec();
        } else {
            messages = await Message.find({
                channel: new mongoose.Types.ObjectId(channelId),
            })
                .limit(MESSAGES_BATCH)
                .populate({
                    path: "member",
                    populate: { path: "profile", model: "User" },
                })
                .exec();
        }

        let nextCursor = null;

        if (messages.length === MESSAGES_BATCH) {
            nextCursor = messages[MESSAGES_BATCH - 1]._id; // تعيين الـ cursor للرسالة الأخيرة
        }

        return res.json({ items: messages, nextCursor });
    } catch (error) {
        console.error("[MESSAGES_GET]", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


export const getCurrentMessage = (req, res) => {
    try {

    } catch (error) {

    }
}

export const createNewMessage = async (req, res) => {
    try {
        
        const profile = new mongoose.Types.ObjectId(req?.user?.id);
        if (!profile) return res.status(401).json({ error: "Unauthorized" });

        const { content, fileUrl } = req.body;
        const { serverId, channelId } = req.query;

        if (!serverId) return res.status(400).json({ error: "Server ID Missing" });

        if (!channelId) return res.status(400).json({ error: "Channel ID Missing" });

        const server = await Server.findOne({
            _id: new mongoose.Types.ObjectId(serverId),
            // members: { $elemMatch: { profileId: profile._id } }
        }).populate("members");
        console.log(server, 'servereeeeeeeeeeeeeee');

        if (!server) return res.status(404).json({ error: "Server Not Found" });

        // البحث عن القناة داخل السيرفر
        const channel = await Channel.findOne({
            _id: new mongoose.Types.ObjectId(channelId),
            server: new mongoose.Types.ObjectId(serverId),
        });
        

        if (!channel) return res.status(404).json({ error: "Channel Not Found" });
        console.log(channel, 'chaneeeeeeeeeeeeel');


        const member = server.members.find(m => m?.profile?.toString() === profile?.toString());

        
        if (!member) return res.status(404).json({ error: "Member Not Found" });


        const message = await Message.create({
            content,
            fileUrl,
            channel: channel._id,
            member: member._id,
        });

        // جلب بيانات العضو والملف الشخصي المرتبطة بالرسالة
        await message.populate({
            path: "member",
            populate: { path: "profile", model:'User' },
        });

        // إرسال الرسالة عبر WebSocket
        const io = req.app.get("io"); // استدعاء Socket.IO من التطبيق
        const channelKey = `chat:${channelId}:messages`;
        io.emit(channelKey, message);

        return res.status(200).json(message);
    } catch (error) {
        console.error("[MESSAGES_POST]", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}


export const updateMessage = async (req, res) => {
    try {
        // console.log('update', req.body.content)
        const profile = new mongoose.Types.ObjectId(req?.user?.id);

        const { content } = req.body;
        const { serverId, channelId, messageId } = req.query;

        if (!profile) return res.status(401).json({ error: "Unauthorized" });

        if (!serverId) return res.status(400).json({ error: "Server ID Missing" });
        if (!channelId) return res.status(400).json({ error: "Channel ID Missing" });

        const member = await Member.findOne({ profile: profile, server: serverId });

        const server = await Server.findOne({
            _id: serverId,
        }).populate({path: "members", populate: {path: 'profile', model: "User"}});

        if (!server) return res.status(404).json({ error: "Server Not Found" });

        // البحث عن القناة داخل السيرفر
        const channel = await Channel.findOne({
            _id: channelId,
            server: serverId,
        });

        if (!channel) return res.status(404).json({ error: "Channel Not Found" });

        // التحقق من أن المستخدم عضو في السيرفر
        // const member = server.members.find((m) => m.profile.toString() === profile);

        // if (!member) return res.status(404).json({ error: "Member Not Found" });

        // البحث عن الرسالة
        const message = await Message.findOne({
            _id: messageId,
            channel: channelId,
            deleted: false,
        }).populate({
            path: "member",
            populate: { path: "profile", model: "User" },
        });

        if (!message) {
            return res.status(404).json({ error: "Message Not Found" });
        }
        console.log(message, 'message');


        // const isMessageOwner = message.member.toString() === member._id.toString();
        // const isAdmin = member.role === "ADMIN";
        // const isModerator = member.role === "MODERATOR";
        // const canModify = isMessageOwner || isAdmin || isModerator;

        // if (!canModify) {
        //     return res.status(403).json({ error: "Unauthorized" });
        // }

        // تحديث الرسالة
        message.content = content;
        await message.save();

        // socket IO
        const channelKey = `chat:${channelId}:messages:update`;
        const io = req.app.get("io"); // الحصول على `io` من `app`
        io.emit(channelKey, message);


        return res.status(200).json(message);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const deleteMessage = async (req, res) => {
    try {
        const profile = new mongoose.Types.ObjectId(req?.user?.id);
        const { serverId, channelId } = req.query;
        const {messageId} = req.params;

        if (!profile) return res.status(401).json({ error: "Unauthorized" });

        if (!serverId) return res.status(400).json({ error: "Server ID Missing" });
        if (!channelId) return res.status(400).json({ error: "Channel ID Missing" });

        const server = await Server.findOne({ _id: serverId }).populate({path: "members", populate: {path: 'profile', model: "User"}});
        
        if (!server) return res.status(404).json({ error: "Server Not Found" });

        const channel = await Channel.findOne({ _id: channelId, server: serverId });
        if (!channel) return res.status(404).json({ error: "Channel Not Found" });

        const member = await Member.findOne({ profile: profile, server: serverId });


        if (!member) return res.status(404).json({ error: "Member Not Found" });

        const message = await Message.findOne({ _id: messageId, channel: channelId, deleted: false })
            .populate({ path: "member", populate: { path: "profile", model: "User" } });

        if (!message) {
            return res.status(404).json({ error: "Message Not Found" });
        }

        // const isMessageOwner = message.memberId.toString() === member._id.toString();
        // const isAdmin = member.role === "ADMIN";
        // const isModerator = member.role === "MODERATOR";
        // const canModify = isMessageOwner || isAdmin || isModerator;

        // if (!canModify) {
        //     return res.status(403).json({ error: "Unauthorized" });
        // }

        // تحديث حالة الرسالة إلى محذوفة
        message.deleted = true;
        message.content = "this message has been deleted";
        message.fileUrl = null;

        await message.save();

        // إرسال الحدث عبر `socket.io`
        const channelKey = `chat:${channelId}:messages:delete`;
        const io = req.app.get("io"); // الحصول على `io` من `app`
        io.emit(channelKey, { messageId });

        return res.status(200).json({ success: true, message: "Message deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
