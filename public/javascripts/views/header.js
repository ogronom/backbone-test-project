window.HeaderView = Backbone.View.extend({

    initialize:function () {
        this.template = _.template($('.header-template').html()); // tpl.get('header'));
    },

    render:function (eventName) {
        $(this.el).html(this.template());
        return this;
    },

    events:{
        "click .new":"newSource"
    },

    newSource:function (event) {
        app.navigate("sources/new", true);
        return false;
    }

});