import Post from "../model/Post.js";
import multer from "multer";
import fs from "fs"
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import dotenv from 'dotenv';
dotenv.config();
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import APP_STATUS from "../constants/constants.js";

export const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/profile')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '_' + Math.floor((Math.random() * 10) + 1) + Date.now() + '.jpg')
    }
})
export const upload = multer({ storage: storage })

export const AddBlog = async function (req, resp) {
    const userName = req.body.userName
    const title = req.body.title;
    const content = req.body.content;
    const status = req.body.status;
    // const image = req.files.map(file => file.filename); // multiple upload image
    const password = req.body.password;
    const blogExist = await Post.findOne({ title: title });
    if (blogExist) {
        if (req.files) {
            for (const file of req.files) {
                const imagePath = path.join(__dirname, `../public/profile/${file.filename}`);
                fs.unlinkSync(imagePath);
            }
        }
        return resp.send({ Status: APP_STATUS.FAILED, message: "Blog already exists" });
    }
    const data = await Post.create({
        userName, title, content, status, password
        // userName, title, content, status, image, password
    });
    resp.send({
        Status: APP_STATUS.SUCCESS,
        message: "Blog Upload.....!",
        data: data
    });
}

export const BlogList = async (req, resp) => {
    try {
        const { type } = req.query;
        const publishedPosts = await Post.find({ status: 'published' });
        const draftPosts = await Post.find({ status: 'draft' });
        const token = req.header('Authorization').replace('Bearer ', '');

        if (publishedPosts.length === 0 && draftPosts.length === 0) {
            return resp.status(404).json({ Status: APP_STATUS.FAILED, message: 'No posts found.' });
        }

        if (type === 'published' && publishedPosts.length) {
            const responseData = {
                Status: APP_STATUS.SUCCESS,
                data: {
                    published: publishedPosts
                }
            };
            resp.status(200).json(responseData);
        } else if (type === 'draft' && draftPosts.length) {
            const responseData = {
                Status: APP_STATUS.SUCCESS,
                data: {
                    draft: draftPosts
                }
            };
            resp.status(200).json(responseData);
        } else {
            const responseData = {
                Status: APP_STATUS.SUCCESS,
                data: {
                    published: publishedPosts,
                    draft: draftPosts
                }
            };
            resp.status(200).json(responseData);
        }
    } catch (error) {
        console.error(error);
        resp.status(500).json({ Status: APP_STATUS.ERROR, error: 'Internal server error.' });
    }
};

export const UpdateBlog = async function (req, resp) {
    //const id = req.query.id;
    const token = req.header('Authorization').replace('Bearer ', '');
    const vecodedToken = jwt.verify(token, 'SEY_KEY');

    const { userName, title, content, status, password } = req.body;
    const blogExist = await Post.findOne({ _id:vecodedToken });
    if (!blogExist) {
        return resp.status(404).send({Status:APP_STATUS.FAILED,message:"Blog does not exist"});
    } else {
        const updateField = (val, prev) => (val ? val : prev);
        const updatedBlog = {
            userName: updateField(userName, blogExist.userName),
            title: updateField(title, blogExist.title),
            content: updateField(content, blogExist.content),
            status: updateField(status, blogExist.status),
            password: updateField(password, blogExist.password)
        };
        if (req.files && req.files.length) {
            updatedBlog.image = req.files.map(file => file.filename);
            for (const imageName of blogExist.image) {
                const imagePath = path.join(__dirname, `../public/profile/${imageName}`);
                fs.unlinkSync(imagePath);   
            }
        } else {
            updatedBlog.image = blogExist.image;
        }
        await Post.updateOne({ _id: vecodedToken }, { $set: updatedBlog });
        resp.status(200).send({
            Status:APP_STATUS.SUCCESS,
            message:"Blog Upload....!"
        });
    }
};

export const DeleteBlog = async function (req, resp) {
    //const id = req.query.id;
    const token = req.header('Authorization').replace('Bearer ', '');
    try {
        const decodedToken = jwt.verify(token, 'SEY_KEY');
        //const blogExist = await Post.findOne({_id:id})
        const blogExist = await Post.findById(decodedToken._id);
        if (!blogExist) {
            return resp.send({ Status: APP_STATUS.FAILED, message: "Blog Does Not Exist" });
        }
        const id = blogExist._id;
        await Post.deleteOne({ _id: id });
        const image = blogExist.image;
        for (const file of image) {
            const imagePath = path.join(__dirname, `../public/profile/${file}`);
            fs.unlinkSync(imagePath);
        }
        console.log("Data deleted");
        resp.send({ Status: APP_STATUS.SUCCESS, message: "Blog Record Deleted Successfully" });
    } catch (error) {
        console.log(error);
        resp.status(500).send({ Status: APP_STATUS.ERROR, error: "Failed to delete blog record" });
    }
}

export const LoginBlog = async (req, resp) => {
    try {
        const view = await Post.findOne({ userName: req.body.userName });
        if (!view) {
            resp.status(404).send({ Status: APP_STATUS.FAILED, message: "Invalid UserName" })
        } else {
            const validBlog = await bcrypt.compare(req.body.password, view.password)
            if (!validBlog) {
                resp.status(401).send({ Status: APP_STATUS.FAILED, message: "Invalid Password" })
            } else {
                const token = await jwt.sign({ _id: view._id }, "SEY_KEY", { expiresIn: '2h' });
                view.tokens = token
                // view.token.push(token);
                await view.save();
                resp.status(200).json({
                    Status: APP_STATUS.SUCCESS,
                    message: "Login Successfully..!",
                    data: view,
                    token: token
                });
            }
        }
    } catch (error) {
        console.log(error);
        resp.status(500).send({ Status: APP_STATUS.ERROR, error: "Internal server error" })
    }
}

// Example API endpoint for pagination and filtering
export const Documents = async (req, resp) => {
    const { page, limit, userName, title, content } = req.query;
    const paginationOptions = {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
    };
    const filter = {};
    if (userName) {
        filter.userName = { $regex: userName, $options: 'i' };
    }
    if (title) {
        filter.title = { $regex: title, $options: 'i' };
    }
    if (content) {
        filter.content = { $regex: content, $options: 'i' };
    }
    try {
        const totalPosts = await Post.countDocuments(filter);
        const posts = await Post.find(filter)
            .skip((paginationOptions.page - 1) * paginationOptions.limit)
            .limit(paginationOptions.limit);

        resp.json({
            page: paginationOptions.page,
            totalPosts,
            totalPages: Math.ceil(totalPosts / paginationOptions.limit),
            posts,
        });
    } catch (error) {
        resp.status(500).json({ error: 'Internal server error' });
    }
};
