/**
 * Module dependencies.
 */
var util = require('util');
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
    var data = req.body;

    if (util.isArray(data)) {
        var results = [];
        var finishCount = 0;
        data.forEach(function(oneRPCRequest) {
            handleRPCRequest(oneRPCRequest, function(statusCode, response) {
                results.push(response);
                finishCount++;

                if (finishCount === data.length) {
                    res.status(200).send(results);
                }
            });
        });
    } else {
        handleRPCRequest(data, function(statusCode, response) {
            res.status(statusCode).send(response);
        });
    }
});

function handleRPCRequest(data, callback) {
    var rpcMethod;
    if (data.jsonrpc !== '2.0') {
        onError({
            code: -32600,
            message: 'Bad Request. JSON RPC version is invalid or missing'
        }, 400);
        return;
    }

    if (!(rpcMethod = rpcMethods[data.method])) {
        onError({
            code: -32601,
            message: 'Method not found : ' + data.method
        }, 404);
        return;
    }

    try {
        rpcMethod(data.params, {
            onSuccess: function(result) {
                callback(200, {
                    jsonrpc: '2.0',
                    result: result,
                    id: data.id
                });
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

    function onError(err, statusCode) {
        callback(statusCode, JSON.stringify({
            jsonrpc: '2.0',
            error: err,
            id: data.id
        }));
    }
}

app.post('/503html', function(req, res) {
    res.status(503).send("<html><head><title>HTTP 503 - Service (Temporarily) Unavailable</title></head><body>Sorry</body></html>");
});

app.post('/500html', function(req, res) {
    res.status(500).send("<html><head><title>HTTP 500 - Server Error</title></head><body>Sorry</body></html>");
});

var port = 3000
app.listen(port);
console.log("Express server listening on port %d", port)
