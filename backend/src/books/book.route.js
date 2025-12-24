const express = require("express");
const Book = require("./book.model");
const {
  postABook,
  getAllBooks,
  getSingleBook,
  UpdateBook,
  deleteABook,
} = require("./book.controller");
const verifyAdminToken = require("../middleware/verifyAdminToken");

const router = express.Router();

// ==================== Routes ====================

// POST a book (only admins, book tagged with uploader)
router.post("/create-book", verifyAdminToken, postABook);

// GET all books (optional: filter by admin if needed)
router.get("/", getAllBooks);

// GET all books uploaded by the logged-in admin (seller)
router.get("/my-books", verifyAdminToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only sellers can view this" });
    }

    const sellerId = req.user.id;

    // Fetch all books where this seller is in uploadedBy array
    const books = await Book.find({ "uploadedBy.seller": sellerId })
      .sort({ createdAt: -1 })
      .populate("uploadedBy.seller", "username email");

    // Keep only the logged-in seller's entry in uploadedBy
    const filteredBooks = books.map((book) => {
      const sellerEntry = book.uploadedBy.find(
        (u) => u.seller._id.toString() === sellerId
      );
      return {
        ...book.toObject(),
        uploadedBy: [sellerEntry], // replace array with only this seller's entry
      };
    });

    res.status(200).json(filteredBooks);
  } catch (error) {
    console.error("Error fetching admin books:", error);
    res.status(500).json({ message: "Error fetching books" });
  }
});

// GET single book
router.get("/:id", getSingleBook);

// UPDATE a book (only admin who uploaded it)
router.put("/edit/:id", verifyAdminToken, UpdateBook);

// DELETE a book (only admin who uploaded it)
router.delete("/:id", verifyAdminToken, deleteABook);

module.exports = router;
