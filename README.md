# jQuery JSON-RPC Plugin

A JSON-RPC 2.0 implementation for jQuery.
JSON-RPC is a stateless, light-weight remote procedure call (RPC) protocol.
Read more in the <http://groups.google.com/group/json-rpc/web/json-rpc-2-0>

## Usage

```
$.jsonrpc(data [, callbacks]);
```

## Examples

```
// A RPC call with named parameters
$.jsonrpc.defaultUrl = '/rpc';
$.jsonrpc({
    method : 'createUser',
    params : {name : 'John Smith', userId : '1000'}
}, {
    success : function(result) {
        doSomething(result);
    },
    error : function(error) {
        console.info('code:', error.code);
        console.info('message:', error.message);
        console.dir(error.data);
    }
});
```

### A Notification 

```
$.jsonrpc({
    method : 'notify',
    params : {action : 'logout', userId : '1000'}
});
```

You can see more sample in test/public/test.js.  
Also server side code in test/app.js, written for node.js.

## License

MIT
