/*
 * jQuery JSON-RPC Plugin
 *
 * @version: 0.3(2012-05-17)
 * @author hagino3000 <http://twitter.com/hagino3000> (Takashi Nishibayashi)
 * @author alanjds <http://twitter.com/alanjds> (Alan Justino da Silva)
 *
 * A JSON-RPC 2.0 implementation for jQuery.
 * JSON-RPC is a stateless, light-weight remote procedure call (RPC) protocol.
 * Read more in the <http://groups.google.com/group/json-rpc/web/json-rpc-2-0>
 */
(function($) {
    var rpcId = 1;
    var emptyFn = function(){};

    function jsonrpc(data, ajaxOpts) {
        var deferred = new $.Deferred();

        var postdata = {
            jsonrpc: '2.0',
            method: data.method || '',
            params: data.params || {},
            id: rpcId++
        };

        ajaxOpts = ajaxOpts || {};
        var successCallback = ajaxOpts.success || emptyFn;
        var errorCallback = ajaxOpts.error || emptyFn;
        delete ajaxOpts.success;
        delete ajaxOpts.error;

        var ajaxParams = $.extend({
            url: data.url || $.jsonrpc.defaultUrl,
            contentType: 'application/json',
            dataType: 'text',
            dataFilter: function(data, type) {
                return JSON.parse(data);
            },
            type: 'POST',
            processData: false,
            data: JSON.stringify(postdata),
            success: function(resp) {
                if (resp.hasOwnProperty('error')) {
                    // HTTP Response 20x but error
                    errorCallback(resp.error);
                    deferred.reject(resp.error);
                    return
                }
                if (resp.hasOwnProperty('result')) {
                    successCallback(resp.result);
                    deferred.resolve(resp.result);
                    return
                }
            },
            error: function(xhr, status, error) {
                var result = null;
                if (error === 'timeout') {
                    result = {
                        status: status,
                        code: -32000,
                        message: "Request Timeout",
                        data: null
                    };
                } else {
                    try {
                        var res = JSON.parse(xhr.responseText);
                        result = res.error;
                    } catch (e) {
                        result = {
                            status: status,
                            code: -32603,
                            message: error,
                            data: xhr.responseText
                        };
                    }
                }
                errorCallback(result);
                deferred.reject(result);
            }
        }, ajaxOpts);

        $.ajax(ajaxParams);

        return deferred.promise();
    }

    $.extend({
        jsonrpc: jsonrpc
    });
    $.jsonrpc.defaultUrl = '/jsonrpc'

})(jQuery);

