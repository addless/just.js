describe('Just', function() {

    describe('Just#bind', function() {
        var duplicatedNodes;

        // Would like to use beforeEach, but not sure how to "reset" Just context
        // with two assertions, getting error about re-using a selector.
        // This set up means all tests in this suite share a DOM context and
        // instance of Just.js state and data.
        beforeAll(function() {
            // this mocks the browser's setTimeout() method
            jasmine.clock().install();
            // append the fixture to the DOM
            document.body.innerHTML = __html__['spec/fixtures/simple_list.html'];
            // create some data to bind
            Just.use({
                testData: [
                    'Apple',
                    'Banana',
                    'Pear'
                ]
            });
            // bind it to our test fixture
            Just.bind('testData')
                .to('.test-container .test-item')
                .as(function(key, obj) {
                    return function(el) {
                        el.innerHTML = obj[key];
                    }
                });
            // render it
            Just.render();
            // and click past the debounced render
            jasmine.clock().tick(81);
            duplicatedNodes = document.getElementsByClassName('test-item');
        });

        // would like to use afterEach, but not sure how to "reset" Just context
        afterAll(function() {
            jasmine.clock().uninstall();
        })

        it('duplicates a found html element to match the bound data', function() {
            expect(duplicatedNodes.length).toEqual(3);            
        });

        it('passes found elements through the handler for manipulation', function() {
            expect(duplicatedNodes[0].innerHTML).toEqual('Apple');
            expect(duplicatedNodes[1].innerHTML).toEqual('Banana');
            expect(duplicatedNodes[2].innerHTML).toEqual('Pear');
        });

    });
});
