var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ArticlesSchema = new Schema({
    alias: { type: String, index: true },
    title: String,
    layout: String,
    views: Number,
    createdAt: { type: Date, index: true, default: Date.now },
    published: { type: Boolean, index: true }
});

mongoose.model('Articles', ArticlesSchema);
