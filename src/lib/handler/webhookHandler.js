import {Worker} from "bullmq";
import {retryQueue} from "@/lib/mq.js";

const webhookWorker = new Worker('Webhooks', async (job) => {
    // Send webhook event to endpoint

    const data = job.data;
    const endpoint = data.endpoint
    const payload = data.payload

    await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
            'Content-type': 'application/json'
        }
    }).then(async (res) => {
        if (res.status === 200 || res.status === 204) {
            console.log("Webhook sent successfully!")
        } else {
            await retryQueue.add('retry', {
                subscriptionId: endpoint,
                payload: payload,
                retryCount: 0,
            }, {delay: 5000})
        }
    }).catch(async (err) => {
        console.log(err)
        await retryQueue.add('retry', {
            subscriptionId: endpoint,
            payload: payload,
            retryCount: 0,
        }, {delay: 5000})
    })

}, {
    connection: {
        host: "127.0.0.1",
        port: 9999
    }
})

export default webhookWorker;