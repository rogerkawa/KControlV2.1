import mysql from 'mysql2/promise'
import 'dotenv/config'

const conect = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: 'Pcmskexr123#',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

export default conect