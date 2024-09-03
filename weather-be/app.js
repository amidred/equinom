const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 4000;

// Connect to the SQLite3 database
let db = new sqlite3.Database('../data/weather_data.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to the SQLite3 database.');
    }
});

// Define a route to get data from the database
app.get('/weather', (req, res) => {
    const sql = 'SELECT * FROM Weather';

    db.all(sql, [], (err, rows) => {
       console.log('rows: ', rows);

        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.header("Access-Control-Allow-Origin", "*");

        res.json({
            "message": "success",
            "data": rows
        });
    });
});

app.get('/weather/query', (req, res) => {
    let { startDate, endDate, minValue, maxValue } = req.query;

    let conditions = [];
    let params = [];

    if (startDate && endDate) {
        conditions.push(`date_time BETWEEN ? AND ?`);
        let startDT = Math.floor(new Date(startDate).getTime() / 1000);
        let endDT = Math.floor(new Date(endDate).getTime() / 1000);
        params.push(startDT, endDT);

        // const currentDate = new Date();
        // const unixTime = Math.floor(currentDate.getTime() / 1000);
        // conditions.push(`date_time >= DATE(?, '-7 days')`);
        // params.push(unixTime);
    }

    if (minValue) {
        conditions.push(`temperature >= ?`);
        params.push(Number(minValue));
    }

    if (maxValue) {
        conditions.push(`temperature <= ?`);
        params.push(Number(maxValue));
    }

    let sql = `SELECT * FROM Weather`;

    if (conditions.length > 0) {
        sql += ` WHERE ` + conditions.join(' AND ');
    }

    console.log('sql: ', sql);
    console.log('params: ', params);

    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.header("Access-Control-Allow-Origin", "*");
        console.log('rows: ', rows);
        res.json({
            "message": "success",
            "data": rows
        });
    });
});

// Function to perform aggregation
app.get('/weather/aggregation', (req, res) => {
    let { startDate, endDate } = req.query;

    let conditions = [];
    let params = [];

    if (startDate && endDate) {
        conditions.push(`date_time BETWEEN ? AND ?`);
        let startDT = Math.floor(new Date(startDate).getTime() / 1000);
        let endDT = Math.floor(new Date(endDate).getTime() / 1000);
        params.push(startDT, endDT);

        // const currentDate = new Date();
        // const unixTime = Math.floor(currentDate.getTime() / 1000);
        // conditions.push(`date_time >= DATE(?, '-7 days')`);
        // params.push(unixTime);
    }

    let query = `
        SELECT city, AVG(temperature) AS avgTemp, AVG(humidity) AS avgHumidity, AVG(pressure) AS avgPressure, MIN(date_time) AS minDate, MAX(date_time) AS maxDate
        FROM Weather 
    `;

    if (conditions.length > 0) {
        query += ` WHERE ` + conditions.join(' AND ');
    }

    query += 'GROUP BY city';

    // Execute the parameterized query
    db.all(query, params, (err, rows) => {
        if (err) {
            console.error('Error executing query:', err.message);
            res.status(400).json({ "error": err.message });
            return;
        }

        // Display the result of the aggregation
        rows.forEach((row) => {
            console.log(`City: ${row.city}, AVG(temperature): ${row.avgTemp}, AVG(humidity): ${row.avgHumidity}, AVG(pressure): ${row.avgPressure}, MIN(date_time): ${row.minDate}, MAX(date_time): ${row.maxDate}`);
            row.avgTemp = (row.avgTemp).toFixed(2);
            row.avgHumidity = (row.avgHumidity).toFixed(2);
            row.avgPressure = (row.avgPressure).toFixed(2);
        });

        res.header("Access-Control-Allow-Origin", "*");
        res.json({
            "message": "success",
            "data": rows
        });
    });
}
);

// Close the database connection when the server shuts down
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database connection:', err.message);
        } else {
            console.log('Closed the database connection.');
        }
        process.exit(0);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
