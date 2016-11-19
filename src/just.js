var Just = (function constructor(rootEl) {
    'use strict';

    var dir2Fnc = {__proto__: null}; // maps directive IDs to functions
    var cls2Dir = {__proto__: null}; // maps class names to directive IDs
    var dir2Dir = {__proto__: null}; // maps directive IDs to directive IDs
    var get2Arg = {__proto__: null}; // maps getter IDs to argument data paths
    var dir2Arg = {__proto__: null}; // maps directive IDs to argument data paths
    var dir2Esc = {__proto__: null}; // maps directive IDs to argument escape flags
    var rootObj = {__proto__: null}; // root object of the shared data model
    var n2Val = new N2Val();         // Maps argument indexes to assessors that get/set values
    var n2Key = new N2Key();         // Maps argument indexes to assessors that get/set values
    var idBase = Date.now();         // base number used to generate all binding ids
    var isRendering;                 // indicates whether we're rendering

    return Object.freeze(Object.defineProperties(Just, {
        data:   {value: bindData},
        with:   {value: bindWith},
        each:   {value: bindEach},
        some:   {value: bindSome},
        _x2Arg: {value: get2Arg},
        render: {value: render}
    }));

    // This is the returned constructor
    // Without it, we have no way of creating separate instances of Just.
    function Just(root) { return constructor(root) }

    // This function alters the data associated with bindings, and then re-renders the view.
    // Without it, we're unable to re-render the view with different data.
    function bindData(val) {
        rootObj = setData(rootObj, val);
        render();
    }

    // This function recursively alters the given data .
    // Without it, we're unable to alter specific data associated within bindings.
    function setData(obj, val) {
        var i = -1;
        var k;

        switch (true) {
        case typeof val !== 'object':
        case val == null:
        case obj == null:
        case val === obj:
            return val;
        }

        for (k = Object.keys(val); k[++i];) {
            obj[k[i]] = setData(obj[k[i]], val[k[i]]);
        }

        return obj;
    }

    // This function associates a given data path with a binding.
    // Without it, we're unable to specify which data paths belong to which bindings.
    function bindSome(path) {
        var o = bindEach.call(this, path);
        dir2Esc[o._uuid].splice(-1, 1, 1);
        return {__proto__: o, each: void 0};
    }

    // This function associates a given data path with a binding.
    // Without it, we're unable to specify which data paths belong to which bindings.
    function bindEach(path) {
        var u = this._uuid || (idBase++).toString(36); // unique identifier for binding directive
        var y = this._x2Arg[u] = this._x2Arg[u] || [];   // binding directive ids
        var x = dir2Arg[u] = dir2Arg[u] || [];         // binding directive ids

        render();
        (dir2Esc[u] = dir2Esc[u] || []).push(0);
        dir2Fnc[u] = function () { return isNaN };
        x[x.length] = y[y.length] = path.split('.');
        return {__proto__: this, _uuid: u, call: bindCall, init: bindInit};
    }

    // This function associates a given class with a binding.
    // Without it, we have no way of specifying which classes belong to which bindings.
    function bindWith(clsId) {
        var d = this._dirs || dir2Dir;                 // binding directive tree
        var u = this._uuid || (idBase++).toString(36); // binding directive identifier

        (d[u] = d[u] || {__proto__: null}).value = d[u];
        (cls2Dir[clsId] = cls2Dir[clsId] || []).push(u);
        return {__proto__: this, _uuid: u, call: bindCall, _x2Arg: dir2Arg, _dirs: d[u]};
    }

    // This function associates a given function with a binding.
    // Without it, we're unable to specify which functions belong to which bindings.
    function bindCall(fnc) {
        dir2Fnc[this._uuid] = fnc;
        render();
    }

    // This function associates a given function with a binding.
    // Without it, we're unable to specify which functions belong to which bindings.
    function bindInit(fnc) {
        var u = this._uuid;
        dir2Fnc[u] = limit;
        render();

        function limit(key, val) {
            dir2Fnc[u] = Function();
            fnc(key, val);
        }
    }

    // Instances of this class map argument indexes to assessors that get/set values.
    // Without it, bound functions cannot manipulate the data model values in a standard way.
    function N2Val() {
        var argN = 0;
        var props = [];
        while (argN < 10) defineArg(argN++);
        return Object.create(null, props);

        function defineArg(argN) {
            props[argN] = {};
            props[argN].get = function () { return this._obj[argN][this._key[argN]] };
            props[argN].set = function (val) { return this._obj[argN][this._key[argN]] = val };
        }
    }

    // Instances of this class map argument indexes to assessors that get/set keys.
    // Without it, bound functions cannot manipulate the data model keys in a standard way.
    function N2Key() {
        var argN = 0;
        var props = [];
        while (argN < 10) defineArg(argN++);
        return Object.create(null, props);

        function defineArg(argN) {
            props[argN] = {};
            props[argN].get = function () { return this._key[argN] };
            props[argN].set = function (key) {
                var x = Object.keys(this._obj[argN]);
                var i = x.indexOf(this._key[argN]);
                var y = x.slice();

                for (y[i] = key; x[i]; i++) {
                    this._obj[argN][y[i]] = this._obj[argN][x[i]];
                    delete this._obj[argN][x[i]];
                }
            }
        }
    }

    // This function de-bounces the view render.
    // Without it, we'd be unable to avoid unnecessary back-to-back rendering.
    function render() {
        if (isRendering) return;

        var arg2Key = {__proto__: null};
        var arg2Obj = {__proto__: null};
        var arg2Mem = {__proto__: null};

        isRendering = true;
        cancelAnimationFrame(render.$frame);
        render.$frame = requestAnimationFrame(recurse.bind(null, 0));

        // This function first executes all non-HTML-bound functions,
        // then renders the view.
        function recurse(dirN) {
            var dirIds = Object.keys(get2Arg);
            var el = rootEl || document.body;
            var memo = {__proto__: null};

            switch (true) {
            case dirIds[dirN] != null:
                visitArgs(arg2Key, arg2Obj, arg2Mem, memo, dirIds[dirN], dir2Fnc[dirIds[dirN]]);
                return recurse(dirN + 1);

            default:
                renderList(dir2Dir, memo, null, el.firstElementChild);
                isRendering = false;
            }
        }
    }

    // This function render's elements in accordance with their bindings.
    // Without it, we have no way of rendering elements in accordance within bindings
    function renderList(dir2Dir, memo, argId, prvEl) {
        var parent = Object(prvEl).parentNode;
        var arg2Key = {__proto__: null};
        var arg2Obj = {__proto__: null};
        var arg2Mem = {__proto__: null};
        var dir2Mem = {__proto__: null};
        var dir2Dec = {__proto__: null};
        var typ2Gen = {__proto__: null};
        var typ2Els = {__proto__: null};
        var typ2Dir = {__proto__: null};

        switch (true) {
        case prvEl == null:
            return;

        default:
            addEl([], dir2Dir, prvEl, 0, 0);
            bindEl2Dec(Object.keys(typ2Dir), 0, 0, 0, 0);
        }

        // This function adds sibling elements to relevant indexes
        // Without it, we're unable to determine element-to-binding associations
        function addEl(typId, d2d, el, classN, dirN) {
            var clsId = el.classList[classN];
            var dirId = Object(cls2Dir[clsId])[dirN];

            switch (true) {
            case clsId == null:
                addEl2Index();
                move2NextEl();
                return;

            case dirId == null:
            case d2d[dirId] == null:
            case dir2Arg[dirId] == null:
                return addEl(typId, d2d, el, classN + 1, 0);

            case String(dir2Arg[cls2Dir[clsId][0]][0]) !== String(argId):
                return renderList(dir2Dir, memo, dir2Arg[cls2Dir[clsId][0]][0], el);

            default:
                typId[dirId] = true;
                return addEl(typId, Object.create(d2d, d2d[dirId]), el, classN, dirN + 1);
            }

            function addEl2Index() {
                typId = Object.keys(typId);
                if (typId.length === 0) return;
                typ2Dir[typId] = typ2Dir[typId] || typId;
                (typ2Els[typId] = typ2Els[typId] || []).push(el);
                typ2Gen[typId] = typ2Els[typId][0].$gen = typ2Els[typId][0].$gen || el.cloneNode(true);
            }

            function move2NextEl() {
                if (!typId.length) renderList(dir2Dir, memo, null, el.firstElementChild);
                if (el.nextElementSibling) addEl([], dir2Dir, el.nextElementSibling, 0, 0);
            }
        }

        // This function binds elements to their associated decorators
        // Without it, we're unable to duplicate and augment elements in accordance with bindings.
        function bindEl2Dec(types, count, dirN, typN, valN) {
            var typId = types[typN];
            var dirId = Object(typ2Dir[typId])[dirN];

            switch (true) {
            case typId == null:
            case dirId == null:
                return;

            case dir2Dec[dirId] == null:
                dir2Dec[dirId] = [];
                dir2Mem[dirId] = [];
                visitArgs(arg2Key, arg2Obj, arg2Mem, memo, dirId, addDec);
            }

            function addDec(vals, keys, memo) {
                var func = dir2Fnc[dirId](vals, keys);
                if (typeof func !== 'function') func = null;
                dir2Mem[dirId].push(memo);
                dir2Dec[dirId].push(func);
                return func;
            }

            switch (true) {
            case dir2Dec[dirId].length < valN && typ2Els[typId].length < valN:
                break;

            case dir2Dec[dirId][valN] == null && typ2Els[typId][valN] == null:
                count += 1;
                break;

            case dir2Dec[dirId][valN] != null && typ2Els[typId][valN] != null:
                dir2Dec[dirId][valN](typ2Els[typId][valN]);
                insertEl(typ2Els[typId][valN]);
                count += 1;
                break;

            case dir2Dec[dirId][valN] == null && typ2Els[typId][valN] != null:
                removeEl(typ2Els[typId][valN]);
                dirN = Infinity;
                count += 1;
                break;

            case dirN === 0:
                typ2Els[typId][valN] = typ2Gen[typId].cloneNode(true);
                dir2Dec[dirId][valN](typ2Els[typId][valN]);
                insertEl(typ2Els[typId][valN]);
                count += 1;
            }

            function removeEl(el) {
                var l = dir2Dec[typ2Dir[typId][0]].length;
                if (prvEl === el) prvEl = prvEl.nextSibling;
                if (l > valN) return typ2Els[typId].unshift(el);
                if (el.$gen == null) return parent.removeChild(el);
                if (el.$gen != null) return el.style.display = 'none';
            }

            function insertEl(el) {
                el.style.display = '';
                if (prvEl !== el) prvEl = parent.insertBefore(el, prvEl && prvEl.nextSibling);
                if (typ2Dir[typId].length === dirN + 1) renderList(dir2Dir, dir2Mem[dirId][valN], null, el.firstElementChild);
            }

            switch (true) {
            case typ2Dir[typId].length > dirN + 1:
                return bindEl2Dec(types, count, dirN + 1, typN, valN);

            case types.length > typN + 1:
                return bindEl2Dec(types, count, 0, typN + 1, valN);

            case count !== 0:
                return bindEl2Dec(types, 0, 0, 0, valN + 1);
            }
        }
    }

    // This function executes a given callback as many times as specified by the number of arguments.
    // Without it, we're unable to execute decorators in accordance with their associated data paths.
    function visitArgs(arg2Key, arg2Obj, arg2Mem, memo, dirId, cb) {
        var val2Mem = memo;
        var keys = [];
        var objs = [];

        return recurse(0, 0);

        // This function recursively calls the given callback per every argN, valN combination.
        // Without it, we're unable to ensure that the callback is given every combination it expects.
        function recurse(argN, valN) {
            var argId = dir2Arg[dirId][argN];
            var v, k;

            switch (true) {
            case argId == null:
                return;

            case arg2Key[argId] == null:
                arg2Key[argId] = [];
                arg2Obj[argId] = [];
                arg2Mem[argId] = [];
                visitVals(rootObj, null, 0, argId.slice(), argId, memo, {__proto__: null});
            }

            switch (true) {
            case arg2Key[argId][valN] == null:
                return;

            default:
                val2Mem = Object.create(val2Mem, arg2Mem[argId][valN]);
                keys[argN] = arg2Key[argId][valN];
                objs[argN] = arg2Obj[argId][valN];
            }

            switch (true) {
            case dir2Arg[dirId][argN + 1] != null:
                return recurse(argN + 1, 0) && dir2Esc[dirId][argN] || recurse(argN, valN + 1);

            default:
                v = {__proto__: n2Val};
                k = {__proto__: n2Key};
                v._key = k._key = keys.slice();
                v._obj = k._obj = objs.slice();
                return cb(v, k, val2Mem) && dir2Esc[dirId][argN] || recurse(argN, valN + 1);
            }
        }

        // This function resolves a dot notation data path in a recursive one-to-many manner.
        // Without it, we have no way of accessing values associated with dot notation data paths.
        function visitVals(val, obj, i, valId, argId, memo, val2Mem) {
            switch (true) {
            default:
            case val == null:
                return console.warn('Null value at path: ' + valId.slice(i).join('.'));

            case i === valId.length:
                arg2Key[argId].push(valId[i - 1]);
                arg2Mem[argId].push(val2Mem);
                arg2Obj[argId].push(obj);
                return;

            case valId[i] === '':
                return getEachKey(val[0] != null);

            case val[valId[i]] != null:
                return visitVals(val[valId[i]], val, i + 1, valId, argId, memo, val2Mem);

            case val[0] != null:
                valId.splice(i, 0, null);
                return getEachKey(true);
            }

            function getEachKey(isArray) {
                var n = -1;
                var v = valId.slice(0, i);
                var t = isArray ? Number : String;
                var k = memo[v] != null ? [memo[v]] : Object.keys(val);

                while (k[++n] != null) {
                    valId[i] = t(k[n]);
                    val2Mem = {__proto__: val2Mem};
                    val2Mem[v] = {value: valId[i]};
                    visitVals(val[k[n]], val, i + 1, valId, argId, memo, val2Mem);
                }
            }
        }
    }
}());