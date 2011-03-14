function simpleMethod(params, callback) {
  callback.onSuccess({
    str : 'Called simpleMethod',
    num : 1,
    boo : true
  });
}

function throwErrorMethod(params, callback) {
  throw 'error';

  callback.onSuccess();
}

function returnErrorMethod(params, callback) {
  callback.onFailure({
    msg : 'this is error'
  });
}

function normalMethod(params, callback) {
  callback.onSuccess({
    p1 : params.p1*2,
    p2 : params.p2+'ZZZ',
    p3 : !params.p3,
    p4 : params.p4.map(function(n){return n*n;}),
    p5 : params.p5
  });
}

function timeoutMethod(params, callback) {
  //NOP
}


exports.simpleMethod = simpleMethod;
exports.throwErrorMethod = throwErrorMethod;
exports.returnErrorMethod = returnErrorMethod;
exports.normalMethod = normalMethod;
exports.timeoutMethod = timeoutMethod;
