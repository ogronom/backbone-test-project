var existingIPs = [];
var existingTags = [];
var typeAheadSrc = [];

function getTagsArrayFromString(str) {
    return  str ? str.split(", ") : [];
}

function addTagsArrayToExistingTags(tagArray) {
    _.each(tagArray, function (tag) {
        if ( !existingTags.includes(tag) ) existingTags.push(tag);
    });
}

function updateTypeAhead() {
    typeAheadSrc = [];
    for (var i=0; i<existingTags.length; i++) {
        typeAheadSrc.push({id: "id"+i, name: existingTags[i]});
    }
}

function setDetailsView(view) {
    if (view) view.validate();
    $('.typeahead').typeahead({source: typeAheadSrc});
    $('.content').show();
    $('.table').hide();
    $('.header').hide();
    $('.wrong-format-ip').hide();
    $('.duplicate-ip').hide();
}

function setListView() {
    $('.content').hide();
    $('.table').show();
    $('.header').show();
}

tpl = {

    // Hash of preloaded templates for the app
    templates:{},

    // Recursively pre-load all the templates for the app.
    // This implementation should be changed in a production environment. All the template files should be
    // concatenated in a single file.
    loadTemplates:function (names, callback) {

        var that = this;

        var loadTemplate = function (index) {
            var name = names[index];
            console.log('Loading template: ' + name);
            $.get('templates/' + name + '.html', function (data) {
                that.templates[name] = data;
                index++;
                if (index < names.length) {
                    loadTemplate(index);
                } else {
                    callback();
                }
            });
        }

        loadTemplate(0);
    },

    // Get template by name from hash of preloaded templates
    get:function (name) {
        return this.templates[name];
    }

};