var sources = new SourceCollection();

var SourceListItemView = Backbone.View.extend({
    model: new Source(),
    tagName: 'tr',
    initialize: function () {
        this.template = _.template($('.sources-list-template').html()); // _.template(tpl.get('source-list-item')); //_
        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
    },
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },
    events:{ "click .edit-source": "editSource"},

    editSource:function (event) {
        app.navigate("sources/"+this.model.id, true);
        setDetailsView();
        return false;
    }
});

var SourceListView = Backbone.View.extend({
    model: sources,
    el: $('.sources-list'),
    initialize: function () {
        this.model.bind("reset", this.render, this);
        var self = this;
        this.model.bind("add", function (source) {
            $(self.el).append(new SourceListItemView({model:source}).render().el);
            updateGlobalParameters();
        });
        this.model.fetch({
            success: function (response) {
                sources.reset();
                _.each(response.toJSON(), function (item) {
                    sources.add(item);
                })
            },
            error: function () { console.log('Failed to get sources.');}
        });
    },
    render: function () {
        var self = this;
        this.$el.html('');
        _.each(this.model.toArray(), function (source) {
            self.$el.append((new SourceListItemView({model: source})).render().$el);
        });
        setListView();
        updateGlobalParameters();
        return this;
    }
});

var sourcesList = new SourceListView();

