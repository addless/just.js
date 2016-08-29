(function () {
    'use strict';

    Just.bind('rules.list')                                                                       .to('.rule');
    Just.bind('rules.list')                                                                       .to('.separator');
    Just.bind('rules.list.id')                                                                    .to('.rule .name')                      .as(genericTextInput);
    Just.bind('rules.list.groups')                                                                .to('.rule .group');
    Just.bind('rules.list.groups.sort')                                                           .to('.rule .sort')                      .as(draggableListItem);
    Just.bind('rules.list.groups.sort.dir')                                                       .to('.rule .sort .dir')                 .as(genericNumberInput);
    Just.bind('rules.list.groups.sort.dir')                                                       .to('.rule .sort .ascending')           .as(ruleSortAscending);
    Just.bind('rules.list.groups.sort.key')                                                       .to('.rule .sort .key')                 .as(genericTextInput);
    Just.bind('fields.').with('rules.list.groups.sort.key')                                       .to('.rule .sort .key option')          .as(ruleSortKeyOption);
    Just.bind('rules.list.groups.include..')                                                      .to('.rule .filter');
    Just.bind('rules.list.groups.include.')                                                       .to('.rule .filter .field')             .as(ruleFilterField);
    Just.bind('fields.').with('rules.list.groups.include.')                                       .to('.rule .filter .field option')      .as(ruleFilterFieldOption);
    Just.bind('rules.list.groups.include..')                                                      .to('.rule .filter .operator')          .as(genericKeyInput);
    Just.bind('operators.').with('rules.list.groups.include.').and('rules.list.groups.include..') .to('.rule .filter .operator option')   .as(ruleFilterOperatorOption);
    Just.bind('rules.list.groups.include.').with('rules.list.groups.include..').and('fields')     .to('.rule .filter .boolean')           .as(ruleFilterBoolean);
    Just.bind('rules.list.groups.include.').with('rules.list.groups.include..').and('fields')     .to('.rule .filter .string')            .as(ruleFilterString);
    Just.bind('rules.list.groups.include.').with('rules.list.groups.include..').and('fields')     .to('.rule .filter .number')            .as(ruleFilterNumber);
    Just.bind('rules.list.groups.skip')                                                           .to('.rule .paging .skip')              .as(genericNumberInput);
    Just.bind('rules.list.groups.limit')                                                          .to('.rule .paging .limit')             .as(genericNumberInput);

    function ruleSortAscending(key, obj) {
        return function (elem) {
            elem.checked = obj[key] === 1;
            elem.onchange = function () {
                obj[key] = elem.checked ? 1 : -1;
            }
        };
    }

    function genericTextInput(key, obj) {
        return function (elem) {
            elem.value = obj[key] != null ? obj[key] : '';
            elem.oninput = function () {
                obj[key] = elem.value;
            };
        };
    }

    function genericNumberInput(key, obj) {
        return function (elem) {
            elem.value = parseInt(obj[key]) || 0;
            elem.oninput = function () {
                obj[key] = parseInt(elem.value) || 0;
            };
        };
    }

    function genericKeyInput(key, obj) {
        return function(elem) {
            elem.value = key != null ? key : '';
            elem.oninput = function () {
                obj[elem.value] = obj[key];
                delete obj[key];
            };
        };
    }

    function ruleSortKeyOption(key, obj, key2, obj2) {
        if (obj[key].sortBy) return function(elem) {
            elem.selected = key === obj2[key2];
            elem.text = obj[key].label;
            elem.value = key;
        }
    }

    function ruleFilterFieldOption(key, obj, key2, obj2) {
        if (obj[key].filterBy) return function(elem) {
            elem.selected = key === key2;
            elem.text = obj[key].label;
            elem.value = key;
        }
    }

    function ruleFilterNumber(key, obj, key2, obj2, key3, obj3) {
        if (obj3[key3][key].kind === Number) return function(elem) {
            elem.value = parseInt(obj2[key2]) || 0;
            elem.onchange = function() {
                obj2[key2] = parseInt(elem.value) || 0;
            };
        };
    }

    function ruleFilterString(key, obj, key2, obj2, key3, obj3) {
        if (obj3[key3][key].kind === String) return function(elem) {
            elem.value = obj2[key2] != null ? obj2[key2] : '';
            elem.onchange = function() {
                obj2[key2] = elem.value;
            };
        };
    }

    function ruleFilterBoolean(key, obj, key2, obj2, key3, obj3) {
        if (obj3[key3][key].kind === Boolean) return function(elem) {
            elem.value = obj2[key2] === true;
            elem.onchange = function() {
                obj2[key2] = elem.value === 'true';
            };
        };
    }

    function ruleFilterOperatorOption(key, obj, key2, obj2, key3, obj3) {
        if (obj[key].fields.indexOf(key2) !== -1) return function(elem) {
            elem.selected = key === key3;
            elem.text = obj[key].label;
            elem.value = key;
        }
    }

    function ruleFilterField(key, obj) {
        if (obj[key] !== null) return function(elem) {
            elem.value = key != null ? key : '';
            // This function renames the target field, while splitting it's nested object accordingly.
            // If it didn't, the field's nested values would be lost.
            elem.oninput = function () {
                var o = obj[elem.value] || {};     // get target object
                var s = Object.keys(obj);          // get list of field names
                var k = Object.keys(obj[key]);     // get list of nested field names
                var i = s.indexOf(key);            // get index of old field name

                if (k.length < 2) delete obj[key]; // delete old object if it will be empty
                obj[elem.value] = o;               // add value to target field
                o[k[i]] = obj[key][k[i]];          // add nested field to the target object
                delete obj[key][k[i]];             // delete nested field from old object
            }
        };
    }

    function draggableListItem(key, obj) {
        return function (elem) {
            elem.onmousedown = function (e) {
                if (e.target !== elem) return;
                addEventListener('mousemove', handleMouseMove, false);
                addEventListener('mouseup', handleDragEnd, false);
                addEventListener('blur', handleDragEnd, false);
                e.stopPropagation();
                e.preventDefault();
            };

            function handleDragEnd() {
                removeEventListener('mousemove', handleMouseMove);
                removeEventListener('mouseup', handleDragEnd);
                removeEventListener('blur', handleDragEnd);
                Just.render();
            }

            function handleMouseMove(e) {
                var r = elem.getBoundingClientRect();
                if (obj[key - 1] != null && e.clientY < r.top) {
                    elem.parentNode.insertBefore(elem, elem.previousElementSibling);
                    obj.splice(key - 1, 2, obj[key], obj[key - 1]);
                    key -= 1;
                }
                if (obj[key + 1] != null && e.clientY > r.bottom) {
                    elem.parentNode.insertBefore(elem.nextElementSibling, elem);
                    obj.splice(key, 2, obj[key + 1], obj[key]);
                    key += 1;
                }
            }
        }
    }
}());