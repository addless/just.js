var Just = (function constructor(rootEl) {
    'use strict';

    var dir2Fnc = {__proto__: null}; // maps directive IDs to functions
    var cls2Dir = {__proto__: null}; // maps class names to directive IDs
    var dir2Dir = {__proto__: null}; // maps directive IDs to directive IDs
    var get2Arg = {__proto__: null}; // maps getter IDs to argument data paths
    var dir2Arg = {__proto__: null}; // maps directive IDs to argument data paths
    var dir2Esc = {__proto__: null}; // maps directive IDs to argument escape flags
    var rootObj = {__proto__: null}; // root object of the shared data model
    var idBase = Date.now();         // base number used to generate all binding ids
    var rendering;                   // indicates whether we're rendering

    return Object.freeze(Object.defineProperties(Just, {
        data:  {value: bindData},
        with:  {value: bindWith},
        each:  {value: bindEach},
        some:  {value: bindSome},
        _args: {value: get2Arg}
    }));

    // This is the returned constructor
    // Without it, we have no way of creating separate instances of Just.
    function Just(root) { return constructor(root) }

    // This function alters the data associated with bindings, and then re-renders the view.
    // Without it, we're unable to re-render the view with different data.
    function bindData(val) {
        setData(rootObj, val);
        render();
    }

    // This function recursively alters the given data .
    // Without it, we're unable to alter specific data associated within bindings.
    function setData(obj, val) {
        var k = Object.keys(val);
        var i = -1;

        if (obj == null) return val;
        if (typeof obj !== 'object') return val;
        while (k[++i]) obj[k[i]] = setData(obj[k[i]], val[k[i]]);
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
        var o = this;
        var a = path.split('.');
        var u = o._uuid || (idBase++).toString(36);
        var x = dir2Arg[u] = dir2Arg[u] || [];
        var y = o._args[u] = o._args[u] || [];

        render();
        x[x.length] = y[y.length] = a;
        (dir2Esc[u] = dir2Esc[u] || []).push(0);
        dir2Fnc[u] = function () { return isNaN };
        return {__proto__: this, _uuid: u, call: bindCall, init: bindInit};
    }

    // This function associates a given class with a binding.
    // Without it, we have no way of specifying which classes belong to which bindings.
    function bindWith(clsId) {
        var d = this._dirs || dir2Dir;
        var u = this._uuid || (idBase++).toString(36);

        d[u] = d[u] || {value: {}};
        (cls2Dir[clsId] = cls2Dir[clsId] || []).push(u);
        return {__proto__: this, _uuid: u, call: bindCall, _args: dir2Arg, _dirs: d[u].value};
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
            var r = fnc(key, val);
            return (dir2Fnc[u] = function () { return r })();
        }
    }

    // This function de-bounces the view render.
    // Without it, we'd be unable to avoid unnecessary back-to-back rendering.
    function render() {
        if (rendering) return;

        var arg2Key = {__proto__: null};
        var arg2Obj = {__proto__: null};

        rendering = true;
        cancelAnimationFrame(render.$frame);
        render.$frame = requestAnimationFrame(recurse.bind(null, 0));

        // This function first executes all non-HTML-bound functions,
        // then renders the view.
        function recurse(dirN) {
            var dirId = Object.keys(get2Arg)[dirN];
            var el = rootEl || document.body;
            var memo = {__proto__: null};

            switch (true) {
            case dirId != null:
                visitArgs(arg2Key, arg2Obj, [], memo, dirId, dir2Fnc[dirId]);
                return recurse(dirN + 1);

            default:
                renderList(Object.create(null, dir2Dir), memo, null, el.firstElementChild);
                rendering = false;
            }
        }
    }

    // This function render's elements in accordance with their bindings.
    // Without it, we have no way of rendering elements in accordance within bindings
    function renderList(dir2Dir, memo, argId, prvEl) {
        var parent = Object(prvEl).parentNode;
        var arg2Key = {__proto__: null};
        var arg2Obj = {__proto__: null};
        var dir2Dec = {__proto__: null};
        var typ2Gen = {__proto__: null};
        var typ2Els = {__proto__: null};
        var typ2Dir = {__proto__: null};
        var typ2Mem = {__proto__: null};

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
                typ2Mem[typId] = typ2Mem[typId] || [];
                typ2Dir[typId] = typ2Dir[typId] || typId;
                (typ2Els[typId] = typ2Els[typId] || []).push(el);
                typ2Gen[typId] = typ2Els[typId][0].$gen = typ2Els[typId][0].$gen || el.cloneNode(true);
            }

            function move2NextEl() {
                if (el.nextElementSibling == null) return;
                addEl([], dir2Dir, el.nextElementSibling, 0, 0);
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
                visitArgs(arg2Key, arg2Obj, typ2Mem[typId], memo, dirId, addDec);
            }

            function addDec(vals, keys, valN) {
                var dec = dir2Fnc[dirId](vals, keys);
                if (typeof dec !== 'function') dec = null;
                dir2Dec[dirId].push(dec);
                return dec;
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
                if (typ2Dir[typId].length === dirN + 1) renderList(dir2Dir, typ2Mem[typId][valN], null, el.firstElementChild);
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
    function visitArgs(arg2Key, arg2Obj, memos, memo, dirId, cb) {
        var keys = [];
        var objs = [];

        return recurse(0, 0);

        // This function recursively calls the given callback per every argN, valN combination.
        // Without it, we're unable to ensure that the callback is given every combination it expects.
        function recurse(argN, valN) {
            var argId = dir2Arg[dirId][argN];
            var k, o;

            switch (true) {
            case argId == null:
                return;

            case arg2Key[argId] == null:
                arg2Key[argId] = [];
                arg2Obj[argId] = [];
                visitVals(rootObj, null, 0, argId.slice(), argId, memo);
            }

            switch (true) {
            case arg2Key[argId][valN] == null:
                return;

            default:
                keys[argN] = arg2Key[argId][valN];
                objs[argN] = arg2Obj[argId][valN];
            }

            switch (true) {
            case dir2Arg[dirId][argN + 1] != null:
                return recurse(argN + 1, 0) && dir2Esc[dirId][argN] || recurse(argN, valN + 1);

            default:
                k = keys.slice();
                o = objs.slice();
                return cb(toVal, toKey, valN) && dir2Esc[dirId][argN] || recurse(argN, valN + 1);
            }

            function toVal(argN, val) {
                if (o[argN] == null) throw Error('bad value index: ' + argN);
                if (arguments.length < 2) return o[argN][k[argN]];
                o[argN][k[argN]] = setData(o[argN][k[argN]], val);
                render();
            }

            function toKey(argN, key) {
                if (o[argN] == null) throw Error('bad key index: ' + argN);
                if (arguments.length < 2) return k[argN];
                var x = Object.keys(o[argN]);
                var i = x.indexOf(k[argN]);
                var y = x.slice();
                var v;

                y[i] = key;
                render();

                for (i; x[i]; i++) {
                    v = o[argN][x[i]];
                    delete o[argN][x[i]];
                    o[argN][y[i]] = v;
                }
            }
        }

        // This function resolves a dot notation data path in a recursive one-to-many manner.
        // Without it, we have no way of accessing values associated with dot notation data paths.
        function visitVals(val, obj, i, valId, argId, memo) {
            switch (true) {
            case val == null:
                return;

            case i === valId.length:
                memos.push(memo);
                arg2Obj[argId].push(obj);
                arg2Key[argId].push(valId[i - 1]);
                return;

            case valId[i] === '':
                return getEachKey(val instanceof Array);

            case val[valId[i]] != null:
                return visitVals(val[valId[i]], val, i + 1, valId, argId, memo);

            case val instanceof Array:
                valId.splice(i, 0, null);
                return getEachKey(true);
            }

            function getEachKey(isArray) {
                var n = -1;
                var m = memo;
                var s = valId.slice(0, i);
                var t = isArray ? Number : String;
                var k = m[s] != null ? [m[s]] : Object.keys(val);

                while (k[++n] != null) {
                    m = {__proto__: memo};
                    m[s] = valId[i] = t(k[n]);
                    visitVals(val[k[n]], val, i + 1, valId, argId, m);
                }
            }
        }
    }
}());