import db from '@/lib/db'
export async function POST(req, res){
    const addSql = `INSERT INTO subscriptions (accountId, subscriptionId, eventId, endpoint) VALUES(?, ?, ?, ?)`;

    const data = await req.json();
    const subscriptionId = Math.random().toString(36).substring(2)

    await db.run(addSql, [data.accountId, subscriptionId, data.eventId, data.endpoint], function (err) {
        if (err) {
            return console.error(err.message);
        }
        const id = this.lastID;
        console.log(`new event sub added, ID ${id}`);
    });

    return new Response("Event Subscription Added", {
        status: 200,
    });
}