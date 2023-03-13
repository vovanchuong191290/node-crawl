const mongoose = require('mongoose');

const InfoSchema = new mongoose.Schema({
	expand: {type: Object, default: {}},
	create: {type: Date, default: Date.now},
	update: {type: Date, default: Date.now}
});

module.exports = mongoose.model('info', InfoSchema);