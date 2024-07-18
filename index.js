const { urlencoded } = require("body-parser");
const json = require("body-parser/lib/types/json");

const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");

const { dbConnect } = require("./db/dbConnect");
const authRouter = require("./routes/auth/user.routes");
const publicApisRouter = require("./routes/app/publicApis.routes");
const docDetailsRouter = require("./routes/app/docDetails.routes");
const docTimeSlotsRouter = require("./routes/app/docTimeslots.routes");
const prescriptionRouter = require("./routes/app/prescription.routes");
const adminRouter = require("./routes/admin/admin.routes");

const app = express();

dotenv.config({ path: "./secret.env" });
app.use(cors({ origin: "*" }));
app.use(json());
app.use(urlencoded({ extended: true }));

dbConnect();

app.get("/", (req, res) => {
  res.status(200).send({ message: "HOME PAGE", statusCode: 200 });
});

// routes will come here
app.use("/api/v1", authRouter.router);
app.use("/api/v1/doc", authRouter.router);
app.use("/api/v1/public/doc", publicApisRouter.router);
app.use("/api/v1/doc/details", docDetailsRouter.router);
app.use("/api/v1/doc/timeslots", docTimeSlotsRouter.router);
app.use("/api/v1/doc/prescription", prescriptionRouter.router);
app.use("/api/v1/admin", adminRouter.router);

// routes will end here

app.listen(process.env.PORT, () => {
  console.log(
    `server running on port : ${process.env.PORT ? process.env.PORT : ""}`
  );
});
