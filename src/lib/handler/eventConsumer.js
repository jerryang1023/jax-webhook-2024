import {Worker} from "bullmq";
import db from "@/lib/db.js";
import {webhookQueue} from "@/lib/mq.js";
import eventMap from "./eventMap.json"

async function processWebhookEvent(eventName, data) {
    const searchSql = `SELECT * FROM subscriptions WHERE eventId=(?)`

    const items = await db.all(searchSql, [eventMap[eventName]], (err) => {
        if (err) {
            return console.error(err.message);
        }
    });

    for(const i in items){
        const endpoint = items[i].endpoint
        const messageId = "webhook_" + Math.random().toString(36).substring(2);
        await webhookQueue.add(eventName, {
            messageId: messageId,
            endpoint: endpoint,
            payload: {
                type: eventName,
                timestamp: Date.now(),
                data: data
            }
        })
    }
}

const eventWorker = new Worker('Events', async (job) => {
    console.log("Processing event type: " + job.name)
    switch(job.name){
        case 'trap.set':
        case 'trap.diffuse':
            // default webhook processors
            await processWebhookEvent(job.name, job.data)
            break;
        default:
            console.log("Unknown event type found in redis events")
    }

    }, { connection: {
        host: "127.0.0.1",
        port: 8888
    }})

export default eventWorker;