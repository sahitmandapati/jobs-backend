const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
// const bcrypt = require('bcryptjs')
// const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  //   const {name , email , password} = req.body
  //   if(!name || !email || !password){
  //     throw new BadRequestError('Please provide name , email and password')
  //   }

  //  passed all below code as middleware in the models/user

  // const { name, email, password } = req.body;

  // const salt = await bcrypt.genSalt(10)
  // const hashedPassword = await bcrypt.hash(password,salt)

  // const tempUser = {name , email , password:hashedPassword}

  // const user = await User.create({ ...tempUser });

  const user = await User.create({ ...req.body });
  const token = user.createJWT();

  // const token = jwt.sign({ userID: user._id, name: user.name }, "jwtSecret", {
  //   expiresIn: "30d",
  // });

  res.status(StatusCodes.CREATED).json({ user: { name: user.name , accountType : user.accountType }, token });
};

const login = async (req, res) => {
  // console.log(req.body)
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }


  const isPasswordCorrect = await user.comparePassword(password)

  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  //compare password

  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name , accountType : user.accountType, userId : user._id }, token});

  // res.send("login user");
};

module.exports = {
  register,
  login,
};
