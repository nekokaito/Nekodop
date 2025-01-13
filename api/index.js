require("dotenv").config();
const http = require("http");
const { neon } = require("@neondatabase/serverless");
const sql = neon(process.env.DATABASE_URL);


const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.end("Server is running");
});

server.listen(4000, () => {
  console.log("Server running at http://localhost:4000");
});
