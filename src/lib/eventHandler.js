import {Worker} from "bullmq";
import db from "@/lib/db.js";
import {eventQueue, webhookQueue} from "@/lib/mq.js";

async function processWebhookEvent() {
    const searchSql = `SELECT * FROM subscriptions WHERE eventId=1`
    const items = await db.all(searchSql, (err) => {
        if (err) {
            return console.error(err.message);
        }
    });

    const payload = {}

    for(const i in items){
        console.log(items[i])
        const payload = {}
        await webhookQueue.add('eventType 1', {
            endpoint: items[i].endpoint,
            payload: payload
        })
    }
}

export const eventWorker = new Worker('Events', async (job) => {
    switch(job.name){
        case 'webhookEvent_1':
            console.log("processing event type set trap")
            await processWebhookEvent()
            break;
        default:
            console.log("Unknown event type found in redis events")
    }

    }, { connection: {
        host: "127.0.0.1",
        port: 8888
    }})
