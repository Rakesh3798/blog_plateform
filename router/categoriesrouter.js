import express from 'express';
import { AddCategories, CategoriesList, CategoriesPage, DeleteCategories, LoginCategories, UpdateCategories } from '../controller/categoriescontroller.js';
const router = express.Router();
import auth from '../middlewares/auth.js';
import APP_STATUS from '../constants/constants.js';

router.post('/categories', async (req, resp) => {
    try {
        await AddCategories(req, resp);
    } catch (error) {
        console.error(error);
        resp.status(500).json({ Status: APP_STATUS.ERROR, error: 'An error occurred while creating an categories' })
    }
});

router.get('/categories', auth, async (req, resp) => {
    try {
        await CategoriesList(req, resp);
    } catch (error) {
        console.error(error);
        resp.status(500).json({ Status: APP_STATUS.ERROR, error: 'An error occurred while Get All categories' })
    }
});

router.put('/categories', auth, async (req, resp) => {
    try {
        await UpdateCategories(req, resp);
    } catch (error) {
        console.error(error);
        resp.status(500).json({ Status: APP_STATUS.ERROR, error: 'An error occurred while updated categories' })
    }
});

router.delete('/categories', async (req, resp) => {
    try {
        await DeleteCategories(req, resp);
    } catch (error) {
        console.error(error);
        resp.status(500).json({ Status: APP_STATUS.ERROR, error: 'An error occured while delete categories' })
    }
});

router.post('/logincategories', async (req, resp) => {
    try {
        await LoginCategories(req, resp);
    } catch (error) {
        console.error(error);
        resp.status(500).json({ Status: APP_STATUS.ERROR, error: 'An error occured while login the categories' })
    }
});

router.get('/postcategories', async (req, resp) => {
    try {
        await CategoriesPage(req, resp);
    } catch (error) {
        console.error(error);
        resp.status(500).json({ Status: APP_STATUS.ERROR, error: 'An error occured while pagination the categories' })
    }
});

export default router;


/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Add new categories
 *     description: Add new categories to the system.
 *     tags:
 *       - Categories
 *     requestBody:
 *       description: Categories data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *               companyName:
 *                 type: string
 *               productName:
 *                 type: string
 *               modelNumber:
 *                 type: string
 *               size:
 *                 type: string
 *               price:
 *                 type: number
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Categories added successfully
 *         content:
 *           application/json:
 *               example:
 *                 Status: Success
 *                 message: Categories Upload.....! 
 *                 data:
 *                   name: Path
 *                   categories: electronics
 *                   companyName: vivo
 *                   productName: tablets
 *                   modelNumber: LKI5874WE44D5
 *                   size: 5.5 inch
 *                   price: 22000
 *                   password: 123
 *       '409':
 *         description: Categories already exists
 *         content:
 *           application/json:
 *               example:
 *                 Status: FAILED
 *                 message: Categories already exists
 */


/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get list of categories
 *     description: Retrieve a list of categories.
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []  # This indicates that the endpoint is secured with a Bearer token
 *     parameters:
 *       - name: Token
 *         in: header # Location should be "header" for Bearer Token
 *         required: true
 *         schema:
 *           type: string
 *           format: "Bearer <token>"
 *     responses:
 *       '200':
 *         description: Successful response containing categories list
 *         content:
 *           application/json:
 *               example:
 *                 Status: Success
 *                 CategoriesList:
 *                    _id: 64c0e5faaed71535f108ed31
 *                    name: Path
 *                    categories: electronics
 *                    companyName: vivo
 *                    productName: tablets
 *                    modelNumber: LKI5874WE44D5
 *                    size: 5.5 inch
 *                    price: 22000
 *                    password: 123 
 *                 
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *               example:
 *                 Status: ERROR
 *                 error: Error retrieving categories list 
 */

/**
 * @swagger
 * /categories:
 *   put:
 *     summary: Update categories
 *     description: Update existing categories.
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []  # This indicates that the endpoint is secured with a Bearer token
 *     requestBody:
 *       description: Updated categories data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *               companyName:
 *                 type: string
 *               productName:
 *                 type: string
 *               modelNumber:
 *                 type: string
 *               size:
 *                 type: string
 *               price:
 *                 type: number
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Categories updated successfully
 *         content:
 *           application/json:
 *               example:
 *                 Status: Success
 *                 message: Categories Updated.....!
 *       '404':
 *         description: Categories not found
 *         content:
 *           application/json:
 *               example:
 *                 Status: FAILED
 *                 message: Categories is Exist
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
 * /categories:
 *   delete:
 *     summary: Delete categories
 *     description: Delete an existing categories.
 *     tags:
 *       - Categories
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
 *         description: Categories deleted successfully
 *         content:
 *           application/json:
 *               example:
 *                 Status: Success
 *                 message: Categories Record Deleted Successfully
 *       '409':
 *         description: Categories Does Not Exist
 *         content:
 *           application/json:
 *             example:
 *               Status: FAILED
 *               message: Categories Does Not Exist
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *               example:
 *                 Status: ERROR
 *                 error: Failed to delete Categories record 
 */

/**
 * @swagger
 * /logincategories:
 *   post:
 *     summary: Login to categories
 *     description: Login to categories using name and password.
 *     tags:
 *       - Categories
 *     requestBody:
 *       description: Categories login credentials
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
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
 *                 message: Login Successfully....!
 *                 data:
 *                   _id: 64c0e5faaed71535f108ed31
 *                   name: Path
 *                   categories: electronics
 *                   companyName: vivo
 *                   productName: tablets
 *                   modelNumber: LKI5874WE44D5
 *                   size: 5.5 inch
 *                   price: 22000
 *                   password: 123                  
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *               example:
 *                 Status: FAILED 
 *                 message: Invalid name and password
 *       '404':
 *         description: Categories not found
 *         content:
 *           application/json:
 *               example:
 *                 Status: FAILED
 *                 message: User not found
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
 * /postcategories:
 *   get:
 *     summary: Get paginated categories list
 *     description: Retrieve a paginated list of categories based on specified filters.
 *     tags:
 *       - Categories
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
 *         description: Filter categories by name (case-insensitive)
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: companyName
 *         description: Filter categories by companyName (case-insensitive)
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: productName
 *         description: Filter categories by productName (case-insensitive)
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response containing paginated categories list
 *         content:
 *           application/json:
 *             example:
 *               page: 1
 *               totalPostes: 1
 *               totalPages: 1
 *               postes: 
 *                 _id: 64c0e5faaed71535f108ed31
 *                 name: Path
 *                 categories: electronics
 *                 companyName: vivo
 *                 productName: tablets
 *                 modelNumber: LKI5874WE44D5
 *                 size: 5.5 inch
 *                 price: 22000
 *                 password: 123 
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *               example:
 *                 Status: FAILED
 *                 message: Internal server error  
 */