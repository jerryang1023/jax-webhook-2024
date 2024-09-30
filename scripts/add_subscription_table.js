import sqlite3 from "sqlite3";

const db = new sqlite3.Database(
    "../collection.db",
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
        if (err) { return console.error(err.message); }
        console.log("Connected to the SQlite database.");
    }
);

class EventSubscription {
    constructor(accountId, subscriptionId, eventId, endpoint) {
        this.accountId = accountId;
        this.subscriptionId = subscriptionId;
        this.eventId = eventId;
        this.endpoint = endpoint;
    }
}
const initalEventSubscriptions = [];
initalEventSubscriptions.push(new EventSubscription("jerry", "123123", 1, "fakeend"))
initalEventSubscriptions.push(new EventSubscription("tom", "456456", 2, "fakeend"))
initalEventSubscriptions.push(new EventSubscription("owner", "789789", 4, "fakeend"))

db.serialize(() => {
    db.run(`DROP TABLE IF EXISTS subscriptions`, (err) => {
        if (err) {return console.error(err.message);}
    })
    db.run(
        `CREATE TABLE IF NOT EXISTS subscriptions
         (
             accountId      TEXT,
             subscriptionId TEXT PRIMARY KEY,
             eventId        INTEGER,
             endpoint       TEXT
         )`,
        (err) => {
            if (err) {return console.error(err.message);}
            console.log("Created event subscriptions table");
        }
    );

    const insertSql = `INSERT INTO subscriptions(accountId, subscriptionId, eventId, endpoint)
                               VALUES (?, ?, ?, ?)`;
    for (let v in initalEventSubscriptions) {
        const aid = initalEventSubscriptions[v].accountId;
        const sid = initalEventSubscriptions[v].subscriptionId;
        const eid = initalEventSubscriptions[v].eventId;
        const ep = initalEventSubscriptions[v].endpoint;
        db.run(insertSql, aid, sid, eid, ep, function (err) {
            if (err) {return console.error(err.message);}
            const id = this.lastID;
            console.log(`Rows inserted, ID ${id}`);
        });
    }

    db.close((err) => {
        if (err) {return console.error(err.message);}
        console.log("Closed the database connection.");
    });
});