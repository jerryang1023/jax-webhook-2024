import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

let db = await open({
    filename: "./collection.db", // Specify the database file path
    driver: sqlite3.Database, // Specify the database driver (sqlite3 in this case)
});

export class EventSubscription {
    constructor(accountId, subscriptionId, eventId, endpoint) {
        this.accountId = accountId;
        this.subscriptionId = subscriptionId;
        this.eventId = eventId;
        this.endpoint = endpoint;
    }
}
export class Trap {
    constructor(owner, setTime) {
        this.owner = owner;
        this.setTime = setTime;
    }
}

export default db;