var fs = require('fs')
  , nconf = require('nconf')
  , express = require('express')
  , http = require('http')
  , request = require('request')
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

// http://stackoverflow.com/questions/11181546/node-js-express-cross-domain-scripting
app.all('/', function(req, res, next) {
  res.header("Cache-Control", "no-cache");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.get('*', function(req, res){
    var out = {
	api: '0.13',
	space: nconf.get('space'),
	logo: nconf.get('logo'),
	url: nconf.get('url'),
	location: nconf.get('location'),
	state: nconf.get('state'),
	contact: nconf.get('contact'),
	issue_report_channels: nconf.get('issue_report_channels'),
	feeds: nconf.get('feeds'),
	projects: nconf.get('projects'),
	ext_donation: nconf.get('ext_donation')
    }

    out.state.open = null;

    request.get(nconf.get('OPENURL'), function (error, response, body) {
	if (!error && response.statusCode == 200) {
            var response = JSON.parse(body)
	    var openstatus = false;
	    if (response.people.length > 0) {
		openstatus = true;
	    }
	    out.state.open = openstatus;

            if (out.state.open) {
                var numppl = response.people.length;
                var pplmsg = (numppl > 1) ? numppl + ' people are' : numppl + " person is";
                out.state.message = "Open for public, at least " + pplmsg + " there." ;
            }

	    // api v12 compatibility
	    out.open = out.state.open;
	    out.icon = out.state.icon;
            out.status = out.state.message;

	    res.json(out);
	} else {

	}
    });
});
