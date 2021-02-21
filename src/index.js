const express = require("express");
require("./db/mongoose");

const userRouter = require("./routers/user");
const bankDetailRouter = require("./routers/bankDetail");
const newsRouter = require("./routers/news");
const topUpRequest = require("./routers/topUpRequest");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRouter);
app.use(bankDetailRouter);
app.use(newsRouter);
app.use(topUpRequest);

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
