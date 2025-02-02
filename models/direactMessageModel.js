import mongoose from 'mongoose';

const DirectMessageSchema = new mongoose.Schema({
    content: {
        type: String,
        
    },
    fileUrl: {
        type: String,
    },
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
        required: true,
    },
    member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Member",
        required: true,
    },
    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  }, { timestamps: true });

export default mongoose.model("DirectMessage", DirectMessageSchema);