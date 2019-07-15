window.SourceView = Backbone.View.extend({

    tagName:"div", // Not required since 'div' is the default if no el or tagName specified

    initialize:function () {

        this.template = _.template(tpl.get('source-details'));
        this.model.bind("change", this.render, this);
    },

    render:function (eventName) {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },

    events:{
        "change input":"change",
        "click .save":"saveSource",
        "click .delete":"deleteSource"
    },

    change:function (event) {
        var target = event.target;
        console.log('changing ' + target.id + ' from: ' + target.defaultValue + ' to: ' + target.value);
        // You could change your model on the spot, like this:
        // var change = {};
        // change[target.name] = target.value;
        // this.model.set(change);
    },

    saveSource:function () {
        this.model.set({
            ip:$('#ip').val(),
            name:$('#name').val(),
            domain:$('#domain').val(),
            username:$('#username').val(),
            password:$('#password').val(),
            addeddate:$('#addeddate').val(),
            lastmodifieddate:$('#lastmodifieddate').val()
        });
        if (this.model.isNew()) {
            var self = this;
            app.sourceList.create(this.model, {
                success:function () {
                    app.navigate('sources/' + self.model.id, false);
                }
            });
        } else {
            this.model.save();
        }

        return false;
    },

    deleteSource:function () {
        this.model.destroy({
            success:function () {
                alert('Source deleted successfully');
                window.history.back();
            }
        });
        return false;
    }

});