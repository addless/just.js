var Just = (function() {
    "use strict";

    var matches = xBrowserMatchFunc(); // Cross browser Element.matches implementation; see https://goo.gl/3n6CSR
    var selectorToFactory = {};        // Each key is a CSS selector, and each value is a factory function.
    var pathToSelector = {};           // Each key is a data path, and each value is an object where each key is a CSS selector.
    var selectorToPath = {};           // Each key is a CSS selector, and each value is a data path.
    var getterNames = [];              // Each item is a getter declaration's name.
    var getterPaths = {};              // Each key is a getter declaration's name, and each value is it's path.
    var getterFuncs = {};              // Each key is a getter declaration's name, and each value is it's function.
    var pathToArg0 = {};               // Each key is a data path, and each value is an array of data path tokens.
    var pathToArg1 = {};               // Each key is a data path, and each value is an array of data path tokens.
    var pathToArg2 = {};               // Each key is a data path, and each value is an array of data path tokens.
    var pathToArg3 = {};               // Each key is a data path, and each value is an array of data path tokens.
    var selectors = [];                // Each item is a CSS selector.
    var data = {};                     // Root object for all data paths.

    addEventListener("DOMContentLoaded", doRender, false);
    addEventListener("change", handleInput, false);
    addEventListener("input", handleInput, false);

    return Object.create(null, {
        get:    {value: setGetterPath},
        use:    {value: setDataRoot},
        bind:   {value: setDataPath},
        render: {value: queueRender}
    });

    // This function de-bounces the view render.
    // Without it, we'd be unable to avoid unnecessary back-to-back rendering.
    function queueRender() {
        clearTimeout(queueRender.$timeout);
        queueRender.$timeout = setTimeout(doRender, 80, true);
    }

    // This function executes the view render.
    // Without it, we'd be unable to initiate the rendering process.
    function doRender() {
        execGetters();
        renderRecursively([], document.body);
    }

    // This function executes each getter declaration.
    // Without it, we'd be unable to mutate the data before displaying it in the view.
    function execGetters() {
        var i = 0;

        for (i; i < getterNames.length; i++) {
            getDataRecurse(0, null, data, [], getterPaths[getterNames[i]].slice(), getterFuncs[getterNames[i]]);
        }
    }

    // This function recursively render's the view.
    // Without it, we'd be unable to render nested elements.
    function renderRecursively(memo, node) {
        var d0, i0, d1, i1, d2, i2, d3, i3;
        var n = node; // The target sibling element
        var e = {};   // Each key is a selector, and each value is an array of associated elements
        var i = {};   // Each key is a selector, and each value is the number of rendered associated elements.
        var s;        // A selector
        var p;        // A data path
        var f;        // A function

        for (; node; node = node.nextElementSibling) {
            s = getMatchingSelector(node, selectors);
            if (s == null && p == null) renderRecursively(memo, node.firstElementChild);
            if (p != null && p !== selectorToPath[s]) break;
            if (p == null) p = selectorToPath[s];
            if (s == null) continue;
            e[s] = e[s] || [];
            e[s].push(node);
            i[s] = 0;
        }

        if (p != null) {
            d0 = getDataRecurse(0, null, data, memo, pathToArg0[p].slice(), []);
            d1 = getDataRecurse(0, null, data, memo, pathToArg1[p].slice(), []);
            d2 = getDataRecurse(0, null, data, memo, pathToArg2[p].slice(), []);
            d3 = getDataRecurse(0, null, data, memo, pathToArg3[p].slice(), []);
        }

        for (i0 in d0) group: for (s in e) for (i1 in d1) for (i2 in d2) for (i3 in d3) {
            f = selectorToFactory[s](d0[i0].$key, d0[i0].$obj, d1[i1].$key, d1[i1].$obj, d2[i2].$key, d2[i2].$obj, d3[i3].$key, d3[i3].$obj);
            e[s][0].$original = e[s][0].$original || e[s][0].cloneNode(true);
            if (f != null) evalListItem();
            if (f == null) continue;
            continue group;
        }

        function evalListItem() {
            var c = e[s][i[s]] || e[s][0].$original.cloneNode(true);

            f(c);
            c.style.display = "";
            n.parentNode.insertBefore(c, n.nextSibling);
            renderRecursively(d0[i0].$memo, c.firstElementChild);
            i[s] += 1; // increment the number of rendered elements associated with this selector
            n = c;     // adopt the current node as the target sibling for the next cycle
        }

        for (s in e) while (n = e[s][i[s]]) {
            if (i[s]) n.parentNode.removeChild(n);
            if (!i[s]) n.style.display = "none";
            i[s]++;
        }

        if (node) {
            renderRecursively(memo, node);
        }
    }

    // This function handles input/change events from HTMLElements that have onchange/oninput defined.
    // Without it, we're unable to re-render in response to user input.
    function handleInput(event) {
        var n = "on" + event.type;
        if (event.target[n]) doRender();
    }

    // This function returns the CSS selector within the given list that matches the given DOM node.
    // Without it, we're unable to quickly determine whichSelector CSS selector matches a given node.
    function getMatchingSelector(node, selectors) {
        var s = selectors.concat();

        while (s.length > 0) {
            selectors = s.splice(s.length / 2);
            if (!matches(node, selectors)) continue;
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
    function setDataRoot(obj) { data = obj }

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
            applyOutput();
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

        function applyOutput() {
            if (typeof out === "function") return out(path[i - 1], obj, path.join("."));
            if (out instanceof Array) out.push({$key: path[i - 1], $obj: obj, $memo: path});
        }

        function getEachKey(type) {
            var n, p;
            var h = val.hasOwnProperty(memo[i]);
            var k = h ? [memo[i]] : Object.keys(val);

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

    // This function defines a data pre-processor declaration.
    // Without it, we're unable to pre-process data before displaying it within the view.
    function setGetterPath(path) {
        return {as: setGetterFunc};

        function setGetterFunc(func) {
            if (getterPaths[path]) throw Error("Getter path cannot be reused: " + path);
            getterPaths[path] = path.split(".");
            getterNames = Object.keys(getterPaths);
            getterNames.sort().reverse();
            getterFuncs[path] = func;
        }
    }
}());