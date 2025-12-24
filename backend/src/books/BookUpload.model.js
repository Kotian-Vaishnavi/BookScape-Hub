const mongoose = require("mongoose");

const bookUploadSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  uploadDate: { type: Date, default: Date.now },
});

const BookUpload = mongoose.model("BookUpload", bookUploadSchema);

module.exports = BookUpload;
