// lib/redis.js
import Redis from "ioredis";

const redisClient = Redis.createClient(8888,'127.0.0.1');

redisClient.on('error', (err) => {
    console.log('Error occurred while connecting or accessing redis server');
});

export default redisClient;