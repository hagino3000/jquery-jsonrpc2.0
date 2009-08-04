;(function($){

  $.jsonrpc = $.jsonrpc || function(options) {
    var options = options || {};
    return $.ajax({
      url: options.url || window.location.href,
      type: options.type || 'POST',      
      contentType: 'application/json',
      dataFilter: function(data) {
        return JSON.parse(data);
      },
      data: JSON.stringify({
        method: options.method || 'system.listMethods',
        params: options.params || []
      }),
      success: function(resp) {
        if (!resp.error) return options.success && options.success(resp.result);
        else return options.fault && resp.error.message && options.fault(resp.error.message);
      },
      error: function(xhr, status, error) {
        return options.error && options.error(xhr, status, error);
      }
    });
  };

})(jQuery);
