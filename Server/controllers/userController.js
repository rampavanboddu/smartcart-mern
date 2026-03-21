const User = require("../models/User");


// REGISTER
exports.registerUser = async (req, res) => {

  try {

    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email
    });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};



// LOGIN
exports.loginUser = async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && user.password === password) {

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email
      });

    } else {

      res.status(401).json({ message: "Invalid email or password" });

    }

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};



// RESET PASSWORD
exports.resetPassword = async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = password;

    await user.save();

    res.json({ message: "Password updated successfully" });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};