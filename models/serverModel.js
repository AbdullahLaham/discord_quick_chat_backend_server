import mongoose from 'mongoose';
import Member from './memberModel.js'

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


serverSchema.pre('findOneAndUpdate', async function (next) {
    const update = this.getUpdate();
    
    if (update && update.$pull && update.$pull.members) {
      const memberId = update.$pull.members;
  
      // Delete the corresponding Member document
      await Member.findByIdAndDelete(memberId);
    }
  
    next();
  });
  