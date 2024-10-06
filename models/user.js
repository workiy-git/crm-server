const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  role: { type: String, required: true }, // e.g., 'admin', 'user', etc.
});

module.exports = mongoose.model("User", userSchema);
