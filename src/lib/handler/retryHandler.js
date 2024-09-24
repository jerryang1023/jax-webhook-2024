import {Worker} from "bullmq";
import {retryQueue} from "@/lib/mq.js";

const retryPolicy = {
    0: 5000,
    1: 10000,
    2: 30000,
}

const retryWorker = new Worker('Retry', async (job) => {
    const data = job.data;
    console.log(data)
    //const endpoint = data.endpoint
    const endpoint = "https://play.svix.com/in/e_5qX6jmztClFhHd8LjjNsV6CDwM4/"
    const payload = data.payload
    const retryCount = data.retryCount

    let response = await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify(data.payload),
        headers: {
            'Content-type': 'application/json'
        }
    })

    if(response.status === 200 || response.status === 204){
        console.log("Webhook retry sent successfully! Retry attempt: ", retryCount)
    }
    else{
        if(retryCount >= 2){
            console.log("Final Webhook retry failed")
        }
        else{
            await eventQueue.add('webhookEventRetry_1', {
                subscriptionId: endpoint,
                payload: payload,
                retryCount: retryCount+1,
            }, {delay: retryPolicy[retryCount+1]})
        }
    }

}, {
    connection: {
        host: "127.0.0.1",
        port: 9999
    }
})

export default retryWorker;