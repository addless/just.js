var Ajax = (function() {
    'use strict';

    return Object.freeze(Object.create(null, {
        _headers: {value: Object.create(null)}, // default request headers
        _method:  {value: "GET"},               // default request method

        headers: {value: setHeaders},           // for setting request headers
        method:  {value: setMethod},            // for setting request method
        body:    {value: setBody},              // for setting request body
        url:     {value: setURL}                // for setting request url
    }));

    // Sets the request method.
    function setMethod(method) {
        if (method == null) return this;
        return {__proto__: this, _method: method};
    }

    // Sets the request headers.
    function setHeaders(headers) {
        if (headers == null) return this;
        return {__proto__: this, _headers: headers};
    }

    // Sets the request URL.
    function setURL(url) {
        if (typeof url !== 'string') throw Error('URL must be string');
        return {__proto__: this, _url: url, exec: execRequest};
    }

    // Sets the request body.
    function setBody(body) {
        if (body == null) return this;
        return {__proto__: this, _body: JSON.stringify(body)};
    }

    // Executes the request.
    function execRequest(callback) {
        var k = Object.keys(this._headers);
        var x = new XMLHttpRequest();
        var i = k.length;

        x.open(this._method, this._url);
        x.onload = handleResponse.bind(x, callback);
        x.onerror = handleResponse.bind(x, callback);
        x.setRequestHeader('content-type', 'application/json; charset=utf-8');
        while (i--) x.setRequestHeader(k[i].toLowerCase(), this._headers[k[i]]);
        x.send(this._body);
    }

    // Handles the response.
    function handleResponse(callback) {
        var r;

        try { r = JSON.parse(this.responseText) }
        catch (_) { r = this.responseText }
        callback.call(this, this.status, r);
    }
}());