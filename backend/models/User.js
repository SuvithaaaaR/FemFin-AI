const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Don't return password in queries by default
    },
    phoneNumber: {
      type: String,
      match: [/^[0-9]{10}$/, "Please provide a valid 10-digit phone number"],
    },
    role: {
      type: String,
      enum: ["entrepreneur", "investor", "admin"],
      default: "entrepreneur",
    },
    profile: {
      age: Number,
      location: String,
      businessExperience: {
        type: String,
        enum: ["None", "0-2 years", "2-5 years", "5+ years"],
      },
      education: String,
      bio: String,
    },
    creditScore: {
      type: Number,
      min: 300,
      max: 900,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  },
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token method
userSchema.methods.getSignedJwtToken = function () {
  const jwt = require("jsonwebtoken");
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "24h",
  });
};

module.exports = mongoose.model("User", userSchema);
