import mongoose from 'mongoose';


const memberSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ['ADMIN', 'MODERATOR', 'GUEST'],
        default: 'GUEST' 
    },
    profile: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true },
    server: { type: mongoose.Schema.Types.ObjectId, ref: 'Server', required: true },
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
    directMessages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DirectMessage' }],
    conversationsInitiated: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' }],
    conversationsReceived: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  }, { timestamps: true });
  
export default mongoose.model('Member', memberSchema);
  