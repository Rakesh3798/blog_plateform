import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const PostSchema = new mongoose.Schema({
    userName: {
        type: String,
        require: true
    },
    title: {
        type: String,
        require: true
    },
    content: {
        type: String,
        require: true
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft',
    },
    // image: {
    //     type: [String],
    //     require: true
    // },
    password: {
        type: String,
        require: true
    },
    tokens: {
        type: String,
        require: true
    }
}, { timestamps: true })

PostSchema.pre("save", async function (next) {
    try {
        if (this.isModified("password")) {
            this.password = await bcrypt.hash(this.password, 10);
            next();
        }
    } catch (error) {
        console.log(error);
    }
})

const PostModel = mongoose.model("Post", PostSchema);
export default PostModel