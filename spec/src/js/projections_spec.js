describe("Projections", function() {
  	var Projections = require('../../../js/projections_module');

    it("should map string to add", function() {
    var result = Projections.add;
    expect(result).toEqual(String);

  });

 });