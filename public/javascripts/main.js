Backbone.View.prototype.close = function () {
    // console.log('Closing view ' + this);
    if (this.beforeClose) {
        this.beforeClose();
    }
    this.remove();
    this.unbind();
};

var AppRouter = Backbone.Router.extend({

    initialize:function () {
        $('#header').html(new HeaderView().render().el);
    },

    routes:{
        "":"list",
        "sources/new":"newSource",
        "sources/:id":"sourceDetails"
    },

    list:function () {
        this.before();
    },

    sourceDetails:function (id) {
        this.before(function () {
            if (app.sourceList.get(id)) {
                var source = app.sourceList.get(id);
                var view = app.showView('#content', new SourceView({model: source}));
                setDetailsView(view);
            }
        });
    },

    newSource:function () {
        this.before(function () {
            var view = app.showView('#content', new SourceView({model:new Source()}));
            $('.delete').hide();
            setDetailsView(view);
        });
    },

    showView:function (selector, view) {
        if (this.currentView)
            this.currentView.close();
        $(selector).html(view.render().el);
        this.currentView = view;
        return view;
    },

    before:function (callback) {
        if (this.sourceList) {
            if (callback) callback();
        } else {
            this.sourceList = new SourceCollection();
            this.sourceList.fetch({success:function (response) {
                    updateGlobalParameters();
                    $('.sources-list').html(new SourceListView({model:app.sourceList}).render().el);
                    setListView();
                    if (callback) callback();
                }});
        }
    }

});

app = new AppRouter();
Backbone.history.start();

$(document).ready(function() {
    setTimeout(function() {
        filter();
    }, 300);
});

// tpl.loadTemplates(['header', 'source-details', 'source-list-item'], function () {
//     app = new AppRouter();
//     Backbone.history.start();
// });