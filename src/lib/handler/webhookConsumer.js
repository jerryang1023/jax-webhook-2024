import {Worker} from "bullmq";

const webhookWorker = new Worker('Webhooks', async (job) => {
    // Send webhook event to endpoint
    const endpoint = job.data.endpoint
    const messageId = job.data.messageId
    const payload = job.data.payload
    console.log("Producing new webhook, messageId: " + messageId )

    await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
            'webhook-id': messageId,
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
    })
}, {
    connection: {
        host: "127.0.0.1",
        port: 9999
    }
})

export default webhookWorker;