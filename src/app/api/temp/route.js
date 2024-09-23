import redisClient from '@/lib/redis';
import db from "@/lib/db";

export async function GET(req, res) {
    const triggerTime = Date.now() - 5000;
    const items = await db.all("SELECT * FROM traps WHERE (setTime < ?)", triggerTime);
    console.log(items)
    console.log('testing')
}

export async function POST(req, res){
    var key = String("trap:");

    if(req.nextUrl.searchParams.get("trapName")){
        key = key.concat(req.nextUrl.searchParams.get("trapName"))
        if(await redisClient.exists(key, (err, exists) => {
            if (err) throw err;
            return exists;
        }) == 1){
            return new Response("trap already exists in redis!", {
                status: 400,
            });
        }
    }
    else{
        key = key.concat(Math.random().toString(36).substring(2))
    }

    redisClient.set(key, "value")
    //redisClient.set(key, "value", 'EX', 60)

    return new Response("inserted into reids", {
        status: 200,
    });
}