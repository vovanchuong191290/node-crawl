const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const DomainSchema = new mongoose.Schema({
	_id: Number,
	name: String,
	expand: {type: Object, default: {}},
	create: {type: Date, default: Date.now},
	update: {type: Date, default: Date.now}
});
DomainSchema.plugin(AutoIncrement, {id: 'domain_id_counter', inc_field: '_id'});
module.exports = mongoose.model('domain', DomainSchema);