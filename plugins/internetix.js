var request = require('request');
var cheerio = require('cheerio');

exports.attach = function(options) {

	this.getData = function(client) {

		for (pool in options.urls) {
			var url = options.urls[pool];

			request(url, (function(pool) {
				return function(err, resp, body) {
					$ = cheerio.load(body);
					var data = $(options.selector).html();
					$ = cheerio.load(data);
					$('img').each(function() {
						$(this).attr('src','http://opinnot.internetix.fi'+ $(this).attr('src'));
					});
					var tags = new Array();

					$('h2').each(function() {
						tags.push($(this).text());
					});

					client.create({
						index : 'oppimateriaalit',
						type : 'material',
						body : {
							tags : tags.concat(options.tags),
							content : $.html()
						}
					}, function(error, response) {
						// ...
					});
				}
			})(pool));
		}

	};

};

exports.init = function(done) {
	return done();
};