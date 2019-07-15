var Source = Backbone.Model.extend({
    urlRoot:'http://localhost:8000/api/sources',
    defaults:{
        id:null,
        ip:"",
        name:"",
        domain:"",
        username:"",
        password:"",
        addeddate:"",
        lastmodifieddate:"",
        tags:[]
    }
});

var SourceCollection = Backbone.Collection.extend({
    model: Source,
    url: 'http://localhost:8000/api/sources'
});
