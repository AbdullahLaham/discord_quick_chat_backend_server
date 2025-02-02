import mongoose from 'mongoose';

const ChannelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['TEXT', 'AUDIO', 'VIDEO'],
        default: 'TEXT',
    },
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
        required: true,
    },
    server:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Server",
        required: true,
    },
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
        }
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });
    

export default mongoose.model("Channel", ChannelSchema);