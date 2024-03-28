import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const authMiddleware = (req, resp, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return resp.status(401).send("Unauthorized. Missing or invalid token.");
    }
    const tokens = authHeader.replace('Bearer ', '');
    try {
        const data = jwt.verify(tokens, "SEY_KEY");
        req.uid = data._id;
        next();
    } catch (error) {
        resp.status(401).send("Invalid credentials");
    }
};

export default authMiddleware;
