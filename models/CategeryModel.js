import mongoose from "mongoose";

const categarySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        // unique: true,
    },
    slug: {
        type: String,
        lowercase: true,
    }
}, { timestamps: true })

export default mongoose.model("Category", categarySchema);  // Here This "Category" we actually use for refference( ref  )  in ProductModel means if incase if we want to use category in other models like Product in that case we have to take ref "Category" and type : mongoose.ObjectId