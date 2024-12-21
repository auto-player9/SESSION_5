const asyncWrapper = require("../middlewares/asyncWrapper");
const User = require("../models/user.modle")
const httpStatusText = require("../utils/httpStatusText");
const appError = require("../utils/appError");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const generateJWT = require("../utils/generateJWT")

const getAllUsers = asyncWrapper(async (req, res) => {
    const query = req.query;
    const limit = query.limit || 10;
    const page = query.page;
    const skip = (page - 1) * limit;
    const users = await User.find({}, { __v: false }).limit(limit).skip(skip);
    res.status(200).json({ status: httpStatusText.SUCCESS, data: { users } });
  });

const register = asyncWrapper( async (req,res,next) => {
    console.log(req.body)
    console.log("request.file",req.file)
    const {firstName,lastName,email,password,role} = req.body
    const oldUser = await User.findOne({email :email})
    if(oldUser) {
        const error = appError.create("user is already exists",400,httpStatusText.FAIL)
        return next(error)
    }

    const hashedpass = await bcrypt.hash(password, 10)
    const newUser = new User({
        firstName,
        lastName,
        email,
        password : hashedpass,
        role,
        avatar : req.file.filename
    })

    newUser.token = generateJWT({id: newUser._id , email: newUser.email, role: newUser.role})
    await newUser.save()
    res
    .status(201)
    .json({ status: httpStatusText.SUCCESS, data: { User: newUser } });
} )

const login = asyncWrapper( async (req,res,next) => {
    const {email,password} = req.body
    if (!email && !password) {
        const error = appError.create("email and password are require",400,httpStatusText.FAIL)
        return next(error)
    }

    const user = await User.findOne({email: email})
    const matchedPassword = bcrypt.compare(password,user.password)

    const token = generateJWT({id: user._id , email: user.email, role: user.role})

    if (user && matchedPassword) {
        res.status(200).json({ status: httpStatusText.SUCCESS, data: {token} });
    }else { 
        const error = appError.create("somethings wrong",500,httpStatusText.ERORR)
        return next(error)
    }
})

module.exports = {
    getAllUsers,
    register,
    login
}
