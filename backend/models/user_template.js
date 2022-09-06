const mongoose = require("mongoose");

const userTemplate = new mongoose.Schema({
  userLogin: {
    type: String,
    required: true,
  },
  userPassword: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
  },
  userSurname: {
    type: String,
  },
  userStreet: {
    type: String,
  },
  userHomenumber: {
    type: String,
  },
  userApartnumber: {
    type: String,
  },
  userTown: {
    type: String,
  },
  userPostcode: {
    type: String,
  },
  userIsAdmin: {
    type: Boolean,
    default: false,
  },
  userCart: [
    {
      userItemId: {
        type: String,
      },
      userItemQuantity: { type: Number },
      userItemSize: { type: String },
      userItemColor: { type: String },
    },
  ],
  userObserve: [
    {
      type: String,
    },
  ],
  userDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = UserTemplate = mongoose.model("users", userTemplate);
