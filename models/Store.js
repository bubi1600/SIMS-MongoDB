const mongoose = require("mongoose");

const StoreSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    desc: { type: String, required: true, },
    price: { type: Number, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Store", StoreSchema);