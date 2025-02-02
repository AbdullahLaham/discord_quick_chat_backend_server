import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    imageUrl: { type: String, },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    servers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Server",
        }
    ],

    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Member",
        }
    ],
    channels: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Channel",
        }
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  }, { timestamps: true });


UserSchema.pre('save', async function (next) {
    if (!this.isModified("password")) {
        next();

    }
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


UserSchema.methods.isPasswordMatched = async (enteredPassword) => {
    return await bcrypt.compare(enteredPassword, this.password)
}


export default mongoose.model("User", UserSchema);
