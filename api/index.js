require("dotenv").config();
const http = require("http");
const { neon } = require("@neondatabase/serverless");
const sql = neon(process.env.DATABASE_URL);


const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.end("Server is running");
});

const createUser = async (email, password, profilePicture) => {
  const result = await sql`
    INSERT INTO users (email, password, profile_picture)
    VALUES (${email}, ${password}, ${profilePicture})
    RETURNING id, email, profile_picture;
  `;
  return result[0];
};

const userValidation = async (email) => {
  const result = await sql`
    SELECT * FROM users WHERE email = ${email};
  `;
  return result[0];
};
const loginUser = async (email, password) => {
  const user = await userValidation(email);

  if (!user) return { error: "User not found" };
  if (user.password === password) {
    return { success: "Login successful", user };
  } else {
    return { error: "Invalid password" };
  }
};



server.listen(4000, () => {
  console.log("Server running at http://localhost:4000");
});
