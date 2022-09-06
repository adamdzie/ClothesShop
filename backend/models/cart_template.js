const mongoose = require("mongoose");

const currentCart = new mongoose.Schema({
  cartItem: [
    {
      itemId: {
        type: String,
      },
      itemQuantity: { type: Number },
      itemColor: {
        type: String,
      },
      itemSize: {
        type: String,
      },
    },
  ],
});

module.exports = CurrentCart = mongoose.model("cart", currentCart);
