const rurl = require('url');
const async = require('async');

const InfoModel = require('../tom_models/InfoModel');
const DomainModel = require('../tom_models/DomainModel');

const getlink = require('../tom_functions/getlink');

exports.getIndex = (req, res, next) => {
	res.render('index', { title: 'Express' });
};

exports.getAllValue = async (req, res, next) => {
	// let a0 = await tom_extract_sitemap('https://s3.sonagitv.live/sitemap_index.xml');
	// a0.reverse();

	let num = req.params.num;
	let link = `https://s3.sonagitv.live/video-sitemap${num}.xml`;
	let page_index = num;

	// let a = await tom_extract_value_sitemap(a0[0].loc);
	let a = await tom_extract_value_sitemap(link);
	// let page_index_regex = a0[0].loc.split('/').pop().match(/(\d+)/i);
	// let page_index_regex = link.split('/').pop().match(/(\d+)/i);
	// let page_index = undefined;
	// if(page_index_regex && page_index_regex[1]) page_index = parseInt(page_index_regex[1]);
	a.reverse();

	let promises = a.map(async (element, index) => {
		let check = element.loc.split('/');
		if (check[4]!='') {
			let b = await tom_extract_contents(element.loc);
			if (b.status == false && b.statusCode != 404) {
				let i = 0;
				while (i<3) {
					b = await tom_extract_contents(element.loc);
					i++;
					if (b.status != false) break;
				}
			}
			
			let value_index = {};
			value_index.no = index;
			if(page_index != undefined) value_index.page = page_index;

			let info = {};
			info.index = value_index;
			info.link = element.loc;
			if (b.post_title!=undefined) info.post_title = b.post_title;
			if (b.description!=undefined) info.description = b.description;
			if (b.image!=undefined) info.image = b.image;
			if (b.category!=undefined) info.category = b.category;
			if (b.post_type!=undefined) info.post_type = b.post_type;
			if (b.status!=undefined) info.status = b.status;
			if (b.statusCode!=undefined) info.statusCode = b.statusCode;
			info.date = new Date(element.lastmod);

			let data = {};
			data.expand = info;
			return data;
		}
	});

	let items = await Promise.all(promises);
	// res.send(items);
	InfoModel.insertMany(items)
		.then(() => res.status(200).json("Order Added!"))
		.catch(err => res.status(400).json("Error: " + err));
};

exports.getNewValue = (req, res, next) => {
	res.send();
};

exports.getSearch = async(req, res, next) => {
	let name = req.params.name;
	let info = await InfoModel.find({'expand.post_title': {$regex: `.*${name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}.*`, $options: 'i'}}).exec();
	res.send(info);
};

exports.getOther = (req, res, next) => res.redirect('/');