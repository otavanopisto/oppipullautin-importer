var request = require('request');
var cheerio = require('cheerio');


exports.attach = function (options) {

  this.getData = function (client) {
	  
	  for (pool in options.urls) {
		    var url = options.urls[pool];

		    request(url, (function(pool) { return function(err, resp, body) {
		        $ = cheerio.load(body);
		        var data = $(options.selector).html();
		        $ = cheerio.load(data);
		        
		        $('*').each(function(){
		        	if ($(this).text().indexOf("[") !=-1 && $(this).text().indexOf("]") !=-1) {
		        		var text = $(this).text();
		        		var newText = text.replace(/\[.*]/g, '');
		        		$(this).text(newText);
		        	}
		        });
		        
			    var tags = new Array();
			    
			    $('h1').each(function(){
			        var tag = $(this).text();
			        var ignore = false;
			        for(var j = 0; j < options.ignoreTags.length;j++){
			        	if(options.ignoreTags[j] == tag){
			        		ignore = true;
			        	}
			        }
			        if(!ignore){
			        	tags.push(tag);	
			        }
			    	
			    });
		        
			    client.create({
		        	  index: 'oppimateriaalit',
		        	  type: 'material',
		        	  body: {
		        	    tags: tags.concat(options.tags),
		        	    content: $.html()
		        	  }
		        }, function (error, response) {
		        	  // ...
		        });
		    }})(pool));
		}

  };

};

exports.init = function (done) {
  return done();
};