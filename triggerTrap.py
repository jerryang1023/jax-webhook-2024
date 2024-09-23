import time
import sqlite3
import calendar
import datetime

sqliteConnection = sqlite3.connect('collection.db')

mycursor = sqliteConnection.cursor()

while True:
    try:
        time.sleep(10)

        date = datetime.datetime.utcnow()
        utc_time = calendar.timegm(date.utctimetuple())
        check_time = utc_time * 1000 - 5000

        mycursor.execute("SELECT * FROM traps WHERE (setTime <  ?)", [check_time])

        myresult = mycursor.fetchall()

        for x in myresult:
            print(x)


    except Exception as error:
        print("Nothing in database\n")
        print(error)

sql_conn.commit()