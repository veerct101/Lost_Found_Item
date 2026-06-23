const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const itemSchema = new mongoose.Schema({
  itemTitle: {
    type: String,
  },

  itemName: {
    type: String,
  },
  itemDesc: {
    type: String,
  },
  location: {
    type: String,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  TypeOfItem: {
    type: String,
    enum: ["Lost", "Found"],
    default: "Lost",
  },
  claimed: {
    type: Boolean,
    required: true,
    default: false,
  },
  claimedBy: [
    {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  imageUrl: {
    type: String,
    default : ""
  },
  imagePublicId: {
    type: String,
    default : ""
  },
}, {timestamps : true});

const ITEM = mongoose.model("item", itemSchema);

module.exports = ITEM;
