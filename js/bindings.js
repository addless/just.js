var Bindings = (function() {
    "use strict";

    // Cross browser Element.matches implementation; see https://goo.gl/3n6CSR
    var matchesSelector = xBrowserMatchFunc();
    // This maps CSS selectors to their associated index.
    var indexBySel = {};
    // List of decorator factories added during setup
    var factories = [];
    // List of selectors added during setup
    var selectors = [];
    // List of data paths added during setup
    var paths = [];
    // List of argument paths added during setup
    var arg1s = [];
    // List of argument paths added during setup
    var arg2s = [];
    // List of argument paths added during setup
    var arg3s = [];

    addEventListener("input", handleInput, false);
    addEventListener("change", handleInput, false);
    addEventListener("DOMContentLoaded", renderLists, false);
    return {add: addDeclarations, render: debounce.bind(null, renderLists)};

    // This function prevents near-simultaneous calls to the given function.
    // Without it, we'd be calling functions more frequently then necessary, and causing race conditions.
    function debounce(func, waitTime) {
        clearTimeout(func.$timeout);
        func.$timeout = setTimeout(func, waitTime || 80);
    }

    // This function is the default decorator factory.
    // It's used in the event that a decorator factory isn't provided during setup.
    function defaultDecoratorFactory() { return defaultDecoratorFactory; }

    // This function adds bindings to the internal map.
    // Without it, we're unable to have external scripts update the internal map.
    function addDeclarations(map) {
        var k = Object.keys(map);
        var i = k.length;

        while (i--) {
            addDeclaration(k[i], map[k[i]]);
        }
    }

    // This function adds one binding to the internal map.
    // Without it, its content would be nested within a loop.
    function addDeclaration(selector, args) {
        if (typeof args[0] !== "string") throw Error("Binding declaration needs data path");
        if (typeof args[1] !== "string") args.splice(1, 0, "");
        if (typeof args[2] !== "string") args.splice(2, 0, "");
        if (typeof args[3] !== "string") args.splice(3, 0, "");
        if (typeof args[4] !== "function") args[4] = defaultDecoratorFactory;
        if (args[0] !== "") paths.push(args[0].split("."));
        if (args[1] !== "") arg1s.push(args[1].split("."));
        if (args[2] !== "") arg2s.push(args[2].split("."));
        if (args[3] !== "") arg3s.push(args[3].split("."));
        if (args[0] === "") paths.push([]);
        if (args[1] === "") arg1s.push([]);
        if (args[2] === "") arg2s.push([]);
        if (args[3] === "") arg3s.push([]);
        indexBySel[selector] = selectors.length;
        factories.push(args.slice(4));
        selectors.push(selector);
    }

    // This function handles input/change events
    // Without it, we're unable to re-render in response to user input
    function handleInput(event) {
        var n = "on" + event.type;
        if (event.target[n] == null) return;
        debounce(renderLists);
    }

    // This function initiates the rendering process.
    // Without it, we're unable to initiate rendering in response to events.
    function renderLists() {
        walkDOM(Data, document.body);
    }

    // This function recursively visits each element within the DOM.
    // Without it, we're unable to recursively interrogate each DOM node.
    function walkDOM(scope, node) {
        var s;

        while (node != null) {
            s = whichSelector(node, selectors);
            if (s) return bindDataToList(scope, s, node);
            walkDOM(scope, node.firstElementChild);
            node = node.nextElementSibling;
        }
    }

    // This function binds given data to the given node.
    // Without it, it's content would be nested within a while loop.
    function bindDataToList(scope, selector, node) {
        var d = indexBySel[selector];
        var a = getValues(scope, arg1s[d], defaultDecoratorFactory);
        var b = getValues(scope, arg2s[d], defaultDecoratorFactory);
        var c = getValues(scope, arg3s[d], defaultDecoratorFactory);
        var f = execDecoratorWithArgs.bind(null, d, a, b, c);
        var v = getValues(scope, paths[d], f);
        var p = node.parentNode;
        var n = node;
        var o = [];
        var i = 0;
        var h;

        while (matchesSelector(n, selector)) {
            o.push(n);
            n = n.nextElementSibling;
        }

        while (o.length > v.length && o.length !== 1) {
            p.removeChild(o.pop());
        }

        if (v.length === 0) {
            node.style.display = "none";
            return walkDOM(scope, node.nextElementSibling);
        }

        for (; i < v.length; i++) {
            node = o[i] || p.insertBefore(node.cloneNode(true), node.nextElementSibling);
            walkDOM(v[i], node.firstElementChild);
            h = v[i].$hash.slice(-1)[0].slice(1);
            node.style.display = "";
            v[i].$func(node, h);
        }

        walkDOM(scope, node.nextElementSibling);
    }

    // This function executes decorators per each argument combination.
    // Without it, it's contents would be nested within a loop.
    function execDecoratorWithArgs(index, arg1, arg2, arg3, val0, key0, obj0) {
        var f = factories[index];
        var o, i, j, k, m;

        for (i in arg1) for (j in arg2) for (k in arg3) for(m in f) {
            o = execDecorator(f[m], val0, key0, obj0, arg1[i], arg2[j], arg3[k]);
            if (typeof o === "function") return o;
        }
    }

    // This function executes a chain of decorators with the appropriate arguments.
    // Without it, it's contents would be nested within a loop.
    function execDecorator(factory, val0, key0, obj0, arg1, arg2, arg3) {
        var i1 = arg1.$memo.length - 1;
        var i2 = arg2.$memo.length - 1;
        var i3 = arg3.$memo.length - 1;
        var o1 = arg1.$memo[i1 - 1];
        var o2 = arg2.$memo[i2 - 1];
        var o3 = arg3.$memo[i3 - 1];
        var k1 = arg1.$path[i1];
        var k2 = arg2.$path[i2];
        var k3 = arg3.$path[i3];
        var v1 = arg1.$memo[i1];
        var v2 = arg2.$memo[i2];
        var v3 = arg3.$memo[i3];

        return factory(val0, key0, obj0, v1, k1, o1, v2, k2, o2, v3, k3, o3);
    }

    // This function uses the given path path to return values from the given object.
    // Without it, we're unable to allow plugins to uniformly resolve bindings.
    function getValues(object, path, evalFunc) {
        var h = object.$hash || [];
        var v = object.$memo || [];
        var k = object.$keys || [];
        var x = object.$path || [];
        var p = path.concat();
        var n = p.length;
        var o = [];
        var i = 0;

        object = Data;
        for (; i < n; i++) {
            if (k[i] !== p[i]) break;
            if (p[i] === "") p[i] = x[i];
            if (n !== i + 1) object = v[i];
        }

        v = v.slice(0, i);
        h = h.slice(0, i);
        getValuesRecurse(h, v, path, o, object, p, i, evalFunc);
        return o;
    }

    // This function uses the given path path to return values from the given object.
    // Without it, we're unable to allow plugins to uniformly resolve bindings.
    function getValuesRecurse(hash, memo, keys, values, object, path, offset, evalFunc) {
        var o = object;

        while (offset < path.length) {
            hash[offset] = hash[offset] || hash[offset - 1] || "";

            switch (true) {
            case path[offset] === "":
                return evalEachKey(String);

            case object[path[offset]] instanceof Array:
                hash[offset] += "." + path[offset];
                object = object[path[offset]];
                return evalEachKey(Number);

            case object[path[offset]] == null:
                return;

            default:
                o = object;
                memo[offset] = object[path[offset]];
                hash[offset] += "." + path[offset];
                object = memo[offset];
                offset++;
            }
        }

        function evalEachKey(type) {
            var k = Object.keys(object);
            var p, m, h;
            var i = 0;

            for (i; i < k.length; i++) {
                p = path.concat();
                m = memo.concat();
                h = hash.concat();
                p[offset] = type(k[i]);
                m[offset] = object[k[i]];
                getValuesRecurse(h, m, keys, values, object, p, offset, evalFunc);
            }
        }

        offset = path.length - 1;
        o = evalFunc(memo[offset], path[offset], o);
        o = {$hash: hash, $memo: memo, $keys: keys, $path: path, $func: o};
        if (typeof o.$func === "function") values.push(o);
    }

    // This function returns the CSS selector within the given list that matches the given DOM node.
    // Without it, we're unable to quickly determine whichSelector CSS selector matches a given node.
    function whichSelector(node, selectors) {
        var s = selectors.concat();

        while (s.length > 0) {
            selectors = s.splice(s.length / 2);
            if (!matchesSelector(node, selectors)) continue;
            if (!selectors[1]) return selectors[0];
            s = selectors;
        }
    }

    // This function indicates whether a given node matches a given CSS selector.
    // Without it, we're unable to allow plugins to uniformly determine if nodes match CSS selectors.
    function xBrowserMatchFunc() {
        var e = Element.prototype;
        var f = e.matches
            || e.matchesSelector
            || e.oMatchesSelector
            || e.msMatchesSelector
            || e.mozMatchesSelector
            || e.webkitMatchesSelector;

        return function matchesSelector(node, selector) {
            if (node == null) return false;
            return f.call(node, selector);
        };
    }
}());