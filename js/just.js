var Just = (function() {
    "use strict";

    // Retrieves data.  This placeholder is redefined on-the-fly.
    var getData = function(){ return [] };
    // Cross browser Element.matches implementation; see https://goo.gl/3n6CSR
    var matchesSelector = xBrowserMatchFunc();
    // Each key is a CSS selector, and each value is an array of data paths.
    var pathToPathList = {};
    // Each key is a CSS selector, and each value is a factory function.
    var selectorToFactory = {};
    // Each key is a data path, and each value is an object where each key is a CSS selector.
    var pathToSelector = {};
    // Each key is a CSS selector, and each value is a data path.
    var selectorToPath = {};
    // Each key is a data path, and each value is an array of data path tokens.
    var pathToArg0 = {};
    // Each key is a data path, and each value is an array of data path tokens.
    var pathToArg1 = {};
    // Each key is a data path, and each value is an array of data path tokens.
    var pathToArg2 = {};
    // Each key is a data path, and each value is an array of data path tokens.
    var pathToArg3 = {};
    // Each item is a CSS selector.
    var selectors = [];

    addEventListener("DOMContentLoaded", doRender, false);
    addEventListener("change", handleInput, false);
    addEventListener("input", handleInput, false);

    return Object.create(null, {
        use:    {value: setDataRoot},
        bind:   {value: setDataPath},
        render: {value: doRender}
    });

    // This function de-bounces the view render.
    // Without it, we'd be unable to avoid unnecessary back-to-back rendering.
    function doRender() {
        clearTimeout(doRender.$timeout);
        doRender.$timeout = setTimeout(doRenderRecurse, 80, [], document.body);
    }

    // This function recursively render's the view.
    // Without it, we'd be unable to render nested elements.
    function doRenderRecurse(memo, node) {
        var d0, d1, d2, d3;
        var i0, i1, i2, i3;
        var n = node;
        var e = {};
        var i = {};
        var s;
        var p;
        var f;

        for (; node; node = node.nextElementSibling) {
            s = whichSelector(node, selectors);
            if (!s && !p) doRenderRecurse(memo, node.firstElementChild);
            if (p && p !== selectorToPath[s]) break;
            if (!p) p = selectorToPath[s];
            if (!s) continue;
            e[s] = e[s] || [];
            e[s].push(node);
            i[s] = 0;
        }

        if (p) {
            d0 = getData(memo, pathToArg0[p].concat(), []);
            d1 = getData(memo, pathToArg1[p].concat(), []);
            d2 = getData(memo, pathToArg2[p].concat(), []);
            d3 = getData(memo, pathToArg3[p].concat(), []);
        }

        for (i0 in d0) group: for (s in e) for (i1 in d1) for (i2 in d2) for (i3 in d3) {
            f = selectorToFactory[s](d0[i0].$val, d0[i0].$key, d0[i0].$obj, d1[i1].$val, d1[i1].$key, d1[i1].$obj, d2[i2].$val, d2[i2].$key, d2[i2].$obj, d3[i3].$val, d3[i3].$key, d3[i3].$obj);
            e[s][0].$original = e[s][0].$original || e[s][0].cloneNode(true);
            if (f) evalListItem(e[s][i[s]] || newListItem());
            if (!f) continue;
            continue group;
        }

        function newListItem() {
            var c = e[s][0].$original.cloneNode(true);
            return n.parentNode.insertBefore(c, n.nextElementSibling);
        }

        function evalListItem(elem) {
            f(elem);
            n = elem;
            i[s] += 1;
            elem.style.display = "";
            doRenderRecurse(d0[i0].$path, elem.firstElementChild);
        }

        for (s in e) while (n = e[s][i[s]]) {
            if (i[s]) n.parentNode.removeChild(n);
            if (!i[s]) n.style.display = "none";
            i[s]++;
        }

        if (node) {
            doRenderRecurse(memo, node);
        }
    }

    // This function handles input/change events from HTMLElements that have onchange/oninput defined.
    // Without it, we're unable to re-render in response to user input.
    function handleInput(event) {
        var n = "on" + event.type;
        if (!event.target[n]) return;
        clearTimeout(doRender.$wait);
        doRender.$wait = setTimeout(doRender, 80);
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

    // This function sets the root data node that will be used during rendering.
    // Without it, we're unable to define the data that will appear within the view.
    function setDataRoot(data) {
        getData = getDataRecurse.bind(undefined, 0, undefined, data);
    }

    // This function retrieves data recursively.
    // Without it, we're unable to resolved dot-notation data paths.
    function getDataRecurse(i, obj, val, memo, path, out) {
        switch (true) {
        case val == null:
            break;

        case val instanceof Array:
            path.splice(i, 0, "");
            getEachKey(Number);
            break;

        case i === path.length:
            out.push({$key: path[i - 1], $val: val, $obj: obj, $path: path});
            break;

        case path[i] === "":
            getEachKey(String);
            break;

        case val[path[i]] == null:
            break;

        default:
            if (memo[i] !== path[i]) memo = path;
            return getDataRecurse(i + 1, val, val[path[i]], memo, path, out);
        }

        return out;

        function getEachKey(type) {
            var h = val.hasOwnProperty(memo[i]);
            var k, n, p;

            if (!h) k = Object.keys(val);
            if (h) k = [memo[i]];

            for (n = 0; n < k.length; n++) {
                p = path.concat();
                p[i] = type(k[n]);
                getDataRecurse(i + 1, val, val[p[i]], memo, p, out);
            }
        }
    }

    // This function adds a new data binding.
    // Without it, we're unable to define relationships between data and view elements.
    function setDataPath(path) {
        var paths = [path];
        return {to: setSelector, with: addPath};

        function addPath(path) {
            paths.push(path);
            return {to: setSelector, and: addPath};
        }

        function setSelector(selector) {
            if (selectorToPath[selector]) throw Error("CSS selector cannot be reused: " + selector);
            pathToArg0[paths] = paths[0] ? paths[0].split(".") : [];
            pathToArg1[paths] = paths[1] ? paths[1].split(".") : [];
            pathToArg2[paths] = paths[2] ? paths[2].split(".") : [];
            pathToArg3[paths] = paths[3] ? paths[3].split(".") : [];
            pathToSelector[paths] = pathToSelector[paths] || {};
            selectorToFactory[selector] = defaultFactory;
            selectorToPath[selector] = paths.toString();
            selectors = Object.keys(selectorToFactory);
            pathToSelector[paths][selector] = true;
            return {as: getFactory};

            function defaultFactory() {
                return defaultFactory;
            }

            function getFactory(factory) {
                selectorToFactory[selector] = factory;
            }
        }
    }
}());