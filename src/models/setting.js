var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SettingSchema = new Schema({
    version: { type:Number, default: -1 }
});

mongoose.model('Setting', SettingSchema);
