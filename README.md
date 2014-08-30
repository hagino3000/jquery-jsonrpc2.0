# jQuery JSON-RPC Plugin

A JSON-RPC 2.0 implementation for jQuery.
JSON-RPC is a stateless, light-weight remote procedure call (RPC) protocol.

Read more in the <http://www.jsonrpc.org/specification>

## Usage

```
$.jsonrpc(data [, ajaxOpts])
.done(function(result) {
   // do something
})
.fail(function(error) {
   // do something
});
```

## Examples

```
$.jsonrpc.defaultUrl = '/rpc';

// Use promise
$.jsonrpc({
    method: 'createUser',
    params: {name: 'John Smith', userId: '1000'}
}).done(function(result) {
    doSomething(result);
}).fail(function(error) {
    console.info('code:', error.code);
    console.info('message:', error.message);
    console.info(error.data);
});

// Set callback functions
$.jsonrpc({
    method: 'createUser',
    params: {name: 'John Smith', userId: '1000'}
}, {
    success: function(result) {
        doSomething(result);
    },
    error: function(error) {
        console.info('code:', error.code);
        console.info('message:', error.message);
        console.info(error.data);
    }
});
```

### Batch Request

Send several RPC Requests in one HTTP request. Always calls success callback.

```
$.jsonrpc.defaultUrl = '/rpc';

// Send 3 requests at once.
$.jsonrpc([{
    method: 'getEventStatus'
}, {
    method: 'getUserStatus'
}, {
    method: 'sendLoginStatus',
    params: {status: 'login'}
}]).done(function(responses) {
    // Here comes all success and error results without notify request.
    // Results are sorted by RPC Id (the same as 1st arguments)
    results.forEach(function(response) {
        if (response.result) {
            doSomething(response.result);
        } else {
            doSomething(response.error);
        }
    });
}).fail(function(error) {
    // timeout
});
```

### Notification

```
$.jsonrpc({
    method: 'notify',
    params: {action: 'logout', userId: '1000'}
});
```

You can see more sample in test/public/test.js.  
Also server side code in test/app.js, written for node.js.

## Support

jQuery > 1.7

## License

MIT
