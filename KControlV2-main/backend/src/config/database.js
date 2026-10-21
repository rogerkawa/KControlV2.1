import mysql from 'mysql2/promise'
import 'dotenv/config'

const conect = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    ssl: {
        ca: process.env.DB_CA_CERT.replace(/\\n/g, '\n'),
        rejectUnauthorized: true
    },
    waitForConnections: true,
    connectTimeout: 20000,
    connectionLimit: 10,
    queueLimit: 0
})

export default conect