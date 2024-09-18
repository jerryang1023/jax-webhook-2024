import redisClient from '@/lib/redis';

export async function GET(req, res) {
    const val = await redisClient.keys("trap:*");

    console.log(val)

    // Return the items as a JSON response with status 200
    return new Response(JSON.stringify(val), {
        headers: { "Content-Type": "application/json" },
        status: 200,
    });
}