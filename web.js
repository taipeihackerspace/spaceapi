var fs = require('fs')
  , nconf = require('nconf')
  , express = require('express')
  , http = require('http')
  ;

// Configuration
nconf.argv()
     .env()
     .file({ file: 'config.json' });


// Set up web interface
var app = express();
app.use(express.logger());
app.use(express.bodyParser());
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

var port = nconf.get('PORT');
var server = http.createServer(app);
server.listen(port, function(){
  console.log("Express server listening on port " + port);
});


app.get('*', function(req, res){
    var out = {
	api: '0.13',
	space: nconf.get('space'),
	logo: nconf.get('logo'),
	url: nconf.get('url'),
	location : nconf.get('location'),
	state: {
	    open: null
	},
	contact : nconf.get('contact'),
	issue_report_channels : nconf.get('issue_report_channels')
    }
    res.json(out);
});

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    next();
};
app.use(allowCrossDomain);
