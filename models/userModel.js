import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    address: {
        type: {}, // bcz for Multiple line    // String,
        required: true,
    },
    answer: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        default: 0,   //  0 -> false  , 1 -> true
    }
}, { timestamps: true }) // timestamps will add newly created user time is going to add

export default mongoose.model("users", userSchema)