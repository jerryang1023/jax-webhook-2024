import {Worker} from "bullmq";
import {retryQueue} from "@/lib/mq.js";
import {createHmac} from 'node:crypto';

const retryPolicy = {
    0: 5000,
    1: 10000,
    2: 30000,
}

const retryWorker = new Worker('Retry', async (job) => {
    const endpoint = job.data.endpoint
    const messageId = job.data.messageId
    const secretKey = job.data.secretKey
    const timestamp = Date.now()
    const retryCount = job.data.retryCount + 1

    const payload = job.data.payload
    const data = payload.data
    const eventTimestamp = payload.timestamp
    console.log("Producing retry webhook, original messageId: " + messageId )

    const hmac = createHmac('sha256', secretKey).update(messageId + timestamp + JSON.stringify(payload))

    await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
            'webhook-id': messageId,
            'webhook-timestamp': Date.now(),
            'webhook-signature': hmac,
            'Content-type': 'application/json'
        }
    }).then(async (res) => {
        if(res.status === 200 || res.status === 204){
            console.log("Webhook retry sent successfully! Retry attempt: ", retryCount)
        }
        else{
            throw("Retry attempt " + retryCount + " webhook status failed " + res.status)
        }
    }).catch(async (err) => {
        console.log(err)
        if(retryCount >= 3){
            console.log("Final Webhook retry failed... original messageId:"+messageId)
        }
        else{
            await retryQueue.add('retry', {
                messageId: messageId,
                endpoint: endpoint,
                secretKey: secretKey,
                retryCount: retryCount,
                payload: {
                    type: "retry_webhook",
                    timestamp: eventTimestamp,
                    data: data
                }
            }, {delay: retryPolicy[retryCount]})
        }
    })
}, {
    connection: {
        host: "127.0.0.1",
        port: 9999
    }
})

export default retryWorker;