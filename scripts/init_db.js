import sqlite3 from "sqlite3"

// Connecting to or creating a new SQLite database file
const db = new sqlite3.Database(
    "../collection.db",
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log("Connected to the SQlite database.");
    }
);

db.serialize(() => {
    // Create Traps Table (mocked upstream service)
    db.run(
        `CREATE TABLE IF NOT EXISTS traps
         (
             id        INTEGER PRIMARY KEY,
             accountId TEXT,
             setTime   INTEGER
         )`,
        (err) => {
            if (err) {
                return console.error(err.message);
            }
            // Clear existing table if it exists
            db.run(`DELETE FROM traps`, (err) => {
                    if (err) {
                        return console.error(err.message);
                    }
                    console.log("All rows deleted from trap");

                    //   Close the database connection after all insertions are done
                    db.close((err) => {
                        if (err) {
                            return console.error(err.message);
                        }
                        console.log("Closed the database connection.");
                    });
                }
            )
        }
    )
});