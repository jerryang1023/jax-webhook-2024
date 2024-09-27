import db from '@/lib/db'
import {eventQueue} from "@/lib/mq.js";

export async function POST(req, res) {
    //db query to 'diffuse' a trap
    const id = req.nextUrl.searchParams.get("id")

    if(id === null){
        return new Response("No trap id provided", {
            status: 400,
        });
    }

    const dbres = await db.run("DELETE FROM traps WHERE " +
        "id=(?)", id);

    // add trap.diffuse event to event queue
    await eventQueue.add('trap.diffuse', {
        id: id
    })

    // Return the items as a JSON response
    return new Response(dbres.changes > 0 ? 'Trap has been diffused' : "No such trap was found", {
        headers: { "Content-Type": "application/json" },
        status: dbres.changes > 0 ? 200 : 400,
    });
}