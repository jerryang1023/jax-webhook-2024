import {Worker} from "bullmq";

export const webhookWorker = new Worker('Webhooks', async (job) => {
    // Send webhook event to endpoint
    console.log(job.name);


}, { connection: {
        host: "127.0.0.1",
        port: 9999
    }})
