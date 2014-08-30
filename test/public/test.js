module('RPC');

asyncTest('Simple method call', function() {
    var res1, res2, res3;

    $.jsonrpc({
        url: '/rpc',
        method: 'simpleMethod'
    }).done(function(result) {
        res1 = result.str;
        res2 = result.num;
        res3 = result.boo;
    });

    setTimeout(function() {
        strictEqual(res1, 'Called simpleMethod', 'Result value 1 (stirng)');
        strictEqual(res2, 1, 'Result value 2 (number)');
        strictEqual(res3, true, 'Result value 3 (boolean)');
        start();
    }, 500);
});

asyncTest('Simple method call with old callback style', function() {
    var res1, res2, res3;

    $.jsonrpc({
        url: '/rpc',
        method: 'simpleMethod'
    }, {
        success: function(result) {
            res1 = result.str;
            res2 = result.num;
            res3 = result.boo;
        }
    });

    setTimeout(function() {
        strictEqual(res1, 'Called simpleMethod', 'Result value 1 (stirng)');
        strictEqual(res2, 1, 'Result value 2 (number)');
        strictEqual(res3, true, 'Result value 3 (boolean)');
        start();
    }, 500);
});

asyncTest('Set defaultUrl (success)', function() {
    var success, error;

    $.jsonrpc.defaultUrl = '/rpc';

    $.jsonrpc({
        method: 'simpleMethod'
    }).done(function(result) {
        success = true;
    }).fail(function(e) {
        error = true;
    });

    setTimeout(function() {
        strictEqual(success, true, 'Successfuly called defaultUrl');
        strictEqual(error, undefined, 'Error callback did not called');
        start();
    }, 500);
});


asyncTest('Set defaultUrl (error)', function() {
    var success, error;

    $.jsonrpc.defaultUrl = '/missing';

    $.jsonrpc({
        method: 'simpleMethod'
    }).done(function(result) {
        success = true;
    }).fail(function(e) {
        error = true;
    });

    setTimeout(function() {
        strictEqual(success, undefined, 'Success callback never called');
        strictEqual(error, true, 'Error callback should be called');
        start();
    }, 500);
});

asyncTest('Use parameter', function() {
    var res, calledSuccess = false, calledFailure = false;
    $.jsonrpc({
        url: '/rpc',
        method: 'normalMethod',
        params: {
            p1: 100,
            p2: 'This is Parameter2',
            p3: false,
            p4: [0, 1, 2, 3],
            p5: {
                hoge: 'fuga'
            }
        }
    }).done(function(result){
        calledSuccess = true;
        res = result;
    }).fail(function(error){
        calledFailure = true;
    });

    setTimeout(function() {
        equals(calledSuccess, true, 'Called success callback');
        equals(calledFailure, false, 'Never called failuer callback');
        equals(res.p1, 200, 'Parameter1');
        equals(res.p2, 'This is Parameter2ZZZ', 'Parameter2');
        equals(res.p3, true, 'Parameter3');
        deepEqual(res.p4, [0, 1, 4, 9], 'Parameter4');
        deepEqual(res.p5, {hoge: 'fuga'}, 'Parameter5');
        start();
    }, 500);
});

asyncTest('Batch Request', function() {
    var res, calledSuccess = false, calledFailure = false;
    $.jsonrpc.defaultUrl = '/rpc';
    $.jsonrpc([{
        method: 'normalMethodA'
    }, {
        method: 'normalMethodB'
    }]).done(function(results){
        calledSuccess = true;
        res = results;
    }).fail(function(error){
        calledFailure = true;
    });

    setTimeout(function() {
        equals(calledSuccess, true, 'Called success callback');
        equals(calledFailure, false, 'Never called failuer callback');
        equals(res[0].result.name, 'paniponi', 'RPC1');
        equals(res[1].result.title, 'overview', 'RPC2');
        start();
    }, 500);
});

asyncTest('Timeout', function() {
    var msg, calledSuccess = false, calledFailure = false;
    $.jsonrpc({
        url: '/rpc',
        method: 'timeoutMethod'
    }, {
        timeout: 500
    }).done(function(result) {
        calledSuccess = true;
    }).fail(function(error) {
        calledFailure = true;
        msg = error.message;
    });
    setTimeout(function() {
        equals(calledSuccess, false, 'Never alled success callback');
        equals(calledFailure, true, 'called failuer callback');
        equals(msg, 'Request Timeout', 'Error messsage');
        start();
    }, 1000);
});

asyncTest('RPC failuer (HTTP 400)', function() {
    var code, data, calledSuccess = false, calledFailure = false;
    $.jsonrpc({
        url: '/rpc',
        method: 'returnErrorMethod'
    }).done(function() {
        calledSuccess = true;
    }).fail(function(error) {
        calledFailure = true;
        code = error.code;
        data = error.data.msg;
    });

    setTimeout(function() {
        equals(calledSuccess, false, 'Never called success callback');
        equals(calledFailure, true, 'Called failuer callback');
        equals(code, -32603, 'RPC fault');
        equals(data, 'this is error', 'error data');
        start();
    }, 500);
});

asyncTest('RPC failuer (HTTP 200)', function() {
    var code, data, calledSuccess = false, calledFailure = false;
    $.jsonrpc({
        url: '/rpc',
        method: 'returnErrorWith200Method'
    }).done(function() {
        calledSuccess = true;
    }).fail(function(error) {
        calledFailure = true;
        code = error.code;
        data = error.data.msg;
    });

    setTimeout(function() {
        equals(calledSuccess, false, 'Never called success callback');
        equals(calledFailure, true, 'Called failuer callback');
        equals(code, -32603, 'RPC fault');
        equals(data, 'this is error but HTTP status is 200', 'error data');
        start();
    }, 500);
});

asyncTest('RPC failuer with old style callback params', function() {
    var code, data, calledSuccess = false, calledFailure = false;
    $.jsonrpc({
        url: '/rpc',
        method: 'returnErrorMethod'
    }).done(function() {
        calledSuccess = true;
    }).fail(function(error) {
        calledFailure = true;
        code = error.code;
        data = error.data.msg;
    });

    setTimeout(function() {
        equals(calledSuccess, false, 'Never called success callback');
        equals(calledFailure, true, 'Called failuer callback');
        equals(code, -32603, 'RPC fault');
        equals(data, 'this is error', 'error data');
        start();
    }, 500);
});

asyncTest('Method missing 404 : No method specified', function() {
    var code, calledSuccess = false, calledFailure = false;
    $.jsonrpc({
        url: '/rpc' // no method set
    }).done(function() {
        calledSuccess = true;
    }).fail(function(error) {
        calledFailure = true;
        code = error.code;
    });

    setTimeout(function() {
        equals(calledSuccess, false, 'Never called success callback');
        equals(calledFailure, true, 'Called failuer callback');
        equals(code, -32601, 'Returns Bad Request');
        start();
    }, 500);
});


asyncTest('Method missing 404: Invalid method name', function() {
    var code, calledSuccess = false, calledFailure = false;
    $.jsonrpc({
        url: '/rpc',
        method: 'unknownMethod'
    }).done(function() {
        calledSuccess = true;
    }).fail(function(error) {
        calledFailure = true;
        code = error.code;
    });

    setTimeout(function() {
        equals(calledSuccess, false, 'Never called success callback');
        equals(calledFailure, true, 'Called failuer callback');
        equals(code, -32601, 'Returns Bad Request');
        start();
    }, 500);
});

asyncTest('Internal Server Error 500 JSON Response', function() {
    var code, calledSuccess = false, calledFailure = false;
    $.jsonrpc({
        url: '/rpc',
        method: 'throwErrorMethod'
    }).done(function() {
        calledSuccess = true;
    }).fail(function(error) {
        calledFailure = true;
        code = error.code;
    });

    setTimeout(function() {
        equals(calledSuccess, false, 'Never called success callback');
        equals(calledFailure, true, 'Called failuer callback');
        equals(code, -32603, 'Returns Server Error');
        start();
    }, 500);
});

asyncTest('Internal Server Error 500 HTML Response', function() {
    var code, calledSuccess = false, calledFailure = false;
    $.jsonrpc({
        url: '/500html',
        method: 'throwErrorMethod'
    }).done(function() {
        calledSuccess = true;
    }).fail(function(error) {
        calledFailure = true;
        code = error.code;
    });

    setTimeout(function() {
        equals(calledSuccess, false, 'Never called success callback');
        equals(calledFailure, true, 'Called failuer callback');
        equals(code, -32603, 'Returns Server Error');
        start();
    }, 500);
});

asyncTest('Temporary Service unavailable 503 JSON Response', function() {
    var code, calledSuccess = false, calledFailure = false;
    $.jsonrpc({
        url: '/rpc',
        method: 'returnErrorWith503Method'
    }).done(function() {
        calledSuccess = true;
    }).fail(function(error) {
        calledFailure = true;
        code = error.code;
    });

    setTimeout(function() {
        equals(calledSuccess, false, 'Never called success callback');
        equals(calledFailure, true, 'Called failuer callback');
        equals(code, -32603, 'Returns Server Error');
        start();
    }, 500);
});

asyncTest('Temporary Service unavailable 503 HTML Response', function() {
    var code, calledSuccess = false, calledFailure = false;
    $.jsonrpc({
        url: '/503html',
        method: 'hoge'
    }).done(function() {
        calledSuccess = true;
    }).fail(function(error) {
        calledFailure = true;
        code = error.code;
    });

    setTimeout(function() {
        equals(calledSuccess, false, 'Never called success callback');
        equals(calledFailure, true, 'Called failuer callback');
        equals(code, -32603, 'Returns Server Error');
        start();
    }, 500);
});
