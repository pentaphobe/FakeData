module.exports = function () {
	var express = require('express'),
		router = express.Router(),
		fd = require('../FakeData/FakeData'),
		recordTypes = require('../dataDefinitions');

	function fakeDataExample() {
		fd.initialise({
			// other data generator definitions can go here

			listBased: 'arrays of strings can be used for random selection'.split(' '),
			funcBased: function() {
				// you can also just write function generators
				return Math.random().toFixed(2);
			},
			meta: [
				'You can also do meta-types.',
				'- Here is a word     : {{listBased}}',
				'- Here are 5 words   : {{listBased,5}} (kind of useless until I expand the filtration stuff)',
				'- Here is a caps word: {{listBased | toUpperCase}}',
				'- For a good time call:{{digit,3}}-{{digit,4}}',
				'- Chance of rain     : {{funcBased}}'
			].join('\n')
		});

		console.log(fd.generateSingle('meta'));
	}
	// fakeDataExample();

	// [@note ignore this, I'm just working a few things out :) #hide]
	function swigTemplating(res, path, url, extra) {
		var tmpl = path + url + extra,
			template,
			data = {
				path: url
			};
		console.log(tmpl);
		if (!fs.existsSync(tmpl)) {
			console.error('Path not found: ' + tmpl);
			res.send(404, 'Path not found: ' + tmpl);
			return;
		}
		template = swig.compileFile(tmpl);
		console.log(tmpl, data);
		return template(data);
	}

	router.get('/data/:type', function(req, res) {
		console.log('DATA:TYPE');
		res.set('Content-Type', 'text/json');
		var type = req.params.type;
		var recordDefinition = recordTypes[type.trim()];
		if (!recordDefinition) {
			res.end('server.js: No FakeData definition called "' + type + '"');
			return;
		}
		res.end(JSON.stringify(fd.generateRecord(recordDefinition)));
	});

	router.route('/examples/*').get(function(req, res) {
		conole.log('EXAMPLES');
		res.end(swigTemplating(res, '../examples/', req.params[0], '.html'));
	});

	router.all('/*', function(req, res){
		console.log('/*');
		var filePath = req.params[0];

		console.log(filePath);
		if (fs.existsSync(filePath)) {
			var file = fs.readFileSync(filePath);
			res.send(file);
			return;
		}
		var url = path.basename(filePath);

		res.end(swigTemplating(res, '../templates/', url, '/index.html'));
	});

	return router;
};
