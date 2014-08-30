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

    var rpcid = 1,
        emptyFn = function() {};

    $.jsonrpc = $.jsonrpc || function(data, callbacks) {

        var postdata = {
            jsonrpc: '2.0',
            method: data.method || '',
            params: data.params || {}
        };
        if (callbacks) {
            postdata.id = data.id || rpcid++;
        } else {
            callbacks = emptyFn;
        }

        if (typeof(callbacks) === 'function') {
            callbacks = {
                success: callbacks,
                error: callbacks
            };
        }

        var dataFilter = data.dataFilter;

        var ajaxopts = {
            url: data.url || $.jsonrpc.defaultUrl,
            contentType: 'application/json',
            dataType: 'text',
            dataFilter: function(data, type) {
                if (dataFilter) {
                    return dataFilter(data);
                } else {
                    return JSON.parse(data);
                }
            },
            type: 'POST',
            processData: false,
            data: JSON.stringify(postdata),
            success: function(resp) {
                if (resp && !resp.error) {
                    return callbacks.success && callbacks.success(resp.result);
                } else if (resp && resp.error) {
                    return callbacks.error && callbacks.error(resp.error);
                } else {
                    return callbacks.error && callbacks.error(resp);
                }
            },
            error: function(xhr, status, error) {
               if (error === 'timeout') {
                   callbacks.error({
                       status: status,
                       code: 0,
                       message: 'Request Timeout'
                   });
                   return;
               }
               // If response code is 404, 400, 500, server returns error object
               try {
                   var res = JSON.parse(xhr.responseText);
                   callbacks.error(res.error);
               } catch (e) {
                   callbacks.error({
                       status: status,
                       code: 0,
                       message: error
                   });
               }
            }
        };
        if (data.timeout) {
            ajaxopts['timeout'] = data.timeout;
        }

        $.ajax(ajaxopts);

        return $;
    }
    $.jsonrpc.defaultUrl = $.jsonrpc.defaultUrl || '/jsonrpc/';

})(jQuery);

