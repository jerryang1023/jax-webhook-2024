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
        console.log(items[i])

        const endpoint = items[i].endpoint
        const payload = {
            type: eventName,
            timestamp: Date.now(),
            data: {
                accountId: data.accountId
            }
        }

        await webhookQueue.add('eventType 1', {
            endpoint: endpoint,
            payload: payload
        })
    }
}

const eventWorker = new Worker('Events', async (job) => {
    console.log("Processing event type: " + job.name)
    switch(job.name){
        case 'trap.set':
            await processWebhookEvent('trap.set', job.data)
            break;
        default:
            console.log("Unknown event type found in redis events")
    }

    }, { connection: {
        host: "127.0.0.1",
        port: 8888
    }})

export default eventWorker;