var SourceView = Backbone.View.extend({

    initialize:function () {

        this.template = _.template($('.source-details-template').html()); // _.template(tpl.get('source-details'));
        // console.log("SourceView initialize, this.model=" + this.model.toJSON());
        this.model.bind("change", this.render, this);
    },

    render:function (eventName) {
        // if ( app.currentView ) app.currentView.close();
        $(this.el).html(this.template(this.model.toJSON()));
        $('.content').show();
        $('.table').hide();
        $('.header').hide();
        // this.validate();
        return this;
    },

    events:{
        "keyup input" : "validate",
        "click .save":"saveSource",
        "click .delete":"deleteSource",
        "click .cancel":"cancel"
    },

    validateIP:function () {
        var valid = true;
        var pattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

        // IP present
        if ( !$('#sourceIp').val() ) {
            valid = false;
        }
        // IP in IPv4 format
        if ( !pattern.test($('#sourceIp').val())) {
            valid = false;
            $('.wrong-format-ip').show();
        } else {
            $('.wrong-format-ip').hide();
        }
        // IP unique
        if (this.model.isNew() && existingIPs.includes($('#sourceIp').val())) {
            console.log("Duplicate IP");
            valid = false;
            $('.duplicate-ip').show();
        } else {
            $('.duplicate-ip').hide();
        }

        if ( valid ) {
            $('#sourceIp').removeClass('invalid');
            $('.wrong-format-ip').hide();
            $('.duplicate-ip').hide();
        } else {
            $('#sourceIp').addClass('invalid');
        }
        return valid;
    },

    validateName:function () {
        var valid = true;
        // Name present
        if ( !$('#name').val() ) {
            $('#name').addClass('invalid');
            valid = false;
            console.log("Invalid name");
        } else {
            $('#name').removeClass('invalid');
            console.log("Valid name");
        }
        return valid;
    },

    validate:function () {
        var formValid = true;
        formValid = this.validateIP() && formValid;
        formValid = this.validateName() && formValid;

        if ( !$('#username').val() ) {
            $('#username').addClass('invalid');
            formValid = false;
        } else {
            $('#username').removeClass('invalid');
        }
        if ( !$('#password').val() ) {
            $('#password').addClass('invalid');
            formValid = false;
        } else {
            $('#password').removeClass('invalid');
        }
        if ( !$('#password2').val() || ( $('#password2').val() !== $('#password').val()) ) {
            $('#password2').addClass('invalid');
            formValid = false;
        } else {
            $('#password2').removeClass('invalid');
        }

        if ( formValid ) $('.save').prop('disabled', false);
    },

    saveSource:function () {
        var now = new Date().toLocaleString();
        this.model.set({
            ip:$('#sourceIp').val(),
            name:$('#name').val(),
            domain:$('#domain').val(),
            username:$('#username').val(),
            password:md5($('#password').val()),
            lastmodifieddate:now
        });

        if (this.model.isNew()) {
            console.log("New model save");
            this.model.set({
                addeddate:now
            });
            var self = this;
            app.sourceList.create(this.model, {
                success:function () {
                    this.$el.empty();
                    app.navigate('', true);
                }
            });
        } else {
            console.log("Existing model save");
            app.navigate('', true);
            this.model.save();
        }
        // if ( app.currentView ) app.currentView.close();
        $('.content').hide();
        $('.table').show();
        $('.header').show();

        return false;
    },

    deleteSource:function () {
        this.model.destroy({
            success:function () {
                alert('Source deleted successfully');
                app.navigate('', true); // window.history.back();
            }
        });
        // if ( app.currentView ) app.currentView.close();
        $('.content').hide();
        $('.table').show();
        $('.header').show();
        return false;
    },

    cancel:function () {
        app.navigate('', true);
        // if ( app.currentView ) app.currentView.close();
        $('.content').hide();
        $('.table').show();
        $('.header').show();
    }

});
