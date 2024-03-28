import Post from '../model/Post.js'
import Categories from '../model/Categories.js'
import APP_STATUS from '../constants/constants.js';

export const SearchBlog = async function (req, resp) {
    const { id, title } = req.query;
    const token = req.header('Authorization').replace('Bearer ', '');
    let query = {};
    if (id) {
        query = { _id: id };
    } else if (title) {
        query = { title: title };
    }
    const post = await Post.findOne(query);
    if (!post) {
        return resp.send({Status:APP_STATUS.FAILED,message:"Blog Not Found"});
    }
    resp.send(post);
}

export const SearchCategories = async function (req, resp) {
    const { id, companyName } = req.query;
    const token = req.header('Authorization').replace('Bearer ', '');
    let query = {};
    if (id) {
        query = { _id: id };
    } else if (companyName) {
        query = { companyName: companyName }
    }
    const posts = await Categories.findOne(query);
    if (!posts) {
        return resp.send({Status:APP_STATUS.FAILED,message:"Categories Not Found"})
    }
    resp.send(posts);
}