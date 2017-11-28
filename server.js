/**
 * ## Note: Do not be fooled, this is now called from Grunt - and thus file paths are ##
 * ## still relative to the project root!                                             ##
 *
 * --kjo
 */

var fs = require('fs'),
	path = require('path'),
	swig = require('swig'),
	express = require('express'),
	connect = require('connect'),
	app = express(),
	server = require('http').createServer(app),
	port = 3001,
	ip = '0.0.0.0', // bind to all interfaces
	fd = require('./FakeData/FakeData'),
	recordTypes = require('./dataDefinitions');

swig.setDefaults({cache: false});

app.use(connect.bodyParser());
app.use( express.static( path.resolve(__dirname, '..') ) );

fd.initialise({
	// other data generator definitions can go here

	listBased: 'arrays of strings can be used for random selection'.split(' '),
	funcBased: function() {
		// you can also just write function generators
		return Math.random().toFixed(2);
	},
	meta: ['You can also do meta-types.',
			'- Here is a word     : {{listBased}}',
			'- Here are 5 words   : {{listBased,5}} (kind of useless until I expand the filtration stuff)',
			'- Here is a caps word: {{listBased | toUpperCase}}',
			'- For a good time call:{{digit,3}}-{{digit,4}}',
			'- Chance of rain     : {{funcBased}}'].join('\n')
});

//console.log(fd.generateSingle('meta'));

// [@note ignore this, I'm just working a few things out :) #hide]
function swigTemplating(res, path, url, extra) {
	var tmpl = __dirname + '/../' + path + url + extra,
		template,
		data = {
			path: url
		};
	res.set('Content-Type', 'text/html');
	if (!fs.existsSync(tmpl)) {
		console.error('Path not found: ' + tmpl);
		res.send(404, 'Path not found: ' + tmpl);
		return;
	}
	template = swig.compileFile(tmpl);
	return template(data);
}

app.get(/\/data\/([a-zA-Z0-9]+)(\/(.*))?/, function(req, res) {
	res.set('Content-Type', 'application/json');
	var type = req.params[0],
		recordDefinition = recordTypes[type.trim()],
		seed = req.params[2];
	if (!recordDefinition) {
		res.end('server.js: No FakeData definition called "' + type + '"');
		return;
	}
	res.end(JSON.stringify(fd.generateRecord(recordDefinition, seed)));
});

app.post('/data/*', function(req, res) {
	res.set('Content-Type', 'application/json');
	res.end('{}');
});

app.put('/data/*', function(req, res) {
	res.set('Content-Type', 'application/json');
	res.end('{}');
});

app.route('/examples/*').get(function(req, res) {
    res.end(swigTemplating(res, 'examples/', req.params[0], '.html'));
});

app.route('/app/*').get(function(req, res) {
    var template = swig.compileFile(__dirname + '/../app/layout.html'),
        data = {
            bootstrap: ''
        };
	res.set('Content-Type', 'text/html');
    res.end(template(data));
});

app.all('/*', function(req, res){
	var filePath = req.params[0];

	console.log(filePath);
	if (fs.existsSync(filePath)) {
		var file = fs.readFileSync(filePath);
		res.send(file);
		return;
	}
	var url = path.basename(filePath);

	res.end(swigTemplating(res, 'templates/', url, '/index.html'));
});


console.log('Running on port ' + port);

server.listen(port, ip);
