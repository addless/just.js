describe("Ajax", function() {

    it("defines a global variable", function() {
        expect(window.Ajax).toBeDefined();
    });

    describe("Ajax#url", function() {
        beforeEach(function() {
            spyOn(window.XMLHttpRequest.prototype, 'open').and.callThrough();
        });
        it("creates a new XMLHttpRequest", function() {
            // NOTE: this is a bunk URL, so will cause a browser error,
            // if phantomjsLauncher.exitOnResourceError is set to true, the browser will crash
            var connection = Ajax.url('http://www.foo.com');
            connection.exec(function() {
                done();
            });
            expect(window.XMLHttpRequest.prototype.open).toHaveBeenCalled();
        });
    });
});
