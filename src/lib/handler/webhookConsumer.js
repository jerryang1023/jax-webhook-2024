import {Worker} from "bullmq";
import {retryQueue} from "@/lib/mq.js";
import {Webhook} from 'standardwebhooks';

const webhookWorker = new Worker('Webhooks', async (job) => {
    // Send webhook event to endpoint
    const endpoint = job.data.endpoint
    const messageId = job.data.messageId
    const secretKey = job.data.secretKey
    const now = new Date()

    const payload = job.data.payload
    const data = payload.data
    const eventTimestamp = payload.timestamp
    console.log("Producing new webhook, messageId: " + messageId )

    const payloadStr = JSON.stringify(payload)
    const webhook = new Webhook(secretKey)
    const signature = webhook.sign(messageId, now, payloadStr);

    await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
            'webhook-id': messageId,
            'webhook-timestamp': now.getTime(),
            'webhook-signature': signature,
            'Content-type': 'application/json'
        }
    }).then(async (res) => {
        if (res.status === 200 || res.status === 204) {
            console.log("Webhook sent successfully!")
        } else {
            throw("Webhook " + messageId + " status failed " + res.status)
        }
    }).catch(async (err) => {
        console.log(err)
        await retryQueue.add('retry', {
            messageId: messageId,
            endpoint: endpoint,
            secretKey: secretKey,
            retryCount: 0,
            payload: {
                type: "retry_webhook",
                timestamp: eventTimestamp,
                data: data
            }
        }, {delay: 5000})
    })
}, {
    connection: {
        host: "127.0.0.1",
        port: 9999
    }
})

export default webhookWorker;