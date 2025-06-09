const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: String,
  unitPrice: Number,
  quantity: Number,
});

const QuoteSchema = new mongoose.Schema({
  customerName: String,
  preparedBy: String,
  items: [ItemSchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Quote', QuoteSchema);
