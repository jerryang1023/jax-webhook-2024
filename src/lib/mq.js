import {Queue} from 'bullmq';


export const eventQueue = new Queue('Events', { connection: {
        host: "127.0.0.1",
        port: 8888
    }});
export const webhookQueue = new Queue('Webhooks', { connection: {
        host: "127.0.0.1",
        port: 9999
    }});

export const retryQueue = new Queue('Retry', { connection: {
        host: "127.0.0.1",
        port: 9999
    }});