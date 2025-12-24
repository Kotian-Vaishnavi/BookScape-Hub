const Book = require("./book.model");

// ==================== Post a Book ====================
const postABook = async (req, res) => {
  try {
    const sellerId = req.user.id; // from verifyAdminToken / verifyToken
    const {
      title,
      author,
      description,
      category,
      trending,
      coverImage,
      oldPrice,
      newPrice,
      stock,
    } = req.body;

    // Normalize strings for comparison
    const normalize = (str) =>
      str
        .toLowerCase()
        .replace(/\s+/g, "") // remove all spaces
        .replace(/[^a-z0-9]/g, ""); // remove punctuation/commas

    // Sanitize author to remove extra spaces
    const sanitizedAuthor = author
      .split(",")
      .map((a) => a.trim())
      .join(", ");

    // Step 1: Find if book already exists
    let existingBook = await Book.findOne({
      title: { $regex: new RegExp("^" + title + "$", "i") }, // case-insensitive
      author: { $regex: new RegExp("^" + sanitizedAuthor + "$", "i") },
    });

    if (existingBook) {
      // Ensure uploadedBy is an array
      if (!Array.isArray(existingBook.uploadedBy)) {
        existingBook.uploadedBy = [];
      }

      // Step 2: Check if seller already listed this book
      const alreadyListed = existingBook.uploadedBy.some(
        (entry) => entry.seller?.toString() === sellerId
      );

      if (alreadyListed) {
        return res
          .status(400)
          .json({ message: "You already listed this book" });
      }

      // Step 3: Add new seller to uploadedBy array
      existingBook.uploadedBy.push({
        seller: sellerId,
        price: newPrice,
        stock: stock || 1,
      });

      await existingBook.save();

      return res.status(200).json({
        message: "Book already exists, added your listing",
        book: existingBook,
      });
    }

    // Step 4: Create a new book if it doesn't exist
    const newBook = await Book.create({
      title,
      author: sanitizedAuthor,
      description,
      category,
      trending,
      coverImage,
      oldPrice,
      newPrice, // display price
      uploadedBy: [
        {
          seller: sellerId,
          price: newPrice,
          stock: stock || 1,
        },
      ],
    });

    res.status(201).json({
      message: "Book uploaded successfully",
      book: newBook,
    });
  } catch (error) {
    console.error("Error posting book:", error);
    res
      .status(500)
      .json({ message: "Failed to post book", error: error.message });
  }
};

// ==================== Get all books ====================
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find()
      .sort({ createdAt: -1 })
      .populate("uploadedBy.seller", "username email");

    res.status(200).send(books);
  } catch (error) {
    console.error("Error fetching books", error);
    res.status(500).send({ message: "Failed to fetch books" });
  }
};

// ==================== Get single book ====================
const getSingleBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id).populate(
      "uploadedBy.seller",
      "username email"
    );
    if (!book) {
      return res.status(404).send({ message: "Book not Found!" });
    }
    res.status(200).send(book);
  } catch (error) {
    console.error("Error fetching book", error);
    res.status(500).send({ message: "Failed to fetch book" });
  }
};

// ==================== Update a book ====================
const UpdateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBook = await Book.findByIdAndUpdate(id, req.body, {
      new: true,
    }).populate("uploadedBy.seller", "username email");

    if (!updatedBook) {
      return res.status(404).send({ message: "Book not Found!" });
    }
    res.status(200).send({
      message: "Book updated successfully",
      book: updatedBook,
    });
  } catch (error) {
    console.error("Error updating a book", error);
    res.status(500).send({ message: "Failed to update a book" });
  }
};

// ==================== Delete a book ====================
const deleteABook = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) {
      return res.status(404).send({ message: "Book not Found!" });
    }
    res.status(200).send({
      message: "Book deleted successfully",
      book: deletedBook,
    });
  } catch (error) {
    console.error("Error deleting a book", error);
    res.status(500).send({ message: "Failed to delete a book" });
  }
};

// ==================== Get books uploaded by logged-in seller ====================
const getAdminBooks = async (req, res) => {
  try {
    const sellerId = req.user.id;

    // find all books where this seller is in uploadedBy array
    const books = await Book.find({ "uploadedBy.seller": sellerId })
      .sort({ createdAt: -1 })
      .populate("uploadedBy.seller", "username email");

    res.status(200).json(books);
  } catch (error) {
    console.error("Error fetching seller books", error);
    res.status(500).json({ message: "Failed to fetch seller books" });
  }
};

module.exports = {
  postABook,
  getAllBooks,
  getSingleBook,
  UpdateBook,
  deleteABook,
  getAdminBooks,
};
