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

const createCatPost = async (
  catOwnerId,
  catName,
  catImage,
  catAge,
  catGender,
  catDescription,
  ownerAddress,
  ownerPhone,
  ownerEmail,
  adopted,
  additionalInformation
) => {
  const result = await sql`
    INSERT INTO cats (cat_owner_id, cat_name, cat_image, cat_age, cat_gender, cat_description, owner_address, owner_phone, owner_email, adopted, additional_information)
    VALUES (${catOwnerId}, ${catName}, ${catImage}, ${catAge}, ${catGender}, ${catDescription}, ${ownerAddress}, ${ownerPhone}, ${ownerEmail}, ${adopted}, ${additionalInformation})
    RETURNING id;
  `;
  return result[0];
};

const getCatsForAdoption = async () => {
  const result = await sql`
    SELECT * FROM cats WHERE adopted = FALSE;
  `;
  return result;
};

const updateCatPost = async (
  catId,
  catName,
  catImage,
  catAge,
  catGender,
  catDescription,
  ownerAddress,
  ownerPhone,
  ownerEmail,
  adopted,
  additionalInformation
) => {
  const result = await sql`
    UPDATE cats
    SET cat_name = ${catName}, cat_image = ${catImage}, cat_age = ${catAge},
        cat_gender = ${catGender}, cat_description = ${catDescription},
        owner_address = ${ownerAddress}, owner_phone = ${ownerPhone},
        owner_email = ${ownerEmail}, adopted = ${adopted},
        additional_information = ${additionalInformation}
    WHERE id = ${catId}
    RETURNING id;
  `;
  return result[0];
};

const deleteCatPost = async (catId) => {
  const result = await sql`
    DELETE FROM cats WHERE id = ${catId} RETURNING id;
  `;
  return result[0];
};


server.listen(4000, () => {
  console.log("Server running at http://localhost:4000");
});
