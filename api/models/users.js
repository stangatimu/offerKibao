const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name:{type:String, required: true},
	dp:{type:String, default:"avatar"},
	email:{type: String, required: true, unique: true},
	isVerified: { type: Boolean, default: false },
	password:{type: String, required: true},
	bio:{type: String, required: true, max: 300, default:''},
	created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('User', userSchema);