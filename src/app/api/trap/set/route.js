import db from '@/lib/db'
export async function POST(req, res){
    // insert sql statement to add a new trap
    const insertSql = `INSERT INTO traps(accountId, setTime) VALUES (?, ?)`;
    const accountId = req.nextUrl.searchParams.get("accountId")

    // check if accountID is null, can't make a trap without an owner
    if(accountId === null){
        console.error("No accountId provided, please provide one in API parameters!")
        return new Response("No accountId provided, please provide one in API parameters!", {
            status: 400,
        });
    }

    // insert new trap in database
    await db.run(insertSql, [accountId, Date.now()], (err) => {
        if (err) {
            return console.error(err.message);
        }
    });
    console.log("New trap inserted into database, accountId: " + accountId + ", /trap/set success")

    return new Response("Set new trap!", {
        status: 200,
    });
}