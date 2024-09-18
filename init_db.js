const sqlite3 = require("sqlite3").verbose();

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

class EventSubscription {
    constructor(accountId, subscriptionId, eventId) {
        this.accountId = accountId;
        this.subscriptionId = subscriptionId;
        this.eventId = eventId;
    }
}

const initalEventSubscriptions = [];
initalEventSubscriptions.push(new EventSubscription("jerry", "123123", 1))
initalEventSubscriptions.push(new EventSubscription("tom", "456456", 2))
initalEventSubscriptions.push(new EventSubscription("owner", "789789", 4))

// Serialize method ensures that database queries are executed sequentially
db.serialize(() => {
    // Create the subscriptions table if it doesn't exist
    db.run(
        `CREATE TABLE IF NOT EXISTS subscriptions (
        id INTEGER PRIMARY KEY,
        accountId TEXT,
        subscriptionId TEXT,
        eventId INTEGER
      )`,
        (err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log("Created subscriptions table.");

            // Clear the existing data in the products table
            db.run(`DELETE FROM subscriptions`, (err) => {
                if (err) {
                    return console.error(err.message);
                }
                console.log("All rows deleted from items");

                // Insert the initial/hardcoded event subscriptions into subscriptions table
                const insertSql = `INSERT INTO subscriptions(accountId, subscriptionId, eventId) VALUES(?, ?, ?)`;
                for(let v in initalEventSubscriptions){
                    db.run(insertSql, v, function (err) {
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