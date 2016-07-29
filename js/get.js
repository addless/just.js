(function () {
    'use strict';

    Just.get('rules').as(remoteResource);
    Just.get('users').as(remoteResource);
    
    function remoteResource(key, obj) {
        var o = obj[key];  // request options
        var h = o.headers;
        var m = o.method;
        var b = o.body;
        var u = o.url;

        if (o.status === 409) {
            Ajax.url(u).body(b).method(m).headers(h).exec(done);
            o.status = 0;
        }

        function done(status, data) {
            if (o.url !== u) return;    // if the request URL has changed then abort
            if (o.body !== b) return;   // if the request body has changed then abort
            if (o.status !== 0) return; // if the request status has changed then abort
            if (o.method !== m) return; // if the request method has changed then abort
            if (data[key]) o.list = data[key];
            o.error = data.error;
            o.status = status;
            Just.render();
        }
    }
}());