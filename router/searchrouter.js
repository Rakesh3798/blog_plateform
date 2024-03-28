import express from 'express';
import { SearchBlog, SearchCategories } from '../controller/searchcontroller.js';
const router = express.Router();
import auth from '../middlewares/auth.js';
import APP_STATUS from '../constants/constants.js';

router.get('/searchblog', auth, async (req, resp) => {
    try {
        await SearchBlog(req, resp);
    } catch (error) {
        console.error(error);
        resp.status(500).json({ Status: APP_STATUS.ERROR, error: 'An error occured while search the blog' })
    }
});

router.get('/searchcategories', auth, async (req, resp) => {
    try {
        await SearchCategories(req, resp);
    } catch (error) {
        console.error(error);
        resp.status(500).json({ Status: APP_STATUS.ERROR, error: 'An error occured while search the categories' })
    }
});

export default router


/**
 * @swagger
 * /searchblog:
 *   get:
 *     summary: Search for a blog post by ID or title.
 *     description: Retrieve a blog post by either its ID or title.
 *     tags:
 *       - Search 
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: The ID of the blog post.
 *       - in: query
 *         name: title
 *         required: true
 *         schema:
 *           type: string
 *         description: The title of the blog post.
 *       - name: Token
 *         in: header # Location should be "header" for Bearer Token
 *         required: true
 *         schema:
 *           type: string
 *           format: "Bearer <token>"
 *     responses:
 *       '200':
 *         description: Successful response with the found blog post.
 *         content:
 *           application/json:
 *             example:
 *               Status: Success
 *               message: Search Blog Successful Add....!
 *               data:
 *                 _id: 64cccd9935528903d686f66c
 *                 userName: blog
 *                 title: blog post
 *                 content: This is the content of the blog post
 *                 status: published
 *                 images: image_91692340829860.jpg
 *                 password: 123 
 *             
 *       '404':
 *         description: Blog post not found.
 *         content:
 *           application/json:
 *             example:
 *               Status: FAILED
 *               message: Blog Not Found
 *     security:
 *       - BearerAuth: []  # Assuming you have authentication defined.
 */


/**
 * @swagger
 * /searchcategories:
 *   get:
 *     summary: Search for categories by ID or company name.
 *     description: Retrieve categories by either their ID or company name.
 *     tags:
 *       - Search
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: The ID of the category.
 *       - in: query
 *         name: companyName
 *         schema:
 *           type: string
 *         description: The name of the company associated with the category.
 *       - name: Token
 *         in: header # Location should be "header" for Bearer Token
 *         required: true
 *         schema:
 *           type: string
 *           format: "Bearer <token>"
 *     responses:
 *       200:
 *         description: Successful response with the found categories.
 *         content:
 *           application/json:
 *             example:
 *               Status: Success
 *               message: Search categories Successful Add....!
 *               data:
 *                 _id: 64c0e7a3aed71535f108ed34
 *                 name: Path
 *                 categories: electronics
 *                 companyName: vivo
 *                 productName: tablets
 *                 modelNumber: LKI5874WE44D5
 *                 size: 5.5 inch
 *                 price: 22000
 *                 password: 123 
 *       404:
 *         description: Categories not found.
 *         content:
 *           application/json:
 *             example:
 *               Status: FAILED
 *               message: Categories Not Found
 *     security:
 *       - BearerAuth: []  # Assuming you have authentication defined.
 */