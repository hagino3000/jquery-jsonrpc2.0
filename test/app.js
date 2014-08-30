/**
 * Module dependencies.
 */
var express = require('express');
var bodyParser = require('body-parser');
var errorhandler = require('errorhandler')

var rpcMethods = require('./methods.js');

var app = express();

// Configuration
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(errorhandler({ dumpExceptions: true, showStack: true })); 


// Routes
app.get('/', function(req, res){
  res.redirect('test.html');
});

// RPC end point
app.post('/rpc', function(req, res) {
  res.header('Content-Type', 'application/json');
  var data = req.body, err = null, rpcMethod;

  if (!err && data.jsonrpc !== '2.0') {
    onError({
      code: -32600,
      message: 'Bad Request. JSON RPC version is invalid or missing',
      data: null
    }, 400);
    return;
  }

  if (!err && !(rpcMethod = rpcMethods[data.method])) {
    onError({
      code: -32601,
      message: 'Method not found : ' + data.method
    }, 404);
    return;
  }

  try {
    rpcMethod(data.params, {
      onSuccess: function(result) {
        res.status(200).send(JSON.stringify({
          jsonrpc: '2.0',
          result: result,
          id: data.id
        }));
      },
      onFailure: function(error, statusCode) {
        onError({
          code: -32603,
          message: 'Failed',
          data: error
        }, statusCode || 400);
      }
    });
  } catch (e) {
    onError({
      code: -32603,
      message: 'Excaption at method call',
      data: e
    }, 500);
  }
  return;

  function onError(err, statusCode) {
    res.status(statusCode).send(JSON.stringify({
      jsonrpc: '2.0',
      error: err,
      id: data.id
    }));
  }
});

var port = 3000
app.listen(port);
console.log("Express server listening on port %d", port)
