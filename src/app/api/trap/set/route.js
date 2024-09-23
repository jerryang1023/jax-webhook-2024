import db from '@/lib/db'
import {eventQueue} from '@/lib/mq'

export async function POST(req, res){
    const insertSql = `INSERT INTO traps(accountId, setTime) VALUES (?, ?)`;
    const accountId = req.nextUrl.searchParams.get("accountId")
    await db.run(insertSql, [accountId, Date.now()], (err) => {
        if (err) {
            return console.error(err.message);
        }
        const id = this.lastID;
        console.log(`Rows inserted, ID ${id}`);
    });

    await eventQueue.add('webhookEvent_1', {
        source: accountId
    })

    return new Response("Set new trap!", {
        status: 200,
    });
}