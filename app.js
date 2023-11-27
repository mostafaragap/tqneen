const express = require("express");
require("dotenv").config();
const multerErrorHandler = require("./middlewares/multerError");

const app = express();
const cors = require("cors");
const connectDB = require("./database/connect");
const { errorHandler } = require("./middlewares/errorHandler");
app.use(express.json());
const routes = require("./routes/index")

app.use(cors());
app.use("/", routes);


app.post("/Paymentcallback", (req, res) => {
  if (req.body.success == "false") {
    return res.status(400).send({ transactionId: req.body.obj.id, message: "not paid" })
  }
  return res.status(200).send({ transactionId: req.body.obj.id, message: "paid successfully" })
})

app.get("/Paymentcallback", (req, res) => {
  if (req.query.success == "false") {
    return res.status(400).send({ transactionId: req.query.id, message: "not paid" })
  }
  return res.status(200).send({ transactionId: req.query.id, message: "paid successfully" })
})

app.use(multerErrorHandler);
app.use(errorHandler);


connectDB
  .then(() => {
    console.log("connected done successfully");
    const port = process.env.PORT || 8000;

    app.listen(port, () =>
      console.log(`Server is listening on http://localhost:${port} ...`)
    );
  })
  .catch((err) => {
    process.exit(1);
  });

require("./insertAdmin.js")