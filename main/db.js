const { Pool } = require("pg")
require('dotenv').config()
const isProduction = process.env.NODE_ENV === 'production'

// const pool = new Pool({
//     user: "postgres",
//     host: "localhost",
//     database: "mydb",
//     password: "darklord",
//     port: 5432
// })

const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`

const pool = new Pool({
    // user: process.env.DB_USER,
    // host: process.env.DB_HOST,
    // database: process.env.DB_DATABASE,
    // password: process.env.DB_PASSWORD,
    // port: process.env.DB_PORT
    connectionString: isProduction ? process.env.DATABASE_URL : connectionString
})


module.exports = pool