import express from 'express'
const router = express.Router();
import { AddBlog, BlogList, DeleteBlog, Documents, LoginBlog, UpdateBlog, upload } from '../controller/postcontroller.js';
import auth from '../middlewares/auth.js';
import APP_STATUS from '../constants/constants.js';

router.post('/blog', upload.array('image'), async (req, resp) => {
    try {
        await AddBlog(req, resp);
    } catch (error) {
        console.error(error);
        resp.status(500).json({ Status: APP_STATUS.ERROR, error: 'An error occurred while creating an blog' })
    }
});

router.get('/blog', auth, async (req, resp) => {
    try {
        await BlogList(req, resp);
    } catch (error) {
        console.error(error);
        resp.status(500).json({ Status: APP_STATUS.ERROR, error: 'An error occurred while Get All blog' })
    }
});

router.put('/blog', upload.array('image'), async (req, resp) => {
    try {
        await UpdateBlog(req, resp);
    } catch (error) {
        console.error(error);
        resp.status(500).json({ error: 'An error occurred while updated blog' })
    }
});

router.delete('/blog', auth, async (req, resp) => {
    try {
        await DeleteBlog(req, resp);
    } catch (error) {
        console.error(error);
        resp.status(500).json({ Status: APP_STATUS.ERROR, error: 'An error occured while delete blog' })
    }
});

router.post('/login/blog', async (req, resp) => {
    try {
        await LoginBlog(req, resp);
    } catch (error) {
        console.error(error);
        resp.status(500).json({ Status: APP_STATUS.ERROR, error: 'An error occured while login the blog' })
    }
}); 

router.get('/postinfo', async (req, resp) => {
    try {
        await Documents(req, resp);
    } catch (error) {
        console.error(error);
        resp.status(500).json({ Status: APP_STATUS.ERROR, error: 'An error occured while pagination the blog' })
    }
});

export default router

/**
 * @swagger
 * /blog:
 *   post:
 *     summary: Add a new blog
 *     description: Add a new blog to the system.
 *     tags:
 *       - Blog
 *     parameters:
 *       - in: query
 *         name: userName
 *         description: Username of the blog author
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: title
 *         description: Title of the blog
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: content
 *         description: Content of the blog
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         description: Status of the blog
 *         required: true
 *         schema:
 *           type: string
 *       - name: image
 *         in: query
 *         required: true    
 *         schema:
 *           type: string
 *           format: binary
 *       - in: query
 *         name: password
 *         description: Password for the blog 
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Blog added successfully
 *         content:
 *           application/json:
 *             example:
 *               Status: Success
 *               message: Registration Successfully....
 *               data:
 *                 userName: blog
 *                 title: blog post
 *                 content: This is the content of the blog post
 *                 status: published
 *                 images: image_91692340829860.jpg
 *                 password: 123
 *       '409':
 *         description: Blog already exists
 *         content:
 *           application/json:
 *             example:
 *               Status: FAILED
 *               message: Blog already exists
 */

/**
 * @swagger
 * /blog:
 *   get:
 *     summary: Get list of blog posts
 *     description: Retrieve a list of blog posts based on the specified type.
 *     tags:
 *       - Blog
 *     parameters:
 *       - in: query
 *         name: type
 *         description: Type of blog posts (published/draft)
 *         required: false
 *         schema:
 *           type: string
 *           enum: [published, draft]
 *       - name: Token
 *         in: header # Location should be "header" for Bearer Token
 *         required: true
 *         schema:
 *           type: string
 *           format: "Bearer <token>"
 *     responses:
 *       '200':
 *         description: Successful response containing blog posts
 *         content:
 *           application/json:
 *               examples:
 *                 published:
 *                   value:
 *                     userName: blog
 *                     title: blog post
 *                     content: This is the content of the blog post
 *                     status: published
 *                     images: image_91692340829860.jpg
 *                     password: 123
 *                 draft:   
 *                   value:
 *                     userName: blog
 *                     title: blog post
 *                     content: This is the content of the blog post
 *                     status: draft
 *                     images: image_91692340829860.jpg
 *                     password: 123
 *       
 *       '404':
 *         description: No posts found
 *         content:
 *           application/json:
 *               example:
 *                 Status: FAILED
 *                 message: No posts found
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *               example:
 *                 Status: ERROR
 *                 error: Internal Server Error
 */


/**
 * @swagger
 * /blog:
 *   put:
 *     summary: Update a blog
 *     description: Update an existing blog.
 *     tags:
 *       - Blog
 *     security:
 *       - bearerAuth: []  # This indicates that the endpoint is secured with a Bearer token
 *     requestBody:
 *       description: Blog update data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               status:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Blog updated successfully
 *         content:
 *           application/json:
 *               example:
 *                 Status: Success
 *                 message: Blog Upload....!
 *       '404':
 *         description: Blog not found
 *         content:
 *           application/json:
 *               example:
 *                 Status: FAILED
 *                 message: Blog does not exist 
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *               example:
 *                 Status: ERROR
 *                 error:  Internal Server Error
 */


/**
 * @swagger
 * /blog:
 *   delete:
 *     summary: Delete a blog
 *     description: Delete an existing blog.
 *     tags:
 *       - Blog
 *     security:
 *       - bearerAuth: []  # This indicates that the endpoint is secured with a Bearer token
 *     parameters:
 *         - name: Token
 *           in: header # Location should be "header" for Bearer Token
 *           required: true
 *           schema:
 *             type: string
 *             format: "Bearer <token>"
 *         - name: user_id
 *           in: query # Location should be "query" for User_id
 *           required: false
 *           schema:
 *             type: string
 *     responses:
 *       '200':
 *         description: Blog deleted successfully
 *         content:
 *           application/json:
 *               example:
 *                 Status: Success
 *                 message: Blog Record Deleted Successfully
 *       '409':
 *         description: Blog Does Not Exist
 *         content:
 *           application/json:
 *             example:
 *               Status: FAILED
 *               message: Blog Does Not Exist
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *               example:
 *                 Status: ERROR
 *                 error: Failed to delete blog record
 */

/**
 * @swagger
 * /login/blog:
 *   post:
 *     summary: Login to a blog
 *     description: Login to a blog using username and password.
 *     tags:
 *       - Blog
 *     requestBody:
 *       description: Blog login credentials
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Login successful
 *         content:
 *           application/json:
 *               example:
 *                 Status: Success
 *                 message: Login Successfully..!
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *               example:
 *                 Status: FAILED
 *                 message: Invalid Password  
 *       '404':
 *         description: Invalid username
 *         content:
 *           application/json:
 *               example:
 *                 Status: FAILED
 *                 message: Invalid UserName
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *               example:
 *                 Status: ERROR
 *                 error: Internal server error 
 */ 

/**
 * @swagger
 * /postinfo:
 *   get:
 *     summary: Get paginated blog list
 *     description: Retrieve a paginated list of blog based on specified filters.
 *     tags:
 *       - Blog
 *     parameters:
 *       - in: query
 *         name: page
 *         description: Page number
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - in: query
 *         name: limit
 *         description: Number of items per page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - in: query
 *         name: userName
 *         description: Filter blog by name (case-insensitive)
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: title
 *         description: Filter blog by title (case-insensitive)
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: content
 *         description: Filter blog by content (case-insensitive)
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response containing paginated user list
 *         content:
 *           application/json:
 *             example:
 *               page: 1
 *               totalPostes: 1
 *               totalPages: 1
 *               postes: 
 *                 _id: 12345
 *                 userName: blog
 *                 title: blog post
 *                 content: This is the content of the blog post
 *                 status: published
 *                 images: image_91692340829860.jpg
 *                 password: 123
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *               example:
 *                 Status: FAILED
 *                 message: Internal server error  
 */