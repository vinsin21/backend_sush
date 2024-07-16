const { urlencoded } = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const { dbConnect } = require("./db/dbConnect");
const authRouter = require("./routes/auth/user.routes");
const json = require("body-parser/lib/types/json");

const app = express();

dotenv.config({ path: "./secret.env" });
app.use(cors({}));
app.use(json());
app.use(urlencoded({ extended: true }));

dbConnect();

app.get("/", (req, res) => {
  res.status(200).send({ message: "HOME PAGE", statusCode: 200 });
});

// routes will come here
app.use("/api/v1/", authRouter.router);

// routes will end here

app.listen(process.env.PORT, () => {
  console.log(
    `server running on port : ${process.env.PORT ? process.env.PORT : ""}`
  );
});
