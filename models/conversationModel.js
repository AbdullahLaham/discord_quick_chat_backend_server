import mongoose from 'mongoose';

const ConversationSchema = new mongoose.Schema({
    memberOneId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Member",
        required: true,
        
    },
    memberTwoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Member",
        required: true,
    },
    directMessages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "DirectMessage",
        required: true,
    }],
    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
    
}, { timestamps: true });
    
    

export default mongoose.model("Conversation", ConversationSchema);