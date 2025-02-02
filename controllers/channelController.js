import Server from '../models/serverModel.js';
import Channel from '../models/channelModel.js';
import mongoose from 'mongoose';

export const getAllChannels = (req, res) => {
    try {
        
        
    } catch(error) {

    }
}

export const getCurrentChannel = async (req, res) => {
    try {
        const profile = new mongoose.Types.ObjectId(req?.user?.id);
        if (!profile) return res.status(401).json({ error: "Unauthorized" });
         const {channelId} = req?.params;
         console.log('chanid', channelId);
         const channel = await Channel.findById(channelId);
         res.status(200).json(channel)
        
    } catch(error) {
        res.status(500).json({message: error.message})
        
    }
}

export const createNewChannel = async (req, res) => {
    try {
        

        const {name, type} = req.body;
        const {serverId} = req.query;
        const profileObjectId = new mongoose.Types.ObjectId(req?.user?.id);
        
        console.log('hi gues', req.body, req.query, 'user', profileObjectId);



        const channel = new Channel({
            name,
            type,
            profile: profileObjectId,
            server: serverId,
        });

        await channel.save();

        console.log(channel, 'channel');

        const updateServer = await Server.findOneAndUpdate(
            {
                _id: new mongoose.Types.ObjectId(serverId),
                // members: {
                //     $elemMatch: {
                //         profile: profileObjectId,
                //         role: { $in: ['ADMIN', 'MODERATOR'] }
                //     }
                // }
            },
            
            {
                $push: {
                    channels: channel._id
                }
            },
            { new: true }
        );
        
       
        console.log(updateServer, 'updateServer')
        res.status(200).json(updateServer)


    } catch(error) {
        return res.status(500).send({message: error?.message})
    }
}



export const updateChannel =  async (req, res) => {
    try {
        console.log('hayyyyyyyyyyyyyyyyyyyyyyy')

        const profile = new mongoose.Types.ObjectId(req?.user?.id);
        if (!profile) return res.status(401).json({ message: "Unauthorized" });

        const { channelId } = req.params;
        if (!channelId) return res.status(400).json({ message: "MISSING CHANNEL ID" });

        const { name, type } = req.body;

        if (!name || !type) return res.status(400).json({ message: "Missing required fields" });
        if (name === 'general') return res.status(400).json({ message: "Name cannot be general" });

        const {serverId} = req.query;
        if (!serverId) return res.status(400).json({ message: "MISSING SERVER ID" });

        const server = await Server.findOne(
            {
                _id: new mongoose.Types.ObjectId(serverId),
                channels: { $in: [channelId] } 
            },
        );

        const channel = await Channel.findByIdAndUpdate({
            _id: channelId,
            server: server?._id,
        }, {
            name,
            type
        })
        console.log(server, 'serverssssssssssssss');


        // if (!server) return res.status(404).json({ message: "Server or channel not found, or unauthorized" });
        
        res.json(server);
    } catch (error) {
        console.error("[CHANNELS_PATCH]", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deleteChannel =  async (req, res) => {
    try {
        
        const profileObjectId = new mongoose.Types.ObjectId(req?.user?.id);
        if (!profileObjectId) return res.status(401).json({ message: 'Unauthorized' });
        
        const { channelId } = req.params;
        
        if (!channelId) return res.status(400).json({ message: 'MISSING CHANNEL ID' });
        
        const { serverId } = req.query;
        if (!serverId) return res.status(400).json({ message: 'SERVER ID MISSING' });
        
        const channel = await Channel.findOne({
            _id: new mongoose.Types.ObjectId(channelId),
        });
        console.log('hello', profileObjectId, channel);

        if (channel?.name == 'general') {
            res.status(500).json({message: 'cannot delete "general" channel'})
        }

        const server = await Server.findOneAndUpdate(
            {
                _id: new mongoose.Types.ObjectId(serverId),
            },
            {
                $pull: { channels: new mongoose.Types.ObjectId(channelId)}
            },
            { new: true }
        );
        console.log('hello', server);

        if (!server) return res.status(404).json({ message: 'Server not found or insufficient permissions' });
        
        return res.status(200).json(server);

    } catch (error) {
        console.error('[CHANNELS_DELETE]', error);
        return res.status(500).json({ message: 'Internal Error' });
    }
}