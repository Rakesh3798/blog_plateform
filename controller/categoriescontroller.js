import Categories from '../model/Categories.js';
import dotenv from 'dotenv';
dotenv.config();
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import APP_STATUS from '../constants/constants.js';

export const AddCategories = async function (req, resp) {
    const { name, categories, companyName, productName, modelNumber, size, price, password } = req.body
    const categoriesExist = await Categories.findOne({ name: name });
    if (categoriesExist) {
        return resp.send({ Status: APP_STATUS.FAILED, message: "Categories already exists" });
    }
    const data = await Categories.create({
        name, categories, companyName, productName, modelNumber, size, price, password
    });
    resp.send({
        Status: APP_STATUS.SUCCESS,
        message: "Categories Upload.....!",
        data: data
    });
}

export const CategoriesList = async (req, resp) => {
    try {
        const categoriesList = await Categories.find();
        const token = req.header('Authorization').replace('Bearer ', '');
        resp.send({ Status: APP_STATUS.SUCCESS, categoriesList });
    } catch (error) {
        console.log(error);
        resp.status(500).send({ Status: APP_STATUS.ERROR, error: "Error retrieving categories list" })
    }
}

export const UpdateCategories = async function (req, resp) {
    //const id = req.query.id;
    const token = req.header('Authorization').replace('Bearer ', '');
    const mecodedToken = jwt.verify(token, 'SEY_KEY');
    const {
        name, categories, companyName, productName, modelNumber, size, price, password
    } = req.body;
    const categoriesExist = await Categories.findOne({ _id: mecodedToken });
    console.log(categoriesExist);
    if (!categoriesExist) {
        return resp.send({ Status: APP_STATUS.FAILED, message: "Categories is Exist" })
    } else {
        const updateField = (val, prev) => !val ? prev : val;
        const updatedCategories = {
            ...categoriesExist,
            name: updateField(name, categoriesExist.name),
            categories: updateField(categories, categoriesExist.categories),
            companyName: updateField(companyName, categoriesExist.companyName),
            productName: updateField(productName, categoriesExist.productName),
            modelNumber: updateField(modelNumber, categoriesExist.modelNumber),
            size: updateField(size, categoriesExist.size),
            price: updateField(price, categoriesExist.price),
            password: updateField(password, categoriesExist.password)
        };
        await Categories.updateOne(
            { _id: mecodedToken },
            {
                $set: {
                    name: updatedCategories.name,
                    categories: updatedCategories.categories,
                    companyName: updatedCategories.companyName,
                    productName: updatedCategories.productName,
                    modelNumber: updatedCategories.modelNumber,
                    size: updatedCategories.size,
                    price: updatedCategories.price,
                    password: updatedCategories.password
                }
            })
        resp.status(200).send({
            Status: APP_STATUS.SUCCESS,
            message: "Categories Updated.....!"
        });
    }
}

export const DeleteCategories = async function (req, resp) {
    // const id = req.query.id;
    const token = req.header('Authorization').replace('Bearer ','');
    try {
        const decodedToken=jwt.verify(token,'SEY_KEY');
        const categoriesExist = await Categories.findById(decodedToken._id);
        if (!categoriesExist) {
            return resp.send({ Status: APP_STATUS.FAILED, message: "Categories Does Not Exist" });
        }
        const id = categoriesExist._id;
        await Categories.deleteOne({ _id: id });
        console.log("Data deleted");
        resp.send({ Status: APP_STATUS.SUCCESS, message: "Categories Record Deleted Successfully" });
    } catch (error) {
        console.log(error);
        resp.status(500).send({ Status: APP_STATUS.ERROR, error: "Failed to delete Categories record" })
    }
}

export const LoginCategories = async (req, resp) => {
    try {
        const result = await Categories.findOne({ name: req.body.name });
        if (!result) {
            resp.status(404).send({ Status: APP_STATUS.FAILED, message: "User not found" })
        } else {
            const validCategories = await bcrypt.compare(req.body.password, result.password);
            if (!validCategories) {
                resp.status(401).send({ Status: APP_STATUS.FAILED, message: "Invalid name and password" })
            } else {
                const token = await jwt.sign({ _id: result._id }, "SEY_KEY", { expiresIn: '2h' });
                result.tokens = token
                // result.token.push(token)
                await result.save();
                resp.status(200).json({
                    Status: APP_STATUS.SUCCESS,
                    message: "Login Successfully....!",
                    data: result,
                    token: token
                })
            }
        }
    } catch (error) {
        console.log(error);
        resp.status(500).send({ Status: APP_STATUS.ERROR, error: "Internal server error" })
    }
}

// Example API endpoint for pagination and filtering
export const CategoriesPage = async (req, resp) => {
    const { page, limit, name, companyName, productName } = req.query;
    const paginationOption = {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
    };
    const filter = {};
    if (name) {
        filter.name = { $regex: name, $options: 'i' };
    }
    if (companyName) {
        filter.companyName = { $regex: companyName, $options: 'i' };
    }
    if (productName) {
        filter.productName = { $regex: productName, $options: 'i' };
    }
    try {
        const totalPost = await Categories.countDocuments(filter);
        const post = await Categories.find(filter)
            .skip((paginationOption.page - 1) * paginationOption.limit)
            .limit(paginationOption.limit);
        resp.json({
            page: paginationOption.page,
            totalPost,
            totalPages: Math.ceil(totalPost / paginationOption.limit),
            post,
        });
    } catch (error) {
        resp.status(500).json({ Status: APP_STATUS.ERROR, error: 'Internal server error' });
    }
};