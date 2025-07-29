const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    title:{
        type: String,
        required: [true, 'Book title is required.'],
        trim: true,
        maxLength: [150, 'Book title cant be more than 150 characters.'],
        unique: true
    },
    author:{
        type: String,
        required: [true, 'Author name is required.'],
        trim: true
    },
    year:{
        type: Number,
        required: [true, 'Publication year is required.'],
        min: [1000, 'Year must be atleast 1000'],
        max: [new Date().getFullYear(), 'Year Cant be in the future.'],
    },
    createdOn: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Book', BookSchema);