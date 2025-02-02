import Server from '../models/serverModel.js';
import Channel from '../models/channelModel.js';
import Member from '../models/memberModel.js';
import { v4 as uuidv4 } from "uuid";
import mongoose from 'mongoose';

export const getAllServers = async (req, res) => {
    try {


        // if (!userId) {
        //     // Error
        //     res.status(401).send("Unauthorized");
        // };

        const profileObjectId = new mongoose.Types.ObjectId(req?.user?.id);
        console.log('hello servs', profileObjectId);
        const servers = await Server.find({});
        const needservers = [];
        for (const server of servers) {
            const member = await Member.findOne({profile: profileObjectId, server: server._id});
            if (member?._id) {
                needservers.push(server);

            }
        }
        // const servers = await Server.find({ profile: profileObjectId });
        
        console.log('helo',needservers);

        res.status(200).json(needservers);


    } catch (error) {
        res.status(500).json({ message: error.message, sucess: false },);

    }
}


export const createNewServer = async (req, res) => {
    try {
        console.log(req.body, 'hellooooooo');
        const { name, imageUrl, userId } = req.body;

        const profileObjectId = new mongoose.Types.ObjectId(req?.user?.id);

        // if (!userId) {
        //     throw new Error("Unauthorized", { status: 401 })
        // };


        const server = new Server({
            profile: profileObjectId,
            name,
            imageUrl,
            channels: [],
            members: [],
            inviteCode: uuidv4(),
        });
        await server.save();

        const channel = new Channel({
            name: "general",
            profile: profileObjectId,
            server: server._id,
        });
        await channel.save();


        const member = new Member({
            profile: profileObjectId,
            role: 'ADMIN',
            server: server._id,
        });

        await member.save();

        let updatedServer = await Server.findByIdAndUpdate(server._id, {
            $push: {
                members: member._id,
                channels: channel._id
            }
            

        }, {new: true});

        // server.members = ;
        // server.channels = [channel._id];

        await updatedServer.save();





        // server.channels = [{name: "general", profile: '678a6f313c7b53b26c2832d5', server: server._id}]
        // server.members = [{ profile: '678a6f313c7b53b26c2832d5', role: 'ADMIN', server: server._id}]


        res.status(200).json(updatedServer)

    } catch (error) {
        console.log("[SERVERS_POST]", error);
        return res.status(500).send("Internal Error")
    }
}



export const updateServer = async (req, res) => {
    try {
        const profile = new mongoose.Types.ObjectId(req?.user?.id);
        if (!profile) return res.status(401).json({ error: "Unauthorized" });

        const { userId, name, imageUrl } = req.body;
        const { serverId } = req.params;
        if (!userId) return res.status(401).send("Unauthorized");
        if (serverId) res.status(500).send("SERVER ID MISSING");

        const server = await Server.findOneAndUpdate({
            where: {
                id: params.serverId,
                profileId: profile.id,
            },
            data: {
                imageUrl,
                name
            }
        })
        return NextResponse.json(server);
    } catch (error) {
        console.log("[SERVER_ID_PATCH]", error)
        return res.status(500).send("Internal Error")
    }
}


export const deleteServer = (req, res) => {
    try {
        const profile = new mongoose.Types.ObjectId(req?.user?.id);
        if (!profile) return res.status(401).json({ error: "Unauthorized" });


    } catch (error) {

    }
}


export const leaveServer = async (req, res) => {
    try {
        const { serverId } = req.params;
        const profile = new mongoose.Types.ObjectId(req?.user?.id);

        if (!profile) return res.status(401).json({ error: "Unauthorized" });

        if (!serverId) return res.status(401).json({ error: "SERVER ID MISSING" });
        const member = await Member.findOne({
            profile,
            server: serverId,
        });
        if (!member) return res.status(404).json({ error: "Member MISSING" });

        const server = await Server.findOneAndUpdate(
            {
                _id: serverId,
                profile: { $ne: profile },
                members: { $nin: profile }
            },
            {
                $pull: { members: member?._id } // حذف العضو من المصفوفة
            },
            { new: true }
        );

        if (!server) {
            return res.status(404).json({ error: "Server not found or unauthorized" });
        }

        return res.status(200).json(server);
    } catch (error) {
        console.log("[SERVER_ID_LEAVE]", error);
        return res.status(500).json({ error: "Internal error" });
    }
}


export const InviteCodeServer = async (req, res) => {
    try {

        const profile = new mongoose.Types.ObjectId(req?.user?.id);
        if (!profile) return res.status(401).json({ error: "Unauthorized" });

        const { serverId } = req.params;

        if (!profile) return res.status(401).json({ message: "Unauthorized" });
        if (!serverId) return res.status(400).json({ message: "SERVER ID MISSING" });

        const server = await Server.findOneAndUpdate(
            {
                _id: serverId,
                profile: profile,
            },
            {
                inviteCode: uuidv4(),
            },
            { new: true }
        );

        if (!server) {
            return res.status(404).json({ message: "Server not found or unauthorized" });
        }

        return res.status(200).json(server);
    } catch (error) {
        console.error("[SERVER_ID]", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};



export const getInvitedServer = async (req, res) => {
    try {

        const profile = new mongoose.Types.ObjectId(req?.user?.id);
        if (!profile) return res.status(401).json({ error: "Unauthorized" });

        const { inviteCode } = req.params;

        if (!profile) return res.status(401).json({ message: "Unauthorized" });
        if (!inviteCode) return res.status(400).json({ message: "INVITE CODE MISSING" });
        const server = await Server.findOne(
            {
                inviteCode,
            }
        );
        const existingServer = await Server.findOne(
            {
                inviteCode,
                members: { $in: profile }
            }
        );

        if (existingServer) {
            return res.status(200).json(existingServer);
        }
        const member = await Member.create({ profile, server: server._id });
        const updatedServer = await Server.findOneAndUpdate(
            {
                inviteCode,
            },
            {
                $push: {
                    members: member._id
                }
            },
            { new: true },
        )
        return res.status(200).json(updatedServer);




    } catch (error) {
        console.error("[SERVER_ID]", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};




export const getCurrentServer = async (req, res) => {
    try {
        const profile = new mongoose.Types.ObjectId(req?.user?.id);
        if (!profile) return res.status(401).json({ error: "Unauthorized" });

        const { serverId } = req.params;

        const server = await Server.findOne({ _id: serverId }).populate({
            path: "channels",
            populate: { path: "profile", model: "User" } // جلب بيانات الملف الشخصي للقناة
        }).populate({
            path: "members",
            populate: { path: "profile", model: "User" }
        }
        );
        console.log(server, 'server');
        res.status(200).json(server);


    } catch (error) {

    }
}

export const getCurrentServerMember = async (req, res) => {

    try {
        const profile = new mongoose.Types.ObjectId(req?.user?.id);
        if (!profile) return res.status(401).json({ error: "Unauthorized" });

        const { serverId } = req.params;

        const member = await Member.findOne({ server: serverId, profile }).populate({
            path: "profile", model: "User"
        })
        console.log(member, 'member');
        res.status(200).json(member);


    } catch (error) {

    }
}

