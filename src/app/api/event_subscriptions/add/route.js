import db from '@/lib/db'

export async function POST(req, res){
    const addSql = `INSERT INTO subscriptions (accountId, subscriptionId, eventId, endpoint, secretKey) VALUES(?, ?, ?, ?, ?)`;

    const data = await req.json();

    //Generate a subscriptionID and secretKey
    const subscriptionId = "SID_"+Math.random(32).toString(36).substring(2)
    const secretKey = Math.random(32).toString(36).substring(2)

    if(data.eventId === undefined || data.accountId === undefined || data.endpoint === undefined){
        return new Response("There was a missing field in your request. \nPlease check your request body", {
            status: 400,
        });
    }

    await db.run(addSql, [data.accountId, subscriptionId, data.eventId, data.endpoint, secretKey], function (err) {
        if (err) {
            return console.error(err.message);
        }
    });

    return new Response("New event subscription added, subscriptionId: " + subscriptionId
        + ", secretKey: " + secretKey + ".\nPlease keep your secret key in a secure place!", {
        status: 200,
    });
}