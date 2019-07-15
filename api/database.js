var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5')

const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    // db.run(`DROP TABLE source`);
    if (err) {
        // Cannot open database
        console.error(err.message)
        throw err
    } else {
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE source (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ip text UNIQUE NOT NULL,
            name text NOT NULL, 
            domain text, 
            username text NOT NULL,
            password text NOT NULL, 
            addeddate text,
            lastmodifieddate text,
            CONSTRAINT ip_unique UNIQUE (ip)
            )`,
            (err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created, creating some rows
                var now = new Date().toLocaleString();
                var insert = 'INSERT INTO source (ip, name, domain, username, password, addeddate, lastmodifieddate) VALUES (?,?,?,?,?,?,?)'
                db.run(insert, ["195.0.0.0","name1","example.com","username1",md5("ip1_123456"), now, now])
                db.run(insert, ["195.0.0.1","name2","example.com","username2",md5("ip2_123456"), now, now])
                db.run(insert, ["195.0.0.2","name3","example.com","username2",md5("ip3_123456"), now, now])
            }
        });
        // console.log('Created Sources table.');

        db.run(`CREATE TABLE tags (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    tagname text NOT NULL
            )`,
            (err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created, creating some rows
                var insert = 'INSERT INTO tags (tagname) VALUES (?)'
                db.run(insert, ["first_tag"])
                db.run(insert, ["second_tag"])
                db.run(insert, ["third_tag"])
            }
            });
        // console.log('Created Tags table.');

        db.run(`CREATE TABLE sources_tags_mapping (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            source_id INTEGER NOT NULL,
                            tag_id INTEGER NOT NULL
                    )`,
            (err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created, creating some rows
                var insert = 'INSERT INTO sources_tags_mapping (source_id, tag_id) VALUES (?,?)'
                db.run(insert, [1,1])
                db.run(insert, [1,2])
                db.run(insert, [2,2])
            }
        });
        // console.log('Created Source-Tag mapping table.');
}
});

module.exports = db;