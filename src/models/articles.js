var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ArticlesSchema = new Schema({
    alias: { type: String, index: true },
    title: String,
    layout: String,
    views: Number,
    createdAt: { type: Date, index: true, default: Date.now }
});

mongoose.model('Articles', ArticlesSchema);
