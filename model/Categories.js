import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const CategoriesSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    categories: {
        type: String,
        require: true
    },
    companyName: {
        type: String,
        require: true
    },
    productName: {
        type: String,
        require: true
    },
    modelNumber: {
        type: String,
        require: true
    },
    size: {
        type: String
    },
    price: {
        type: Number,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    tokens: {
        type: String,
        require: true
    }
}, { timestamps: true })

CategoriesSchema.pre("save", async function (next) {
    try {
        if (this.isModified("password")) {
            this.password = await bcrypt.hash(this.password, 10);
            next();
        }
    } catch (error) {
        console.log(error);
    }
})

const CategoriesModel = new mongoose.model("Categories", CategoriesSchema);
export default CategoriesModel;