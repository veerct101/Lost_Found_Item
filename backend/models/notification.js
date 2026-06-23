const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
    isSystemNotification: {
      type: Boolean,
      default: false,
    },
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "item",
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("NOTIFICATION", notificationSchema);
