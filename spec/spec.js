// var jquery = require('../node_modules/jquery/src/jquery');
// var underscore = require('../node_modules/underscore/underscore');
// var backbone = require('../node_modules/backbone/backbone');
// var source = require('../public/javascripts/models/sourcemodel');

describe("Test for Source Model: ", function(){
    beforeEach(function () {
        jquery = new jquery();
        underscore = new underscore();
        backbone = new Backbone();

        source = new Source();
    });

    it("Source was created", function () {
        expect(source).toBeDefined();
    });

    it("Source has id", function () {
        expect(source.get('id')).equals(null);
    })
})