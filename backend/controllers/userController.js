// const User = require("../models/userModel");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const Doctor = require("../models/doctorModel");
// const Appointment = require("../models/appointmentModel");

// const getuser = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id).select("-password");
//     return res.send(user);
//   } catch (error) {
//     res.status(500).send("Unable to get user");
//   }
// };

// const getallusers = async (req, res) => {
//   try {
//     const users = await User.find()
//       .find({ _id: { $ne: req.locals } })
//       .select("-password");
//     return res.send(users);
//   } catch (error) {
//     res.status(500).send("Unable to get all users");
//   }
// };

// const login = async (req, res) => {
//   try {
//     const emailPresent = await User.findOne({ email: req.body.email });
//     if (!emailPresent) {
//       return res.status(400).send("Incorrect credentials");
//     }
//     const verifyPass = await bcrypt.compare(
//       req.body.password,
//       emailPresent.password
//     );
//     if (!verifyPass) {
//       return res.status(400).send("Incorrect credentials");
//     }
//     const token = jwt.sign(
//       { userId: emailPresent._id, isAdmin: emailPresent.isAdmin, isDoctor: emailPresent.isDoctor },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "2 days",
//       }
//     );
//     return res.status(201).send({ msg: "User logged in successfully", token });
//   } catch (error) {
//     res.status(500).send("Unable to login user");
//   }
// };

// const register = async (req, res) => {
//   try {
//     // console.log(req.body)
//     const emailPresent = await User.findOne({ email: req.body.email });
//     if (emailPresent) {
//       return res.status(400).send("Email already exists");
//     }
//     const hashedPass = await bcrypt.hash(req.body.password, 10);
//     const user = await User({ ...req.body, password: hashedPass });
//     const result = await user.save();
//     if (!result) {
//       return res.status(500).send("Unable to register user");
//     }
//     return res.status(201).send("User registered successfully");
//   } catch (error) {
//     res.status(500).send("Unable to register user");
//   }
// };

// const updateprofile = async (req, res) => {
//   try {
//     const {
//       firstname,
//       lastname,
//       email,
//       age,
//       mobile,
//       address,
//       gender,
//       password,
//       pic, // <-- this is the Cloudinary image URL from frontend
//     } = req.body;

//     const updateData = {
//       firstname,
//       lastname,
//       email,
//       age,
//       mobile,
//       address,
//       gender,
//     };

//     // Save the new Cloudinary pic URL if provided
//     if (pic) {
//       updateData.pic = pic;
//     }

//     if (password && password.length > 5) {
//       const hashedPass = await bcrypt.hash(password, 10);
//       updateData.password = hashedPass;
//     }

//     const result = await User.findByIdAndUpdate(
//       { _id: req.locals },
//       updateData
//     );

//     if (!result) {
//       return res.status(500).send("Unable to update user");
//     }

//     return res.status(201).send("User updated successfully");
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Unable to update user");
//   }
// };

// const deleteuser = async (req, res) => {
//   try {
//     const result = await User.findByIdAndDelete(req.body.userId);
//     const removeDoc = await Doctor.findOneAndDelete({
//       userId: req.body.userId,
//     });
//     const removeAppoint = await Appointment.findOneAndDelete({
//       userId: req.body.userId,
//     });
//     return res.send("User deleted successfully");
//   } catch (error) {
//     res.status(500).send("Unable to delete user");
//   }
// };

// module.exports = {
//   getuser,
//   getallusers,
//   login,
//   register,
//   updateprofile,
//   deleteuser,
// };

const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Doctor = require("../models/doctorModel");
const Appointment = require("../models/appointmentModel");
const nodemailer = require("nodemailer");

// In-memory store for OTPs (better: use Redis or save in User model with expiry)
let otpStore = {}; // { email: { otp: "123456", expire: 123456789 } }

const getuser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    return res.send(user);
  } catch (error) {
    res.status(500).send("Unable to get user");
  }
};

const getallusers = async (req, res) => {
  try {
    const users = await User.find()
      .find({ _id: { $ne: req.locals } })
      .select("-password");
    return res.send(users);
  } catch (error) {
    res.status(500).send("Unable to get all users");
  }
};

const login = async (req, res) => {
  try {
    const emailPresent = await User.findOne({ email: req.body.email });
    if (!emailPresent) {
      return res.status(400).send("Incorrect credentials");
    }
    const verifyPass = await bcrypt.compare(
      req.body.password,
      emailPresent.password
    );
    if (!verifyPass) {
      return res.status(400).send("Incorrect credentials");
    }
    const token = jwt.sign(
      {
        userId: emailPresent._id,
        isAdmin: emailPresent.isAdmin,
        isDoctor: emailPresent.isDoctor,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2 days" }
    );
    return res.status(201).send({ msg: "User logged in successfully", token });
  } catch (error) {
    res.status(500).send("Unable to login user");
  }
};

const register = async (req, res) => {
  try {
    const emailPresent = await User.findOne({ email: req.body.email });
    if (emailPresent) {
      return res.status(400).send("Email already exists");
    }
    const hashedPass = await bcrypt.hash(req.body.password, 10);
    const user = await User({ ...req.body, password: hashedPass });
    const result = await user.save();
    if (!result) {
      return res.status(500).send("Unable to register user");
    }
    return res.status(201).send("User registered successfully");
  } catch (error) {
    res.status(500).send("Unable to register user");
  }
};

const updateprofile = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      email,
      age,
      mobile,
      address,
      gender,
      password,
      pic,
    } = req.body;

    const updateData = {
      firstname,
      lastname,
      email,
      age,
      mobile,
      address,
      gender,
    };

    if (pic) updateData.pic = pic;

    if (password && password.length > 5) {
      const hashedPass = await bcrypt.hash(password, 10);
      updateData.password = hashedPass;
    }

    const result = await User.findByIdAndUpdate({ _id: req.locals }, updateData);

    if (!result) return res.status(500).send("Unable to update user");

    return res.status(201).send("User updated successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Unable to update user");
  }
};

const deleteuser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.body.userId);
    await Doctor.findOneAndDelete({ userId: req.body.userId });
    await Appointment.findOneAndDelete({ userId: req.body.userId });
    return res.send("User deleted successfully");
  } catch (error) {
    res.status(500).send("Unable to delete user");
  }
};

// ----------------- 🔹 NEW FUNCTIONS FOR FORGOT PASSWORD -----------------

// Send OTP
const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = { otp, expire: Date.now() + 10 * 60 * 1000 };

    
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: '"MediLink "<mhakalshiv8000@gmail.com>',
      to: email,
      subject: "Your OTP for Password Reset",
      text: `Your OTP is ${otp}. It expires in 10 minute.`,
    });

    return res.status(200).send({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Unable to send OTP" });
  }
};


const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!otpStore[email]) return res.status(400).send({ message: "OTP not requested" });

    const { otp: storedOtp, expire } = otpStore[email];
    if (Date.now() > expire) return res.status(400).send({ message: "OTP expired" });
    if (storedOtp !== otp) return res.status(400).send({ message: "Invalid OTP" });

    const hashedPass = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ email }, { password: hashedPass });

    delete otpStore[email];
    return res.status(200).send({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Unable to reset password" });
  }
};

module.exports = {
  getuser,
  getallusers,
  login,
  register,
  updateprofile,
  deleteuser,
  sendOtp,
  resetPassword,
};
