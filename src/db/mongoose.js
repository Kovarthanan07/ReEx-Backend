const mongoose = require("mongoose");

const connectionURL =
  "mongodb+srv://admin:admin@reex.xw1tu.mongodb.net/ReEx?retryWrites=true&w=majority";

mongoose
  .connect(connectionURL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Connected to MongoDB...");
  })
  .catch((error) => {
    console.log("Could not connect to MongoDB...");
  });
