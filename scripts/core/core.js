(function(core, $, undefined) {

    // guard to detect browser-specific issues early in development
    "use strict";

    // public var
    core.urls = {};
    core.values = {};

    // public method
    core.init = function(urls, values) {
        core.values = values;
        core.urls = urls;
    };

    // public method
    core.getURL = function(value, params) {
        var paramsContext = "";
        $.each(params, function(parameter, value) {
            paramsContext += parameter + "=" + value + "&";
        });
        paramsContext = paramsContext.substring(0, paramsContext.length - 1);
        return core.urls[value] + "?" + paramsContext;
    };

    $(document).ready(function() {
        $('.animate-show').animate({'opacity': 100, 'height': '100%'}, 20000);
    });

}(window.core = window.core || {}, jQuery));