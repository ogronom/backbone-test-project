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
        // if ( app.currentView ) app.currentView.close();
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },
    events:{
        "click .edit-source": "editSource"
    },

    editSource:function (event) {
        // if ( app.currentView ) app.currentView.close();
        app.navigate("sources/"+this.model.id, true);
        $('.content').show();
        $('.table').hide();
        $('.header').hide();
        return false;
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
            $(self.el).append(new SourceListItemView({model:source}).render().el);
        });
        this.model.fetch({
            success: function (response) {
                _.each(response.toJSON(), function (item) {
                    sources.reset();
                    _.each(item.data, function (source) {
                        sources.add(source);
                    });
                })
            },
            error: function () {
                console.log('Failed to get sources.');
            }
        });
    },
    render: function () {
        // if ( app.currentView ) app.currentView.close();
        $('.table').show();
        var self = this;
        this.$el.html('');
        _.each(this.model.toArray(), function (source) {
            self.$el.append((new SourceListItemView({model: source})).render().$el);
        });
        return this;
    }
});


var sourcesList = new SourceListView();

