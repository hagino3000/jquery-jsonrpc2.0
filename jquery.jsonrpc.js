(function($){

$.jsonRpc = $.jsonRpc || function(options) {
    var ajaxOptions = {
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        processData: false
    };

    var data = {
        version: options.version || '1.0',
        method: options.method || 'system.listMethods',
        params: options.params || []
    };
    $.each(data, function(i){ delete options[i] });

    function send() {
        options.data = JSON.stringify(data);
        $.ajax($.extend(ajaxOptions, options));
    }
    
    if (typeof JSON == 'undefined') {
        $.getScript('http://www.json.org/json2.js', function(){ send() });
    } else {
        send();
    }
    return $;
}

})(jQuery);
