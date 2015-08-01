var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ExtensionSchema = new Schema({
    _id: { type: String, index: true },
    title: String,
    description: String,
    author: String,
    authorAvatar: String,
    homepage: String,
    version: String,
    stars: { type: Number, default: 0 },
    forks: { type: Number, default: 0 },
    timestamp: { type: Date, default: Date.now, index: true },
    githubTimestamp: Date,
    totalDownloads: Number,
    downloads: [{
        count: Number,
        timestamp: { type: Date, default: Date.now }
    }],
    repository: String,
    dailyDownloads: { type: Number, default: 0, index: true }
});

mongoose.model('Extension', ExtensionSchema);
