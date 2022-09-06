const mongoose = require("mongoose");

const orderTemplate = new mongoose.Schema({
  orderUserLogin: {
    type: String,
    default: "Niezalogowany",
  },
  orderSum: {
    type: Number,
    required: true,
  },
  orderName: {
    type: String,
  },
  orderSurname: {
    type: String,
  },
  orderStreet: {
    type: String,
  },
  orderHomenumber: {
    type: String,
  },
  orderApartnumber: {
    type: String,
  },
  orderTown: {
    type: String,
  },
  orderPostcode: {
    type: String,
  },
  orderEmail: {
    type: String,
  },
  orderStatus: {
    type: String,
    default: "W oczekiwaniu",
  },
  orderItems: [
    {
      itemId: {
        type: String,
      },
      itemName: {
        type: String,
      },
      itemQuantity: {
        type: Number,
      },
      itemSize: {
        type: String,
      },
      itemColor: {
        type: String,
      },
    },
  ],
  orderDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = OrderTemplate = mongoose.model("orders", orderTemplate);
