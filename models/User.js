// Load Mongoose to define the schema and the model
const mongoose = require('mongoose');

// A User is an authenticated GitHub account. This API never stores passwords:
// identity comes from GitHub OAuth and only the public profile fields are kept.
// githubId holds GitHub's numeric account id, which is stable even if the
// username changes, so it is the natural unique key for the upsert.
const userSchema = new mongoose.Schema(
  {
    githubId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    displayName: {
      type: String,
      trim: true,
    },
    profileUrl: {
      type: String,
      trim: true,
    },
    avatarUrl: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
  },
  { timestamps: true }
);

// "User" becomes the "users" collection in MongoDB
module.exports = mongoose.model('User', userSchema);
