(function () {
    "use strict";

    Bindings.add({
        "div.example":                                   ["example"],
        "div.example input.name":                        ["example.name", genericTextInput],
    });

    function criteriaList(val, key, obj, val2) {
        return function (elem, path) {
            var e = val2.$criteria[path] || elem;
            if (e.parentNode == null) e = elem;
            val2.$criteria[path] = e;
        };
    }
    
    function ruleSortAscending(val, key, obj) {
        return function(elem) {
            elem.checked = val === 1;
            elem.onchange = function() {
                obj[key] = elem.checked ? 1 : -1;
            }
        };
    }
    
    function genericTextInput(val, key, obj) {
        return function(elem) {
            elem.value = val != null ? val : "";
            elem.oninput = function() {
                obj[key] = elem.value;
            };
            console.log('genericTextInput', val, key, obj)
        };
    }

    function genericNumberInput(val, key, obj) {
        return function(elem) {
            elem.value = parseInt(val) || 0;
            elem.oninput = function () {
                obj[key] = parseInt(elem.value) || 0;
            };
        };
    }

    function genericKeyInput(val, key, obj) {
        return function(elem) {
            elem.value = key != null ? key : "";
            elem.oninput = function () {
                obj[elem.value] = val;
                delete obj[key];
            };
        };
    }

    function ruleSortKeyOption(val, key, obj, val2, key2, obj2) {
        if (val.sortBy) return function(elem) {
            elem.selected = key === val2;
            elem.text = val.label;
            elem.value = key;
        }
    }

    function ruleFilterFieldOption(val, key, obj, val2, key2, obj2) {
        if (val.filterBy) return function(elem) {
            elem.selected = key === key2;
            elem.text = val.label;
            elem.value = key;
        }
    }

    function ruleFilterNumber(val, key, obj, val2, key2, obj2, val3) {
        if (val3[key].kind === Number) return function(elem) {
            elem.value = parseInt(val2) || 0;
            elem.onchange = function() {
                obj2[key2] = parseInt(elem.value) || 0;
            };
        };
    }

    function ruleFilterString(val, key, obj, val2, key2, obj2, val3) {
        if (val3[key].kind === String) return function(elem) {
            elem.value = val2 != null ? val2 : "";
            elem.onchange = function() {
                obj2[key2] = elem.value;
            };
        };
    }

    function ruleFilterBoolean(val, key, obj, val2, key2, obj2, val3) {
        if (val3[key].kind === Boolean) return function(elem) {
            elem.value = val2 === true;
            elem.onchange = function() {
                obj2[key2] = elem.value === "true";
            };
        };
    }

    function ruleFilterOperatorOption(val, key, obj, val2, key2, obj2, val3, key3, obj3) {
        if (val.fields.indexOf(key2) !== -1) return function(elem) {
            elem.selected = key === key3;
            elem.text = val.label;
            elem.value = key;
        }
    }

    function ruleFilterField(val, key, obj) {
        if (val !== null) return function(elem) {
            elem.value = key != null ? key : "";
            // This function renames the target field, while spiting it's nested object accordingly.
            // If it didn't, the field's nested values would be lost.
            elem.oninput = function () {
                var o = obj[elem.value] || {};     // get target object
                var s = Object.keys(obj);          // get list of field names
                var k = Object.keys(val);          // get list of nested field names
                var i = s.indexOf(key);            // get index of old field name
                var f = elem.value;

                if (k.length < 2) delete obj[key]; // delete old object if it will be empty
                obj[elem.value] = o;               // add value to target field
                o[k[i]] = val[k[i]];               // add nested field to the target object
                delete val[k[i]];                  // delete nested field from old object
            }
        };
    }

    function draggableListItem(val, key, obj) {
        return function(elem) {
            elem.onmousedown = function(e) {
                if (e.target !== elem) return;
                addEventListener("mousemove", handleMouseMove, false);
                addEventListener("mouseup", handleDragEnd, false);
                addEventListener("blur", handleDragEnd, false);
                e.stopPropagation();
                e.preventDefault();
            };
            function handleDragEnd() {
                removeEventListener("mousemove", handleMouseMove);
                removeEventListener("mouseup", handleDragEnd);
                removeEventListener("blur", handleDragEnd);
                Bindings.render();
            }
            function handleMouseMove(e) {
                var r = elem.getBoundingClientRect();
                if (obj[key - 1] != null && e.clientY < r.top) {
                    elem.parentNode.insertBefore(elem, elem.previousElementSibling);
                    obj.splice(key - 1, 2, val, obj[key - 1]);
                    key -= 1;
                }
                if (obj[key + 1] != null && e.clientY > r.bottom) {
                    elem.parentNode.insertBefore(elem.nextElementSibling, elem);
                    obj.splice(key, 2, obj[key + 1], val);
                    key += 1;
                }
            }
        };
    }
}());