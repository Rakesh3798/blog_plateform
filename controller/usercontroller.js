import User from '../model/User.js'
import dotenv from "dotenv";
dotenv.config();
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import APP_STATUS from '../constants/constants.js';
import mongoose from 'mongoose';

  
export const Registration = async function (req, resp) {
  const { name, email, address, city, pincode, phoneNumber, password } = req.body
  const existingUser = await User.findOne({ $or: [{ name: name }, { email: email }] });
  if (existingUser) {
    if (existingUser.name === name && existingUser.email === email) {
      return resp.status(409).json({ Status: APP_STATUS.FAILED, message: 'Name and Email already exist.' });
    } else if (existingUser.name === name) {
      return resp.status(409).json({ Status: APP_STATUS.FAILED, message: 'Name already exists.' });
    } else {
      return resp.status(409).json({ Status: APP_STATUS.FAILED, message: 'Email already exists.' });
    }
  }
  const data = await User.create({
    name, email, address, city, pincode, phoneNumber, password
  });
  return resp.status(200).json({
    Status: APP_STATUS.SUCCESS,
    message: "Registration Successfully....",
    data: data
  });
};

export const Login = async (req, resp) => {
  try {
    const data = await User.findOne({ email: req.body.email });
    if (!data) {
      return resp.status(404).send({ Status: APP_STATUS.FAILED, message: "Invalid Email" });
    } else {
      const valid = await bcrypt.compare(req.body.password, data.password);
      if (!valid) {
        return resp.status(401).send({ Status: APP_STATUS.FAILED, message: "Invalid Password" });
      } else {
        const token = await jwt.sign({ _id: data._id }, "SEY_KEY", { expiresIn: '2h' });
        data.tokens = token
        //data.tokens.push(token);
        await data.save();
        return resp.status(200).json({
          Status: APP_STATUS.SUCCESS,
          message: "Login Successfully..!",
          data: data,
         // token: token
        });
      }
    }
  } catch (error) {
    console.log(error);
    return resp.status(500).send({ Status: APP_STATUS.ERROR, message: "Internal Server Error" });
  }
}

// export const Logout = async (req, resp) => {
//   try {
//     const id = req.query.id;
//     const token = req.header('Authorization').replace('Bearer ', '');
//     const user = await User.findById(id);
//     if (!user) {
//       return resp.status(401).json({ Status: APP_STATUS.FAILED, message: "User not found" });
//     } else {
//       if (!Array.isArray(user.tokens)) {
//         user.tokens = [];
//         // user.tokens=null
//       } else {
//         user.tokens = user.tokens.filter((t) => t !== token);
//       }
//     }
//     await user.save();
//     return resp.status(200).json({ Status: APP_STATUS.SUCCESS, message: "User logged out successfully" });
//   } catch (error) {
//     console.log(error);
//     return resp.status(500).json({ Status: APP_STATUS.ERROR, message: "Internal Server error" });
//   }
// };

export const Logout = async (req, resp) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decodedToken = jwt.verify(token, 'SEY_KEY');
    const user = await User.findById(decodedToken._id);
    if (!user) {
      return resp.status(401).json({ Status: APP_STATUS.FAILED, message: "User not found" });
    } else {
      if (user.tokens===null) {
      return resp.status(200).json({ Status: APP_STATUS.FAILED, message: "User already logout" });
      } else {
          user.tokens=null
          await user.save();
        return resp.status(200).json({ Status: APP_STATUS.SUCCESS, message: "User logout successfully" });
      }
    }
  } catch (error) {
    console.log(error);
    return resp.status(500).json({ Status: APP_STATUS.ERROR, message: "Internal Server error" });
  }
};


// Example API endpoint for pagination and filtering
export const PageUser = async (req, resp) => {
  const { page, limit, name, email, address } = req.query;
  const paginationOptiones = {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10,
  };
  const filter = {};
  if (name) {
    filter.name = { $regex: name, $options: 'i' };
  }
  if (email) {
    filter.email = { $regex: email, $options: 'i' };
  }
  if (address) {
    filter.address = { $regex: address, $options: 'i' };
  }
  try {
    const totalPostes = await User.countDocuments(filter);
    const postes = await User.find(filter)
      .skip((paginationOptiones.page - 1) * paginationOptiones.limit)
      .limit(paginationOptiones.limit);

    resp.json({
      page: paginationOptiones.page,
      totalPostes,
      totalPages: Math.ceil(totalPostes / paginationOptiones.limit),
      postes,
    });
  } catch (error) {
    resp.status(500).json({ Status: APP_STATUS.ERROR, error: 'Internal server error' });
  }
};

export const fromdata = async (request, response) => {
  try {
      const userId = request.body.userId  
      const fromDate = request.body.fromDate
      const toDate = request.body.toDate
      console.log(userId);
      console.log(fromDate);
      console.log(toDate);
      const aggregate = await User.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(userId),
            createdAt: {
              $gte: new Date(fromDate),
              $lte: new Date(toDate)
            }
          }
        }
      ]);
      
      console.log(aggregate);
      //let message = "true"; // Default message
      if (!aggregate) {
        return response.json({message: "true version"}); 
      } else {
        return response.json({message : "false"});
      }
      //response.status(200).json({ Status: APP_STATUS.SUCCESS, message })
  } catch (error) {
    response.status(500).json({ Status: APP_STATUS.ERROR, error: 'Internal server error' });
  }
}


