var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
    login: { type: String, index: true },
    token: { type: String, index: true },
    hash: String,
    role: { type: String, default: 'user' },
    email: String
});

mongoose.model('User', UserSchema);
