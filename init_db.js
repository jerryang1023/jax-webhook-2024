const sqlite3 = require("sqlite3").verbose();

class EventSubscription {
    constructor(accountId, subscriptionId, eventId, endpoint) {
        this.accountId = accountId;
        this.subscriptionId = subscriptionId;
        this.eventId = eventId;
        this.endpoint = endpoint;
    }
}

// Connecting to or creating a new SQLite database file
const db = new sqlite3.Database(
    "./collection.db",
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log("Connected to the SQlite database.");
    }
);

const initalEventSubscriptions = [];
initalEventSubscriptions.push(new EventSubscription("jerry", "123123", 1, "fakeend"))
initalEventSubscriptions.push(new EventSubscription("tom", "456456", 2, "fakeend"))
initalEventSubscriptions.push(new EventSubscription("owner", "789789", 4, "fakeend"))

db.serialize(() => {
    db.run(
        `CREATE TABLE IF NOT EXISTS traps
         (
             id      INTEGER PRIMARY KEY,
             accountId   TEXT,
             setTime INTEGER
         )`,
        (err) => {
            if (err) {
                return console.error(err.message);
            }
            db.run(`DELETE
                    FROM traps`, (err) => {
                    if (err) {
                        return console.error(err.message);
                    }
                    console.log("All rows deleted from trap");
                }
            )
        }
    )


    // Create the subscriptions table if it doesn't exist
    db.run(
        `CREATE TABLE IF NOT EXISTS subscriptions
         (
             id             INTEGER PRIMARY KEY,
             accountId      TEXT,
             subscriptionId TEXT,
             eventId        INTEGER,
             endpoint       TEXT
         )`,
        (err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log("Created subscriptions table.");

            // Clear the existing data in the products table
            db.run(`DELETE
                    FROM subscriptions`, (err) => {
                if (err) {
                    return console.error(err.message);
                }
                console.log("All rows deleted from items");

                // Insert the initial/hardcoded event subscriptions into subscriptions table
                const insertSql = `INSERT INTO subscriptions(accountId, subscriptionId, eventId, endpoint)
                                   VALUES (?, ?, ?, ?)`;
                for (let v in initalEventSubscriptions) {
                    const aid = initalEventSubscriptions[v].accountId;
                    const sid = initalEventSubscriptions[v].subscriptionId;
                    const eid = initalEventSubscriptions[v].eventId;
                    const ep = initalEventSubscriptions[v].endpoint;
                    db.run(insertSql, aid, sid, eid, ep, function (err) {
                        if (err) {
                            return console.error(err.message);
                        }
                        const id = this.lastID; // get the id of the last inserted row
                        console.log(`Rows inserted, ID ${id}`);
                    });
                }

                //   Close the database connection after all insertions are done
                db.close((err) => {
                    if (err) {
                        return console.error(err.message);
                    }
                    console.log("Closed the database connection.");
                });
            });
        }
    );
});

