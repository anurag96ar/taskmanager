const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../models/User");


const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            return res.status(409)
                .json({ message: 'User is already exist, you can login', success: false });
        }
        const userModel = new User({ name, email, password });
        userModel.password = await bcrypt.hash(password, 10);
        await userModel.save();
        res.status(201)
            .json({
                message: "Signup successfully",
                success: true
            })
    } catch (err) {
        res.status(500)
            .json({
                message: "Internal server errror",
                success: false
            })
    }
}


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        const errorMsg = 'Auth failed email or password is wrong';
        if (!user) {
            return res.status(403)
                .json({ message: errorMsg, success: false });
        }
        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            return res.status(403)
                .json({ message: errorMsg, success: false });
        }
        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        )

        res.status(200)
            .json({
                message: "Login Success",
                success: true,
                jwtToken,
                email,
                name: user.name
            })
    } catch (err) {
        res.status(500)
            .json({
                message: "Internal server errror",
                success: false
            })
    }
}

const googleLogin = async (req, res) => {
    try {
      console.log("googleLogin");
      const { email } = req.body;
      console.log(email, "req body email");
    ;
      const user = await User.findOne({ email: email});
      
      if (user) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        return res.json({
          message: "Google Login",
          token,
          user
        });
      } else {
        return res.json({ message: "Invalid User", email: email });
      }
    } catch (error) {
      console.log(error);
    }
  };

module.exports = {
    signup,
    login,
    googleLogin
}