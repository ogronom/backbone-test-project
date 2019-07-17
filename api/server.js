// Create express app
var express = require("express");
var app = express();
var db = require("./database.js");
var md5 = require("md5")

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Server port
var HTTP_PORT = 8000;

// Start server
app.listen(HTTP_PORT, function() { console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT)); });


// Allow access for localhost
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', false);

    // Pass to next layer of middleware
    next();
});


// Root endpoint
app.get("/", function(req, res) { res.json({"message":"Ok"});});

// Get the list of sources
app.get("/api/sources", function(req, res) {
    console.log("INFO: received a get request for all sources");
    var sql = "select * from source";
    var params = [];
    db.all(sql, params, function(err, rows) {
        if (err) {
            res.status(400).json({"error":err.message});
            console.log("ERROR: retrieving ALL from sources failed.");
            return;
        }
        // console.log("INFO: retrieved ALL from sources.")
        res.send(rows)
        // res.json({
        //     "message":"success",
        //     "data":rows
        // })
    });
});

// Get a single source by id
app.get("/api/sources/:id", function(req, res) {
    console.log("INFO: received a get request for source id"+req.params.id);
    var sql = "select * from source where id = ?";
    var params = [req.params.id];
    db.get(sql, params, function(err, row) {
        if (err) {
            res.status(400).json({"error":err.message});
            console.log("ERROR: retrieving item from sources failed, id="+req.params.id);
            return;
        }
        console.log("INFO: retrieved item from sources, id="+req.params.id);
        res.send(row);
        // res.json({
        //     "message":"success",
        //     "data":row
        // })
    });
});

// Create a new source
app.post('/api/sources/', function(req, res) {
    console.log("INFO: received a new source save request");
    var data = {
        ip: req.body.ip,
        name: req.body.name,
        domain: req.body.domain ? req.body.domain : '',
        username: req.body.username,
        password : req.body.password,
        addeddate: req.body.addeddate,
        lastmodifieddate: req.body.lastmodifieddate,
        tags: req.body.tags ? req.body.tags : ''
    }
    var sql ='INSERT INTO source (ip, name, domain, username, password, addeddate, lastmodifieddate, tags) VALUES (?,?,?,?,?,?,?,?)';
    var params =[data.ip, data.name, data.domain, data.username, data.password, data.addeddate, data.lastmodifieddate, data.tags];
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message});
            console.log("ERROR: inserting item to sources failed");
            return;
        }
        console.log("INFO: inserting item to sources");
        data.id = this.lastID;
        res.send(data);
        // res.json({
        //     "message": "success",
        //     "data": data,
        //     "id" : this.lastID
        // })
    });
});

// Update an existing user
app.patch("/api/sources/:id", function(req, res) {
    console.log("INFO: received an update request for source id"+req.params.id);
    var data = {
        ip: req.body.ip,
        name: req.body.name,
        domain: req.body.domain ? req.body.domain : '',
        username: req.body.username,
        password : req.body.password,
        lastmodifieddate: req.body.lastmodifieddate,
        tags: req.body.tags
    };
    db.run(
        `UPDATE source set 
           ip =  COALESCE(?,ip),
           name = COALESCE(?,name), 
           domain = COALESCE(?,domain), 
           username = COALESCE(?,username), 
           password = COALESCE(?,password),
           lastmodifieddate = COALESCE(?,lastmodifieddate),
           tags = COALESCE(?,tags), 
           WHERE id = ?`,
        [data.ip, data.name, data.domain, data.username, data.password, data.lastmodifieddate, data.tags, req.params.id],
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                console.log("ERROR: updating item in sources failed, id="+req.params.id);
                return;
            }
            console.log("INFO: updating item in sources, id="+req.params.id);
            res.send(data);
            // res.json({
            //     message: "success",
            //     data: data,
            //     changes: this.changes
            // })
        });
})

// Delete a user
app.delete("/api/sources/:id", function(req, res) {
    console.log("INFO: received a delete request for source id"+req.params.id);
    db.run(
        'DELETE FROM source WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                console.log("ERROR: deleting item from sources failed, id="+req.params.id);
                return;
            }
            console.log("INFO: deleting item from sources, id="+req.params.id);
            res.json({"message":"deleted", changes: this.changes})
        });
})

// Default response for any other request
app.use(function(req, res){
    res.status(404);
});


// var errors=[];
// if (!req.body.ip){
//     errors.push("No ip specified");
// }
// if (!req.body.name){
//     errors.push("No name specified");
// }
// if (!req.body.username){
//     errors.push("No username specified");
// }
// if (!req.body.password){
//     errors.push("No password specified");
// }
//
// if (errors.length){
//     res.status(400).json({"error":errors.join(",")});
//     return;
// }