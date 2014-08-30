function simpleMethod(params, callback) {
    callback.onSuccess({
        str: 'Called simpleMethod',
        num: 1,
        boo: true
    });
}

function throwErrorMethod(params, callback) {
    throw 'error';
}

function returnErrorMethod(params, callback) {
    callback.onFailure({
        msg: 'this is error'
    });
}

function returnErrorWith503Method(params, callback) {
    callback.onFailure({
        msg: 'this is error'
    }, 503);
}

function returnErrorWith200Method(params, callback) {
    callback.onFailure({
        msg: 'this is error but HTTP status is 200'
    }, 200);
}

function normalMethod(params, callback) {
    callback.onSuccess({
        p1: params.p1*2,
        p2: params.p2+'ZZZ',
        p3: !params.p3,
        p4: params.p4.map(function(n){return n*n;}),
        p5: params.p5
    });
}

function normalMethodA(params, callback) {
    setTimeout(function() {
        callback.onSuccess({
            userId: 100,
            name: 'paniponi'
        });
    }, 100);
}

function normalMethodB(params, callback) {
    callback.onSuccess({
        postId: 999,
        title: 'overview'
    });
}

function timeoutMethod(params, callback) {
    //NOP
}


exports.simpleMethod = simpleMethod;
exports.throwErrorMethod = throwErrorMethod;
exports.returnErrorMethod = returnErrorMethod;
exports.returnErrorWith200Method = returnErrorWith200Method;
exports.returnErrorWith503Method = returnErrorWith503Method;
exports.normalMethod = normalMethod;
exports.timeoutMethod = timeoutMethod;
exports.normalMethodA = normalMethodA
exports.normalMethodB = normalMethodB
