const mongoose = require('mongoose');

const TagSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    color: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Tag', TagSchema);