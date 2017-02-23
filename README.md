# just.js

A small data binding library. Nothing more, nothing less.

###Usage
Load `just.js` via a script tag.
```HTML
<script type="text/javascript" src="just.js"></script>
```

Define your HTML view.
```HTML
<div class="todo">
    <input class="todo-status" type="checkbox">
    <span class="todo-text"></span>
</div>
<form class="new-todo">
    <input class="next-todo-text" type="text">
    <button class="add-todo">add todo</button>
</form>
```

Define data.
```javascript
Just.data({
    todos: {
        next: '',
        list: ['stay calm', 'return stapler']
    }
})
```

Describe bindings using classes names, dot-notation, and decorators.
```javascript
Just.with('todo')
    .each('todos.list.');
    
Just.with('todo-text')
    .each('todos.list.');
    
Just.with('todo-status')
    .each('todos.list')
    .each('todos.list.')
    .call(function status(val, key) {
        return function(el) {
          el.checked = false;
          el.onchange = function() { val[0].splice(key[1], 1) };
        }
    });
    
Just.with('next-todo-text')
    .each('todos.next')
    .call(function text(val, key) {
        return function(el) {
            el.oninput = function() { val[0] = el.value };
            if (document.activeElement !== el) el.value = val[0];
        }
    });
    
Just.with('add-todo')
    .each('todos.list')
    .each('todos.next')
    .call(function addButton(val) {
        return function(el) {
            el.onclick = function() { 
                val[0].push(val[1]);
                Just.render();
            };
        }
    });
```

###Guiding Principles
1. `just.js` only supports browsers with >1% ussage according to [caniuse.com](http://caniuse.com/usage-table).
1. 100% of `just.js`'s code is exercised by every page where it is used.
1. `just.js` doesn't require any third-party-fameworks.
1. `just.js` doesn't require any special HTML markup.
