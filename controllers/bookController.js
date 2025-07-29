const BookModel = require("../models/bookModel.js");

const getAllBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const sortBy = req.query.sortBy || "createdOn";
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const totalBooks = await BookModel.countDocuments();
    const totalPages = Math.ceil(totalBooks / limit);

    const sortObject = {};
    sortObject[sortBy] = sortOrder;


    const allBooks = await BookModel.find().sort(sortObject).skip(skip).limit(limit);

    if (allBooks) {
      res.status(200).json({
        success: true,
        message: "List of books fetched successfully.",
        currentPage: page,
        totalPages,
        totalBooks,
        data: allBooks,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "List of books fetched failed.",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error?.errorResponse?.errmsg ?? "Internal server issue.",
    });
  }
};

const getBookById = async (req, res) => {
  try {
    const bookId = req?.params?.id;

    if (!bookId) {
      return res.status(400).json({
        success: false,
        message: "Book ID is required.",
      });
    }

    const findedBook = await BookModel.findById(bookId, {});

    if (findedBook) {
      res.status(200).json({
        success: true,
        message: "Book fetched successfully.",
        data: findedBook,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "book not exist with this id.",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error?.errorResponse?.errmsg ?? "Internal server issue.",
    });
  }
};

const createBook = async (req, res) => {
  try {
    const reqBodyData = req.body;
    const newBook = await BookModel.create(reqBodyData);
    if (newBook) {
      res.status(201).json({
        success: true,
        message: "Book created successfully.",
        data: newBook,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error?.errorResponse?.errmsg ?? "Internal server issue.",
    });
  }
};

const uploadMultipleBooks = async (req, res) => {
  try {
    const books = req.body;

    if (!Array.isArray(books) || books.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Books data must be a non-empty array.",
      });
    }

    const insertedBooks = await BookModel.insertMany(books, { ordered: false });

    return res.status(201).json({
      success: true,
      message: `${insertedBooks.length} books uploaded successfully.`,
      data: insertedBooks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.errorResponse?.errmsg ?? "Internal server error.",
    });
  }
};

const updateBookById = async (req, res) => {
  try {
    const bookId = req.params?.id;

    if (!bookId) {
      return res.status(400).json({
        success: false,
        message: "Book ID is required.",
      });
    }

    const updateData = req.body;

    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No update data provided.",
      });
    }

    const updatedBook = await BookModel.findByIdAndUpdate(
      bookId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedBook) {
      return res.status(404).json({
        success: false,
        message: "Book not found with this ID.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Book updated successfully.",
      data: updatedBook,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.errorResponse?.errmsg ?? "Internal server error.",
    });
  }
};

const deleteBookById = async (req, res) => {
  try {
    const bookId = req?.params?.id;
    if (!bookId) {
      return res.status(400).json({
        success: false,
        message: "Book ID is required.",
      });
    }

    const deletedBook = await BookModel.findByIdAndDelete(bookId);

    if (deletedBook) {
      res.status(200).json({
        success: true,
        message: "Book deleted successfully.",
        data: deletedBook,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "book not exist with this id.",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error?.errorResponse?.errmsg ?? "Internal server issue.",
    });
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  uploadMultipleBooks,
  updateBookById,
  deleteBookById,
};
