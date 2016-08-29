(function () {
    'use strict';

    Just.get('rules').as(remoteResource);
    Just.get('users').as(remoteResource);

    function remoteResource(key, obj) {
        var v = obj[key];
        var h = v.headers;
        var m = v.method;
        var b = v.body;
        var u = v.url;

        if (v.status === 409) {
            Ajax.url(u).body(b).method(m).headers(h).exec(done);
            v.status = 0;
        }

        function done(status, data) {
            if (v.url !== u) return;
            if (v.body !== b) return;
            if (v.status !== 0) return;
            if (v.method !== m) return;
            if (data[key]) v.list = data[key];
            v.error = data.error;
            v.status = status;
            Just.render();
        }
    }
}());