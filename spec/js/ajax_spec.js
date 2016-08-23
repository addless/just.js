describe('Ajax', function() {

    it('defines a global variable', function() {
        expect(window.Ajax).toBeDefined();
    });

    describe('Ajax#url', function() {
        var request, onSuccess;

        beforeEach(function() {
            // put the mock XMLHttpRequest in place
            jasmine.Ajax.install();
            // set up a spy we can interrogate later
            onSuccess = jasmine.createSpy('onSuccess');
            // and call our "code under test"
            Ajax
                .url('http://example.com/test')
                .method('GET')
                .exec(onSuccess);
            // this gives us a handle on the request to assert against
            request = jasmine.Ajax.requests.mostRecent();
        });

        afterEach(function() {
            jasmine.Ajax.uninstall();
        })

        it('sets the url on the request', function() {
            expect(request.url).toEqual('http://example.com/test');
        });

        it('sets the method for the request', function() {
            expect(request.method).toEqual('GET');
        });

        it('calls the callback with status and parsed response body', function() {
            var expectedResponse = { users: ['Bob', 'Sue'] };
            request.respondWith({
              status: 200,
              responseText: '{ "users": ["Bob","Sue"] }'
            });
            expect(onSuccess).toHaveBeenCalledWith(200, expectedResponse);
        });
    });
});
