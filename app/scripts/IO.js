(function (window) {
    define(['jquery'], function ($) {
        var IO = {};

        IO.requestAsync = function (url, options) {
            var deferred = $.Deferred();

            if (typeof url !== 'string') {
                options = url;
                url = options.url;
            }

            var originalURL = url;

            options = options || {};
            options.type = options.type || 'get';
            options.data = options.data || {};

            var done = function (resp) {
                resp = JSON.parse(resp);

                if (typeof options.success === 'function') {
                    options.success.call(window, resp);
                }

                deferred.resolve(resp);
            };

            switch (options.type.toLowerCase()) {
            case 'get':
                var datas = [];
                var d;
                for (d in options.data) {
                    if (options.data.hasOwnProperty(d)) {
                        datas.push(d + '=' + window.encodeURIComponent(options.data[d]));
                    }
                }

                if (datas.length > 0) {
                    url = url + '?' + datas.join('&');
                }

                window.OneRingRequest(options.type, url, null, done);
                break;
            case 'post':
                window.OneRingRequest(options.type, url, window.encodeURIComponent(JSON.stringify(options.data)), done);
                break;
            }

            return deferred.promise();
        };

        return IO;
    });
}(this));
