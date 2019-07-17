var perPage = 25;
var currentPage = 1;
var totalPages = 1;

var existingIPs = [];
var existingTags = [];
var typeAheadSrc = [];

function setPage(page) {
    currentPage = page;
    setListView();
}

function filter() {
    var collection = app.sourceList;
    var pageCollection = new SourceCollection();

    var filterIP =  $('#filterIP').val();
    var filterName =  $('#filterName').val();
    var filterTags =  $('#filterTags').val();

    for (var i=0; i<collection.length; i++) {
        var item = collection.models[i];
        var ip = item.get('ip');
        var name = item.get('name');
        var tags = item.get('tags') ? item.get('tags') : "";

        if ( (!filterIP || ip.includes(filterIP)) && (!filterName || name.includes(filterName)) && (!filterTags || tags.includes(filterTags))) {
            pageCollection.add(item);
        }
    }
    paginate(pageCollection);

}

function paginate(filteredCollection) {
    var minItem = ( currentPage - 1 )*perPage;
    var maxItem = currentPage*perPage;
    var collection = app.sourceList;
    var pageCollection = new SourceCollection();

    // Hide all to start with
    for (var i=0; i<collection.length; i++) {
        var id = collection.models[i].get('id');
        $('.id' + id).parent().parent().hide();
    }

    for ( var i=0; i<filteredCollection.length; i++ ) {
        if ( i >= minItem && i < maxItem ) {
            var item = filteredCollection.models[i];
            var id = item.get('id');
            $('.id' + id).parent().parent().show();
            pageCollection.add(item);
        }
    }
    displayPagination(filteredCollection);
    return pageCollection;
}

function displayPagination(collection) {
    $('.pagination').html('');
    totalPages = Math.floor(collection.length / perPage );
    if ( collection.length % perPage ) totalPages += 1;
    for (var i=1; i<=totalPages; i++) {
        var active = i==currentPage ? ' activePage' : '';
        var pageNumItem = "<span class='page"+ active + "' onclick='setPage("+i+")'>" + i + "</span>";
        $('.pagination').append(pageNumItem);
        $('.pagination').show();
    }
}

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

function updateGlobalParameters() {
    existingIPs = [];
    _.each(app.sourceList.models, function(model) {
        existingIPs.push(model.get('ip'));
        var tagArray = getTagsArrayFromString(model.get('tags'));
        addTagsArrayToExistingTags(tagArray);
    });
    updateTypeAhead();
}

function setDetailsView(view) {
    if (view) view.validate();
    $('.typeahead').typeahead({source: typeAheadSrc});
    $('.content').show();
    $('.table').hide();
    $('.header-row').hide();
    $('.wrong-format-ip').hide();
    $('.duplicate-ip').hide();
    $('.pagination').hide();

}

function setListView() {
    $('.content').hide();
    $('.table').show();
    $('.header-row').show();
    filter();
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