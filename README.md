# just.js
<<<<<<< HEAD
Javascript data binding. Nothing more. Nothing less.
=======
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
Just.use({
    todos: {
        next: '',
        list: ['stay calm', 'return stapler']
    }
})
```

Describe bindings via dot-notation and CSS selectors.
```javascript
Just.bind('todos.list') .to('.todo');
Just.bind('todos.list') .to('.todo-text');
Just.bind('todos.list') .to('.todo-status')    .as(status);
Just.bind('todos.next') .to('.next-todo-text') .as(text);
Just.bind('todos')      .to('.add-todo')       .as(addButton);

function status(i, list) {
    return function(elem) {
        elem.checked = false;
        elem.onchange = function() { list.splice(i, 1) };
    }
}

function text(i, list) {
    return function(elem) {
        elem.oninput = function() { list[i] = elem.value };
        if (document.activeElement !== elem) elem.value = list[i];
    }
}

function addButton(todos) {
    return function(elem) {
        elem.onclick = function() { todos.list.push(todos.next) };
    }
}
```

###Guiding Principles
1. `just.js` only supports browsers with >1% ussage according to [caniuse.com](http://caniuse.com/usage-table).
1. 100% of `just.js`'s code is exercised by every page where it is used.
1. `just.js` doesn't require any third-party-fameworks.
1. `just.js` doesn't require any special HTML markup.
>>>>>>> origin/NGDC-1993
