const mongoose = require("mongoose");

const itemTemplate = new mongoose.Schema({
  itemTitle: {
    type: String,
    required: true,
  },
  itemType: {
    type: String,
    required: true,
  },
  itemUnderType: {
    type: String,
    required: true,
  },
  itemPrice: {
    type: Number,
    required: true,
  },
  itemDescription: {
    type: String,
  },
  itemColors: [
    {
      type: String,
    },
  ],
  itemSizes: [
    {
      type: String,
    },
  ],
  itemDate: {
    type: Date,
    default: Date.now,
  },
  itemImagesBase64: [
    {
      type: String,
    },
  ],
});

module.exports = ItemTemplate = mongoose.model("items", itemTemplate);
