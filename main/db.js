const { Pool } = require("pg")
require('dotenv').config()
const isProduction = process.env.NODE_ENV === 'production'

const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`

const pool = new Pool({
    connectionString: isProduction ? process.env.DATABASE_URL : connectionString
})


module.exports = pool

// local db info
// const pool = new Pool({
//     user: "postgres",
//     host: "localhost",
//     database: "mydb",
//     password: "darklord",
//     port: 5432
// })
// you should modify th packge.json file in the proxy section to the right url (in local case http://localhost:5000)

// access database from server
// heroku pg:psql postgresql-regular-57507 --app my-social-blog-api-server