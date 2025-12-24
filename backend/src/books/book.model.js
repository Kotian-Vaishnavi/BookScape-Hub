const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    trending: {
      type: Boolean,
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    oldPrice: {
      type: Number,
      required: true,
    },
    newPrice: {
      type: Number,
      required: true,
    },

    // 🔹 CHANGED: from single seller → array of sellers with details
    uploadedBy: [
      {
        seller: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        stock: {
          type: Number,
          default: 1,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
