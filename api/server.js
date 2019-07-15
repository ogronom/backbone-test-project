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
app.listen(HTTP_PORT, () => console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT)));


// Allow access for localhost
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', false);

    // Pass to next layer of middleware
    next();
});


// Root endpoint
app.get("/", (req, res, next) => {
    res.json({"message":"Ok"})
});

// Other API endpoints

// Get the list of sources
app.get("/api/sources", (req, res, next) => {
    var sql = "select * from source"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
    });
});

// Get a single source by id
app.get("/api/source/:id", (req, res, next) => {
    var sql = "select * from source where id = ?"
    var params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "data":row
        })
    });
});

// Create a new source
app.post("/api/source/", (req, res, next) => {
    var errors=[]
    if (!req.body.ip){
    errors.push("No ip specified");
}
if (!req.body.name){
    errors.push("No name specified");
}
if (!req.body.username){
    errors.push("No username specified");
}
if (!req.body.password){
    errors.push("No password specified");
}

if (errors.length){
    res.status(400).json({"error":errors.join(",")});
    return;
}

var now = new Date().toLocaleString()

var data = {
    ip: req.body.ip,
    name: req.body.name,
    domain: req.body.domain ? req.body.domain : '',
    username: req.body.username,
    password : md5(req.body.password),
    addeddate: now,
    lastmodifieddate: now,
    tags: req.body.tags
}
var sql ='INSERT INTO source (ip, name, domain, username, password, addeddate, lastmodifieddate) VALUES (?,?,?,?,?,?,?)'
var params =[data.ip, data.name, data.domain, data.username, data.password, data.addeddate, data.lastmodifieddate]
db.run(sql, params, function (err, result) {
    if (err){
        res.status(400).json({"error": err.message})
        return;
    }
    res.json({
        "message": "success",
        "data": data,
        "id" : this.lastID
    })
});
})

// Update an existing user
app.patch("/api/source/:id", (req, res, next) => {
    var now = new Date().toLocaleString()
    var data = {
        ip: req.body.ip,
        name: req.body.name,
        domain: req.body.domain ? req.body.domain : '',
        username: req.body.username,
        password : md5(req.body.password),
        lastmodifieddate: now
    }
    db.run(
        `UPDATE source set 
           ip =  COALESCE(?,ip),
           name = COALESCE(?,name), 
           domain = COALESCE(?,domain), 
           username = COALESCE(?,username), 
           password = COALESCE(?,password),
           lastmodifieddate = COALESCE(?,lastmodifieddate), 
           WHERE id = ?`,
        [data.ip, data.name, data.domain, data.username, data.password, req.params.id, req.params.lastmodifieddate],
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({
                message: "success",
                data: data,
                changes: this.changes
            })
        });
})

// Delete a user

app.delete("/api/source/:id", (req, res, next) => {
    db.run(
        'DELETE FROM source WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({"message":"deleted", changes: this.changes})
        });
})

// TAGS:
// Get the list of tags
app.get("/api/tags", (req, res, next) => {
    var sql = "select * from tags"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
    });
});



// Default response for any other request
app.use(function(req, res){
    res.status(404);
});