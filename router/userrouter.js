import express, { json } from "express";
import { Registration, Login, Logout, PageUser, fromdata } from "../controller/usercontroller.js";
const router = express.Router();
import auth from '../middlewares/auth.js'
import APP_STATUS from "../constants/constants.js";

router.post('/signup', async (req, resp) => {
    try {
        await Registration(req, resp);
    } catch (error) {
        console.error(error);
        resp.status(500).json({ Status: APP_STATUS.ERROR, error: 'An error occurred while registration an user' })
    }
});

router.post('/login', async (req, resp) => {
    try {
        await Login(req, resp);
    } catch (error) {
        console.error(error);
        resp.status(500).json({ Status: APP_STATUS.ERROR, error: 'An error occured while login the user' })
    }
});

router.post('/logout', auth, async (req, resp) => {
    try {
        await Logout(req, resp);
    } catch (error) {
        console.error(error);
        resp.status(500).json({ Status: APP_STATUS.ERROR, error: 'An error occured while logout the user' })
    }
});

router.get('/pageinfo', async (req, resp) => {
    try {
        await PageUser(req, resp);
    } catch (error) {
        console.error(error);
        resp.status(500).json({ Status: APP_STATUS.ERROR, error: 'An error occured while pagination the user' })
    }
});

router.get('/fromdata',async(req,resp)=>{
    try {
        await fromdata(req, resp);
    } catch (error) {
        console.error(error);
        resp.status(500).json({ Status: APP_STATUS.ERROR, error: 'An error occured while pagination the user' })
    }
})

export default router


/**
 * @swagger
 * paths:
 *   /signup:
 *     post:
 *       tags:
 *         - User
 *       summary: Register a new user
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 address:
 *                   type: string
 *                 city:
 *                   type: string
 *                 pincode:
 *                   type: number
 *                 phoneNumber:
 *                   type: number
 *                 password:
 *                   type: string
 *       responses:
 *         '200':
 *           description: User registered successfully
 *           content:
 *             application/json:
 *               example:
 *                 Status: Success
 *                 message: Registration Successfully....
 *                 data:
 *                   name: mukesh
 *                   email: mukesh@gmail.com
 *                   address: 55, keval park, punagam
 *                   city: surat
 *                   pincode: 395010
 *                   phoneNumber: 987653211
 *                   password: 123
 *         '409':
 *           description: User registration failed due to conflict (duplicate name or email)
 *           content:
 *             application/json:
 *               examples:
 *                 user_exists_name:
 *                   value:
 *                     Status: FAILED
 *                     message: Name already Exits..!
 *                 user_exists_email:
 *                   value:
 *                     Status: FAILED
 *                     message: Email already Exits..!
 *                 user_exists_both:
 *                   value:
 *                     Status: FAILED
 *                     message: Name and Email already Exits..!
 */


/**
 * @swagger
 * paths:
 *   /login:
 *     post:
 *       tags:
 *         - User
 *       summary: User login
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 email:
 *                   type: string
 *                 password:
 *                   type: string
 *       responses:
 *         '200':
 *           description: Login successful
 *           content:
 *             application/json:
 *               example:
 *                 Status: Success
 *                 message: Login Successfully..!
 *                 data:
 *                   _id: 12345
 *                   name: mukesh
 *                   email: mukesh@gmail.com
 *                   address: 55, keval park, punagam
 *                   city: surat
 *                   pincode: 395010
 *                   phoneNumber: 987653211
 *                   password: 123
 *                   tokens: "jwt.token.here"
 *         '401':
 *           description: Invalid password
 *           content:
 *             application/json:
 *               example:
 *                 Status: FAILED
 *                 message: Invalid Password
 *         '404':
 *           description: User not found
 *           content:
 *             application/json:
 *               example:
 *                 Status: FAILED
 *                 message: Invalid Email
 *         '500':
 *           description: Internal server error
 *           content:
 *             application/json:
 *               example:
 *                 Status: ERROR
 *                 message: Internal Server Error
 */

/**
 * @swagger
 * paths:
 *   /logout:
 *     post:
 *       tags:
 *         - User
 *       summary: User logout
 *       security:
 *         - bearerAuth: [] # Define the bearerAuth security scheme
 *       parameters:
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
 *       responses:
 *         '200':
 *           description: Logout successful
 *           content:
 *             application/json:
 *               examples:
 *                 user_logout:
 *                   value:
 *                     Status: Success
 *                     message: User logout successfully
 *                 user_already_logout:
 *                   value:
 *                     Status: FAILED
 *                     message: User already logged out
 *         '401':
 *           description: Unauthorized
 *           content:
 *             application/json:
 *               example:
 *                 Status: FAILED
 *                 message: Unauthorized. User not found.
 *         '500':
 *           description: Internal server error
 *           content:
 *             application/json:
 *               example:
 *                 Status: ERROR
 *                 message: Internal Server Error
 */

/**
 * @swagger
 * /pageinfo:
 *   get:
 *     summary: Get paginated user list
 *     description: Retrieve a paginated list of users based on specified filters.
 *     tags:
 *       - User
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
 *         name: name
 *         description: Filter users by name (case-insensitive)
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: email
 *         description: Filter users by email (case-insensitive)
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: address
 *         description: Filter users by address (case-insensitive)
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
 *                 name: mukesh
 *                 email: mukesh@gmail.com
 *                 address: 55, keval park, punagam
 *                 city: surat
 *                 pincode: 395010
 *                 phoneNumber: 987653211
 *                 password: 123
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *               example:
 *                 Status: FAILED
 *                 message: Internal server error  
 */
  