import express from "express";
import { dbutil } from "./connect/dbconnect.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const PORT = process.env.PORT;
const app = express();
app.use(express.json());
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, "./public");
app.use('/public', express.static(publicPath));

// For Data Display Ejs 
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
import User from './model/User.js'
// app.get("/", async (request, response) => {
//     try {
//         const users = await User.find({})
//         response.render('index.ejs', { data: users })
//     } catch (error) {
//         console.error("Error Fetchinf data ", error);
//         response.status(500).send("Internal Server error")
//     }
// })

app.get("/", async (req, resp) => {
    try {
      const perPage = 8; // Number of items per page
      const page = req.query.page || 1; // Get the requested page from the query parameters
      const skip = (page - 1) * perPage; // Calculate the number of items to skip
  
      // Fetch a limited number of users based on pagination settings
      const users = await User.find()
        .skip(skip)
        .limit(perPage);
  
      // Calculate the total number of users
      const totalUsers = await User.countDocuments();
  
      // Calculate the total number of pages
      const totalPages = Math.ceil(totalUsers / perPage);
  
      resp.render("index.ejs", { data: users, currentPage: page, totalPages: totalPages });
  
    } catch (error) {
      console.error(error);
    }
  });
    

//swagger
import swaggerUi from "swagger-ui-express"
import specs from "./swagger/config.js";
app.use('/swagger',swaggerUi.serve,swaggerUi.setup(specs));
//display on json format
app.get('/swagger.json', (req, res) => {
    res.sendFile(__dirname + '/swagger.json');
});

import userrouter from "./router/userrouter.js";
import postrouter from "./router/postrouter.js";
import categoriesrouter from "./router/categoriesrouter.js"
import searchrouter from "./router/searchrouter.js"
app.use("/", userrouter);
app.use("/", postrouter);
app.use("/", categoriesrouter);
app.use("/", searchrouter);

// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// })
  
app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});