var SourceView = Backbone.View.extend({

    initialize:function () {

        this.template = _.template($('.source-details-template').html()); // _.template(tpl.get('source-details'));
        this.model.bind("change", this.render, this);
    },

    render:function (eventName) {
        $(this.el).html(this.template(this.model.toJSON()));
        setDetailsView();
        return this;
    },

    events:{
        "keyup input" : "validate",
        "click .save" : "saveSource",
        "click .delete" : "deleteSource",
        "click .cancel" : "cancel"
    },

    validate:function () {
        var formValid = true;
        formValid = validateIP(this.model.isNew()) && formValid;
        formValid = validateElValueNotNull('#name') && formValid;
        formValid = validateElValueNotNull('#username') && formValid;
        formValid = validateElValueNotNull('#password') && formValid;
        formValid = validatePassword() && formValid;

        if ( formValid ) $('.save').prop('disabled', false);
    },

    saveSource:function () {
        var now = new Date().toLocaleString();
        var pass = this.model.get('password');
        var passChanged = false;
        if ( pass !== $('#password').val() ) {
            passChanged = true;
        }

        this.model.set({
            ip:$('#sourceIp').val(),
            name:$('#name').val(),
            domain:$('#domain').val(),
            username:$('#username').val(),
            password:passChanged? md5($('#password').val()) : pass,
            lastmodifieddate:now,
            tags:$('#tags').val()
        });

        if (this.model.isNew()) {
            console.log("INFO: New model save");
            this.model.set({
                addeddate:now
            });
            var self = this;
            app.sourceList.create(this.model, {type: 'POST',
                success:function () {
                    this.$el.empty();
                    console.log("INFO: created new source");
                },
                error:function () {
                    console.log("ERROR: failed creating new source");
                }
            });
        } else {
            console.log("INFO: Existing model save");
            this.model.save(null, {type: 'PATCH'});
        }
        app.navigate('', true);
        setListView();
        return false;
    },

    deleteSource:function () {
        this.model.destroy({
            success:function () {
                alert('Source deleted successfully');
            }
        });
        app.navigate('', true);
        setListView();
        return false;
    },

    cancel:function () {
        app.navigate('', true);
        setListView();
    }

});
