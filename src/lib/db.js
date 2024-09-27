import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

let db = await open({
    filename: "./collection.db",
    driver: sqlite3.Database,
});

export default db;