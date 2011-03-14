module('RPC');

asyncTest('Simple method call', function(){
  var res1, res2, res3;

  $.jsonrpc({
    url : '/rpc',
    method : 'simpleMethod'
  }, function(result) {
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

asyncTest('Use parameter', function(){
  var res, calledSuccess = false, calledFailure = false;
  $.jsonrpc({
    url : '/rpc',
    method : 'normalMethod',
    params : {
      p1 : 100,
      p2 : 'This is Parameter2',
      p3 : false,
      p4 : [0, 1, 2, 3],
      p5 : {
        hoge : 'fuga'
      }
    }
  }, {
    success : function(result) {
      calledSuccess = true;
      res = result;
    },
    fault : function(error) {
      calledFailure = true;
    }
  });

  setTimeout(function() {
    equals(calledSuccess, true, 'Called success callback');
    equals(calledFailure, false, 'Never called failuer callback');
    equals(res.p1, 200, 'Parameter1');
    equals(res.p2, 'This is Parameter2ZZZ', 'Parameter2');
    equals(res.p3, true, 'Parameter3');
    deepEqual(res.p4, [0, 1, 4, 9], 'Parameter4'); 
    deepEqual(res.p5, {hoge : 'fuga'}, 'Parameter5');
    start();
  }, 500);
});

asyncTest('Timeout', function(){
  var msg, calledSuccess = false, calledFailure = false;
  $.jsonrpc({
    url : '/rpc',
    method : 'timeoutMethod',
    timeout : 500
  }, {
    success : function(result) {
      calledSuccess = true;
    },
    fault : function(error) {
      calledFailure = true;
      msg = error.message;
    }
  });
  setTimeout(function() {
    equals(calledSuccess, false, 'Never alled success callback');
    equals(calledFailure, true, 'called failuer callback');
    equals(msg, 'Request Timeout', 'Error messsage');
    start();
  }, 1000);
});

asyncTest('RPC failuer', function(){
  var code, data, calledSuccess = false, calledFailure = false;
  $.jsonrpc({
    url : '/rpc',
    method : 'returnErrorMethod'
  }, {
    success : function() {
      calledSuccess = true;
    },
    fault : function(error) {
      calledFailure = true;
      code = error.code;
      data = error.data.msg;
    }
  });

  setTimeout(function() {
    equals(calledSuccess, false, 'Never called success callback');
    equals(calledFailure, true, 'Called failuer callback');
    equals(code, -32603, 'RPC fault');
    equals(data, 'this is error', 'error data');
    start();
  }, 500);
});

asyncTest('Method missing 404 : No method specified', function(){
  var code, calledSuccess = false, calledFailure = false;
  $.jsonrpc({
    url : '/rpc' // no method set
  }, {
    success : function() {
      calledSuccess = true;
    },
    fault : function(error) {
      calledFailure = true;
      code = error.code;
    },
  });

  setTimeout(function() {
    equals(calledSuccess, false, 'Never called success callback');
    equals(calledFailure, true, 'Called failuer callback');
    equals(code, -32601, 'Returns Bad Request');
    start();
  }, 500);
});


asyncTest('Method missing 404: Invalid method name', function(){
  var code, calledSuccess = false, calledFailure = false;
  $.jsonrpc({
    url : '/rpc',
    method : 'unknownMethod'
  }, {
    success : function() {
      calledSuccess = true;
    },
    fault : function(error) {
      calledFailure = true;
      code = error.code;
    }
  });

  setTimeout(function() {
    equals(calledSuccess, false, 'Never called success callback');
    equals(calledFailure, true, 'Called failuer callback');
    equals(code, -32601, 'Returns Bad Request');
    start();
  }, 500);
});

asyncTest('Internal Server Error 500', function(){
  var code, calledSuccess = false, calledFailure = false;
  $.jsonrpc({
    url : '/rpc',
    method : 'throwErrorMethod'
  }, {
    success : function() {
      calledSuccess = true;
    },
    fault : function(error) {
      calledFailure = true;
      code = error.code;
    }
  });

  setTimeout(function() {
    equals(calledSuccess, false, 'Never called success callback');
    equals(calledFailure, true, 'Called failuer callback');
    equals(code, -32603, 'Returns Server Error');
    start();
  }, 500);
});

/*
asyncTest('Test Syncronus test with arguments', function() {

  var queue = new AsyncQueue({
    name : 'test2'
  });

  var result = [];

  var fn1 = function() {
    result.push('AAA');
    result.push('BBB');
  }

  var fn2 = function(a, b) {
    result.push(a);
    result.push(b);
    result.push('EEE');
  }

  var fn3 = function(a) {
    result.push(a);
  }

  queue.push({
    fn : fn1
  });

  queue.push({
    fn : fn2,
    args : ['CCC', 'DDD']
  });

  queue.push({
    fn : fn3,
    args : ['FFF']
  });

  queue.push(function(){
    result.push('END');
  });

  setTimeout(function() {
    equals(result[0], 'AAA', 'Value by static');
    equals(result[1], 'BBB', 'Value by static');
    equals(result[2], 'CCC', 'Value by argument1');
    equals(result[3], 'DDD', 'Value by argument2');
    equals(result[4], 'EEE', 'Value by static');
    equals(result[5], 'FFF', 'Value by argument1');
    equals(result[6], 'END', 'Final value');
    start();
  }, 100);
});

asyncTest('Test syncronus test with Scope', function() {

  var result = [];

  var queue = new AsyncQueue({
    name : 'test3'
  });

  var Ninja = function(name){
    this.name = name;
  }
  Ninja.prototype = {
    getName : function(r) {
      r.push(this.name);
    },
    setWeapon : function(w) {
      this.weapon = w;
    },
    getWeapon : function(r) {
      r.push(this.weapon);
    }
  }

  var sasuke = new Ninja('sasuke');

  queue.push({
    fn : sasuke.getName,
    args : [result],
    scope : sasuke
  });

  queue.push({
    fn : sasuke.setWeapon,
    args : ['katana'],
    scope : sasuke
  });

  queue.push({
    fn : sasuke.getWeapon,
    args : [result],
    scope : sasuke
  });

  setTimeout(function() {
    equals(result[0], 'sasuke', 'Value in scope');
    equals(result[1], 'katana', 'Value in scope');
    start();
  }, 100);
});


asyncTest('Test asyncronus test', function() {

  var result = [];

  var queue = new AsyncQueue({
    name : 'test4'
  });

  var Ninja = function(name){
    this.name = name;
  }
  Ninja.prototype = {
    getName : function(r, callback) {
      var result = this.name;
      setTimeout(function() {
        callback(result);
      }, 100);
    },
    setWeapon : function(w, callback) {
      var self = this;
      setTimeout(function() {
        self.weapon = w;
        callback();
      });
    },
    getWeapon : function(r, callback) {
      var result = this.weapon;
      setTimeout(function() {
        callback(result);
      }, 100);
    }
  }

  var sasuke = new Ninja('sasuke');

  queue.push({
    fn : sasuke.getName,
    args : [result],
    scope : sasuke,
    callback : function(name) {
      result.push(name);
    }
  });

  queue.push({
    fn : sasuke.setWeapon,
    args : ['katana'],
    scope : sasuke,
    callback : function(){}
  });

  queue.push({
    fn : sasuke.getWeapon,
    args : [result],
    scope : sasuke,
    callback : function(wep) {
      result.push(wep);
    }
  });

  queue.push(function(){
    result.push('END');
  });

  result.push('First');

  setTimeout(function() {
    equals(result[0], 'First', 'Value add syncronus');
    equals(result[1], 'sasuke', 'Value in callback');
    equals(result[2], 'katana', 'Value in callback');
    equals(result[3], 'END', 'End Value');
    start();
  }, 300);
});
*/
