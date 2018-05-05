const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name:{type:String, required: true},
	email:{type: String, required: true, unique: true},
	password:{type: String, required: true},
	address:{
		city: {type: String, required: true},
		street: {type: String, required: true},
	},
	created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('User', userSchema);