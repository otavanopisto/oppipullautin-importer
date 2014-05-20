var broadway = require("broadway");

var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

var app = new broadway.App();

var options = require(__dirname + '/options');

app.use(require("./plugins/internetix"), options );

app.init(function (err) {
  if (err) {
    console.log(err);
  }
});

app.getData(client);