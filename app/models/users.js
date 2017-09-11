var mongoose = require("mongoose");
var crypto = require("crypto");
var jwt = require("jsonwebtoken");
var auth = require("../config/secretExample");

var userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  usertype: {
    type: String,
    required: true
  },
  faculty: {
    type: String
  },
  mat: {
    type: String,
    unique:true
  },
  city: {
    type: String
  },
  street: {
    type: String
  },
  postalCode: {
    type: String
  },
  tel: {
    type: String
  },
  entryYear: {
    type: String
  },
  hash: String,
  salt: String
});

userSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, "sha1")
    .toString("hex");
};

userSchema.methods.verifyPassword = function(password) {
  var hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, "sha1")
    .toString("hex");
  return this.hash === hash;
};

userSchema.methods.generateToken = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
      usertype: this.usertype,
      faculty: this.faculty,
      mat: this.mat,
      city: this.city,
      street: this.street,
      postalCode: this.postalCode,
      tel: this.tel,
      entryYear: this.entryYear,
      exp: parseInt(expiry.getTime() / 1000)
    },
    auth
  );
};

mongoose.model("User", userSchema);
