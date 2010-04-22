/*
 * jQuery JSON-RPC Plugin
 *
 * @version: 0.1(2010-04-21)
 * @author hagino3000 <http://twitter.com/hagino3000> (Takashi Nishibayashi)
 *
 * A JSON-RPC 2.0 implementation for jQuery.
 * JSON-RPC is a stateless, light-weight remote procedure call (RPC) protocol.
 * Read more in the <http://groups.google.com/group/json-rpc/web/json-rpc-2-0>
 *
 * Requires json2.js<http://www.json.org/json2.js> if borowser not supported the window.JSON.
 *
 * Usage:
 *   $.jsonRpc(url, data[, callbackFunc]);
 *
 * Examples:
 *   // RPC call with named parameters
 *   $.jsonRpc('/rpc', {
 *     method : 'createUser',
 *     params : {name : 'John Smith', userId : '1000'}
 *   }, function(response, status) {
 *     // callback
 *     console.info(status);
 *     if (response.error) {
 *       console.dir(response.error);
 *     } else {
 *       doSomething(response.result);
 *     }
 *   });
 *
 *   // A Notification 
 *   $.jsonRpc('/rpc', {
 *     method : 'notify',
 *     params : {action : 'logout', userId : '1000'}
 *   });
 *
 *
 * This document is licensed as free software under the terms of the
 * MIT License: http://www.opensource.org/licenses/mit-license.php
 */
(function($) {

  var rpcid = 0;

  $.jsonRpc = $.jsonRpc || function(url, data, callback) {

    var postdata = {
      jsonrpc : '2.0',
      method : data.method || '',
      params : data.params || {}
    }
    if (callback) {
      postdata.id = data.id || rpcid++;
    }

    var ajaxopts = {
      url : url,
      contentType : 'application/json',
      dataType : 'json',
      type : 'POST',
      processData : false,
      data : JSON.stringify(postdata),
      success : callback,
      error : function(xhr, e) {
        if (xhr.responseText) {
          callback(JSON.parse(xhr.responseText), e);
        }
      }
    }
    $.ajax(ajaxopts);

    return $;
  }

})(jQuery);

