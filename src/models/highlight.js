'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var HighlightSchema = new Schema({
    _id: { type: String, index: true },
    timestamp: { type: String, index: true },
    screenshot: String,
    description: String
});

mongoose.model('Highlight', HighlightSchema);
