var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DownloadSchema = new Schema({
    count: Number,
    timestamp: { type: Date, default: Date.now, index:true },
    extension: { type: String, index: true }
});

mongoose.model('Download', DownloadSchema);
