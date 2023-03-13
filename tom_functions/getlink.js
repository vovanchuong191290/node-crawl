const cheerio = require('cheerio');
const cloudscraper = require('cloudscraper');

tom_extract_sitemap = (url) => {
	return new Promise((resolve, reject) => {
		cloudscraper.get(url)
			.then((body) => {
				let $ = cheerio.load(body);
				let data = $('sitemap');
				let arr = [];
				for (let i=0; i<data.length; i++) {
					if($(data).eq(i).find('loc').text().indexOf('video-sitemap')>-1)
					arr.push({loc:$(data).eq(i).find('loc').text(),lastmod:$(data).eq(i).find('lastmod').text()});
				}
				resolve(arr);
			})
			.catch((err) => {
				console.log(err);
				resolve(false);
			});
	});
};

tom_extract_value_sitemap = (url) => {
	return new Promise((resolve, reject) => {
		cloudscraper.get(url)
			.then((body) => {
				let $ = cheerio.load(body);
				let data = $('url');
				let arr = [];
				for (let i=0; i<data.length; i++) {
					arr.push({loc:$(data).eq(i).find('loc').text(),lastmod:$(data).eq(i).find('lastmod').text()});
				}
				resolve(arr);
			})
			.catch((err) => {
				console.log(err);
				resolve(false);
			});
	});
};

tom_extract_contents = (url) => {
	return new Promise((resolve, reject) => {
		cloudscraper.get(url)
			.then((body) => {
				let $ = cheerio.load(body);
				let json_ins = {};
				// Post title - Description - Image
				$('meta').each((index, value) => {
					let mt_name = $(value).attr('property');
					let mt_val = $(value).attr('content');
					switch (mt_name) {
						case 'og:title':
							json_ins.post_title = mt_val;
							break;
						case 'og:description':
							json_ins.description = mt_val;
							break;
						case 'og:image':
							json_ins.image = mt_val;
							break;
						case 'og:url':
							break;
					}
				});
				// Category
				let arr_category = [];
				$('.video-details').eq(0).find('span.meta').each((index, value) => {
					let mt_name = $(value).eq(index).find('span.meta-info').text();
					let mt_val = $(value).eq(index).find('a');
					if (mt_name.indexOf('Category')>-1) mt_val.each((i,e) => arr_category.push($(e).text()));
					json_ins.category = arr_category;
				});
				// Post Type
				json_ins.post_type = ($('#carousel-latest-mars-relatedvideo-widgets-2')) ? 'tv-show' : 'movie';

				resolve(json_ins);
			})
			.catch((err) => {
				// if(err.statusCode != 404) console.log(err);
				resolve({status:false, statusCode:err.statusCode});
			});
	});
};

module.exports.tom_extract_sitemap = tom_extract_sitemap;
module.exports.tom_extract_value_sitemap = tom_extract_value_sitemap;
module.exports.tom_extract_contents = tom_extract_contents;