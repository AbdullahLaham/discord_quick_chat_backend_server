import mongoose from 'mongoose';


const serverSchema = new mongoose.Schema({
    name: {
        type: String, required: true
    },
    imageUrl: { type: String, required: true },
    inviteCode: { type: String, unique: true, required: true },
    profile: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Member' }],
    channels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Channel' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Server', serverSchema);
