// window.SourceListView = Backbone.View.extend({
// //
// //     tagName:  'ul',
// //
// //     initialize:function () {
// //         console.log("####### Initializing Source List view.");
// //         this.model.bind("reset", this.render, this);
// //         var self = this;
// //         this.model.bind("add", function (source) {
// //             $(self.el).append(new SourceListItemView({model:source}).render().el);
// //         });
// //     },
// //
// //     render:function (eventName) {
// //         _.each(this.model.models, function (source) {
// //             $(this.el).append(new SourceListItemView({model:source}).render().el);
// //         }, this);
// //         return this;
// //     }
// // });
// //
// // window.SourceListItemView = Backbone.View.extend({
// //
// //     tagName: "li", // $('.sources-list'),
// //
// //     initialize:function () {
// //         this.template = _.template(tpl.get('source-list-item'));
// //         this.model.bind("change", this.render, this);
// //         this.model.bind("destroy", this.close, this);
// //     },
// //
// //     render:function (eventName) {
// //         $(this.el).html(this.template(this.model.toJSON()));
// //         return this;
// //     }
// //
// // });


var sources = new SourceCollection();

var SourceView = Backbone.View.extend({
    model: new Source(),
    tagName: 'tr',
    initialize: function () {
        this.template = _.template($('.sources-list-template').html()); // _.template(tpl.get('source-list-item'));
    },
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});

var SourceListView = Backbone.View.extend({
    model: sources,
    el: $('.sources-list'),
    initialize: function () {
        // this.model.on('add', this.render, this);
        this.model.bind("reset", this.render, this);
        var self = this;
        this.model.bind("add", function (source) {
            $(self.el).append(new SourceView({model:source}).render().el);
        });
        this.model.fetch({
            success: function (response) {
                _.each(response.toJSON(), function (item) {
                    sources.reset();
                    _.each(item.data, function (dataelement) {
                        sources.add(dataelement);
                    });
                });
            },
            error: function () {
                console.log('Failed to get sources.');
            }
        });
    },
    render: function () {
        var self = this;
        this.$el.html('');
        _.each(this.model.toArray(), function (source) {
            self.$el.append((new SourceView({model: source})).render().$el);
        });
        return this;
    }
});

var sourcesView = new SourceListView();

