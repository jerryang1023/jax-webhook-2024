import db from '@/lib/db'

export async function GET(req, res) {
    const accountId = req.nextUrl.searchParams.get("accountId")
    let items = "";
    if(accountId === null){
        // preform DB query to get all subscriptions
        items = await db.all("SELECT * FROM subscriptions");
    }
    else{
        // preform DB query to get subscriptions for one accountId
        items = await db.all("SELECT * FROM subscriptions WHERE(accountId = ?)", accountId);
    }

    // Return the items as a JSON response with status 200
    return new Response(JSON.stringify(items), {
        headers: { "Content-Type": "application/json" },
        status: 200,
    });
}