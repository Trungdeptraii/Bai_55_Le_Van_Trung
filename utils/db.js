const postgres = require("postgres");
const {DB_HOST, DB_PORT, DB_NAME, DB_PASSWORD, DB_USER} = process.env
module.exports = postgres({
    host                 : DB_HOST,            // Postgres ip address[s] or domain name[s]
    port                 : DB_PORT,          // Postgres server port[s]
    database             : DB_USER,            // Name of database to connect to
    username             : DB_NAME,            // Username of database user
    password             : DB_PASSWORD,            // Password of database user
  })