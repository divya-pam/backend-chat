import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    imageId: String,
    email: { type: String, unique: true },
    Groups: [
        {   
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Groups'
        },
    ],
})

export const Users = mongoose.model('Users', userSchema)