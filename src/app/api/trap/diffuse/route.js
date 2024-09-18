import redisClient from '@/lib/redis';

export async function POST(req, res){
    redisClient.hset("testing:123", "name", "jerry")
    return new Response("inserted into reids", {
        status: 200,
    });
}
export async function GET(req, res) {
    const val = await redisClient.hget('testing:123', "name")

    console.log(val)

    // Return the items as a JSON response with status 200
    return new Response(JSON.stringify(val), {
        headers: { "Content-Type": "application/json" },
        status: 200,
    });
}