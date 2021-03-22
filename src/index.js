const express = require("express");
require("./db/mongoose");

const userRouter = require("./routers/user");
const bankDetailRouter = require("./routers/bankDetail");
const newsRouter = require("./routers/news");
const topUpRequestRouter = require("./routers/topUpRequest");
const transactionRouter = require("./routers/transaction");
const cashReimbursementRouter = require("./routers/cashReimbursement");
const dashboardRouter = require("./routers/dashboard");
const testingRouter = require("./routers/testing");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(testingRouter);
app.use(userRouter);
app.use(bankDetailRouter);
app.use(newsRouter);
app.use(topUpRequestRouter);
app.use(transactionRouter);
app.use(cashReimbursementRouter);
app.use(dashboardRouter);

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
