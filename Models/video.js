const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS videos (id INTEGER PRIMARY KEY AUTOINCREMENT, path TEXT, duration INTEGER)");
});

function saveVideo(videoPath, duration, callback) {
    const stmt = db.prepare("INSERT INTO videos (path, duration) VALUES (?, ?)");
    stmt.run(videoPath, duration, function(err) {
        callback(err, this.lastID);
    });
    stmt.finalize();
}

module.exports = db;