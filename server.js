/**
 *
 * --kjo
 */

var 
  fs = require('fs'),
  path = require('path'),
  swig = require('swig'),
  express = require('express'),
  connect = require('connect'),
  bodyParser = require('body-parser'),
  app = express(),
  server = require('http').createServer(app),
  port = 3001,
  ip = '0.0.0.0', // bind to all interfaces
  fd = require('./FakeData/FakeData'),
  recordTypes = require('./dataDefinitions');

const
  defaultResult = {
    success: true,
    $receivedData: {}
  };

swig.setDefaults({cache: false});

app.use(connect.bodyParser());
app.use( express.static( path.resolve(__dirname, '..') ) );

function swigTemplating(res, path, dataObject) {
  var 
    tmpl = __dirname + '/' + path,
    template,
    data = Object.assign({
      path: url
    }, dataObject);

  res.set('Content-Type', 'text/html');
  if (!fs.existsSync(tmpl)) {
    console.error('Path not found: ' + tmpl);
    res.send(404, 'Path not found: ' + tmpl);
    return;
  }
  template = swig.compileFile(tmpl);

  return template(data);
}

fd.initialise({
  // other data generator definitions can go here
  listBased: 'arrays of strings can be used for random selection'.split(' '),

  // you can also just write function generators
  funcBased: function() {
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

app.get(/\/data\/([a-zA-Z0-9]+)(\/(.*))?/, function(req, res) {  
  var 
    type = req.params[0],
    recordDefinition = recordTypes[type.trim()],
    seed = req.params[2];

  res.set('Content-Type', 'application/json');

  if (!recordDefinition) {
    res.end('server.js: No FakeData definition called "' + type + '"');
    return;
  }

  res.end(JSON.stringify(fd.generateRecord(recordDefinition, seed)));
});

/**
 * Quietly accept all POST
 */
app.post('/data/*', function(req, res) {
  res.set('Content-Type', 'application/json');
  res.end(
    JSON.stringify(
      Object.assign(
        {},
        defaultResult,
        {
          $receivedData: req.body
        }
      )
    )
  );
});

/**
 * Quietly accept all PUT
 */
app.put('/data/*', function(req, res) {
  res.set('Content-Type', 'application/json');
  res.end(
    JSON.stringify(
      Object.assign(
        {},
        defaultResult,
        {
          $receivedData: req.body
        }
      )
    )
  );
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

  res.end(swigTemplating(res, './templates/index.html', {
    recordTypes: Object.keys(dataDefinitions)
  }));
});


console.log('Running on port ' + port);

server.listen(port, ip);
